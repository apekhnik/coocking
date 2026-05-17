'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from './Icon'

const items = [
  { key: 'home',      href: '/home',        label: 'Home',      Icon: Icons.home },
  { key: 'favorites', href: '/favorites',   label: 'Favorites', Icon: Icons.heart },
  { key: 'add',       href: '/recipes/new', label: '',          Icon: Icons.plus },
  { key: 'book',      href: '/home',        label: 'Cookbook',  Icon: Icons.book },
  { key: 'import',    href: '/import',      label: 'Import',    Icon: Icons.upload },
] as const

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 right-0 bottom-0 pb-7 pt-3.5 z-30"
      style={{ background: 'linear-gradient(180deg, rgba(240,233,220,0) 0%, rgba(240,233,220,0.95) 40%, var(--bg) 100%)' }}>
      <div className="mx-3.5 h-16 rounded-[36px] flex items-center justify-around px-1.5"
        style={{
          background: 'rgba(251,247,239,0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(31,26,20,0.06)',
          boxShadow: '0 1px 2px rgba(31,26,20,0.04), 0 12px 30px rgba(31,26,20,0.10)',
        }}>
        {items.map(({ key, href, label, Icon }) => {
          if (key === 'add') {
            return (
              <Link key={key} href={href} aria-label="Add recipe"
                className="w-12 h-12 rounded-full flex items-center justify-center text-card shrink-0"
                style={{ background: 'var(--ink)', boxShadow: '0 6px 16px rgba(31,26,20,0.28)' }}>
                <Icon />
              </Link>
            )
          }
          const active = pathname.startsWith(href) && href !== '/home' || pathname === href
          return (
            <Link key={key} href={href}
              className="flex flex-col items-center gap-0.5 px-2.5 min-w-[54px]"
              style={{ color: active ? 'var(--terracotta)' : 'var(--ink-soft)' }}>
              <Icon />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
