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
