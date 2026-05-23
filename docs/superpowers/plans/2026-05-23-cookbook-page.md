# My Cookbook Page & Recipe Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/cookbook` page for the logged-in user's own recipes, make `/home` a pure community browse-only feed, add Public/Private filter chips on the cookbook page, and add public/private badges on all recipe cards.

**Architecture:** `/home` always shows `getPublicRecipes()` with action buttons disabled (community feed). New `/cookbook` page shows the user's own recipes via `getRecipesWithRelations()` with full actions and a visibility filter. Cards get a small lock/globe badge. Navigation wires up to `/cookbook`.

**Tech Stack:** Next.js 16 App Router, Clerk v7, Drizzle ORM, Tailwind CSS, TypeScript

**Task order (dependencies):**
Tasks 1–3 have no inter-dependencies. Task 4 depends on Tasks 2 & 3 (uses new props). Task 7 depends on Tasks 2 & 3. Tasks 5–6 depend on Task 1. Task 8 has no deps. Task 9 depends on all.

---

## File Map

| File | Change |
|------|--------|
| `src/components/Icon.tsx` | Add `Icons.lock` SVG |
| `src/components/RecipeFeed.tsx` | Add `showVisibilityFilter` + `disableActions` props |
| `src/components/desktop/DesktopHome.tsx` | Add `showVisibilityFilter` + `disableActions` props |
| `src/app/home/page.tsx` | Remove auth branch; pass `disableActions` to feed components |
| `src/components/RecipeCard.tsx` | Add public/private badge |
| `src/components/desktop/DesktopCard.tsx` | Add public/private badge to all 3 card variants |
| `src/app/cookbook/page.tsx` | New protected page |
| `src/components/BottomNav.tsx` | `book` item href → `/cookbook` |
| `src/components/desktop/DesktopSidebar.tsx` | `cookbook` item href → `/cookbook`, fix active logic |

---

## Task 1: Add lock icon to `Icon.tsx`

**Files:**
- Modify: `src/components/Icon.tsx`

- [ ] **Step 1: Add `lock` to the Icons object**

In `src/components/Icon.tsx`, add `lock` after the `share` line (currently line 17):

```ts
lock:   (p: P = {}) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="7" width="10" height="8" rx="1.5"/><path d="M5 7V5a3 3 0 0 1 6 0v2"/></svg>,
```

- [ ] **Step 2: Verify TypeScript**

```bash
cd "C:\Users\alexe\OneDrive\Рабочий стол\coocking"
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Icon.tsx
git commit -m "feat: add lock icon"
```

---

## Task 2: Update `RecipeFeed.tsx` — `showVisibilityFilter` + `disableActions`

**Files:**
- Modify: `src/components/RecipeFeed.tsx`

**Context:**
- `showVisibilityFilter?: boolean` — when true, adds "Public" and "Private" filter chips. Used by `/cookbook`.
- `disableActions?: boolean` — when true, hides all delete and favorite buttons regardless of auth state. Used by `/home` (community browse).
- Existing `FILTERS`: `['All', 'Favorites', 'Quick', 'Vegetarian', 'Dessert', 'Sunday']`

- [ ] **Step 1: Update Props interface**

Find `interface RecipeFeedProps {` and replace:

```tsx
interface RecipeFeedProps {
  recipes: RecipeListItem[]
  title?: string
  showVisibilityFilter?: boolean
  disableActions?: boolean
}
```

- [ ] **Step 2: Destructure new props**

Find `export default function RecipeFeed({ recipes, title }: RecipeFeedProps)` and replace:

```tsx
export default function RecipeFeed({ recipes, title, showVisibilityFilter, disableActions }: RecipeFeedProps) {
```

- [ ] **Step 3: Add VISIBILITY_FILTERS constant**

After the existing `const FILTERS = [...]` line, add:

```tsx
const VISIBILITY_FILTERS = ['Public', 'Private'] as const
```

- [ ] **Step 4: Update the list filter logic**

Find the `const list = recipes.filter(...)` block and replace it entirely:

```tsx
const list = recipes.filter((r) => {
  if (filter === 'Favorites' && !r.isFavorite) return false
  if (filter === 'Quick' && r.cookTime > 30) return false
  if (filter === 'Public' && !r.isPublic) return false
  if (filter === 'Private' && r.isPublic) return false
  if (filter !== 'All' && filter !== 'Favorites' && filter !== 'Quick' && filter !== 'Public' && filter !== 'Private') {
    if (!r.tags.some((t) => t === filter)) return false
  }
  if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false
  return true
})
```

