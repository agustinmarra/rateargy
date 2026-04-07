'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CATEGORIAS } from '@/lib/data'

// ── SVG Illustrations ─────────────────────────────────────────────────────────

function IllustrationTarjetas() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="14" width="56" height="36" rx="7" fill="#1DB954" />
      <rect x="4" y="14" width="56" height="36" rx="7" fill="url(#cg)" />
      <rect x="4" y="24" width="56" height="10" fill="rgba(0,0,0,0.15)" />
      <rect x="12" y="38" width="16" height="6" rx="2" fill="rgba(255,255,255,0.6)" />
      <rect x="36" y="38" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.4)" />
      <rect x="36" y="43" width="10" height="3" rx="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="48" cy="18" r="4" fill="rgba(255,255,255,0.25)" />
      <circle cx="54" cy="18" r="4" fill="rgba(255,255,255,0.15)" />
      <defs>
        <linearGradient id="cg" x1="4" y1="14" x2="60" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1DB954" />
          <stop offset="1" stopColor="#0ea868" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function IllustrationCuentas() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="28" width="48" height="28" rx="4" fill="#0ea5e9" />
      <rect x="16" y="20" width="32" height="12" rx="3" fill="#38bdf8" />
      <rect x="24" y="12" width="16" height="12" rx="2" fill="#7dd3fc" />
      <rect x="14" y="36" width="8" height="12" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="28" y="36" width="8" height="12" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="42" y="36" width="8" height="12" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="4" y="54" width="56" height="4" rx="2" fill="#0284c7" />
    </svg>
  )
}

function IllustrationPrestamos() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="26" fill="#fef9c3" />
      <circle cx="32" cy="32" r="22" fill="#fde047" />
      <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#854d0e">$</text>
      <circle cx="50" cy="16" r="10" fill="#f59e0b" />
      <circle cx="50" cy="16" r="7" fill="#fbbf24" />
      <text x="50" y="20" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">$</text>
      <circle cx="16" cy="48" r="8" fill="#f59e0b" />
      <circle cx="16" cy="48" r="5.5" fill="#fbbf24" />
      <text x="16" y="52" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#78350f">$</text>
    </svg>
  )
}

function IllustrationSeguros() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 6 L56 16 L56 34 C56 46 44 56 32 58 C20 56 8 46 8 34 L8 16 Z" fill="#6366f1" />
      <path d="M32 10 L52 19 L52 34 C52 44 42 53 32 55 C22 53 12 44 12 34 L12 19 Z" fill="#818cf8" />
      <path d="M22 32 L28 38 L42 24" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IllustrationInversiones() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="44" width="10" height="14" rx="2" fill="#ec4899" />
      <rect x="20" y="34" width="10" height="24" rx="2" fill="#f472b6" />
      <rect x="34" y="22" width="10" height="36" rx="2" fill="#ec4899" />
      <rect x="48" y="10" width="10" height="48" rx="2" fill="#db2777" />
      <path d="M8 46 L22 36 L36 24 L50 12" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
      <circle cx="50" cy="12" r="4" fill="#fda4af" />
    </svg>
  )
}

function IllustrationBilleteras() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="6" width="36" height="52" rx="8" fill="#8b5cf6" />
      <rect x="17" y="9" width="30" height="46" rx="6" fill="#a78bfa" />
      <rect x="20" y="14" width="24" height="4" rx="2" fill="rgba(255,255,255,0.5)" />
      <rect x="20" y="22" width="16" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="20" y="28" width="20" height="3" rx="1.5" fill="rgba(255,255,255,0.35)" />
      <rect x="20" y="38" width="24" height="10" rx="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="40" cy="43" r="4" fill="rgba(255,255,255,0.5)" />
    </svg>
  )
}

const ILLUSTRATIONS: Record<string, React.FC> = {
  tarjetas: IllustrationTarjetas,
  cuentas: IllustrationCuentas,
  prestamos: IllustrationPrestamos,
  seguros: IllustrationSeguros,
  inversiones: IllustrationInversiones,
  billeteras: IllustrationBilleteras,
}

// ── Animated wrapper ──────────────────────────────────────────────────────────

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

// ── Main component ────────────────────────────────────────────────────────────

export default function CategoryGrid() {
  return (
    <section className="py-16" style={{ background: '#e8f5e9' }}>
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
            const Illustration = ILLUSTRATIONS[cat.slug]
            return (
              <FadeInCard key={cat.id} delay={i * 60}>
                <Link
                  href={`/${cat.slug}`}
                  className="group flex flex-col items-center text-center bg-white rounded-2xl p-5 border border-transparent hover:border-[#bbf7d0] transition-all duration-200"
                  style={{
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.transform = 'scale(1.03)'
                    el.style.boxShadow = '0 8px 24px rgba(29,185,84,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.transform = 'scale(1)'
                    el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.07)'
                  }}
                >
                  {/* Arrow */}
                  <div className="self-end mb-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#9ca3af] group-hover:text-[#1DB954] transition-colors">
                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Illustration */}
                  <div className="mb-3">
                    {Illustration && <Illustration />}
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
