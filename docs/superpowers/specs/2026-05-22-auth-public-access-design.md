# Auth: Public Access + Login/Logout/Register

**Date:** 2026-05-22  
**Status:** Approved

## Goal

Make `/home` publicly accessible with hardcoded demo recipes for guests. All other app routes remain protected. Add Login / Register / Logout UI in the sidebar (desktop) and mobile header.

---

## 1. Middleware (`src/proxy.ts`)

Add `/home` to the public route matcher. No other changes.

**Public routes (no auth required):**
- `/`
- `/sign-in(.*)`
- `/sign-up(.*)`
- `/share/(.*)`
- `/home` ← new

**Protected routes (auth.protect → redirect to /sign-in):**
- `/recipes/*` (create, edit, detail)
- `/favorites`
- `/import`
- `/api/*`
- everything else

Root `page.tsx` always redirects to `/home` (removes the sign-in branch).

---

## 2. Demo Data (`src/lib/demo-data.ts`)

New file. Exports `DEMO_RECIPES` — an array of ~5 hardcoded objects matching the `RecipeListItem` type returned by `getRecipesWithRelations()`.

Each demo recipe includes:
- `id`, `userId: 'demo'`, `title`, `subtitle`, `imageUrl` (Unsplash URL), `imageTone`, `cookTime`, `difficulty`, `tags`, `isFavorite: false`, `isPublic: false`, `createdAt`, `updatedAt`
- `ingredients: []`, `steps: []` (minimal, enough for RecipeCard rendering)

No DB queries. No env vars needed.

---

## 3. Home Page (`src/app/home/page.tsx`)

Remove the hard redirect to `/sign-in`. New logic:

```ts
const { userId } = await auth()
const recipes = userId ? await getRecipesWithRelations() : DEMO_RECIPES
```

Both guests and authenticated users render the same `<RecipeFeed>` / `<DesktopHome>` components — no new components needed.

---

## 4. Auth UI

### Desktop — `src/components/desktop/DesktopSidebar.tsx`

The sidebar already has a bottom section (after the Import card). Add below it, wrapped in Clerk's `<SignedIn>` / `<SignedOut>`:

**Guest (`<SignedOut>`):**
```
[ Sign in ]    ← link to /sign-in, styled like nav item
[ Register ]   ← link to /sign-up, styled as terracotta accent button
```

**Authenticated (`<SignedIn>`):**
```
<UserButton />  ← Clerk component: avatar + dropdown with Logout
user name/email (from useUser hook)
```

### Mobile — `src/components/RecipeFeed.tsx`

In the existing header row (top of RecipeFeed), add to the right side:

**Guest (`<SignedOut>`):**  
Small `Sign in` button (link to `/sign-in`)

**Authenticated (`<SignedIn>`):**  
`<UserButton />` (avatar, small)

---

## 5. Files Changed

| File | Change |
|------|--------|
| `src/proxy.ts` | Add `/home` to public route matcher |
| `src/app/page.tsx` | Always redirect to `/home` |
| `src/app/home/page.tsx` | Remove sign-in redirect; use demo data if no userId |
| `src/lib/demo-data.ts` | New file: `DEMO_RECIPES` constant |
| `src/components/desktop/DesktopSidebar.tsx` | Add auth UI at bottom |
| `src/components/RecipeFeed.tsx` | Add auth button in header |

No DB schema changes. No new pages. No changes to server actions.

---

## 6. Out of Scope

- DesktopHome mobile header (DesktopHome has its own sticky header — handled via RecipeFeed on mobile only)
- Profile page (`/profile`) — already listed as TODO in CLAUDE.md
- Favorites / import / add recipe for guests: middleware already redirects to `/sign-in` automatically
