'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  end: number
  suffix?: string
  prefix?: string
  duration?: number
}

function CountUp({ end, suffix = '', prefix = '', duration = 1600 }: CountUpProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          let startTime: number | null = null
          const step = (ts: number) => {
            if (!startTime) startTime = ts
            const progress = Math.min((ts - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.floor(eased * end))
            if (progress < 1) requestAnimationFrame(step)
            else setValue(end)
          }
          requestAnimationFrame(step)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref}>
      {prefix}{value.toLocaleString('es-AR')}{suffix}
    </span>
  )
}

const STATS = [
  { prefix: '+', end: 50000, suffix: '', label: 'decisiones financieras\ntomadas con rateargy' },
  { prefix: '+', end: 200, suffix: '', label: 'productos comparados\nde los mejores bancos' },
  { prefix: '', end: 100, suffix: '+', label: 'expertos revisando\ncada producto' },
]

const PARTNERS = [
  'Banco Nación',
  'Banco Galicia',
  'Mercado Pago',
  'Naranja X',
  'Ualá',
  'Santander',
]

export default function TrustSection() {
  return (
    <section className="py-16 bg-white border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* Left — decorative */}
          <div className="flex-1 max-w-md">
            <div className="relative bg-[#f0fdf4] rounded-2xl p-8 border border-[#bbf7d0]">
              {/* Green accent bar */}
              <div className="w-10 h-1 bg-[#1DB954] rounded-full mb-5" />
              <h2 className="font-extrabold text-2xl md:text-3xl text-[#1a1a1a] leading-tight mb-4">
                Por qué miles de argentinos confían en rateargy
              </h2>
              <p className="text-[#6b7280] text-sm leading-relaxed">
                Analizamos cada producto financiero con criterios objetivos: tasa real, costos ocultos, experiencia de usuario y atención al cliente. Sin conflictos de interés.
              </p>

              {/* Check list */}
              <ul className="mt-5 space-y-2">
                {[
                  'Información verificada con cada banco',
                  'Actualizamos tasas y condiciones diariamente',
                  'Las comisiones no afectan nuestros rankings',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#374151]">
                    <div className="w-4 h-4 rounded-full bg-[#1DB954] flex items-center justify-center shrink-0 mt-0.5">
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — stats + logos */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="font-extrabold text-4xl text-[#1DB954] leading-none mb-1.5">
                    <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm text-[#6b7280] leading-snug whitespace-pre-line">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Partners */}
            <div>
              <p className="text-xs text-[#9ca3af] font-semibold uppercase tracking-wide mb-4">
                Productos de estas instituciones en rateargy
              </p>
              <div className="flex flex-wrap gap-2">
                {PARTNERS.map((name) => (
                  <div
                    key={name}
                    className="px-3.5 py-1.5 rounded-md border border-[#e5e7eb] bg-[#f7f8fa] text-xs font-semibold text-[#6b7280]"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
