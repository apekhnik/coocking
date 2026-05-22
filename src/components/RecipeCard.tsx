'use client'

import Link from 'next/link'
import FoodImg from './FoodImg'
import { Icons } from './Icon'
import { toggleFavorite, deleteRecipe } from '@/actions/recipes'
import { useAuth } from '@clerk/nextjs'
import type { Recipe } from '@/db/schema'

interface RecipeCardProps {
  recipe: Recipe
  tall?: boolean
}

export default function RecipeCard({ recipe, tall }: RecipeCardProps) {
  const aspectRatio = tall ? '3/4.2' : '3/3.4'
  const { userId } = useAuth()

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    if (!window.confirm(`Удалить «${recipe.title}»?`)) return
    await deleteRecipe(recipe.id)
  }

  return (
    <div className="cursor-pointer rounded-[18px] overflow-hidden">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="relative rounded-[18px] overflow-hidden bg-[#e9dfcd]"
          style={{ aspectRatio }}>
          <FoodImg src={recipe.imageUrl} tone={recipe.imageTone} label={recipe.title} fill />
          {/* Favorite button */}
          {userId && (
            <button
              onClick={async (e) => { e.preventDefault(); await toggleFavorite(recipe.id) }}
              className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(251,247,239,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(31,26,20,0.06)',
                color: recipe.isFavorite ? 'var(--terracotta)' : 'var(--ink-muted)',
              }}>
              {recipe.isFavorite ? <Icons.heartF /> : <Icons.heart />}
            </button>
          )}
          {/* Delete button */}
          {userId && (
            <button
              onClick={handleDelete}
              className="absolute top-2 left-2 w-[30px] h-[30px] rounded-full flex items-center justify-center"
              style={{
                background: 'rgba(251,247,239,0.85)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(31,26,20,0.06)',
                color: 'var(--ink-muted)',
              }}>
              <Icons.trash />
            </button>
          )}
          {/* Time badge */}
          <div className="absolute left-2 bottom-2">
            <span className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[10.5px] font-semibold"
              style={{ background: 'rgba(31,26,20,0.7)', color: '#FBF7EF', backdropFilter: 'blur(8px)' }}>
              <Icons.clock /> {recipe.cookTime}m
            </span>
          </div>
        </div>
        <div className="pt-2.5 px-1 pb-1">
          <h4 className="font-serif m-0 text-[18px] leading-[1.12] font-medium" style={{ color: 'var(--ink)' }}>
            {recipe.title}
          </h4>
          {recipe.subtitle && (
            <p className="font-serif italic text-[13px] leading-[1.3] mt-1 mb-0 line-clamp-2" style={{ color: 'var(--ink-muted)' }}>
              {recipe.subtitle}
            </p>
          )}
          <div className="mt-1 text-[11.5px] flex gap-2 items-center" style={{ color: 'var(--ink-soft)' }}>
            <span className="inline-flex items-center gap-0.5"><Icons.flame />{recipe.difficulty}</span>
            <span>·</span>
            <span>{recipe.tags[0]}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
