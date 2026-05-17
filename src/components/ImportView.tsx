'use client'

import { useRouter } from 'next/navigation'
import { Icons } from './Icon'
import BottomNav from './BottomNav'

export default function ImportView() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col fadein" style={{ background: 'var(--bg)' }}>
      <div className="h-[54px]" />
      {/* Header */}
      <div className="flex items-center gap-4 px-[22px] pb-4 pt-2">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--rule-2)', color: 'var(--ink)' }}>
          <Icons.back />
        </button>
        <h2 className="font-serif text-[22px] font-medium m-0">Import recipes</h2>
      </div>

      <div className="flex-1 px-[22px] pb-[120px] flex flex-col gap-5">
        {/* Drop zone */}
        <label className="flex flex-col items-center justify-center gap-4 rounded-[22px] border-2 border-dashed p-10 cursor-pointer transition-colors"
          style={{ borderColor: 'var(--rule-2)', background: 'var(--surface)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(184,84,63,0.1)', color: 'var(--terracotta)' }}>
            <Icons.upload />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold m-0" style={{ color: 'var(--ink)' }}>Drop a .docx file here</p>
            <p className="text-[13px] mt-1 m-0" style={{ color: 'var(--ink-soft)' }}>or tap to browse</p>
          </div>
          <input type="file" accept=".docx" className="hidden" />
        </label>

        {/* Tips */}
        <div className="rounded-[18px] p-5" style={{ background: 'var(--surface)' }}>
          <h3 className="font-serif text-[18px] font-medium m-0 mb-3">Formatting tips</h3>
          <ul className="text-[14px] m-0 pl-5 flex flex-col gap-2" style={{ color: 'var(--ink-2)' }}>
            <li>Use a heading for each recipe title</li>
            <li>List ingredients with quantity, unit, and name</li>
            <li>Number each step on its own line</li>
            <li>Separate recipes with a horizontal rule (---)</li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
