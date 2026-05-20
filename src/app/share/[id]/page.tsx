import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { getPublicRecipe } from '@/actions/recipes'
import RecipeDetailView from '@/components/RecipeDetailView'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const recipe = await getPublicRecipe(id)
  return { title: recipe?.title ?? 'Recipe' }
}

export default async function SharePage({ params }: Props) {
  const { id } = await params
  const [recipe, { userId }] = await Promise.all([
    getPublicRecipe(id),
    auth(),
  ])

  if (!recipe) notFound()

  return <RecipeDetailView recipe={recipe} readOnly showSignupBanner={!userId} />
}
