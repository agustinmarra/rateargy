'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { CATEGORIAS } from '@/lib/data'

// ── SVG Illustrations (80×80, coloridas, estilo moderno) ──────────────────────

function SvgTarjetas() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow card */}
      <rect x="10" y="20" width="60" height="38" rx="7" fill="#bbf7d0" />
      {/* Main card */}
      <rect x="8" y="16" width="60" height="38" rx="7" fill="url(#tc1)" />
      {/* Stripe */}
      <rect x="8" y="27" width="60" height="11" fill="rgba(0,0,0,0.12)" />
      {/* Chip */}
      <rect x="16" y="20" width="12" height="9" rx="2" fill="url(#tc2)" />
      <line x1="22" y1="20" x2="22" y2="29" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
      <line x1="16" y1="24.5" x2="28" y2="24.5" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8" />
      {/* Network circles */}
      <circle cx="54" cy="23" r="5" fill="rgba(255,255,255,0.35)" />
      <circle cx="59" cy="23" r="5" fill="rgba(255,255,255,0.2)" />
      {/* Number dots */}
      <rect x="16" y="42" width="5" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      <rect x="24" y="42" width="5" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      <rect x="32" y="42" width="5" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      <rect x="40" y="42" width="5" height="3" rx="1.5" fill="rgba(255,255,255,0.7)" />
      {/* Shine */}
      <rect x="8" y="16" width="60" height="38" rx="7" fill="url(#tc3)" />
      <defs>
        <linearGradient id="tc1" x1="8" y1="16" x2="68" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16a34a" />
          <stop offset="1" stopColor="#065f46" />
        </linearGradient>
        <linearGradient id="tc2" x1="16" y1="20" x2="28" y2="29" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcd34d" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="tc3" x1="8" y1="16" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.18" />
          <stop offset="0.5" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SvgCuentas() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Base / ground */}
      <rect x="8" y="66" width="64" height="5" rx="2.5" fill="#bae6fd" />
      {/* Body */}
      <rect x="12" y="38" width="56" height="28" rx="3" fill="url(#cb1)" />
      {/* Columns */}
      <rect x="18" y="44" width="8" height="16" rx="2" fill="rgba(255,255,255,0.55)" />
      <rect x="32" y="44" width="8" height="16" rx="2" fill="rgba(255,255,255,0.55)" />
      <rect x="46" y="44" width="8" height="16" rx="2" fill="rgba(255,255,255,0.55)" />
      {/* Entablature */}
      <rect x="10" y="32" width="60" height="7" rx="2" fill="url(#cb2)" />
      {/* Pediment */}
      <path d="M40 12 L68 32 L12 32 Z" fill="url(#cb2)" />
      {/* Star on pediment */}
      <circle cx="40" cy="25" r="3.5" fill="white" opacity="0.6" />
      <defs>
        <linearGradient id="cb1" x1="12" y1="38" x2="68" y2="66" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#0c4a6e" />
        </linearGradient>
        <linearGradient id="cb2" x1="10" y1="30" x2="70" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SvgPrestamos() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Back bill */}
      <rect x="18" y="26" width="50" height="30" rx="5" fill="#fde68a" />
      {/* Mid bill */}
      <rect x="13" y="22" width="50" height="30" rx="5" fill="#fcd34d" />
      {/* Front bill */}
      <rect x="8" y="18" width="50" height="30" rx="5" fill="url(#pm1)" />
      {/* Bill inner border */}
      <rect x="12" y="22" width="42" height="22" rx="3" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
      {/* Dollar sign */}
      <text x="33" y="37" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="white" opacity="0.9">$</text>
      {/* Lines (decorative) */}
      <rect x="14" y="24" width="10" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
      <rect x="42" y="34" width="6" height="2" rx="1" fill="rgba(255,255,255,0.4)" />
      <defs>
        <linearGradient id="pm1" x1="8" y1="18" x2="58" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SvgSeguros() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow shield */}
      <path d="M40 70 C24 62 14 50 14 36 L14 20 L40 12 L66 20 L66 36 C66 50 56 62 40 70Z" fill="#c7d2fe" transform="translate(2,2)" />
      {/* Main shield */}
      <path d="M40 68 C24 60 14 48 14 34 L14 18 L40 10 L66 18 L66 34 C66 48 56 60 40 68Z" fill="url(#sg1)" />
      {/* Inner shield highlight */}
      <path d="M40 60 C28 54 20 44 20 32 L20 22 L40 16 L60 22 L60 32 C60 44 52 54 40 60Z" fill="url(#sg2)" />
      {/* Checkmark */}
      <path d="M27 38 L35 46 L53 28" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="sg1" x1="14" y1="10" x2="66" y2="68" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#3730a3" />
        </linearGradient>
        <linearGradient id="sg2" x1="20" y1="16" x2="60" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SvgInversiones() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background area */}
      <rect x="8" y="8" width="64" height="64" rx="10" fill="#fdf2f8" />
      {/* Grid lines */}
      <line x1="8" y1="54" x2="72" y2="54" stroke="#fce7f3" strokeWidth="1" />
      <line x1="8" y1="40" x2="72" y2="40" stroke="#fce7f3" strokeWidth="1" />
      <line x1="8" y1="26" x2="72" y2="26" stroke="#fce7f3" strokeWidth="1" />
      {/* Chart fill */}
      <path d="M14 62 L26 54 L36 46 L48 34 L60 22 L68 16 L68 70 L14 70 Z" fill="url(#iv1)" opacity="0.5" />
      {/* Chart line */}
      <path d="M14 62 L26 54 L36 46 L48 34 L60 22 L68 16" stroke="url(#iv2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Data points */}
      <circle cx="26" cy="54" r="3.5" fill="#ec4899" />
      <circle cx="48" cy="34" r="3.5" fill="#ec4899" />
      <circle cx="68" cy="16" r="4.5" fill="white" stroke="#ec4899" strokeWidth="2.5" />
      {/* Arrow up */}
      <path d="M62 10 L68 16 L62 22" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <defs>
        <linearGradient id="iv1" x1="40" y1="16" x2="40" y2="70" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ec4899" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="iv2" x1="14" y1="62" x2="68" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#db2777" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SvgBilleteras() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shadow */}
      <rect x="10" y="20" width="58" height="42" rx="8" fill="#ddd6fe" transform="translate(2,2)" />
      {/* Wallet body */}
      <rect x="10" y="20" width="58" height="42" rx="8" fill="url(#bw1)" />
      {/* Wallet flap */}
      <rect x="10" y="20" width="58" height="16" rx="8" fill="url(#bw2)" />
      <rect x="10" y="28" width="58" height="8" fill="url(#bw2)" />
      {/* Coin pocket */}
      <rect x="46" y="35" width="18" height="20" rx="6" fill="url(#bw3)" />
      {/* Coin circle */}
      <circle cx="55" cy="45" r="6" fill="url(#bw4)" />
      <text x="52.5" y="49" fontFamily="Arial" fontSize="8" fontWeight="bold" fill="white">$</text>
      {/* Cards in wallet */}
      <rect x="14" y="37" width="27" height="5" rx="2.5" fill="rgba(255,255,255,0.55)" />
      <rect x="14" y="45" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.35)" />
      <defs>
        <linearGradient id="bw1" x1="10" y1="20" x2="68" y2="62" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c3aed" />
          <stop offset="1" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="bw2" x1="10" y1="20" x2="68" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="bw3" x1="46" y1="35" x2="64" y2="55" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="bw4" x1="49" y1="39" x2="61" y2="51" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcd34d" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  )
}

const ILLUSTRATIONS: Record<string, React.FC> = {
  tarjetas:    SvgTarjetas,
  cuentas:     SvgCuentas,
  prestamos:   SvgPrestamos,
  seguros:     SvgSeguros,
  inversiones: SvgInversiones,
  billeteras:  SvgBilleteras,
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
    <section className="py-16" style={{ background: '#f0fdf4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-extrabold text-3xl md:text-[2rem] text-[#1a1a1a] tracking-tight mb-2">
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
                  className="group flex flex-col items-center text-center bg-white rounded-2xl p-5 border border-transparent hover:border-[#86efac] transition-all duration-200"
                  style={{
                    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
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
                  <div className="self-end mb-1">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[#9ca3af] group-hover:text-[#008000] transition-colors">
                      <path d="M3 11L11 3M11 3H5M11 3v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <div className="mb-3 flex items-center justify-center" style={{ width: 80, height: 80 }}>
                    {Illustration && <Illustration />}
                  </div>

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
