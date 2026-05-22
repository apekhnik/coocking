# Public Access + Auth UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Open `/home` to guests with hardcoded demo recipes; add Login/Register/Logout UI to desktop sidebar and mobile header.

**Architecture:** `proxy.ts` adds `/home` to the public route matcher. `home/page.tsx` returns `DEMO_RECIPES` when no `userId`, own DB recipes otherwise. Clerk's `<SignedIn>`/`<SignedOut>` components render conditional auth UI; `useAuth()` guards delete/favorite buttons so guests never call protected server actions.

**Tech Stack:** Next.js 16 App Router, Clerk v7 (`@clerk/nextjs`), Drizzle ORM, TypeScript

---

## File Map

| File | Change |
|------|--------|
| `src/lib/demo-data.ts` | **Create** — `DEMO_RECIPES` constant |
| `src/proxy.ts` | **Modify** — add `/home` to public route matcher |
| `src/app/page.tsx` | **Modify** — always redirect to `/home` |
| `src/app/home/page.tsx` | **Modify** — use demo data for guests |
| `src/components/desktop/DesktopSidebar.tsx` | **Modify** — add auth section at bottom |
| `src/components/RecipeFeed.tsx` | **Modify** — replace user icon with auth button; hide guest actions |
| `src/components/RecipeCard.tsx` | **Modify** — hide delete/favorite buttons for guests |

---

### Task 1: Create demo data

**Files:**
- Create: `src/lib/demo-data.ts`

- [ ] **Step 1: Create the file with 5 demo recipes**

