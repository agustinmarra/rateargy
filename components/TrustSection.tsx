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
  { prefix: '+', end: 50000, suffix: '', label: 'decisiones financieras tomadas' },
  { prefix: '+', end: 200, suffix: '', label: 'productos comparados' },
  { prefix: '', end: 0, suffix: 'Siempre gratis', label: 'sin registro obligatorio', isText: true },
]

const PARTNERS = [
  { name: 'BCRA', color: '#003087' },
  { name: 'Banco Nación', color: '#003F80' },
  { name: 'Mercado Pago', color: '#009EE3' },
  { name: 'Galicia', color: '#E30613' },
  { name: 'Santander', color: '#EC0000' },
  { name: 'Naranja X', color: '#FF6200' },
]

export default function TrustSection() {
  return (
    <section className="py-16 bg-white border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">

          {/* Left — imagen persona usando celular */}
          <div className="w-full lg:w-80 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500"
              alt="Persona tomando decisiones financieras con rateargy"
              className="w-full rounded-2xl object-cover"
              style={{ height: 360 }}
            />
          </div>

          {/* Right — título + stats + logos */}
          <div className="flex-1">
            <div className="w-10 h-1 bg-[#008000] rounded-full mb-5" />
            <h2 className="font-extrabold text-2xl md:text-3xl text-[#1a1a1a] leading-tight mb-3">
              Por qué miles de argentinos<br />confían en rateargy
            </h2>
            <p className="text-[#6b7280] text-sm leading-relaxed mb-8 max-w-lg">
              Analizamos cada producto financiero con criterios objetivos: costos reales, beneficios verificados y experiencia de usuario. Sin conflictos de interés.
            </p>

            {/* Stats en verde grande */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              <div>
                <div className="font-extrabold text-4xl text-[#008000] leading-none mb-1">
                  <CountUp end={50000} prefix="+" />
                </div>
                <p className="text-sm text-[#6b7280]">decisiones financieras tomadas</p>
              </div>
              <div>
                <div className="font-extrabold text-4xl text-[#008000] leading-none mb-1">
                  <CountUp end={200} prefix="+" />
                </div>
                <p className="text-sm text-[#6b7280]">productos comparados</p>
              </div>
              <div>
                <div className="font-extrabold text-4xl text-[#008000] leading-none mb-1">
                  Gratis
                </div>
                <p className="text-sm text-[#6b7280]">sin registro obligatorio</p>
              </div>
            </div>

            {/* Logos de fuentes */}
            <div>
              <p className="text-xs text-[#9ca3af] font-semibold uppercase tracking-wide mb-3">
                Nuestros datos vienen de:
              </p>
              <div className="flex flex-wrap gap-2">
                {PARTNERS.map((p) => (
                  <div
                    key={p.name}
                    className="px-3 py-1.5 rounded-md border text-xs font-bold"
                    style={{
                      borderColor: p.color + '40',
                      color: p.color,
                      background: p.color + '08',
                    }}
                  >
                    {p.name}
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
