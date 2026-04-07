'use client'

import { useEffect, useState } from 'react'
import { DolarData } from '@/lib/types'

interface TickerData {
  dolares: DolarData[]
  lastUpdate: string
}

const DOLAR_LABELS: Record<string, string> = {
  'Oficial': 'USD Oficial',
  'Blue': 'USD Blue',
  'Bolsa': 'USD MEP',
  'Contado con liquidación': 'USD CCL',
  'Tarjeta': 'USD Tarjeta',
  'Mayorista': 'USD Mayorista',
}

function formatPrice(num: number) {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export default function TickerBar() {
  const [data, setData] = useState<TickerData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/dolar')
        if (!res.ok) throw new Error('fetch failed')
        const json = await res.json()
        setData(json)
      } catch {
        setError(true)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const items = data?.dolares ?? []

  const tickerItems = items.flatMap((d) => {
    const label = DOLAR_LABELS[d.nombre] ?? d.nombre
    return [
      { label, value: `$${formatPrice(d.venta)}`, sub: `Compra $${formatPrice(d.compra)}` },
    ]
  })

  if (error || tickerItems.length === 0) {
    const fallback = [
      { label: 'USD Blue', value: '$...', sub: '' },
      { label: 'USD MEP', value: '$...', sub: '' },
      { label: 'USD CCL', value: '$...', sub: '' },
      { label: 'USD Oficial', value: '$...', sub: '' },
    ]
    tickerItems.push(...fallback)
  }

  // Duplicate for seamless loop
  const doubled = [...tickerItems, ...tickerItems]

  return (
    <div className="ticker-bar bg-[#0a0a0a] border-b border-white/10 overflow-hidden py-2">
      <div className="ticker-track flex gap-12 whitespace-nowrap">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-2 shrink-0">
            <span className="text-white/50 text-xs font-medium uppercase tracking-wider">
              {item.label}
            </span>
            <span className="text-white text-xs font-bold">{item.value}</span>
            {item.sub && (
              <span className="text-white/40 text-xs">{item.sub}</span>
            )}
            <span className="text-white/20 mx-2">|</span>
          </div>
        ))}
      </div>
    </div>
  )
}
