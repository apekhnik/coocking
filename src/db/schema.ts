import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle').notNull().default(''),
  imageUrl: text('image_url').notNull().default(''),
  imageTone: text('image_tone').notNull().default('#B8543F'),
  cookTime: integer('cook_time').notNull().default(30),
  difficulty: text('difficulty').notNull().default('Easy'),
  tags: text('tags').array().notNull().default([]),
  isFavorite: boolean('is_favorite').notNull().default(false),
  isPublic: boolean('is_public').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const ingredients = pgTable('ingredients', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  qty: text('qty').notNull().default(''),
  unit: text('unit').notNull().default(''),
  item: text('item').notNull(),
  position: integer('position').notNull().default(0),
})

export const steps = pgTable('steps', {
  id: uuid('id').primaryKey().defaultRandom(),
  recipeId: uuid('recipe_id')
    .notNull()
    .references(() => recipes.id, { onDelete: 'cascade' }),
  title: text('title').notNull().default(''),
  body: text('body').notNull(),
  position: integer('position').notNull().default(0),
})

export type Recipe = typeof recipes.$inferSelect
export type NewRecipe = typeof recipes.$inferInsert
export type Ingredient = typeof ingredients.$inferSelect
export type Step = typeof steps.$inferSelect