- [ ] **Step 5: Add visibility filter chips to the chip row**

Find the filter chips `<div className="flex gap-2 w-max">` block. Inside it, after the closing `})}` of the `FILTERS.map(...)`, add:

```tsx
{showVisibilityFilter && VISIBILITY_FILTERS.map((f) => {
  const on = filter === f
  return (
    <button key={f} onClick={() => setFilter(f)}
      className="h-[34px] px-3.5 rounded-full text-[12.5px] font-semibold tracking-tight whitespace-nowrap"
      style={{
        border: on ? 'none' : '1px solid var(--rule-2)',
        background: on ? 'var(--ink)' : 'transparent',
        color: on ? 'var(--surface)' : 'var(--ink-2)',
      }}>
      {f}
    </button>
  )
})}
```

- [ ] **Step 6: Apply `disableActions` to delete and favorite buttons**

Search for every `{userId && (` in `RecipeFeed.tsx` that wraps a delete or favorite button. Replace each with `{userId && !disableActions && (`.

There are two locations:
1. The delete button on the featured card (in the hero section, inside the `<Link>`)
2. The delete + favorite buttons block in the rows view (inside `view === 'rows'` conditional)

- [ ] **Step 7: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/RecipeFeed.tsx
git commit -m "feat: add showVisibilityFilter and disableActions to RecipeFeed"
```

---

## Task 3: Update `DesktopHome.tsx` — `showVisibilityFilter` + `disableActions`

**Files:**
- Modify: `src/components/desktop/DesktopHome.tsx`

**Context:** Mirror of Task 2 for the desktop component. `useAuth()` and `userId` are already in this file from a previous fix.

- [ ] **Step 1: Update Props interface**

Find `interface Props {` and replace:

```tsx
interface Props {
  recipes: RecipeListItem[]
  title?: string
  showVisibilityFilter?: boolean
  disableActions?: boolean
}
```

- [ ] **Step 2: Destructure new props**

Find `export default function DesktopHome({ recipes, title }: Props)` and replace:

```tsx
export default function DesktopHome({ recipes, title, showVisibilityFilter, disableActions }: Props) {
```

- [ ] **Step 3: Add VISIBILITY_FILTERS and update filter logic**

After `const FILTERS = [...]`, add:

```tsx
const VISIBILITY_FILTERS = ['Public', 'Private'] as const
```

Find the `const filtered = recipes.filter(...)` block and replace it entirely:

```tsx
const filtered = recipes.filter((r) => {
  if (filter === 'Quick' && r.cookTime > 30) return false
  if (filter === 'Vegetarian' && !r.tags.includes('Vegetarian')) return false
  if (filter === 'Sweet' && !r.tags.includes('Dessert')) return false
  if (filter === 'Sunday' && !r.tags.includes('Sunday')) return false
  if (filter === 'Public' && !r.isPublic) return false
  if (filter === 'Private' && r.isPublic) return false
  if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false
  return true
})
```

- [ ] **Step 4: Add visibility chips to the filter row**

Find the block that renders `{FILTERS.map((f) => { ...` filter buttons. After the closing `})}` of that map, add:

```tsx
{showVisibilityFilter && VISIBILITY_FILTERS.map((f) => {
  const on = filter === f
  return (
    <button key={f} onClick={() => setFilter(f)}
      className="h-8 px-3.5 rounded-full text-[12.5px] font-semibold"
      style={{
        background: on ? 'var(--ink)' : 'transparent',
        color: on ? 'var(--surface)' : 'var(--ink-2)',
        border: on ? 'none' : '1px solid var(--rule-2)',
      }}>
      {f}
    </button>
  )
})}
```

- [ ] **Step 5: Apply `disableActions` to action buttons**

There are two locations where `userId` gates action buttons:

1. **"Delete all" button** — currently `{userId && recipes.length > 0 && (`:
   Change to `{userId && !disableActions && recipes.length > 0 && (`

2. **Per-recipe buttons in rows view** — currently `{userId && (`:
   Change to `{userId && !disableActions && (`

- [ ] **Step 6: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/desktop/DesktopHome.tsx
git commit -m "feat: add showVisibilityFilter and disableActions to DesktopHome"
```

---

## Task 4: Update `home/page.tsx` — pure community feed

**Files:**
- Modify: `src/app/home/page.tsx`

**Context:** Tasks 2 & 3 must be complete before this task (they add `disableActions` prop). This page removes the auth branch and passes `disableActions` to prevent logged-in users from seeing action buttons on other people's public recipes.

- [ ] **Step 1: Replace file content**

Replace the entire `src/app/home/page.tsx` with:

```tsx
import { getPublicRecipes } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function HomePage() {
  const recipes = await getPublicRecipes()

  return (
    <AppShell>
      <div className="flex-1 lg:hidden overflow-hidden">
        <RecipeFeed recipes={recipes} disableActions />
      </div>
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <DesktopHome recipes={recipes} disableActions />
      </div>
    </AppShell>
  )
}
```

Removed: `auth()` call, `getRecipesWithRelations` import.

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/home/page.tsx
git commit -m "feat: home page is now a pure community feed"
```

---

## Task 5: Add public/private badge to `RecipeCard.tsx`

**Files:**
- Modify: `src/components/RecipeCard.tsx`

**Context:** `Icons.lock` added in Task 1. `recipe.isPublic` is on the `Recipe` type (line 22 of `schema.ts`). Badge goes in bottom-right of the card image, mirroring the time badge that's in bottom-left.

- [ ] **Step 1: Add visibility badge to the image overlay**

In `RecipeCard.tsx`, find the time badge div:

```tsx
{/* Time badge */}
<div className="absolute left-2 bottom-2">
```

After the closing `</div>` of that time badge, add:

```tsx
{/* Visibility badge */}
<div className="absolute right-2 bottom-2">
  <span
    className="inline-flex items-center justify-center w-[22px] h-[22px] rounded-full"
    style={{
      background: recipe.isPublic ? 'var(--terracotta)' : 'rgba(31,26,20,0.55)',
      backdropFilter: 'blur(8px)',
      color: '#FBF7EF',
    }}
    title={recipe.isPublic ? 'Public' : 'Private'}
  >
    {recipe.isPublic
      ? <Icons.share style={{ width: 10, height: 10 }} />
      : <Icons.lock style={{ width: 10, height: 10 }} />
    }
  </span>
</div>
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/RecipeCard.tsx
git commit -m "feat: add public/private badge to RecipeCard"
```

---

## Task 6: Add public/private badge to `DesktopCard.tsx`

**Files:**
- Modify: `src/components/desktop/DesktopCard.tsx`

**Context:** Three variants — `DesktopFeature`, `DesktopRecipeWide`, `DesktopCard`. `Icons.lock` added in Task 1. `recipe.isPublic` is on `Recipe`. `Icons` already imported.

### DesktopFeature

- [ ] **Step 1: Add badge to DesktopFeature**

In `DesktopFeature`, find the "Editor's pick" chip div:
```tsx
<div className="absolute top-[18px] left-[18px]">
  <span className="chip dark">Editor&apos;s pick</span>
</div>
```

Add a visibility badge div immediately after it:

```tsx
{/* Visibility badge */}
<div className="absolute top-[18px] left-[68px]">
  <span
    className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-full"
    style={{
      background: recipe.isPublic ? 'rgba(184,84,63,0.85)' : 'rgba(0,0,0,0.32)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.18)',
      color: '#fff',
    }}
    title={recipe.isPublic ? 'Public' : 'Private'}
  >
    {recipe.isPublic
      ? <Icons.share style={{ width: 14, height: 14 }} />
      : <Icons.lock style={{ width: 14, height: 14 }} />
    }
  </span>
</div>
```

### DesktopRecipeWide

- [ ] **Step 2: Add badge to DesktopRecipeWide**

In `DesktopRecipeWide`, find the bottom row:
```tsx
<div className="flex items-center justify-between mt-3 shrink-0">
```

Inside it, there's a stats div on the left and a delete button on the right. Add the badge between them:

```tsx
<span
  className="inline-flex items-center justify-center w-6 h-6 rounded-full"
  style={{
    background: recipe.isPublic ? 'rgba(184,84,63,0.12)' : 'rgba(31,26,20,0.08)',
    color: recipe.isPublic ? 'var(--terracotta)' : 'var(--ink-soft)',
  }}
  title={recipe.isPublic ? 'Public' : 'Private'}
>
  {recipe.isPublic
    ? <Icons.share style={{ width: 11, height: 11 }} />
    : <Icons.lock style={{ width: 11, height: 11 }} />
  }
</span>
```

### DesktopCard

- [ ] **Step 3: Add badge to DesktopCard**

In `DesktopCard`, find the time badge:
```tsx
<div className="absolute left-2.5 bottom-2.5">
```

After its closing `</div>`, add:

```tsx
{/* Visibility badge */}
<div className="absolute right-2.5 bottom-2.5">
  <span
    className="inline-flex items-center justify-center w-6 h-6 rounded-full"
    style={{
      background: recipe.isPublic ? 'var(--terracotta)' : 'rgba(31,26,20,0.55)',
      backdropFilter: 'blur(8px)',
      color: '#FBF7EF',
    }}
    title={recipe.isPublic ? 'Public' : 'Private'}
  >
    {recipe.isPublic
      ? <Icons.share style={{ width: 11, height: 11 }} />
      : <Icons.lock style={{ width: 11, height: 11 }} />
    }
  </span>
</div>
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/desktop/DesktopCard.tsx
git commit -m "feat: add public/private badge to DesktopCard variants"
```

---

## Task 7: Create `/cookbook` page

**Files:**
- Create: `src/app/cookbook/page.tsx`

**Context:** Tasks 2 & 3 must be complete (provide `showVisibilityFilter` prop). `/cookbook` is not in `proxy.ts` public routes, so Clerk blocks unauthenticated access automatically — no middleware change needed.

- [ ] **Step 1: Create the file**

Create `src/app/cookbook/page.tsx`:

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

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/cookbook/page.tsx
git commit -m "feat: add /cookbook page for user's own recipes"
```

---

## Task 8: Wire navigation to `/cookbook`

**Files:**
- Modify: `src/components/BottomNav.tsx`
- Modify: `src/components/desktop/DesktopSidebar.tsx`

### BottomNav.tsx

- [ ] **Step 1: Update `book` href**

In `src/components/BottomNav.tsx`, find the `items` array. Change the `book` entry from `href: '/home'` to `href: '/cookbook'`:

```tsx
{ key: 'book', href: '/cookbook', label: 'Cookbook', Icon: Icons.book },
```

The existing active detection `pathname.startsWith(href) && href !== '/home' || pathname === href` will work correctly: `/cookbook` is not `/home`, so `pathname.startsWith('/cookbook')` activates it.

### DesktopSidebar.tsx

- [ ] **Step 2: Update `cookbook` href in NAV**

In `src/components/desktop/DesktopSidebar.tsx`, find the `NAV` array. Change the `cookbook` entry:

```tsx
{ key: 'cookbook', href: '/cookbook', label: 'My Cookbook', Icon: Icons.book },
```

- [ ] **Step 3: Fix active detection for cookbook**

Find the `active` const inside the `NAV.map` loop:

```tsx
const active = key === 'favorites' ? pathname.startsWith('/favorites') : key === 'home' ? pathname === '/home' : false
```

Replace with:

```tsx
const active =
  key === 'favorites' ? pathname.startsWith('/favorites') :
  key === 'home' ? pathname === '/home' :
  key === 'cookbook' ? pathname.startsWith('/cookbook') :
  false
```

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/BottomNav.tsx src/components/desktop/DesktopSidebar.tsx
git commit -m "feat: wire Cookbook nav links to /cookbook"
```

---

## Task 9: Manual end-to-end verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Guest on /home — no action buttons**

Open incognito. Navigate to `http://localhost:3000/home`.
Expected: public recipes visible, no delete/favorite buttons on any card.

- [ ] **Step 3: Auth user on /home — still no action buttons**

Log in. Navigate to `/home`.
Expected: same public feed, no delete/favorite buttons (disableActions hides them for all).

- [ ] **Step 4: Auth user navigates to /cookbook via nav**

Click "Cookbook" in BottomNav (mobile) or DesktopSidebar.
Expected: navigates to `/cookbook`, link is highlighted as active. Shows only YOUR own recipes.

- [ ] **Step 5: /cookbook has full actions**

In `/cookbook`: delete and favorite buttons are visible and functional.

- [ ] **Step 6: Visibility filters on /cookbook**

Chips "Public" and "Private" appear in the filter row.
Click "Public" → only public recipes shown.
Click "Private" → only private recipes shown.
Click "All" → all shown.

- [ ] **Step 7: Public/private badge on cards**

Cards with `isPublic=true`: terracotta share icon badge (bottom-right of image).
Cards with `isPublic=false`: grey lock icon badge.

- [ ] **Step 8: Guest blocked from /cookbook**

In incognito, navigate to `http://localhost:3000/cookbook`.
Expected: redirect to `/sign-in`.
