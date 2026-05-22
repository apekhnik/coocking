'use client'

import { useState } from 'react'
import Link from 'next/link'
import FoodImg from './FoodImg'
import RecipeCard from './RecipeCard'
import BottomNav from './BottomNav'
import { Icons } from './Icon'
import { deleteRecipe, deleteAllRecipes } from '@/actions/recipes'
import type { Recipe } from '@/db/schema'
import { SignedIn, SignedOut, UserButton, useAuth } from '@clerk/nextjs'

const FILTERS = ['All', 'Favorites', 'Quick', 'Vegetarian', 'Dessert', 'Sunday'] as const

interface RecipeFeedProps {
  recipes: Recipe[]
  title?: string
}

export default function RecipeFeed({ recipes, title }: RecipeFeedProps) {
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<string>('All')
  const [view, setView] = useState<'grid' | 'rows'>('grid')
  const { userId } = useAuth()

  const list = recipes.filter((r) => {
    if (filter === 'Favorites' && !r.isFavorite) return false
    if (filter === 'Quick' && r.cookTime > 30) return false
    if (filter !== 'All' && filter !== 'Favorites' && filter !== 'Quick') {
      if (!r.tags.some((t) => t === filter)) return false
    }
    if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const featured = list[0]

  return (
    <div className="h-screen flex flex-col fadein" style={{ background: 'var(--bg)' }}>
      {/* Status bar */}
      <div className="h-[54px]" />

      {/* Header */}
      <div className="px-[22px] pb-3.5 pt-2">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: 'var(--terracotta)' }}>
              Vol. 04 · Late Summer
            </div>
            <h1 className="font-serif mt-1 mb-0 text-[42px] leading-none font-medium tracking-tight">
              {title
                ? <><em className="italic" style={{ color: 'var(--terracotta)' }}>{title}</em></>
                : <>Your <em className="italic" style={{ color: 'var(--terracotta)' }}>cookbook</em></>
              }
            </h1>
          </div>
          <div className="w-[42px] h-[42px] flex items-center justify-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Link href="/sign-in"
                className="w-[42px] h-[42px] rounded-full flex items-center justify-center"
                style={{ border: '1px solid var(--terracotta)', background: 'var(--surface)', color: 'var(--terracotta)' }}>
                <Icons.user />
              </Link>
            </SignedOut>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-[22px] pb-3">
        <div className="flex gap-2.5">
          <label className="flex-1 flex items-center gap-2.5 h-[46px] px-4 rounded-[14px]"
            style={{ background: 'rgba(31,26,20,0.05)', color: 'var(--ink-muted)' }}>
            <Icons.search />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search recipes…"
              className="flex-1 border-none outline-none bg-transparent text-[15px]"
              style={{ color: 'var(--ink)' }}
            />
          </label>
          <button className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center"
            style={{ background: 'var(--ink)', color: 'var(--surface)', border: 'none' }}>
            <Icons.filter />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className="scroll overflow-x-auto px-[22px] pb-3.5 pt-1">
        <div className="flex gap-2 w-max">
          {FILTERS.map((f) => {
            const on = filter === f
            return (
              <button key={f} onClick={() => setFilter(f)}
                className="h-[34px] px-3.5 rounded-full text-[12.5px] font-semibold tracking-tight whitespace-nowrap"
                style={{
                  border: on ? 'none' : '1px solid var(--rule-2)',
                  background: on ? 'var(--ink)' : 'transparent',
                  color: on ? 'var(--surface)' : 'var(--ink-2)',
                }}>
                {f}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable content */}
      <div className="scroll flex-1 overflow-y-auto pb-[120px]">
        {/* Featured card */}
        {featured && (
          <div className="px-[22px] pb-[22px]">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-serif m-0 text-[22px] font-medium">Tonight&apos;s pick</h2>
              <span className="text-[11px] font-semibold uppercase tracking-[0.04em]" style={{ color: 'var(--ink-soft)' }}>Editor</span>
            </div>
            <Link href={`/recipes/${featured.id}`}
              className="block w-full rounded-[22px] overflow-hidden relative"
              style={{ background: '#000', boxShadow: 'var(--shadow-card)' }}>
              <div className="relative overflow-hidden" style={{ aspectRatio: '4/5' }}>
                <FoodImg src={featured.imageUrl} tone={featured.imageTone} label={featured.title} fill />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(20,15,10,0.75) 100%)' }} />
                {/* Tags */}
                <div className="absolute top-3.5 left-3.5 flex gap-1.5">
                  <span className="chip dark">{featured.tags[0]}</span>
                  <span className="chip dark">{featured.cookTime} min</span>
                </div>
                {/* Delete button */}
                {userId && (
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!window.confirm(`Удалить «${featured.title}»?`)) return
                      await deleteRecipe(featured.id)
                    }}
                    className="absolute top-3.5 right-3.5 w-[34px] h-[34px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(0,0,0,0.38)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#fff',
                    }}>
                    <Icons.trash style={{ width: 15, height: 15 }} />
                  </button>
                )}
                {/* Title */}
                <div className="absolute left-0 right-0 bottom-0 px-5 pb-5 pt-[18px] text-white">
                  <div className="text-[11px] font-bold tracking-[0.16em] uppercase opacity-85">
                    Recipe № {String(recipes.indexOf(featured) + 12).padStart(3, '0')}
                  </div>
                  <h3 className="font-serif mt-1 mb-1 text-[30px] leading-[1.05] font-medium">{featured.title}</h3>
                  <div className="text-[13px] opacity-85 italic font-serif">{featured.subtitle}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Recipe grid */}
        <div className="px-[22px]">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="font-serif m-0 text-[22px] font-medium">From your cookbook</h2>
            <div className="flex items-center gap-2">
              {userId && list.length > 0 && (
                <button
                  onClick={async () => {
                    if (!window.confirm(`Удалить все ${list.length} рецепт(ов)? Это действие необратимо.`)) return
                    await deleteAllRecipes()
                  }}
                  className="h-[30px] px-2.5 rounded-full text-[11px] font-semibold inline-flex items-center gap-1"
                  style={{ color: 'var(--ink-muted)', border: '1px solid var(--rule-2)' }}>
                  <Icons.trash style={{ width: 12, height: 12 }} /> Delete all
                </button>
              )}
              <span className="text-[12px] font-semibold" style={{ color: 'var(--ink-muted)' }}>{list.length}</span>
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

          {list.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--ink-soft)' }}>
              <p className="text-[15px]">No recipes yet.</p>
              <Link href="/recipes/new" className="text-[14px] font-semibold mt-2 inline-block" style={{ color: 'var(--terracotta)' }}>
                Add your first recipe →
              </Link>
            </div>
          )}

          {view === 'grid' ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-3.5">
              {list.slice(1).map((r, i) => (
                <RecipeCard key={r.id} recipe={r} tall={i % 3 === 1} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {list.slice(1).map((r) => (
                <Link key={r.id} href={`/recipes/${r.id}`}
                  className="flex gap-3.5 rounded-[16px] p-3 items-center"
                  style={{ background: 'var(--surface)', textDecoration: 'none' }}>
                  <div className="relative shrink-0 rounded-[11px] overflow-hidden" style={{ width: 64, height: 64 }}>
                    <FoodImg src={r.imageUrl} tone={r.imageTone} fill />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-[17px] leading-[1.2] font-medium m-0 truncate" style={{ color: 'var(--ink)' }}>
                      {r.title}
                    </h4>
                    <div className="mt-1 text-[12px] flex gap-2 items-center" style={{ color: 'var(--ink-soft)' }}>
                      <span className="inline-flex items-center gap-0.5"><Icons.clock />{r.cookTime}m</span>
                      <span>·</span>
                      <span>{r.difficulty}</span>
                      {r.tags[0] && <><span>·</span><span>{r.tags[0]}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={async (e) => { e.preventDefault(); const { toggleFavorite } = await import('@/actions/recipes'); await toggleFavorite(r.id) }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ color: r.isFavorite ? 'var(--terracotta)' : 'var(--ink-muted)' }}>
                      {r.isFavorite ? <Icons.heartF /> : <Icons.heart />}
                    </button>
                    <button
                      onClick={async (e) => {
                        e.preventDefault()
                        if (!window.confirm(`Удалить «${r.title}»?`)) return
                        await deleteRecipe(r.id)
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ color: 'var(--ink-muted)' }}>
                      <Icons.trash />
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="h-10" />
      </div>

      <BottomNav />
    </div>
  )
}
