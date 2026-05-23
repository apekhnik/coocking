import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRecipe, getPublicRecipe } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeDetailView from '@/components/RecipeDetailView'

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  const { id } = await params

  if (userId) {
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

  // Guest: only public recipes are accessible
  const recipe = await getPublicRecipe(id)
  if (!recipe) redirect('/sign-in')

  return (
    <AppShell>
      <div className="flex-1 overflow-hidden">
        <RecipeDetailView recipe={recipe} readOnly showSignupBanner />
      </div>
    </AppShell>
  )
}
