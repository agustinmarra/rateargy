'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CATEGORIAS } from '@/lib/data'

// Flaticon CDN icons (coloridos, 512px)
const ICON_URLS: Record<string, string> = {
  tarjetas:    'https://cdn-icons-png.flaticon.com/512/1250615.png',
  cuentas:     'https://cdn-icons-png.flaticon.com/512/2830284.png',
  prestamos:   'https://cdn-icons-png.flaticon.com/512/3135706.png',
  seguros:     'https://cdn-icons-png.flaticon.com/512/2910791.png',
  inversiones: 'https://cdn-icons-png.flaticon.com/512/2282966.png',
  billeteras:  'https://cdn-icons-png.flaticon.com/512/1602096.png',
}

function FadeInCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

export default function CategoryGrid() {
  return (
    <section className="py-16" style={{ background: '#f0fdf4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-extrabold text-2xl md:text-3xl text-[#1a1a1a] tracking-tight mb-2">
            Explorá por categoría
          </h2>
          <p className="text-[#4b5563] text-base">
            Todo lo que necesitás para mejorar tus finanzas, en un solo lugar.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIAS.map((cat, i) => {
            const iconUrl = ICON_URLS[cat.slug]
            return (
              <FadeInCard key={cat.id} delay={i * 60}>
                <Link
                  href={`/${cat.slug}`}
                  className="group flex flex-col items-center text-center bg-white rounded-2xl p-5 border border-transparent hover:border-[#86efac] transition-all duration-200"
                  style={{
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.transform = 'scale(1.03)'
                    el.style.boxShadow = '0 8px 24px rgba(0,128,0,0.12)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.transform = 'scale(1)'
                    el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'
                  }}
                >
                  {/* Arrow */}
                  <div className="self-end mb-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#9ca3af] group-hover:text-[#008000] transition-colors">
                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Icon */}
                  <div className="mb-3 flex items-center justify-center" style={{ width: 80, height: 80 }}>
                    {iconUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={iconUrl}
                        alt={cat.nombre}
                        width={80}
                        height={80}
                        style={{ objectFit: 'contain' }}
                      />
                    )}
                  </div>

                  {/* Text */}
                  <p className="font-semibold text-sm text-[#1a1a1a] leading-tight mb-1">
                    {cat.nombre}
                  </p>
                  <p className="text-xs text-[#9ca3af]">{cat.cantidad_productos} productos</p>
                </Link>
              </FadeInCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
