import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRecipes } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function FavoritesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const all = await getRecipes(userId)
  const recipes = all.filter((r) => r.isFavorite)

  return (
    <AppShell>
      <div className="flex-1 lg:hidden overflow-hidden">
        <RecipeFeed recipes={recipes} title="Favorites" />
      </div>
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <DesktopHome recipes={recipes} title="Your favorites" />
      </div>
    </AppShell>
  )
}