```ts
import type { RecipeListItem } from '@/actions/recipes'

const BASE = new Date('2024-09-01')

export const DEMO_RECIPES: RecipeListItem[] = [
  {
    id: 'demo-1',
    userId: 'demo',
    title: 'Pasta Carbonara',
    subtitle: 'Roman classic with eggs, pecorino and guanciale',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80',
    imageTone: '#C4A882',
    cookTime: 25,
    difficulty: 'Easy',
    tags: ['Italian', 'Quick'],
    isFavorite: false,
    isPublic: false,
    createdAt: BASE,
    updatedAt: BASE,
    ingredients: [
      { id: 'di-1-1', recipeId: 'demo-1', qty: '400', unit: 'g',  item: 'spaghetti',       position: 0 },
      { id: 'di-1-2', recipeId: 'demo-1', qty: '200', unit: 'g',  item: 'guanciale',        position: 1 },
      { id: 'di-1-3', recipeId: 'demo-1', qty: '4',   unit: '',   item: 'egg yolks',        position: 2 },
      { id: 'di-1-4', recipeId: 'demo-1', qty: '80',  unit: 'g',  item: 'Pecorino Romano',  position: 3 },
    ],
    steps: [
      { id: 'ds-1-1', recipeId: 'demo-1', title: 'Boil pasta',     body: 'Cook spaghetti in well-salted water until al dente.',                               position: 0 },
      { id: 'ds-1-2', recipeId: 'demo-1', title: 'Fry guanciale',  body: 'Cook guanciale in a dry pan until crispy. Remove from heat.',                       position: 1 },
      { id: 'ds-1-3', recipeId: 'demo-1', title: 'Make sauce',     body: 'Whisk egg yolks with grated pecorino and a splash of pasta water.',                 position: 2 },
      { id: 'ds-1-4', recipeId: 'demo-1', title: 'Combine',        body: 'Off heat, toss pasta with guanciale then fold in egg mixture quickly.',             position: 3 },
    ],
  },
  {
    id: 'demo-2',
    userId: 'demo',
    title: 'Shakshuka',
    subtitle: 'Eggs poached in spiced tomato sauce',
    imageUrl: 'https://images.unsplash.com/photo-1544510807-2d87a65ae0a9?w=800&q=80',
    imageTone: '#C4603F',
    cookTime: 30,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Quick'],
    isFavorite: false,
    isPublic: false,
    createdAt: BASE,
    updatedAt: BASE,
    ingredients: [
      { id: 'di-2-1', recipeId: 'demo-2', qty: '1',   unit: 'can', item: 'crushed tomatoes', position: 0 },
      { id: 'di-2-2', recipeId: 'demo-2', qty: '4',   unit: '',    item: 'eggs',              position: 1 },
      { id: 'di-2-3', recipeId: 'demo-2', qty: '1',   unit: '',    item: 'onion',             position: 2 },
      { id: 'di-2-4', recipeId: 'demo-2', qty: '2',   unit: 'tsp', item: 'cumin',             position: 3 },
      { id: 'di-2-5', recipeId: 'demo-2', qty: '1',   unit: 'tsp', item: 'paprika',           position: 4 },
    ],
    steps: [
      { id: 'ds-2-1', recipeId: 'demo-2', title: 'Sauté onion',  body: 'Cook diced onion in olive oil until soft, about 5 min.',                     position: 0 },
      { id: 'ds-2-2', recipeId: 'demo-2', title: 'Add spices',   body: 'Add cumin and paprika, stir 1 min.',                                          position: 1 },
      { id: 'ds-2-3', recipeId: 'demo-2', title: 'Add tomatoes', body: 'Pour in crushed tomatoes, simmer 10 min until thickened.',                    position: 2 },
      { id: 'ds-2-4', recipeId: 'demo-2', title: 'Poach eggs',   body: 'Make wells in the sauce, crack eggs in. Cover and cook 5–7 min.',            position: 3 },
    ],
  },
  {
    id: 'demo-3',
    userId: 'demo',
    title: 'Banana Pancakes',
    subtitle: 'Fluffy stack with caramelised banana',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    imageTone: '#D4A24C',
    cookTime: 20,
    difficulty: 'Easy',
    tags: ['Breakfast', 'Quick'],
    isFavorite: false,
    isPublic: false,
    createdAt: BASE,
    updatedAt: BASE,
    ingredients: [
      { id: 'di-3-1', recipeId: 'demo-3', qty: '2',   unit: '',    item: 'ripe bananas',   position: 0 },
      { id: 'di-3-2', recipeId: 'demo-3', qty: '1',   unit: 'cup', item: 'flour',          position: 1 },
      { id: 'di-3-3', recipeId: 'demo-3', qty: '1',   unit: 'cup', item: 'milk',           position: 2 },
      { id: 'di-3-4', recipeId: 'demo-3', qty: '1',   unit: '',    item: 'egg',            position: 3 },
      { id: 'di-3-5', recipeId: 'demo-3', qty: '1',   unit: 'tsp', item: 'baking powder', position: 4 },
    ],
    steps: [
      { id: 'ds-3-1', recipeId: 'demo-3', title: 'Make batter', body: 'Mash bananas, mix with flour, milk, egg, and baking powder.',           position: 0 },
      { id: 'ds-3-2', recipeId: 'demo-3', title: 'Cook',        body: 'Ladle onto a hot buttered pan. Cook until bubbles form, flip once.',   position: 1 },
    ],
  },
  {
    id: 'demo-4',
    userId: 'demo',
    title: 'Avocado Toast',
    subtitle: 'Toasted sourdough with smashed avocado',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80',
    imageTone: '#7A9A5F',
    cookTime: 10,
    difficulty: 'Easy',
    tags: ['Vegetarian', 'Breakfast', 'Quick'],
    isFavorite: false,
    isPublic: false,
    createdAt: BASE,
    updatedAt: BASE,
    ingredients: [
      { id: 'di-4-1', recipeId: 'demo-4', qty: '2',   unit: 'slices', item: 'sourdough bread',    position: 0 },
      { id: 'di-4-2', recipeId: 'demo-4', qty: '1',   unit: '',       item: 'ripe avocado',       position: 1 },
      { id: 'di-4-3', recipeId: 'demo-4', qty: '',    unit: '',       item: 'lemon juice',        position: 2 },
      { id: 'di-4-4', recipeId: 'demo-4', qty: '',    unit: '',       item: 'red pepper flakes',  position: 3 },
    ],
    steps: [
      { id: 'ds-4-1', recipeId: 'demo-4', title: 'Toast bread', body: 'Toast sourdough until golden and crisp.',                                 position: 0 },
      { id: 'ds-4-2', recipeId: 'demo-4', title: 'Mash avo',    body: 'Mash avocado with lemon juice, salt, and pepper.',                       position: 1 },
      { id: 'ds-4-3', recipeId: 'demo-4', title: 'Top',         body: 'Spread on toast, finish with red pepper flakes.',                        position: 2 },
    ],
  },
  {
    id: 'demo-5',
    userId: 'demo',
    title: 'Roast Chicken',
    subtitle: 'Crispy herb-butter roast with pan juices',
    imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c8?w=800&q=80',
    imageTone: '#9B6B3F',
    cookTime: 90,
    difficulty: 'Medium',
    tags: ['Sunday slow', 'Dinner'],
    isFavorite: false,
    isPublic: false,
    createdAt: BASE,
    updatedAt: BASE,
    ingredients: [
      { id: 'di-5-1', recipeId: 'demo-5', qty: '1.5', unit: 'kg', item: 'whole chicken',          position: 0 },
      { id: 'di-5-2', recipeId: 'demo-5', qty: '60',  unit: 'g',  item: 'butter, softened',       position: 1 },
      { id: 'di-5-3', recipeId: 'demo-5', qty: '4',   unit: '',   item: 'garlic cloves',          position: 2 },
      { id: 'di-5-4', recipeId: 'demo-5', qty: '',    unit: '',   item: 'fresh thyme and rosemary', position: 3 },
    ],
    steps: [
      { id: 'ds-5-1', recipeId: 'demo-5', title: 'Prep',  body: 'Mix butter with crushed garlic and herbs. Rub under and over skin. Season generously.', position: 0 },
      { id: 'ds-5-2', recipeId: 'demo-5', title: 'Roast', body: 'Roast at 200°C for 1h 20min, basting halfway through.',                                 position: 1 },
      { id: 'ds-5-3', recipeId: 'demo-5', title: 'Rest',  body: 'Rest 15 min before carving. Use pan juices as sauce.',                                   position: 2 },
    ],
  },
]
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "C:\Users\alexe\OneDrive\Рабочий стол\coocking" && npx tsc --noEmit
```

