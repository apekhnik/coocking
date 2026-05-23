import { auth } from '@clerk/nextjs/server'
import { getRecipesWithRelations, getPublicRecipes } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function HomePage() {
  const { userId } = await auth()
  const recipes = userId ? await getRecipesWithRelations() : await getPublicRecipes()

  return (
    <AppShell>
      <div className="flex-1 lg:hidden overflow-hidden">
        <RecipeFeed recipes={recipes} />
      </div>
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <DesktopHome recipes={recipes} />
      </div>
    </AppShell>
  )
}
