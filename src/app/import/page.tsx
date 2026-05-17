import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import ImportView from '@/components/ImportView'

export default async function ImportPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <AppShell>
      <div className="flex-1 overflow-hidden">
        <ImportView />
      </div>
    </AppShell>
  )
}
