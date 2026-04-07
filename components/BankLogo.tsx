'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BankLogoProps {
  domain?: string
  name: string
  size?: number
  className?: string
}

// Paleta de fallback determinística por nombre
const FALLBACK_COLORS = [
  '#1DB954', '#0ea5e9', '#f59e0b', '#6366f1',
  '#ec4899', '#8b5cf6', '#14b8a6', '#f97316',
]

function colorFor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length]
}

function initials(name: string) {
  return name
    .replace(/banco|seguros|argentina|group|crédito/gi, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export default function BankLogo({ domain, name, size = 40, className = '' }: BankLogoProps) {
  const [failed, setFailed] = useState(false)

  const style: React.CSSProperties = { width: size, height: size, minWidth: size }
  const rounded = 'rounded-lg'

  if (!domain || failed) {
    return (
      <div
        className={`${rounded} flex items-center justify-center font-bold text-white shrink-0 select-none ${className}`}
        style={{ ...style, background: colorFor(name), fontSize: Math.floor(size * 0.36) }}
        title={name}
      >
        {initials(name) || name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div
      className={`${rounded} overflow-hidden bg-white border border-[#e5e7eb] shrink-0 flex items-center justify-center p-1 ${className}`}
      style={style}
      title={name}
    >
      <Image
        src={`https://logo.clearbit.com/${domain}`}
        alt={name}
        width={size - 8}
        height={size - 8}
        className="object-contain"
        onError={() => setFailed(true)}
        unoptimized
      />
    </div>
  )
}
