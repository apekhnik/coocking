'use client'

import { useState } from 'react'
import Link from 'next/link'
import FoodImg from './FoodImg'
import BottomNav from './BottomNav'
import { Icons } from './Icon'
import type { RecipeWithRelations } from '@/actions/recipes'

type Tab = 'ingredients' | 'method'

interface Props {
  recipe: NonNullable<RecipeWithRelations>
}

export default function RecipeDetailView({ recipe }: Props) {
  const [tab, setTab] = useState<Tab>('ingredients')
  const [servings, setServings] = useState(2)
  const [checked, setChecked] = useState<Set<number>>(new Set())

  const scale = servings / 2

  return (
    <div className="h-screen flex flex-col fadein" style={{ background: 'var(--bg)' }}>
      {/* Hero image */}
      <div className="relative shrink-0" style={{ height: 340 }}>
        <FoodImg src={recipe.imageUrl} tone={recipe.imageTone} fill />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 60%)' }} />
        {/* Nav buttons */}
        <div className="absolute top-12 left-4 right-4 flex justify-between">
          <Link href="/home" className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(251,247,239,0.85)', backdropFilter: 'blur(10px)', color: 'var(--ink)' }}>
            <Icons.back />
          </Link>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(251,247,239,0.85)', backdropFilter: 'blur(10px)', color: 'var(--ink)' }}>
              <Icons.share />
            </button>
            <Link href={`/recipes/${recipe.id}/edit`} className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(251,247,239,0.85)', backdropFilter: 'blur(10px)', color: 'var(--ink)' }}>
              <Icons.edit />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="scroll flex-1 overflow-y-auto pb-[120px]">
        <div className="px-[22px] pt-5">
          {/* Tags */}
          <div className="flex gap-1.5 mb-3">
            {recipe.tags.map((t) => <span key={t} className="chip">{t}</span>)}
            <span className="chip">
              <Icons.clock className="mr-1 inline" />{recipe.cookTime}m
            </span>
          </div>
          <h1 className="font-serif text-[34px] leading-[1.08] font-medium m-0">{recipe.title}</h1>
          <p className="font-serif italic text-[16px] mt-1 mb-5" style={{ color: 'var(--ink-muted)' }}>{recipe.subtitle}</p>

          {/* Servings */}
          <div className="flex items-center justify-between mb-5 px-4 h-12 rounded-[14px]"
            style={{ background: 'var(--surface)' }}>
            <span className="text-[14px] font-semibold" style={{ color: 'var(--ink-2)' }}>Servings</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'var(--rule-2)', color: 'var(--ink)' }}>
                <Icons.x style={{ width: 14, height: 14 }} />
              </button>
              <span className="text-[18px] font-semibold w-6 text-center">{servings}</span>
              <button onClick={() => setServings(Math.min(12, servings + 1))}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'var(--ink)', color: 'var(--surface)' }}>
                <Icons.add />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {(['ingredients', 'method'] as Tab[]).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="h-[38px] px-4 rounded-full text-[13px] font-semibold capitalize"
                style={{
                  background: tab === t ? 'var(--ink)' : 'transparent',
                  color: tab === t ? 'var(--surface)' : 'var(--ink-muted)',
                  border: tab === t ? 'none' : '1px solid var(--rule-2)',
                }}>
                {t}
              </button>
            ))}
          </div>

          {/* Ingredients */}
          {tab === 'ingredients' && (
            <div className="flex flex-col gap-3">
              {recipe.ingredients.map((ing, i) => (
                <button key={ing.id} onClick={() => setChecked((s) => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })}
                  className="flex items-center gap-3 text-left w-full"
                  style={{ opacity: checked.has(i) ? 0.45 : 1 }}>
                  <div className="w-[22px] h-[22px] rounded-full border-2 shrink-0 flex items-center justify-center"
                    style={{ borderColor: checked.has(i) ? 'var(--olive)' : 'var(--rule-2)', background: checked.has(i) ? 'var(--olive)' : 'transparent', color: '#fff' }}>
                    {checked.has(i) && <Icons.check />}
                  </div>
                  <span className="font-serif text-[18px]" style={{ textDecoration: checked.has(i) ? 'line-through' : 'none' }}>
                    <strong>{ing.qty && `${(parseFloat(ing.qty) * scale).toFixed(1).replace(/\.0$/, '')} `}</strong>
                    <span style={{ opacity: 0.7 }}>{ing.unit} </span>
                    <em>{ing.item}</em>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Steps */}
          {tab === 'method' && (
            <div className="flex flex-col gap-5">
              {recipe.steps.map((step, i) => (
                <div key={step.id} className="flex gap-3.5">
                  <div className="w-[38px] h-[38px] rounded-full shrink-0 flex items-center justify-center text-[15px] font-bold"
                    style={{ background: 'var(--ink)', color: 'var(--surface)' }}>
                    {i + 1}
                  </div>
                  <div>
                    {step.title && <h4 className="font-serif text-[18px] font-semibold m-0 mb-1">{step.title}</h4>}
                    <p className="text-[14px] leading-[1.55] m-0" style={{ color: 'var(--ink-2)' }}>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
