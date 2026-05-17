'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from './Icon'
import BottomNav from './BottomNav'
import { importRecipesFromDocx } from '@/actions/recipes'

type Status =
  | { type: 'idle' }
  | { type: 'loading' }
  | { type: 'success'; imported: number; skipped: number }
  | { type: 'error'; message: string }

export default function ImportView() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>({ type: 'idle' })

  async function handleFile(file: File) {
    if (!file.name.endsWith('.docx')) {
      setStatus({ type: 'error', message: 'Оберіть файл формату .docx' })
      return
    }

    setStatus({ type: 'loading' })
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await importRecipesFromDocx(formData)
      setStatus({ type: 'success', imported: result.imported, skipped: result.skipped })
      if (result.imported > 0) {
        setTimeout(() => router.push('/home'), 2000)
      }
    } catch (err) {
      setStatus({ type: 'error', message: err instanceof Error ? err.message : 'Помилка імпорту' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col fadein" style={{ background: 'var(--bg)' }}>
      <div className="h-[54px]" />

      <div className="flex items-center gap-4 px-[22px] pb-4 pt-2">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }}
        >
          <Icons.back />
        </button>
        <h2 className="font-serif text-[22px] font-medium m-0">Імпорт / Експорт</h2>
      </div>

      <div className="flex-1 px-[22px] pb-[120px] flex flex-col gap-5">

        {/* Import drop zone */}
        <label
          className="flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed p-10 cursor-pointer transition-colors"
          style={{ borderColor: 'var(--rule-2)', background: 'var(--surface)' }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(184,84,63,0.1)', color: 'var(--terracotta)' }}
          >
            {status.type === 'loading'
              ? <span className="text-[24px]">⏳</span>
              : <Icons.upload />
            }
          </div>

          <div className="text-center">
            <p className="text-[16px] font-semibold m-0" style={{ color: 'var(--ink)' }}>
              {status.type === 'loading' ? 'Імпортуємо...' : 'Завантажити .docx'}
            </p>
            <p className="text-[13px] mt-1 m-0" style={{ color: 'var(--ink-soft)' }}>
              натисни або перетягни файл
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".docx"
            className="hidden"
            disabled={status.type === 'loading'}
            onChange={e => {
              const file = e.target.files?.[0]
              if (file) handleFile(file)
              e.target.value = ''
            }}
          />
        </label>

        {/* Status message */}
        {status.type === 'success' && (
          <div
            className="rounded-[18px] p-5 text-center"
            style={{ background: 'rgba(92,107,63,0.12)', color: 'var(--olive)' }}
          >
            <p className="font-semibold text-[16px] m-0">Готово!</p>
            <p className="text-[14px] mt-1 m-0">
              Імпортовано: {status.imported} · Пропущено: {status.skipped}
            </p>
            {status.imported > 0 && (
              <p className="text-[13px] mt-1 m-0" style={{ color: 'var(--ink-soft)' }}>
                Переходимо до рецептів...
              </p>
            )}
          </div>
        )}

        {status.type === 'error' && (
          <div
            className="rounded-[18px] p-5 text-center"
            style={{ background: 'rgba(184,84,63,0.1)', color: 'var(--terracotta)' }}
          >
            <p className="font-semibold text-[16px] m-0">Помилка</p>
            <p className="text-[14px] mt-1 m-0">{status.message}</p>
          </div>
        )}

        {/* Export button */}
        <a
          href="/api/export"
          className="flex items-center justify-center gap-3 rounded-[22px] p-5 transition-opacity hover:opacity-80"
          style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)', textDecoration: 'none' }}
        >
          <span style={{ color: 'var(--terracotta)' }}>
            <Icons.upload style={{ transform: 'rotate(180deg)' }} />
          </span>
          <div>
            <p className="font-semibold text-[15px] m-0">Експортувати всі рецепти</p>
            <p className="text-[13px] m-0 mt-0.5" style={{ color: 'var(--ink-soft)' }}>
              Завантажити .docx файл
            </p>
          </div>
        </a>

      </div>

      <BottomNav />
    </div>
  )
}
