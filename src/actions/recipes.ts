'use server'

import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { recipes, ingredients, steps } from '@/db/schema'
import type { NewRecipe } from '@/db/schema'
import { eq, and, inArray } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { parseDocxToRecipes } from '@/lib/docx-service'
import { fetchFoodImageUrl } from '@/lib/image-service'

export type RecipeWithRelations = Awaited<ReturnType<typeof getRecipe>>

export async function getRecipes(userId?: string) {
  const { userId: authUserId } = await auth()
  const uid = userId ?? authUserId
  if (!uid) return []

  return db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, uid))
    .orderBy(recipes.createdAt)
}

export async function getRecipe(id: string) {
  const { userId } = await auth()
  if (!userId) return null

  const [recipe] = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
    .limit(1)

  if (!recipe) return null

  const [recipeIngredients, recipeSteps] = await Promise.all([
    db
      .select()
      .from(ingredients)
      .where(eq(ingredients.recipeId, id))
      .orderBy(ingredients.position),
    db
      .select()
      .from(steps)
      .where(eq(steps.recipeId, id))
      .orderBy(steps.position),
  ])

  return { ...recipe, ingredients: recipeIngredients, steps: recipeSteps }
}

export async function createRecipe(data: {
  recipe: Omit<NewRecipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ingredients: { qty: string; unit: string; item: string }[]
  steps: { title: string; body: string }[]
}) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [recipe] = await db
    .insert(recipes)
    .values({ ...data.recipe, userId })
    .returning()

  if (data.ingredients.length) {
    await db.insert(ingredients).values(
      data.ingredients.map((ing, position) => ({
        recipeId: recipe.id,
        ...ing,
        position,
      }))
    )
  }

  if (data.steps.length) {
    await db.insert(steps).values(
      data.steps.map((step, position) => ({
        recipeId: recipe.id,
        ...step,
        position,
      }))
    )
  }

  revalidatePath('/home')
  return recipe
}

export async function updateRecipe(
  id: string,
  data: {
    recipe: Partial<Omit<NewRecipe, 'id' | 'userId' | 'createdAt'>>
    ingredients?: { qty: string; unit: string; item: string }[]
    steps?: { title: string; body: string }[]
  }
) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await db
    .update(recipes)
    .set({ ...data.recipe, updatedAt: new Date() })
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))

  if (data.ingredients !== undefined) {
    await db.delete(ingredients).where(eq(ingredients.recipeId, id))
    if (data.ingredients.length) {
      await db.insert(ingredients).values(
        data.ingredients.map((ing, position) => ({
          recipeId: id,
          ...ing,
          position,
        }))
      )
    }
  }

  if (data.steps !== undefined) {
    await db.delete(steps).where(eq(steps.recipeId, id))
    if (data.steps.length) {
      await db.insert(steps).values(
        data.steps.map((step, position) => ({
          recipeId: id,
          ...step,
          position,
        }))
      )
    }
  }

  revalidatePath('/home')
  revalidatePath(`/recipes/${id}`)
}

export async function deleteRecipe(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await db
    .delete(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))

  revalidatePath('/home')
}

export async function populateRecipeImages(): Promise<{ updated: number }> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const all = await db
    .select({ id: recipes.id, title: recipes.title, imageUrl: recipes.imageUrl })
    .from(recipes)
    .where(eq(recipes.userId, userId))

  const missing = all.filter(r => !r.imageUrl)
  let updated = 0

  for (const r of missing) {
    const imageUrl = await fetchFoodImageUrl(r.title)
    if (imageUrl) {
      await db
        .update(recipes)
        .set({ imageUrl })
        .where(eq(recipes.id, r.id))
      updated++
    }
  }

  revalidatePath('/home')
  return { updated }
}

