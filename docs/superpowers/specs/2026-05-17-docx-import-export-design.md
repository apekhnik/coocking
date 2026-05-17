# Docx Import / Export — Design Spec

**Date:** 2026-05-17  
**Status:** Approved

## Context

The app needs to import recipes from `.docx` files and export all recipes back to `.docx` in the same format. The docx format was established by a previous backend service (`DocxService`) and contains two layers:

1. **Visual layer** — human-readable recipe pages (Heading1 title, description text, bulleted ingredients)
2. **Hidden JSON block** — `===DATA_JSON_START=== ... ===DATA_JSON_END===` embedded in white 1pt text at the end of the document

The JSON block is the authoritative source for import. The visual layer is for readability only.

The current app uses a structured DB schema (`steps[]` and `ingredients[qty, unit, item]`), while the docx format stores flat strings (`description` text, `ingredients` multiline text). Mapping between the two is defined below.

---

## Data Mapping

### Import (docx → DB)

| docx JSON field | DB mapping |
|---|---|
| `title` | `recipes.title` |
| `description` | One `steps` record: `body=description, title="", position=0` |
| `ingredients` (multiline) | Each non-empty line → one `ingredients` record: `item=line, qty="", unit="", position=N` |
| `createdAt` | Ignored — `createdAt` is set by DB default |

**Duplicate handling:** if a recipe with the same `title` already exists for the user → skip, count as skipped.

### Export (DB → docx)

| DB fields | docx JSON field |
|---|---|
| `recipe.title` | `title` |
| `steps` ordered by position | `description` = `steps.map(s => s.body).join('\n\n')` |
| `ingredients` ordered by position | `ingredients` = each row → `[qty, unit, item].filter(Boolean).join(' ')`, joined by `\n` |

---

## Architecture

### Dependencies to add

```
mammoth   — extract raw text from docx (to find hidden JSON block)
docx      — generate .docx files (already used in reference service)
```

### New files

#### `src/lib/docx-service.ts`

Pure utility module. No auth, no DB — only docx parsing and generation logic.

```ts
interface ParsedRecipe {
  title: string
  description: string
  ingredients: string  // multiline, one per line
}

// Extracts recipes from the hidden JSON block inside a .docx buffer
parseDocxToRecipes(buffer: Buffer): Promise<ParsedRecipe[]>

// Generates a .docx Buffer from structured recipe data
generateRecipeDocument(recipes: RecipeWithRelations[]): Promise<Buffer>
```

`parseDocxToRecipes`:
1. `mammoth.extractRawText({ buffer })` → plain text
2. Find `===DATA_JSON_START===` / `===DATA_JSON_END===` markers
3. `JSON.parse(jsonBlock)` → return array
4. Throw descriptive error if block not found or JSON invalid

`generateRecipeDocument`:
- Mirrors the original `DocxService` exactly (Comfortaa/Roboto fonts, blue color `#2e30b5`, bullet list for ingredients, page break before each recipe)
- Appends hidden JSON block at the end (white, size 1pt)
- JSON embedded: `{ id, title, description, ingredients, createdAt }` where `description` and `ingredients` are reassembled from structured data

#### `src/actions/recipes.ts` — add

```ts
export async function importRecipesFromDocx(
  formData: FormData
): Promise<{ imported: number; skipped: number }>
```

Steps:
1. `auth()` — throw if not authenticated
2. `formData.get('file')` → `arrayBuffer()` → `Buffer`
3. `parseDocxToRecipes(buffer)` — throw user-friendly error on failure
4. Fetch existing recipe titles for user (single query)
5. For each parsed recipe:
   - Skip if title already exists
   - Call `createRecipe({ recipe: { title }, ingredients: [...], steps: [...] })`
6. `revalidatePath('/home')`
7. Return `{ imported, skipped }`

#### `src/app/api/export/route.ts` — new

```ts
export async function GET(): Promise<Response>
```

Steps:
1. `auth()` — return 401 if not authenticated
2. `getRecipesWithRelations(userId)` — full recipes with steps + ingredients
3. `generateRecipeDocument(recipes)` → Buffer
4. Return `new Response(buffer, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition': 'attachment; filename="recipes.docx"' } })`

Need a new helper `getRecipesWithRelations(userId)` in `src/actions/recipes.ts` (or inline in route) that joins recipes → steps → ingredients.

#### `src/components/ImportView.tsx` — update

- Add `onChange` to `<input type="file">` → build `FormData` → call `importRecipesFromDocx`
- UI states: idle → loading (spinner) → success ("Импортировано: N, пропущено: M") → error (error message)
- Add "Экспортировать все рецепты" button → `window.location.href = '/api/export'`

---

## Error Handling

| Scenario | Behavior |
|---|---|
| File has no JSON block | Show error: "Файл не содержит данных рецептов" |
| Invalid JSON | Show error: "Не удалось прочитать файл" |
| All recipes are duplicates | Show success: "Импортировано: 0, пропущено: N" |
| DB error during insert | Show error: "Ошибка сохранения" |
| Export with 0 recipes | Generate valid empty docx |

---

## Verification

1. Upload `recipes_2025-11-03.docx` → expect 13 recipes imported, 0 skipped
2. Upload same file again → expect 0 imported, 13 skipped
3. Export → download `recipes.docx` → open in Word → verify titles, ingredients, description are readable
4. Import the exported file → all skipped (round-trip fidelity)
5. Test with a docx that has no JSON block → error message shown
