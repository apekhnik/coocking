import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getRecipes } from '@/actions/recipes'
import AppShell from '@/components/AppShell'
import RecipeFeed from '@/components/RecipeFeed'
import DesktopHome from '@/components/desktop/DesktopHome'

export default async function HomePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const recipes = await getRecipes(userId)

  return (
    <AppShell>
      {/* Mobile: full-screen feed (hidden on lg+) */}
      <div className="flex-1 lg:hidden overflow-hidden">
        <RecipeFeed recipes={recipes} />
      </div>
      {/* Desktop: editorial layout with sticky header (hidden below lg) */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <DesktopHome recipes={recipes} />
      </div>
    </AppShell>
  )
}