export async function getRecipesWithRelations() {
  const { userId } = await auth()
  if (!userId) return []

  const allRecipes = await db
    .select()
    .from(recipes)
    .where(eq(recipes.userId, userId))
    .orderBy(recipes.createdAt)

  if (!allRecipes.length) return []

  const ids = allRecipes.map(r => r.id)

  const [allIngredients, allSteps] = await Promise.all([
    db.select().from(ingredients).where(inArray(ingredients.recipeId, ids)),
    db.select().from(steps).where(inArray(steps.recipeId, ids)),
  ])

  return allRecipes.map(recipe => ({
    ...recipe,
    ingredients: allIngredients.filter(i => i.recipeId === recipe.id),
    steps: allSteps.filter(s => s.recipeId === recipe.id),
  }))
}

export async function importRecipesFromDocx(
  formData: FormData
): Promise<{ imported: number; skipped: number }> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  if (!file) throw new Error('Файл не знайдено')

  const buffer = Buffer.from(await file.arrayBuffer())
  const parsed = await parseDocxToRecipes(buffer)

  const existingRecipes = await db
    .select({ title: recipes.title })
    .from(recipes)
    .where(eq(recipes.userId, userId))

  const existingTitles = new Set(existingRecipes.map(r => r.title))

  let imported = 0
  let skipped = 0

  for (const item of parsed) {
    if (!item.title || existingTitles.has(item.title)) {
      skipped++
      continue
    }

    const imageUrl = await fetchFoodImageUrl(item.title)

    const subtitle =
      item.subtitle ||
      (item.description && item.description !== '-'
        ? item.description.split('\n')[0].trim().slice(0, 200)
        : '')

    const [recipe] = await db
      .insert(recipes)
      .values({ title: item.title, subtitle, userId, imageUrl })
      .returning()

    if (item.description && item.description !== '-') {
      await db.insert(steps).values({
        recipeId: recipe.id,
        body: item.description,
        title: '',
        position: 0,
      })
    }

    const ingredientLines = (item.ingredients ?? '')
      .split('\n')
      .map((l: string) => l.trim())
      .filter(Boolean)

    if (ingredientLines.length) {
      await db.insert(ingredients).values(
        ingredientLines.map((line: string, position: number) => ({
          recipeId: recipe.id,
          item: line,
          qty: '',
          unit: '',
          position,
        }))
      )
    }

    existingTitles.add(item.title)
    imported++
  }

  revalidatePath('/home')
  return { imported, skipped }
}

export async function deleteAllRecipes(): Promise<{ deleted: number }> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const all = await db
    .select({ id: recipes.id })
    .from(recipes)
    .where(eq(recipes.userId, userId))

  if (all.length === 0) return { deleted: 0 }

  await db.delete(recipes).where(eq(recipes.userId, userId))

  revalidatePath('/home')
  revalidatePath('/favorites')
  return { deleted: all.length }
}

export async function toggleFavorite(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [recipe] = await db
    .select({ isFavorite: recipes.isFavorite })
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
    .limit(1)

  if (!recipe) return

  await db
    .update(recipes)
    .set({ isFavorite: !recipe.isFavorite, updatedAt: new Date() })
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))

  revalidatePath('/home')
  revalidatePath(`/recipes/${id}`)
}

export async function toggleShareRecipe(id: string): Promise<{ isPublic: boolean }> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const [recipe] = await db
    .select({ isPublic: recipes.isPublic })
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))
    .limit(1)

  if (!recipe) throw new Error('Not found')

  const next = !recipe.isPublic

  await db
    .update(recipes)
    .set({ isPublic: next, updatedAt: new Date() })
    .where(and(eq(recipes.id, id), eq(recipes.userId, userId)))

  revalidatePath(`/recipes/${id}`)
  return { isPublic: next }
}

export async function getPublicRecipe(id: string) {
  const [recipe] = await db
    .select()
    .from(recipes)
    .where(and(eq(recipes.id, id), eq(recipes.isPublic, true)))
    .limit(1)

  if (!recipe) return null

  const [recipeIngredients, recipeSteps] = await Promise.all([
    db
      .select()
      .from(ingredients)
      .where(eq(ingredients.recipeId, id))
      .orderBy(ingredients.position),
    db
      .select()
      .from(steps)
      .where(eq(steps.recipeId, id))
      .orderBy(steps.position),
  ])

  return { ...recipe, ingredients: recipeIngredients, steps: recipeSteps }
}
