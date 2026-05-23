# My Cookbook Page & Recipe Visibility — Design Spec

**Date:** 2026-05-23  
**Status:** Approved

## Goal

1. `/home` becomes a pure community feed (always public recipes, no auth branch)
2. New `/cookbook` page shows the logged-in user's own recipes with Public/Private filter
3. Recipe cards show a public/private badge
4. Navigation wires up "Cookbook" link to `/cookbook`

---

## Section 1: `/home` — Always Public Feed

**File:** `src/app/home/page.tsx`

Remove the `userId` branch. Always call `getPublicRecipes()`:

```tsx
const recipes = await getPublicRecipes()
```

Remove `getRecipesWithRelations` import. Remove `auth()` call. The page becomes a simple server component with no auth dependency.

---

## Section 2: New `/cookbook` Page

**File:** `src/app/cookbook/page.tsx` (new)

Protected route — `/cookbook` is not in middleware public list, so Clerk blocks unauthenticated access automatically.

```tsx
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRecipesWithRelations } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function CookbookPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const recipes = await getRecipesWithRelations()

  return (
    <AppShell>
      <div className="flex-1 lg:hidden overflow-hidden">
        <RecipeFeed recipes={recipes} title="My Cookbook" showVisibilityFilter />
      </div>
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <DesktopHome recipes={recipes} title="My Cookbook" showVisibilityFilter />
      </div>
    </AppShell>
  )
}
```

---

## Section 3: Public/Private Filter in RecipeFeed & DesktopHome

**Files:** `src/components/RecipeFeed.tsx`, `src/components/desktop/DesktopHome.tsx`

Add optional prop `showVisibilityFilter?: boolean` to both components.

When `showVisibilityFilter` is true, add two extra filter chips to the existing chip row:
- `Public` — filters to `r.isPublic === true`
- `Private` — filters to `r.isPublic === false`

Filter logic additions (in the existing `.filter()` call):
```ts
if (filter === 'Public' && !r.isPublic) return false
if (filter === 'Private' && r.isPublic) return false
```

The chips render alongside existing filters. On `/home` (no prop) — not shown. On `/cookbook` (prop passed) — shown.

---

## Section 4: Public/Private Badge on Recipe Cards

**Files:** `src/components/RecipeCard.tsx`, `src/components/desktop/DesktopCard.tsx`

Add a small badge on each card showing visibility status:
- Public: globe icon (`Icons.share` or a small 🌐-like SVG) — terracotta tint
- Private: lock icon — ink-muted tint

**RecipeCard** (mobile grid card): badge in top-left corner overlay, alongside existing tag chips. Small (20×20px), semi-transparent background, same style as existing chip overlays.

**DesktopCard / DesktopFeature / DesktopRecipeWide**: badge in the same top corner position, matching style.

Badge is always rendered (on both `/home` and `/cookbook`). On `/home` every recipe is public so every card shows the globe — subtle but informative. In `/cookbook` the mix of lock/globe is more useful.

---

## Section 5: Navigation Wiring

**Files:** `src/components/BottomNav.tsx`, `src/components/desktop/DesktopSidebar.tsx`

Currently `Cookbook` link points to `/home` (placeholder). Change to `/cookbook`.

In `BottomNav.tsx`: update the href for the "book" / cookbook nav item.
In `DesktopSidebar.tsx`: update the href for the Cookbook nav item, set `active: true` when path is `/cookbook`.

---

## Files Changed

| File | Change |
|------|--------|
| `src/app/home/page.tsx` | Remove auth branch, always `getPublicRecipes()` |
| `src/app/cookbook/page.tsx` | New protected page with user's own recipes |
| `src/components/RecipeFeed.tsx` | Add `showVisibilityFilter` prop + Public/Private filter logic |
| `src/components/desktop/DesktopHome.tsx` | Add `showVisibilityFilter` prop + Public/Private filter logic |
| `src/components/RecipeCard.tsx` | Add public/private badge |
| `src/components/desktop/DesktopCard.tsx` | Add public/private badge |
| `src/components/BottomNav.tsx` | Update Cookbook href to `/cookbook` |
| `src/components/desktop/DesktopSidebar.tsx` | Update Cookbook href to `/cookbook` |

## Out of Scope

- No pagination
- No "community" label change on /home header (kept as-is)
- No author attribution on public recipe cards
