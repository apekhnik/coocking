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
| Deploy | Vercel |

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

## Структура проекта

```
src/
├── proxy.ts                        # Auth middleware (Clerk). В Next.js 16 называется proxy, не middleware
├── actions/
│   └── recipes.ts                  # Все server actions: getRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, toggleFavorite
├── db/
│   ├── schema.ts                   # Drizzle schema: recipes, ingredients, steps + экспортированные типы
│   └── index.ts                    # Neon + Drizzle client (db)
├── app/
│   ├── layout.tsx                  # ClerkProvider + Google Fonts (Manrope, Cormorant Garamond)
│   ├── globals.css                 # CSS токены дизайн-системы + утилиты (.chip, .scroll, .fadein)
│   ├── page.tsx                    # Редирект: authed → /home, иначе → /sign-in
│   ├── home/page.tsx               # Лента рецептов (AppShell + RecipeFeed mobile / DesktopHome desktop)
│   ├── recipes/[id]/page.tsx       # Детальная страница рецепта
│   ├── recipes/[id]/edit/page.tsx  # Редактор рецепта
│   ├── recipes/new/page.tsx        # Создание рецепта
│   └── import/page.tsx             # Импорт .docx
└── components/
    ├── AppShell.tsx                 # Обёртка: сайдбар (desktop) + slot для контента
    ├── Icon.tsx                     # Все SVG-иконки как функции
    ├── FoodImg.tsx                  # <img> с градиентным fallback при ошибке загрузки
    ├── Chip.tsx                     # Тег-чип (.chip .veg/.quick/.plum/.honey/.dark)
    ├── BottomNav.tsx                # Нижняя навигация для мобайла (fixed)
    ├── RecipeFeed.tsx               # Мобайл: лента с featured + 2-column grid, поиск, фильтры
    ├── RecipeCard.tsx               # Карточка рецепта для мобильной сетки
    ├── RecipeDetailView.tsx         # Детальный вид: hero-фото, табы Ingredients/Method, servings scaler
    ├── RecipeEditor.tsx             # Форма создания/редактирования рецепта
    ├── ImportView.tsx               # Dropzone для .docx импорта (UI-заглушка, логика не реализована)
    └── desktop/
        ├── DesktopSidebar.tsx       # Сайдбар 232px (только lg+): логотип, nav, коллекции, import-card
        ├── DesktopHome.tsx          # Десктоп главная: sticky header, editorial hero, 4-column grid
        └── DesktopCard.tsx          # Три компонента: DesktopFeature (большой), DesktopRecipeWide (горизонтальный), DesktopCard (сетка)
```

## База данных (Drizzle schema)

```
recipes        id, user_id, title, subtitle, image_url, image_tone,
               cook_time, difficulty, tags[], is_favorite, created_at, updated_at

ingredients    id, recipe_id (FK → cascade), qty, unit, item, position

steps          id, recipe_id (FK → cascade), title, body, position
```

Тип `Recipe` и `RecipeWithRelations` (с `ingredients[]` и `steps[]`) — экспортируются из `@/db/schema` и `@/actions/recipes`.

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

## Известные ограничения / TODO

- `ImportView` — только UI, реальный парсинг .docx не реализован
- `toggleFavorite` в `RecipeCard` / `DesktopCard` вызывает server action напрямую из `onClick` — нет optimistic update
- Картинки рецептов — пока только URL (Unsplash). Upload на Vercel Blob / R2 не реализован
- Коллекции в сайдбаре — хардкод, не привязаны к тегам из БД
- Страница профиля (`/profile`) — не реализована

## Прототип

Оригинальный дизайн-прототип (Claude Design Canvas) лежит в `prototype/` — HTML + JSX без бандлера, открывается прямо в браузере через `prototype/index.html`.
