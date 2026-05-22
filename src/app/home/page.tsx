import { auth } from '@clerk/nextjs/server'
import { getRecipesWithRelations } from '@/actions/recipes'
import { DEMO_RECIPES } from '@/lib/demo-data'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function HomePage() {
  const { userId } = await auth()
  const recipes = userId ? await getRecipesWithRelations() : DEMO_RECIPES

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