Expected: no errors (or only pre-existing errors unrelated to this file).

- [ ] **Step 3: Commit**

```bash
git add src/lib/demo-data.ts
git commit -m "feat: add hardcoded demo recipes for guests"
```

---

### Task 2: Open `/home` in middleware

**Files:**
- Modify: `src/proxy.ts`

- [ ] **Step 1: Add `/home` to the public route matcher**

Replace line 3 in `src/proxy.ts`:

Old:
```ts
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/share/(.*)'])
```

New:
```ts
const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)', '/sign-up(.*)', '/share/(.*)', '/home'])
```

- [ ] **Step 2: Commit**

```bash
git add src/proxy.ts
git commit -m "feat: open /home to unauthenticated users"
```

---

### Task 3: Root page — always redirect to `/home`

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the entire file**

```ts
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/home')
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redirect root to /home for all visitors"
```

---

### Task 4: Home page — serve demo recipes for guests

**Files:**
- Modify: `src/app/home/page.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
import { auth } from '@clerk/nextjs/server'
import { getRecipesWithRelations } from '@/actions/recipes'
import { DEMO_RECIPES } from '@/lib/demo-data'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function HomePage() {
  const { userId } = await auth()
  const recipes = userId ? await getRecipesWithRelations() : DEMO_RECIPES

  return (
    <AppShell>
      <div className="flex-1 lg:hidden overflow-hidden">
        <RecipeFeed recipes={recipes} />
      </div>
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <DesktopHome recipes={recipes} />
      </div>
    </AppShell>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/home/page.tsx
git commit -m "feat: show demo recipes to unauthenticated visitors on /home"
```

---

### Task 5: Desktop sidebar — auth UI

**Files:**
- Modify: `src/components/desktop/DesktopSidebar.tsx`

- [ ] **Step 1: Add Clerk imports**

Add to the existing imports at the top of the file (after the current `import Link from 'next/link'` line):

```ts
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
```

- [ ] **Step 2: Wrap the Import card in `<SignedIn>` and add an auth section below it**

Find the bottom section of the `<aside>` (lines 98–111 in the current file):

```tsx
      <div className="flex-1" />

      {/* Import card */}
      <Link href="/import"
        className="flex items-center gap-2.5 px-3.5 py-3.5 rounded-[14px] no-underline"
        style={{ background: 'var(--ink)', color: 'var(--surface)' }}
      >
        <span style={{ color: 'var(--honey)' }}><Icons.upload /></span>
        <div className="flex-1 text-[12px] leading-[1.3]">
          <div className="font-serif text-[14px] font-semibold">Import .docx</div>
          <div style={{ opacity: 0.6 }}>Bring in your archive</div>
        </div>
      </Link>
    </aside>
```

