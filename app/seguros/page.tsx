'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ExternalLink, ChevronRight } from 'lucide-react'
import BankLogo from '@/components/BankLogo'
import DisclaimerBanner from '@/components/DisclaimerBanner'

// ── Datos de seguros ──────────────────────────────────────────────────────────
const SEGUROS = [
  { banco: 'Sancor Seguros',      rating: 4.8, todoRiesgo: 85000,  terceros: 32000, url: 'https://www.sancorseguros.com.ar/autos' },
  { banco: 'MAPFRE Argentina',    rating: 4.6, todoRiesgo: 92000,  terceros: 35000, url: 'https://www.mapfre.com.ar/seguros-de-auto/' },
  { banco: 'Zurich Argentina',    rating: 4.5, todoRiesgo: 98000,  terceros: 38000, url: 'https://www.zurich.com.ar/' },
  { banco: 'La Caja',             rating: 4.4, todoRiesgo: 78000,  terceros: 29000, url: 'https://www.lacaja.com.ar/autos' },
  { banco: 'Federación Patronal', rating: 4.3, todoRiesgo: 72000,  terceros: 27000, url: 'https://www.federacionpatronal.com.ar/' },
  { banco: 'San Cristóbal',       rating: 4.2, todoRiesgo: 68000,  terceros: 25000, url: 'https://www.sancristobal.com.ar/' },
  { banco: 'Mercado Seguros',     rating: 4.1, todoRiesgo: 65000,  terceros: 24000, url: 'https://seguros.mercadopago.com.ar/' },
]

const COTIZACIONES = [
  { banco: 'Sancor Seguros',   ciudad: 'Buenos Aires', precio: 85000 },
  { banco: 'La Caja',         ciudad: 'Córdoba',       precio: 78000 },
  { banco: 'Zurich Argentina', ciudad: 'Rosario',      precio: 98000 },
  { banco: 'MAPFRE Argentina', ciudad: 'Mendoza',      precio: 92000 },
]

const PROVINCIAS = [
  'Buenos Aires', 'CABA', 'Córdoba', 'Santa Fe', 'Mendoza',
  'Tucumán', 'Salta', 'Entre Ríos', 'Rosario', 'Neuquén',
]

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < filled ? '#008000' : '#d1d5db', fontSize: 15 }}>★</span>
      ))}
      <span className="ml-1 font-bold text-[#1a1a1a]" style={{ fontSize: 14 }}>{rating.toFixed(1)}</span>
    </div>
  )
}

