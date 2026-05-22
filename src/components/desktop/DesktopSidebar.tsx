'use client'

import Link from 'next/link'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/Icon'

const NAV = [
  { key: 'home',      href: '/home',      label: 'Home',       Icon: Icons.home },
  { key: 'search',    href: '/home',      label: 'Search',     Icon: Icons.search },
  { key: 'favorites', href: '/favorites', label: 'Favorites',  Icon: Icons.heart },
  { key: 'cookbook',  href: '/home',      label: 'My Cookbook',Icon: Icons.book },
] as const

const COLLECTIONS = [
  { label: 'Weeknight quick',    count: 12 },
  { label: 'Sunday slow',        count: 8  },
  { label: 'Vegetarian',         count: 22 },
  { label: 'Sweet things',       count: 14 },
  { label: 'Imported · grandma', count: 9  },
]

export default function DesktopSidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex flex-col shrink-0"
      style={{
        width: 232,
        padding: '28px 18px 24px',
        background: 'var(--surface)',
        borderRight: '1px solid var(--rule)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 pb-[22px]">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{
            width: 32, height: 32,
            background: 'var(--ink)',
            color: 'var(--honey)',
            fontFamily: 'var(--font-serif)',
            fontSize: 20, fontWeight: 600, fontStyle: 'italic',
          }}
        >
          m
        </div>
        <div>
          <div className="font-serif text-[17px] font-semibold leading-none">Mise</div>
          <div className="text-[10px] uppercase tracking-[0.14em] mt-0.5" style={{ color: 'var(--ink-soft)' }}>
            Cookbook
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV.map(({ key, href, label, Icon }) => {
          const active = key === 'favorites' ? pathname.startsWith('/favorites') : key === 'home' ? pathname === '/home' : false
          return (
            <Link key={key} href={href}
              className="flex items-center gap-2.5 px-2.5 py-[9px] rounded-[10px] text-[13.5px] transition-all"
              style={{
                background: active ? 'var(--paper)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--ink-muted)',
                fontWeight: active ? 700 : 500,
                boxShadow: active ? '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)' : 'none',
                border: 'none',
              }}
            >
              <Icon />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Collections */}
      <div className="mt-6 mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: 'var(--ink-soft)' }}>
        Collections
      </div>
      <div className="flex flex-col gap-0.5">
        {COLLECTIONS.map(({ label, count }) => (
          <button key={label}
            className="flex items-center justify-between px-2.5 py-2 rounded-[10px] text-[13px] font-medium text-left transition-colors hover:bg-black/[0.04]"
            style={{ color: 'var(--ink-2)', border: 'none', background: 'transparent' }}
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--olive)', opacity: 0.5 }} />
              {label}
            </span>
            <span className="text-[11px]" style={{ color: 'var(--ink-soft)' }}>{count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Import card — only for authenticated users */}
      <SignedIn>
        <Link href="/import"
          className="flex items-center gap-2.5 px-3.5 py-3.5 rounded-[14px] no-underline"
          style={{ background: 'var(--ink)', color: 'var(--surface)' }}
        >
          <span style={{ color: 'var(--honey)' }}><Icons.upload /></span>
          <div className="flex-1 text-[12px] leading-[1.3]">
            <div className="font-serif text-[14px] font-semibold">Import .docx</div>
            <div style={{ opacity: 0.6 }}>Bring in your archive</div>
          </div>
        </Link>
      </SignedIn>

      {/* Auth section */}
      <SignedIn>
        <div className="mt-3 flex items-center gap-2.5 px-1">
          <UserButton />
          <span className="text-[12px] font-medium truncate" style={{ color: 'var(--ink-muted)' }}>
            My account
          </span>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="mt-3 flex flex-col gap-2">
          <Link href="/sign-in"
            className="flex items-center justify-center h-9 rounded-[10px] text-[13px] font-semibold no-underline"
            style={{ border: '1px solid var(--rule-2)', color: 'var(--ink)' }}
          >
            Sign in
          </Link>
          <Link href="/sign-up"
            className="flex items-center justify-center h-9 rounded-[10px] text-[13px] font-semibold no-underline"
            style={{ background: 'var(--terracotta)', color: '#fff' }}
          >
            Register
          </Link>
        </div>
      </SignedOut>
    </aside>
  )
}
