'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Icons } from '@/components/Icon'
import FoodImg from '@/components/FoodImg'
import { DesktopFeature, DesktopRecipeWide, DesktopCard } from './DesktopCard'
import { toggleFavorite } from '@/actions/recipes'
import type { Recipe } from '@/db/schema'

const FILTERS = ['All', 'Quick', 'Vegetarian', 'Sweet', 'Sunday'] as const

interface Props {
  recipes: Recipe[]
}

export default function DesktopHome({ recipes }: Props) {
  const [filter, setFilter] = useState<string>('All')
  const [q, setQ] = useState('')
  const [view, setView] = useState<'grid' | 'rows'>('grid')

  const filtered = recipes.filter((r) => {
    if (filter === 'Quick' && r.cookTime > 30) return false
    if (filter === 'Vegetarian' && !r.tags.includes('Vegetarian')) return false
    if (filter === 'Sweet' && !r.tags.includes('Dessert')) return false
    if (filter === 'Sunday' && !r.tags.includes('Sunday')) return false
    if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const featured = filtered[0]
  const secondaries = filtered.slice(1, 3)
  const grid = filtered.slice(3)

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <main className="flex-1 overflow-y-auto scroll" style={{ background: 'var(--bg)' }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center gap-3.5 px-9"
        style={{
          padding: '18px 36px',
          background: 'rgba(240,233,220,0.88)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--rule)',
        }}
      >
        {/* Search */}
        <label className="flex items-center gap-2.5 h-[42px] px-4 rounded-[12px] flex-1 max-w-[520px]"
          style={{ background: 'rgba(31,26,20,0.06)', color: 'var(--ink-muted)' }}>
          <Icons.search style={{ width: 16, height: 16 }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${recipes.length} recipes, ingredients, or tags…`}
            className="flex-1 border-none outline-none bg-transparent text-[13.5px]"
            style={{ color: 'var(--ink)' }}
          />
        </label>

        <div className="flex-1" />

        <button className="h-[42px] px-4 rounded-[12px] inline-flex items-center gap-2 text-[13px] font-semibold"
          style={{ background: 'transparent', border: '1px solid var(--rule-2)', color: 'var(--ink-2)' }}>
          <Icons.filter style={{ width: 16, height: 16 }} />
          Filters
        </button>

        <Link href="/recipes/new"
          className="h-[42px] px-[18px] rounded-[12px] inline-flex items-center gap-2 text-[13px] font-bold no-underline"
          style={{ background: 'var(--terracotta)', color: '#fff' }}>
          <Icons.plus style={{ width: 16, height: 16 }} />
          New recipe
        </Link>
      </div>

      {/* Editorial hero */}
      <div style={{ padding: '34px 36px 24px' }}>
        <div className="flex items-end justify-between mb-[18px]">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: 'var(--terracotta)' }}>
              Vol. 04 · Late Summer
            </div>
            <h1 className="font-serif mt-1.5 mb-0 text-[54px] leading-none font-medium tracking-tight">
              The <em className="italic" style={{ color: 'var(--terracotta)' }}>kitchen</em> tonight
            </h1>
          </div>
          <div className="text-right font-serif">
            <div className="text-[13px] italic" style={{ color: 'var(--ink-muted)' }}>{today}</div>
            <div className="text-[13px] italic mt-0.5" style={{ color: 'var(--ink-muted)' }}>23° · clear · open windows</div>
          </div>
        </div>

        {/* Hero grid: big feature + 2 wide cards */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
            {featured && <DesktopFeature recipe={featured} />}
            <div className="grid gap-5" style={{ gridTemplateRows: secondaries.length > 1 ? '1fr 1fr' : '1fr' }}>
              {secondaries.map((r) => (
                <DesktopRecipeWide key={r.id} recipe={r} />
              ))}
              {secondaries.length === 0 && (
                <div className="rounded-[18px] flex items-center justify-center text-[14px]"
                  style={{ border: '1px dashed var(--rule-2)', color: 'var(--ink-soft)' }}>
                  Add more recipes
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recipe grid */}
      <div style={{ padding: '18px 36px 60px' }}>
        <div className="flex items-center justify-between mb-[18px]">
          <h2 className="font-serif m-0 text-[28px] font-medium">From your cookbook</h2>
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              {FILTERS.map((f) => {
                const on = filter === f
                return (
                  <button key={f} onClick={() => setFilter(f)}
                    className="h-8 px-3.5 rounded-full text-[12.5px] font-semibold"
                    style={{
                      background: on ? 'var(--ink)' : 'transparent',
                      color: on ? 'var(--surface)' : 'var(--ink-2)',
                      border: on ? 'none' : '1px solid var(--rule-2)',
                    }}>
                    {f}
                  </button>
                )
              })}
            </div>
            <div className="flex rounded-[10px] overflow-hidden" style={{ border: '1px solid var(--rule-2)' }}>
              <button
                onClick={() => setView('grid')}
                className="w-8 h-8 flex items-center justify-center"
                style={{ background: view === 'grid' ? 'var(--ink)' : 'transparent', color: view === 'grid' ? 'var(--surface)' : 'var(--ink-muted)' }}
              >
                <Icons.grid />
              </button>
              <button
                onClick={() => setView('rows')}
                className="w-8 h-8 flex items-center justify-center"
                style={{ background: view === 'rows' ? 'var(--ink)' : 'transparent', color: view === 'rows' ? 'var(--surface)' : 'var(--ink-muted)', borderLeft: '1px solid var(--rule-2)' }}
              >
                <Icons.rows />
              </button>
            </div>
          </div>
        </div>

        {grid.length === 0 && filtered.length > 0 && (
          <p className="text-[14px]" style={{ color: 'var(--ink-soft)' }}>No more recipes in this filter.</p>
        )}

        {view === 'grid' ? (
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {grid.map((r) => (
              <DesktopCard key={r.id} recipe={r} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {grid.map((r) => (
              <Link key={r.id} href={`/recipes/${r.id}`}
                className="flex gap-4 rounded-[14px] p-3 items-center group no-underline transition-colors"
                style={{ background: 'var(--surface)' }}>
                <div className="relative shrink-0 rounded-[10px] overflow-hidden" style={{ width: 72, height: 72 }}>
                  <FoodImg src={r.imageUrl} tone={r.imageTone} fill />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-[18px] leading-[1.2] font-medium m-0" style={{ color: 'var(--ink)' }}>
                    {r.title}
                  </h4>
                  <div className="mt-1 text-[12.5px] flex gap-2 items-center" style={{ color: 'var(--ink-soft)' }}>
                    <span className="inline-flex items-center gap-1"><Icons.clock />{r.cookTime} min</span>
                    <span>·</span>
                    <span>{r.difficulty}</span>
                    {r.tags[0] && <><span>·</span><span>{r.tags[0]}</span></>}
                  </div>
                </div>
                <button
                  onClick={async (e) => { e.preventDefault(); await toggleFavorite(r.id) }}
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: r.isFavorite ? 'var(--terracotta)' : 'var(--ink-muted)' }}>
                  {r.isFavorite ? <Icons.heartF /> : <Icons.heart />}
                </button>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4" style={{ color: 'var(--ink-soft)' }}>
      <div className="font-serif text-[22px] font-medium" style={{ color: 'var(--ink-2)' }}>Your cookbook is empty</div>
      <p className="text-[14px] m-0">Add your first recipe or import from a .docx file.</p>
      <div className="flex gap-3 mt-2">
        <Link href="/recipes/new"
          className="h-10 px-5 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 no-underline"
          style={{ background: 'var(--terracotta)', color: '#fff' }}>
          <Icons.plus style={{ width: 14, height: 14 }} /> New recipe
        </Link>
        <Link href="/import"
          className="h-10 px-5 rounded-full text-[13px] font-semibold inline-flex items-center gap-2 no-underline"
          style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink-2)' }}>
          <Icons.upload style={{ width: 14, height: 14 }} /> Import .docx
        </Link>
      </div>
    </div>
  )
}
