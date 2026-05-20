import { notFound } from 'next/navigation'
import { getPublicRecipe } from '@/actions/recipes'
import RecipeDetailView from '@/components/RecipeDetailView'

interface Props {
  params: Promise<{ id: string }>
}

export default async function SharePage({ params }: Props) {
  const { id } = await params
  const recipe = await getPublicRecipe(id)

  if (!recipe) notFound()

  return <RecipeDetailView recipe={recipe} readOnly />
}
