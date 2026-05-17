'use client'

import { useState } from 'react'
import Image from 'next/image'

interface FoodImgProps {
  src?: string
  alt?: string
  tone?: string
  label?: string
  fill?: boolean
  className?: string
}

export default function FoodImg({ src, alt = '', tone = '#B8543F', label, fill, className }: FoodImgProps) {
  const [ok, setOk] = useState(!!src)

  if (!ok || !src) {
    return (
      <div
        className={className}
        style={{
          width: fill ? '100%' : undefined,
          height: fill ? '100%' : undefined,
          position: fill ? 'absolute' : 'relative',
          inset: fill ? 0 : undefined,
          background: `radial-gradient(120% 100% at 30% 20%, ${tone}33 0%, transparent 55%),radial-gradient(120% 100% at 80% 80%, ${tone}66 0%, ${tone}22 60%),linear-gradient(135deg, #d9c5a1 0%, #b89a75 100%)`,
        }}
      >
        {label && (
          <span className="absolute bottom-2 left-2.5 font-mono text-[10px] uppercase tracking-wider text-white/75">
            {label}
          </span>
        )}
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={`object-cover ${className ?? ''}`}
      onError={() => setOk(false)}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  )
}
