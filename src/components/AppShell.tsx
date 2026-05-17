import DesktopSidebar from './desktop/DesktopSidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <DesktopSidebar />
      {children}
    </div>
  )
}
