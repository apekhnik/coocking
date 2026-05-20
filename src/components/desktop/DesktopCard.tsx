import Link from 'next/link'
import FoodImg from '@/components/FoodImg'
import { Icons } from '@/components/Icon'
import { toggleFavorite, deleteRecipe } from '@/actions/recipes'
import type { Recipe } from '@/db/schema'

export function DesktopFeature({ recipe, description }: { recipe: Recipe; description?: string }) {
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!window.confirm(`Удалить «${recipe.title}»?`)) return
    await deleteRecipe(recipe.id)
  }

  return (
    <Link href={`/recipes/${recipe.id}`}
      className="relative block rounded-[22px] overflow-hidden"
      style={{ aspectRatio: '4/5', background: '#000', boxShadow: 'var(--shadow-card)' }}
    >
      <FoodImg src={recipe.imageUrl} tone={recipe.imageTone} fill />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(20,15,10,0.78) 100%)' }} />

      {/* Editor badge */}
      <div className="absolute top-[18px] left-[18px]">
        <span className="chip dark">Editor&apos;s pick</span>
      </div>

      {/* Fav button */}
      <button
        onClick={async (e) => { e.preventDefault(); await toggleFavorite(recipe.id) }}
        className="absolute top-[18px] right-[18px] w-[42px] h-[42px] rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(0,0,0,0.32)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
        }}
      >
        {recipe.isFavorite ? <Icons.heartF /> : <Icons.heart />}
      </button>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute top-[68px] right-[18px] w-[42px] h-[42px] rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(0,0,0,0.32)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.18)',
          color: '#fff',
        }}
      >
        <Icons.trash style={{ width: 18, height: 18 }} />
      </button>

      {/* Caption */}
      <div className="absolute left-0 right-0 bottom-0 text-white" style={{ padding: '28px 30px' }}>
        <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ opacity: 0.85 }}>
          Recipe · {recipe.tags[0]}
        </div>
        <h3 className="font-serif mt-2 mb-1.5 text-[46px] leading-none font-medium">
          {recipe.title}
        </h3>
        {description && (
          <div className="font-serif italic text-[17px] line-clamp-2" style={{ opacity: 0.85 }}>
            {description}
          </div>
        )}
        <div className="flex gap-3.5 mt-3.5 text-[12px]" style={{ opacity: 0.85 }}>
          <span className="inline-flex items-center gap-1.5"><Icons.clock />{recipe.cookTime} min</span>
          <span>·</span>
          <span>{recipe.difficulty}</span>
          <span>·</span>
          <span>4 servings</span>
        </div>
      </div>
    </Link>
  )
}

export function DesktopRecipeWide({ recipe, description }: { recipe: Recipe; description?: string }) {
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!window.confirm(`Удалить «${recipe.title}»?`)) return
    await deleteRecipe(recipe.id)
  }

  return (
    <Link href={`/recipes/${recipe.id}`}
      className="relative flex rounded-[18px] overflow-hidden no-underline"
      style={{
        background: 'var(--card)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--rule)',
      }}
    >
      <div className="relative shrink-0" style={{ width: '42%' }}>
        <FoodImg src={recipe.imageUrl} tone={recipe.imageTone} fill />
      </div>
      <div className="flex-1 flex flex-col" style={{ padding: '20px 22px' }}>
        <div className="flex gap-1.5 mb-1.5">
          {recipe.tags.slice(0, 2).map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
        <h3 className="font-serif m-0 mt-0.5 mb-1 text-[24px] leading-[1.05] font-medium" style={{ color: 'var(--ink)' }}>
          {recipe.title}
        </h3>
        {description && (
          <p className="font-serif italic text-[14px] leading-[1.35] m-0 line-clamp-3" style={{ color: 'var(--ink-muted)' }}>
            {description}
          </p>
        )}
        <div className="flex-1" />
        <div className="flex items-center justify-between">
          <div className="flex gap-3 text-[12px]" style={{ color: 'var(--ink-muted)' }}>
            <span className="inline-flex items-center gap-1"><Icons.clock />{recipe.cookTime} min</span>
            <span>·</span>
            <span>{recipe.difficulty}</span>
          </div>
          <button
            onClick={handleDelete}
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ color: 'var(--ink-soft)', border: '1px solid var(--rule-2)' }}>
            <Icons.trash />
          </button>
        </div>
      </div>
    </Link>
  )
}

export function DesktopCard({ recipe }: { recipe: Recipe }) {
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!window.confirm(`Удалить «${recipe.title}»?`)) return
    await deleteRecipe(recipe.id)
  }

  return (
    <div className="relative">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="relative rounded-[14px] overflow-hidden" style={{ aspectRatio: '4/5', background: '#e9dfcd' }}>
          <FoodImg src={recipe.imageUrl} tone={recipe.imageTone} fill />
          {/* Fav */}
          <button
            onClick={async (e) => { e.preventDefault(); await toggleFavorite(recipe.id) }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(251,247,239,0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(31,26,20,0.06)',
              color: recipe.isFavorite ? 'var(--terracotta)' : 'var(--ink-muted)',
            }}
          >
            {recipe.isFavorite ? <Icons.heartF /> : <Icons.heart />}
          </button>
          {/* Delete */}
          <button
            onClick={handleDelete}
            className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(251,247,239,0.88)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(31,26,20,0.06)',
              color: 'var(--ink-muted)',
            }}
          >
            <Icons.trash />
          </button>
          {/* Time */}
          <div className="absolute left-2.5 bottom-2.5">
            <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[11px] font-semibold"
              style={{ background: 'rgba(31,26,20,0.7)', color: '#FBF7EF', backdropFilter: 'blur(8px)' }}>
              <Icons.clock /> {recipe.cookTime}m
            </span>
          </div>
        </div>
        <h4 className="font-serif mt-3 mb-1 text-[21px] font-medium leading-[1.1]" style={{ color: 'var(--ink)' }}>
          {recipe.title}
        </h4>
        {recipe.subtitle && (
          <p className="font-serif italic text-[13px] leading-[1.3] mt-0.5 mb-1 line-clamp-2" style={{ color: 'var(--ink-muted)' }}>
            {recipe.subtitle}
          </p>
        )}
        <div className="text-[12px] flex gap-2" style={{ color: 'var(--ink-muted)' }}>
          <span className="inline-flex items-center gap-0.5"><Icons.flame />{recipe.difficulty}</span>
          <span>·</span>
          <span>{recipe.tags[0]}</span>
        </div>
      </Link>
    </div>
  )
}
