'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from './Icon'
import FoodImg from './FoodImg'
import { createRecipe, updateRecipe } from '@/actions/recipes'
import type { RecipeWithRelations } from '@/actions/recipes'

const TAGS = ['Italian', 'Japanese', 'French', 'Mexican', 'Vegetarian', 'Vegan', 'Gluten-free', 'Quick', 'Sunday', 'Comfort', 'Dessert', 'Breakfast']
const DIFFS = ['Easy', 'Medium', 'Hard'] as const

interface Props {
  recipe?: NonNullable<RecipeWithRelations>
}

interface IngRow { qty: string; unit: string; item: string }
interface StepRow { title: string; body: string }

export default function RecipeEditor({ recipe }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const [title, setTitle] = useState(recipe?.title ?? '')
  const [subtitle, setSubtitle] = useState(recipe?.subtitle ?? '')
  const [imageUrl, setImageUrl] = useState(recipe?.imageUrl ?? '')
  const [cookTime, setCookTime] = useState(recipe?.cookTime ?? 30)
  const [difficulty, setDifficulty] = useState<typeof DIFFS[number]>((recipe?.difficulty as typeof DIFFS[number]) ?? 'Easy')
  const [tags, setTags] = useState<string[]>(recipe?.tags ?? [])
  const [ings, setIngs] = useState<IngRow[]>(recipe?.ingredients.map((i) => ({ qty: i.qty, unit: i.unit, item: i.item })) ?? [{ qty: '', unit: '', item: '' }])
  const [steps, setSteps] = useState<StepRow[]>(recipe?.steps.map((s) => ({ title: s.title, body: s.body })) ?? [{ title: '', body: '' }])

  const toggleTag = (t: string) => setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  async function handleImageUpload(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      setImageUrl(url)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    startTransition(async () => {
      const data = { recipe: { title, subtitle, cookTime, difficulty, tags, imageUrl }, ingredients: ings.filter((i) => i.item), steps: steps.filter((s) => s.body) }
      if (recipe) {
        await updateRecipe(recipe.id, data)
        router.push(`/recipes/${recipe.id}`)
      } else {
        const r = await createRecipe(data)
        router.push(`/recipes/${r.id}`)
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col fadein" style={{ background: 'var(--bg)' }}>
      <div className="h-[54px]" />
      {/* Header */}
      <div className="flex items-center justify-between px-[22px] pb-4 pt-2">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }}>
          <Icons.x />
        </button>
        <h2 className="font-serif text-[20px] font-medium">{recipe ? 'Edit Recipe' : 'New Recipe'}</h2>
        <button onClick={handleSave} disabled={!title || pending}
          className="h-9 px-5 rounded-full text-[13px] font-semibold"
          style={{ background: !title || pending ? 'var(--rule-2)' : 'var(--ink)', color: !title || pending ? 'var(--ink-muted)' : 'var(--surface)' }}>
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>

      {/* Image preview */}
      {imageUrl && (
        <div className="relative shrink-0" style={{ height: 180 }}>
          <FoodImg src={imageUrl} tone={recipe?.imageTone ?? '#B8543F'} fill />
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-10 px-[22px] scroll">
        {/* Image */}
        <div className="mb-4 mt-4">
          <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>Photo</label>
          <div className="flex gap-2 mb-2">
            <label
              className="h-10 px-3 rounded-[12px] text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
              style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: uploading ? 'var(--ink-muted)' : 'var(--ink-2)' }}
            >
              <Icons.image />
              {uploading ? 'Завантаження...' : 'З компʼютера'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }}
              />
            </label>
            <button
              type="button"
              onClick={() => setImageUrl(`https://source.unsplash.com/800x500/?food,${encodeURIComponent(title || 'cooking')}`)}
              className="h-10 px-3 rounded-[12px] text-[12px] font-semibold flex items-center gap-1.5 shrink-0"
              style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink-2)' }}
            >
              🎲 Random
            </button>
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl('')}
                className="h-10 px-3 rounded-[12px] text-[12px] shrink-0"
                style={{ color: 'var(--ink-muted)' }}>
                <Icons.x />
              </button>
            )}
          </div>
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="или вставьте URL..."
            className="w-full h-10 px-3 rounded-[12px] text-[13px] outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }} />
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Recipe name"
            className="w-full h-12 px-4 rounded-[14px] text-[16px] font-medium outline-none border"
            style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }} />
        </div>

        {/* Subtitle */}
        <div className="mb-4">
          <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>Subtitle</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Short description"
            className="w-full h-12 px-4 rounded-[14px] text-[15px] outline-none"
            style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }} />
        </div>

        {/* Time + Difficulty */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>Cook time (min)</label>
            <input type="number" value={cookTime} onChange={(e) => setCookTime(Number(e.target.value))} min={1}
              className="w-full h-12 px-4 rounded-[14px] text-[15px] outline-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }} />
          </div>
          <div className="flex-1">
            <label className="text-[11px] font-bold uppercase tracking-widest mb-1.5 block" style={{ color: 'var(--ink-muted)' }}>Difficulty</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as typeof DIFFS[number])}
              className="w-full h-12 px-4 rounded-[14px] text-[15px] outline-none appearance-none"
              style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }}>
              {DIFFS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--ink-muted)' }}>Tags</label>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => {
              const on = tags.includes(t)
              return (
                <button key={t} onClick={() => toggleTag(t)}
                  className="h-[34px] px-3.5 rounded-full text-[12px] font-semibold"
                  style={{ background: on ? 'var(--ink)' : 'transparent', color: on ? 'var(--surface)' : 'var(--ink-2)', border: on ? 'none' : '1px solid var(--rule-2)' }}>
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* Ingredients */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--ink-muted)' }}>Ingredients</label>
          <div className="flex flex-col gap-2">
            {ings.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={ing.qty} onChange={(e) => { const n = [...ings]; n[i] = { ...n[i], qty: e.target.value }; setIngs(n) }}
                  placeholder="Qty" className="w-14 h-10 px-2.5 rounded-[10px] text-[14px] outline-none text-center"
                  style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)' }} />
                <input value={ing.unit} onChange={(e) => { const n = [...ings]; n[i] = { ...n[i], unit: e.target.value }; setIngs(n) }}
                  placeholder="Unit" className="w-16 h-10 px-2.5 rounded-[10px] text-[14px] outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)' }} />
                <input value={ing.item} onChange={(e) => { const n = [...ings]; n[i] = { ...n[i], item: e.target.value }; setIngs(n) }}
                  placeholder="Ingredient" className="flex-1 h-10 px-2.5 rounded-[10px] text-[14px] outline-none"
                  style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)' }} />
                <button onClick={() => setIngs(ings.filter((_, j) => j !== i))} style={{ color: 'var(--ink-muted)' }}>
                  <Icons.trash />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setIngs([...ings, { qty: '', unit: '', item: '' }])}
            className="mt-2 h-9 px-4 rounded-full text-[13px] font-semibold flex items-center gap-1"
            style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink-2)' }}>
            <Icons.add /> Add ingredient
          </button>
        </div>

        {/* Steps */}
        <div className="mb-5">
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: 'var(--ink-muted)' }}>Steps</label>
          <div className="flex flex-col gap-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[13px] font-bold mt-1"
                  style={{ background: 'var(--ink)', color: 'var(--surface)' }}>{i + 1}</div>
                <div className="flex-1 flex flex-col gap-1">
                  <input value={step.title} onChange={(e) => { const n = [...steps]; n[i] = { ...n[i], title: e.target.value }; setSteps(n) }}
                    placeholder="Step title (optional)" className="w-full h-9 px-3 rounded-[10px] text-[14px] outline-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)' }} />
                  <textarea value={step.body} onChange={(e) => { const n = [...steps]; n[i] = { ...n[i], body: e.target.value }; setSteps(n) }}
                    placeholder="Describe the step…" rows={3}
                    className="w-full px-3 py-2 rounded-[10px] text-[14px] outline-none resize-none"
                    style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)' }} />
                </div>
                <button onClick={() => setSteps(steps.filter((_, j) => j !== i))} className="mt-1" style={{ color: 'var(--ink-muted)' }}>
                  <Icons.trash />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setSteps([...steps, { title: '', body: '' }])}
            className="mt-2 h-9 px-4 rounded-full text-[13px] font-semibold flex items-center gap-1"
            style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink-2)' }}>
            <Icons.add /> Add step
          </button>
        </div>
      </div>
    </div>
  )
}