Replace with:

```tsx
      <div className="flex-1" />

      {/* Import card — only for authenticated users */}
      <SignedIn>
        <Link href="/import"
          className="flex items-center gap-2.5 px-3.5 py-3.5 rounded-[14px] no-underline"
          style={{ background: 'var(--ink)', color: 'var(--surface)' }}
        >
          <span style={{ color: 'var(--honey)' }}><Icons.upload /></span>
          <div className="flex-1 text-[12px] leading-[1.3]">
            <div className="font-serif text-[14px] font-semibold">Import .docx</div>
            <div style={{ opacity: 0.6 }}>Bring in your archive</div>
          </div>
        </Link>
      </SignedIn>

      {/* Auth section */}
      <SignedIn>
        <div className="mt-3 flex items-center gap-2.5 px-1">
          <UserButton />
          <span className="text-[12px] font-medium truncate" style={{ color: 'var(--ink-muted)' }}>
            My account
          </span>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="mt-3 flex flex-col gap-2">
          <Link href="/sign-in"
            className="flex items-center justify-center h-9 rounded-[10px] text-[13px] font-semibold no-underline"
            style={{ border: '1px solid var(--rule-2)', color: 'var(--ink)' }}
          >
            Sign in
          </Link>
          <Link href="/sign-up"
            className="flex items-center justify-center h-9 rounded-[10px] text-[13px] font-semibold no-underline"
            style={{ background: 'var(--terracotta)', color: '#fff' }}
          >
            Register
          </Link>
        </div>
      </SignedOut>
    </aside>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/desktop/DesktopSidebar.tsx
git commit -m "feat: add login/register/logout UI to desktop sidebar"
```

---

### Task 6: Mobile RecipeFeed — auth button + hide guest actions

**Files:**
- Modify: `src/components/RecipeFeed.tsx`

- [ ] **Step 1: Add Clerk imports**

Replace the existing import block at the top with the addition:

```ts
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs'
```

(Add this after the existing imports.)

- [ ] **Step 2: Add `useAuth` call inside the component**

Inside `RecipeFeed`, after the three `useState` calls (around line 22), add:

```ts
  const { userId } = useAuth()
```

- [ ] **Step 3: Replace the user icon button in the header**

Find lines 55–58:

```tsx
          <button className="w-[42px] h-[42px] rounded-full flex items-center justify-center"
            style={{ border: '1px solid var(--rule-2)', background: 'var(--surface)', color: 'var(--ink)' }}>
            <Icons.user />
          </button>
```

Replace with:

```tsx
          <div className="w-[42px] h-[42px] flex items-center justify-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in"
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center"
                style={{ border: '1px solid var(--terracotta)', background: 'var(--surface)', color: 'var(--terracotta)' }}>
                <Icons.user />
              </Link>
            </SignedOut>
          </div>
```

- [ ] **Step 4: Hide the delete button on the featured card for guests**

Find the delete button inside the featured card (lines ~124–137):

```tsx
                <button
                  onClick={async (e) => {
                    e.preventDefault()
                    if (!window.confirm(`Удалить «${featured.title}»?`)) return
                    await deleteRecipe(featured.id)
                  }}
                  className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(0,0,0,0.38)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: '#fff',
                  }}>
                  <Icons.trash style={{ width: 15, height: 15 }} />
                </button>
```

Wrap with `{userId && (...)}`:

```tsx
                {userId && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!window.confirm(`Удалить «${featured.title}»?`)) return
                      await deleteRecipe(featured.id)
                    }}
                    className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(0,0,0,0.38)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#fff',
                    }}>
                    <Icons.trash style={{ width: 15, height: 15 }} />
                  </button>
                )}
```

- [ ] **Step 5: Hide "Delete all" button for guests**

Find (lines ~157–165):

```tsx
              {list.length > 0 && (
                <button
                  onClick={async () => {
                    if (!window.confirm(`Удалить все ${list.length} рецепт(ов)? Это действие необратимо.`)) return
                    await deleteAllRecipes()
                  }}
                  className="h-[30px] px-2.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1"
                  style={{ color: 'var(--ink-muted)', border: '1px solid var(--rule-2)' }}>
                  <Icons.trash style={{ width: 12, height: 12 }} /> Delete all
                </button>
              )}
```

