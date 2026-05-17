import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import RecipeEditor from '@/components/RecipeEditor'

export default async function NewRecipePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <AppShell>
      <div className="flex-1 overflow-hidden">
        <RecipeEditor />
      </div>
    </AppShell>
  )
}