// ── Phone mockup ──────────────────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative mx-auto hidden lg:block" style={{ width: 240 }}>
      <div
        className="relative rounded-[36px] p-3"
        style={{ background: '#1a1a1a', boxShadow: '0 30px 70px rgba(0,0,0,0.28)' }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl z-10" style={{ background: '#1a1a1a' }} />
        {/* Screen */}
        <div className="rounded-[26px] overflow-hidden" style={{ background: 'white' }}>
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-7 pb-2" style={{ background: '#f0fdf4' }}>
            <span style={{ fontSize: 10, fontWeight: 700 }}>9:41</span>
            <div className="flex gap-0.5 items-center">
              <div className="w-3 h-1.5 bg-[#008000] rounded-sm opacity-80" />
              <div className="w-1 h-1.5 bg-[#1a1a1a] rounded-sm opacity-20" />
            </div>
          </div>
          {/* App header */}
          <div className="px-4 pb-3" style={{ background: '#f0fdf4' }}>
            <p style={{ fontSize: 9, color: '#9ca3af' }}>rateargy · seguros de auto</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Mejores cotizaciones</p>
          </div>
          {/* Insurance cards */}
          {[
            { name: 'Sancor', rating: '4.8', price: '$85.000', tag: '+ económico', c: '#006837' },
            { name: 'Mapfre', rating: '4.6', price: '$92.000', tag: null, c: '#C8102E' },
            { name: 'Zurich', rating: '4.5', price: '$98.000', tag: null, c: '#003DA5' },
          ].map((item, i) => (
            <div key={i} className="mx-3 mb-2 bg-white rounded-xl border border-[#e5e7eb] p-3" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-md border flex items-center justify-center" style={{ borderColor: item.c + '40', background: item.c + '10' }}>
                    <span style={{ fontSize: 9, fontWeight: 900, color: item.c }}>{item.name[0]}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#1a1a1a' }}>{item.name}</div>
                    <div style={{ fontSize: 9, color: '#9ca3af' }}>★ {item.rating} · Todo riesgo</div>
                  </div>
                </div>
                {item.tag && (
                  <span style={{ fontSize: 8, fontWeight: 700, background: '#008000', color: 'white', padding: '2px 6px', borderRadius: 6 }}>{item.tag}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 14, fontWeight: 900, color: '#1a1a1a' }}>
                  {item.price}<span style={{ fontSize: 9, fontWeight: 400, color: '#9ca3af' }}>/mes</span>
                </span>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'white', background: '#1a5c38', padding: '3px 8px', borderRadius: 6 }}>Ver →</div>
              </div>
            </div>
          ))}
          {/* Home indicator */}
          <div className="flex justify-center py-3">
            <div className="w-16 h-1 bg-[#d1d5db] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SegurosPage() {
  const [cobertura, setCobertura] = useState<'todos' | 'todo-riesgo' | 'terceros'>('todos')
  const [provincia, setProvincia] = useState('')
  const [antiguedad, setAntiguedad] = useState('')

  const sorted = [...SEGUROS].sort((a, b) => {
    if (cobertura === 'terceros') return a.terceros - b.terceros
    if (cobertura === 'todo-riesgo') return a.todoRiesgo - b.todoRiesgo
    return b.rating - a.rating
  })

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="flex-1 max-w-xl">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1 text-sm text-[#9ca3af] mb-5">
                <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
                <ChevronRight size={13} />
                <span className="text-[#6b7280]">Seguros</span>
              </nav>

              <h1 className="font-extrabold tracking-tight text-[#1a1a1a] leading-tight mb-4" style={{ fontSize: 36 }}>
                Compará seguros de auto<br />en Argentina
              </h1>
              <p className="text-[#6b7280] leading-relaxed mb-8" style={{ fontSize: 18 }}>
                Encontrá la cobertura que necesitás al mejor precio. Comparamos las principales aseguradoras del país.
              </p>
              <Link
                href="#comparar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
                style={{ background: '#1a5c38', fontSize: 15 }}
              >
                Comparar seguros
                <ChevronRight size={16} />
              </Link>
              <p className="text-xs text-[#9ca3af] mt-3">
                Precios referenciales · Actualizado mensualmente · Sin costo
              </p>
            </div>

            {/* Right — CSS phone mockup */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Content: filters + table ──────────────────────────────────── */}
      <div id="comparar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <DisclaimerBanner variant="seguros" />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar filters */}
          <aside className="w-full lg:w-60 shrink-0 space-y-6">
            {/* Tipo de cobertura */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <h3 className="font-semibold text-[#1a1a1a] mb-3" style={{ fontSize: 14 }}>Tipo de cobertura</h3>
              {(['todos', 'todo-riesgo', 'terceros'] as const).map((v) => {
                const labels = { todos: 'Todos', 'todo-riesgo': 'Todo riesgo', terceros: 'Solo terceros' }
                return (
                  <label key={v} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="cobertura"
                      checked={cobertura === v}
                      onChange={() => setCobertura(v)}
                      className="accent-[#008000]"
                    />
                    <span style={{ fontSize: 14, color: cobertura === v ? '#1a1a1a' : '#6b7280' }}>{labels[v]}</span>
                  </label>
                )
              })}
            </div>

            {/* Provincia */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <h3 className="font-semibold text-[#1a1a1a] mb-3" style={{ fontSize: 14 }}>Provincia</h3>
              <select
                value={provincia}
                onChange={(e) => setProvincia(e.target.value)}
                className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2 focus:outline-none focus:border-[#008000]"
                style={{ fontSize: 13 }}
              >
                <option value="">Todas</option>
                {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              {provincia && (
                <p className="text-xs text-[#9ca3af] mt-2">Los precios pueden variar por zona.</p>
              )}
            </div>

            {/* Antigüedad del vehículo */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5">
              <h3 className="font-semibold text-[#1a1a1a] mb-3" style={{ fontSize: 14 }}>Antigüedad del vehículo</h3>
              {['0–3 años', '4–7 años', '8+ años'].map((v) => (
                <label key={v} className="flex items-center gap-2.5 py-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="antiguedad"
                    checked={antiguedad === v}
                    onChange={() => setAntiguedad(v)}
                    className="accent-[#008000]"
                  />
                  <span style={{ fontSize: 14, color: antiguedad === v ? '#1a1a1a' : '#6b7280' }}>{v}</span>
                </label>
              ))}
            </div>

            <p className="text-xs text-[#9ca3af] leading-relaxed">
              Los precios mostrados son referenciales. El valor final depende del modelo, año, zona y perfil del conductor.
            </p>
          </aside>

          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-extrabold text-[#1a1a1a]" style={{ fontSize: 20 }}>
                {sorted.length} aseguradoras comparadas
              </h2>
              <span className="text-xs text-[#9ca3af]">
                {cobertura === 'terceros' ? 'Ordenado por menor precio terceros' :
                 cobertura === 'todo-riesgo' ? 'Ordenado por menor precio todo riesgo' :
                 'Ordenado por rating'}
              </span>
            </div>

            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {/* Table header */}
              <div
                className="grid items-center px-5 py-3 border-b border-[#f3f4f6]"
                style={{
                  gridTemplateColumns: '1fr 120px 150px 150px 120px',
                  background: '#fafafa',
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#9ca3af',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                <div>Aseguradora</div>
                <div>Rating</div>
                <div style={{ color: cobertura !== 'terceros' ? '#008000' : '#9ca3af' }}>Todo riesgo</div>
                <div style={{ color: cobertura === 'terceros' ? '#008000' : '#9ca3af' }}>Solo terceros</div>
                <div />
              </div>

              {/* Rows */}
              {sorted.map((s, i) => (
                <div
                  key={s.banco}
                  className="grid items-center px-5 py-4 border-b border-[#f9fafb] transition-colors hover:bg-[#f9fafb]"
                  style={{ gridTemplateColumns: '1fr 120px 150px 150px 120px' }}
                >
                  {/* Aseguradora */}
                  <div className="flex items-center gap-3">
                    <BankLogo name={s.banco} size={40} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{s.banco}</div>
                      {i === 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#f0fdf4', color: '#166534', padding: '1px 6px', borderRadius: 4, border: '1px solid #86efac' }}>
                          Mejor calificado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <Stars rating={s.rating} />

                  {/* Todo riesgo */}
                  <div style={{ color: cobertura !== 'terceros' ? '#1a1a1a' : '#9ca3af', fontWeight: cobertura !== 'terceros' ? 700 : 400, fontSize: 15 }}>
                    ${s.todoRiesgo.toLocaleString('es-AR')}
                    <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>/mes</span>
                  </div>

                  {/* Terceros */}
                  <div style={{ color: cobertura === 'terceros' ? '#1a1a1a' : '#9ca3af', fontWeight: cobertura === 'terceros' ? 700 : 400, fontSize: 15 }}>
                    ${s.terceros.toLocaleString('es-AR')}
                    <span style={{ fontSize: 12, fontWeight: 400, color: '#9ca3af' }}>/mes</span>
                  </div>

                  {/* CTA */}
                  <div>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-white transition-colors whitespace-nowrap"
                      style={{ background: '#1a5c38', fontSize: 13 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
                    >
                      Ver cotización
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#9ca3af] mt-4">
              * Precios referenciales para un auto de uso particular sin siniestros. El precio final varía según modelo, año, zona y perfil. Verificá siempre la cotización con la aseguradora.
            </p>
          </div>
        </div>

        {/* ── Cotizaciones recientes ─────────────────────────────────── */}
        <div className="mt-14">
          <h2 className="font-extrabold text-[#1a1a1a] mb-6" style={{ fontSize: 22 }}>
            Cotizaciones recientes en rateargy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COTIZACIONES.map((c, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#e5e7eb] p-4 flex items-center gap-4"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <BankLogo name={c.banco} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-[#6b7280] leading-snug" style={{ fontSize: 13 }}>
                    <span className="font-semibold text-[#1a1a1a]">{c.banco}</span> cotizó este precio para un conductor en <span className="font-medium text-[#1a1a1a]">{c.ciudad}</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-extrabold text-[#1a1a1a]" style={{ fontSize: 17 }}>
                    ${c.precio.toLocaleString('es-AR')}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>/mes</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
