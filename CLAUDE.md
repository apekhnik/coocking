@AGENTS.md

# Mise — Recipe Cookbook

Персональный кулинарный блокнот. Next.js 16 приложение с мобильным и десктопным UI.

## Стек

| Слой | Технология |
|------|-----------|
| Framework | Next.js 16.2 (App Router, webpack — **не Turbopack**, он крашится на кириллическом пути `Рабочий стол`) |
| Auth | Clerk `@clerk/nextjs` v7 |
| DB | Neon (Postgres) через `@neondatabase/serverless` |
| ORM | Drizzle ORM (neon-http driver) |
| Styles | Tailwind CSS v4 + CSS custom properties (`var(--ink)`, `var(--terracotta)`, etc.) |
| Fonts | Manrope (sans, `--font-sans`) + Cormorant Garamond (serif, `--font-serif`) |
| Deploy | Vercel (деплой с ветки `main`) |
| Storage | Vercel Blob (`@vercel/blob`) — загрузка фото рецептов |

## Команды

```bash
npm run dev          # localhost:3000
npm run build        # production build
npm run db:push      # применить схему к Neon (использует DATABASE_URL_UNPOOLED)
npm run db:studio    # Drizzle Studio для просмотра БД
```

## Env переменные

Хранятся в `.env.local` (в .gitignore). Нужны:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` — из dashboard.clerk.com
- `DATABASE_URL` — pooled Neon connection (для runtime)
- `DATABASE_URL_UNPOOLED` — direct Neon connection (для `drizzle-kit push`)
- `BLOB_READ_WRITE_TOKEN` — из Vercel Blob dashboard (для загрузки фото)

## Auth и маршруты

Middleware в `src/proxy.ts` (в Next.js 16 называется `proxy`, не `middleware`).

| Маршрут | Доступ |
|---------|--------|
| `/` | публичный → редирект на `/home` |
| `/home` | публичный — гости видят демо-рецепты |
| `/sign-in/*`, `/sign-up/*` | публичные |
| `/share/*` | публичные |
| всё остальное | требует auth → редирект на `/sign-in` |

**Clerk v7 API** — `SignedIn`/`SignedOut` компонентов **нет**. Для условного рендеринга используй `useAuth()`:
```tsx
const { userId } = useAuth()
// авторизован:    {userId && <.../>}
// гость:          {!userId && <.../>}
// ternary:        {userId ? <authed/> : <guest/>}
```
Доступные компоненты: `UserButton`, `SignInButton`, `SignUpButton`, `SignOutButton`.

## Структура проекта

```
src/
├── proxy.ts                        # Auth middleware (Clerk). Публичные: /, /home, /sign-in/*, /sign-up/*, /share/*
├── lib/
│   ├── demo-data.ts                # DEMO_RECIPES: RecipeListItem[] — 5 хардкод-рецептов для гостей на /home
│   ├── docx-service.ts             # parseDocxToRecipes(buffer) + generateRecipeDocument(recipes) — парсинг/генерация .docx
│   └── image-service.ts            # fetchFoodImageUrl(title) — Unsplash по ключевым словам; getKeywords(title) — маппинг укр/рус → EN
├── actions/
│   └── recipes.ts                  # Server actions: getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe,
│                                   # toggleFavorite, importRecipesFromDocx, getRecipesWithRelations, populateRecipeImages
├── db/
│   ├── schema.ts                   # Drizzle schema: recipes, ingredients, steps + экспортированные типы
│   └── index.ts                    # Neon + Drizzle client (db)
├── app/
│   ├── layout.tsx                  # ClerkProvider + Google Fonts (Manrope, Cormorant Garamond)
│   ├── globals.css                 # CSS токены дизайн-системы + утилиты (.chip, .scroll, .fadein)
│   ├── page.tsx                    # Всегда редиректит на /home (для всех посетителей)
│   ├── home/page.tsx               # Лента рецептов; userId → свои рецепты из DB, иначе → DEMO_RECIPES
│   ├── favorites/page.tsx          # Избранные рецепты — тот же layout, фильтрует isFavorite
│   ├── recipes/[id]/page.tsx       # Детальная страница рецепта
│   ├── recipes/[id]/edit/page.tsx  # Редактор рецепта
│   ├── recipes/new/page.tsx        # Создание рецепта
│   ├── import/page.tsx             # Импорт .docx
│   └── api/
│       ├── export/route.ts         # GET → генерирует и отдаёт .docx со всеми рецептами пользователя
│       └── upload/route.ts         # POST multipart → сохраняет фото в Vercel Blob, возвращает {url}
└── components/
    ├── AppShell.tsx                 # Обёртка: сайдбар (desktop) + slot для контента
    ├── Icon.tsx                     # Все SVG-иконки как функции (home, heart, plus, book, upload, edit, grid, rows, ...)
    ├── FoodImg.tsx                  # <img> с градиентным fallback при ошибке загрузки
    ├── Chip.tsx                     # Тег-чип (.chip .veg/.quick/.plum/.honey/.dark)
    ├── BottomNav.tsx                # Нижняя навигация для мобайла: Home, Favorites, Add, Cookbook, Import
    ├── RecipeFeed.tsx               # Мобайл: лента с featured + grid/rows toggle, поиск, фильтры, title prop
    │                                # Шапка: UserButton (auth) / иконка→/sign-in (гость)
    │                                # Delete/favorite кнопки скрыты для гостей через useAuth().userId
    ├── RecipeCard.tsx               # Карточка рецепта для мобильной сетки
    │                                # Delete/favorite кнопки скрыты для гостей через useAuth().userId
    ├── RecipeDetailView.tsx         # Детальный вид: hero-фото, табы Ingredients/Method, servings scaler. Без BottomNav.
    ├── RecipeEditor.tsx             # Форма создания/редактирования: загрузка фото с ПК + random Unsplash
    ├── ImportView.tsx               # .docx импорт (кнопка → importRecipesFromDocx), экспорт, заполнение фото
    └── desktop/
        ├── DesktopSidebar.tsx       # Сайдбар 232px: логотип, nav, коллекции
        │                            # Низ: userId → Import card + UserButton; !userId → Sign in + Register
        ├── DesktopHome.tsx          # Десктоп главная: sticky header, editorial hero, grid/rows toggle, title prop
        └── DesktopCard.tsx          # DesktopFeature (большой), DesktopRecipeWide (горизонтальный), DesktopCard (сетка)
```

## База данных (Drizzle schema)

```
recipes        id, user_id, title, subtitle, image_url, image_tone,
               cook_time, difficulty, tags[], is_favorite, created_at, updated_at

ingredients    id, recipe_id (FK → cascade), qty, unit, item, position

steps          id, recipe_id (FK → cascade), title, body, position
```

Тип `Recipe` и `RecipeWithRelations` (с `ingredients[]` и `steps[]`) — экспортируются из `@/db/schema` и `@/actions/recipes`.
`RecipeListItem` = `Awaited<ReturnType<typeof getRecipesWithRelations>>[number]` — тип с `ingredients[]` и `steps[]`, используется в `DEMO_RECIPES` и `home/page.tsx`.

## Docx формат

Файл .docx содержит визуальный layout рецептов + скрытый JSON-блок (белый текст 1pt) между маркерами:
```
===DATA_JSON_START===
[{...рецепты...}]
===DATA_JSON_END===
```
Импорт читает JSON через mammoth. Экспорт генерирует файл в том же формате через библиотеку `docx`.

## Картинки рецептов

- Источник: `images.unsplash.com` (через redirect с `source.unsplash.com`)
- Маппинг: украинские/русские названия блюд → английские ключевые слова в `src/lib/image-service.ts`
- Upload: POST `/api/upload` → Vercel Blob → путь `recipes/{userId}/{timestamp}.{ext}`
- `next.config.ts` разрешает хосты: `images.unsplash.com`, `source.unsplash.com`, `*.public.blob.vercel-storage.com`

## Дизайн-система

CSS custom properties в `src/app/globals.css`:

```css
--bg: #F0E9DC        /* основной фон */
--surface: #F7F1E6   /* карточки, сайдбар */
--card: #FBF7EF
--ink: #1F1A14       /* основной текст */
--ink-muted: #6B6359
--ink-soft: #9B9389
--terracotta: #B8543F /* акцент */
--olive: #5C6B3F
--honey: #D4A24C
--plum: #6B3F4C
--rule: rgba(31,26,20,0.08)   /* разделители */
--rule-2: rgba(31,26,20,0.14)
```

Tailwind-токены настроены в `tailwind.config.ts` — используй `bg-terracotta`, `text-ink-muted` и т.д.

Шрифты: `.font-serif` для заголовков (Cormorant Garamond), `.font-sans` для UI (Manrope).

## Адаптивность

- **< 1024px (mobile)**: `AppShell` скрывает сайдбар, показывает `RecipeFeed` + `BottomNav`
- **≥ 1024px (desktop)**: сайдбар 232px + `DesktopHome` с editorial layout

Паттерн: `<div className="lg:hidden">` для мобайл-контента, `<div className="hidden lg:flex">` для десктопа.

При изменениях UI — правь **оба** компонента: `RecipeFeed` (mobile) и `DesktopHome` (desktop).

## Известные ограничения / TODO

- `toggleFavorite` в `RecipeCard` / `DesktopCard` — нет optimistic update
- Коллекции в сайдбаре — хардкод, не привязаны к тегам из БД
- Страница профиля (`/profile`) — не реализована
- Search и Cookbook в сайдбаре не имеют своих страниц (href: '/home', active: false)
- `DEMO_RECIPES` в `src/lib/demo-data.ts` — хардкод, обновлять вручную при необходимости
- Детальная страница рецепта (`/recipes/[id]`) защищена для гостей — гость не может открыть демо-рецепт полностью

## Прототип

Оригинальный дизайн-прототип (Claude Design Canvas) лежит в `prototype/` — HTML + JSX без бандлера, открывается прямо в браузере через `prototype/index.html`.