Change condition to `{userId && list.length > 0 && ...}`:

```tsx
              {userId && list.length > 0 && (
                <button
                  onClick={async () => {
                    if (!window.confirm(`Удалить все ${list.length} рецепт(ов)? Это действие необратимо.`)) return
                    await deleteAllRecipes()
                  }}
                  className="h-[30px] px-2.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1"
                  style={{ color: 'var(--ink-muted)', border: '1px solid var(--rule-2)' }}>
                  <Icons.trash style={{ width: 12, height: 12 }} /> Delete all
                </button>
              )}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/RecipeFeed.tsx
git commit -m "feat: add mobile auth button and hide guest-only actions in RecipeFeed"
```

---

### Task 7: Hide action buttons in RecipeCard for guests

**Files:**
- Modify: `src/components/RecipeCard.tsx`

- [ ] **Step 1: Add `useAuth` import**

Add to the existing imports:

```ts
import { useAuth } from '@clerk/nextjs'
```

- [ ] **Step 2: Call `useAuth` inside the component**

After `const aspectRatio = tall ? '3/4.2' : '3/3.4'`, add:

```ts
  const { userId } = useAuth()
```

- [ ] **Step 3: Wrap the favorite button with `{userId && (...)}`**

Find lines 30–40:

```tsx
          {/* Favorite button */}
          <button
            onClick={async (e) => { e.preventDefault(); await toggleFavorite(recipe.id) }}
            className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(251,247,239,0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(31,26,20,0.06)',
              color: recipe.isFavorite ? 'var(--terracotta)' : 'var(--ink-muted)',
            }}>
            {recipe.isFavorite ? <Icons.heartF /> : <Icons.heart />}
          </button>
```

Replace with:

```tsx
          {/* Favorite button */}
          {userId && (
            <button
              onClick={async (e) => { e.preventDefault(); await toggleFavorite(recipe.id) }}
              className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(251,247,239,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(31,26,20,0.06)',
                color: recipe.isFavorite ? 'var(--terracotta)' : 'var(--ink-muted)',
              }}>
              {recipe.isFavorite ? <Icons.heartF /> : <Icons.heart />}
            </button>
          )}
```

- [ ] **Step 4: Wrap the delete button with `{userId && (...)}`**

Find lines 42–52:

```tsx
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="absolute top-2 left-2 w-[30px] h-[30px] rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(251,247,239,0.85)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(31,26,20,0.06)',
              color: 'var(--ink-muted)',
            }}>
            <Icons.trash />
          </button>
```

Replace with:

```tsx
          {/* Delete button */}
          {userId && (
            <button
              onClick={handleDelete}
              className="absolute top-2 left-2 w-[30px] h-[30px] rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(251,247,239,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(31,26,20,0.06)',
                color: 'var(--ink-muted)',
              }}>
              <Icons.trash />
            </button>
          )}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/RecipeCard.tsx
git commit -m "feat: hide delete/favorite buttons in RecipeCard for guests"
```

---

### Task 8: Smoke test

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Test as guest (incognito window)**

Open `http://localhost:3000` — should redirect to `/home`.

Check:
- 5 demo recipes visible (Pasta Carbonara, Shakshuka, Banana Pancakes, Avocado Toast, Roast Chicken)
- **Desktop:** sidebar bottom shows "Sign in" and "Register" buttons (no Import card)
- **Mobile:** user icon in header is terracotta-bordered, links to `/sign-in`
- No delete buttons on recipe cards or featured card
- No "Delete all" button
- Navigate to `http://localhost:3000/recipes/new` → redirects to `/sign-in`
- Navigate to `http://localhost:3000/favorites` → redirects to `/sign-in`
- Navigate to `http://localhost:3000/import` → redirects to `/sign-in`

- [ ] **Step 3: Test as authenticated user**

Click "Sign in" → login → redirects back to `/home`.

Check:
- Your own recipes show (not demo recipes)
- **Desktop:** sidebar bottom shows `<UserButton>` avatar + "My account" label + Import card visible
- **Mobile:** `<UserButton>` avatar in header
- Delete and favorite buttons visible on recipe cards
- Click `<UserButton>` → dropdown with "Sign out" option works
- Sign out → returns to `/home` with demo recipes
