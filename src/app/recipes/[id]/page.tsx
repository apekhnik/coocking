import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRecipe } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeDetailView from '@/components/RecipeDetailView'

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const { id } = await params
  const recipe = await getRecipe(id)
  if (!recipe) redirect('/home')

  return (
    <AppShell>
      <div className="flex-1 overflow-hidden">
        <RecipeDetailView recipe={recipe} />
      </div>
    </AppShell>
  )
}
