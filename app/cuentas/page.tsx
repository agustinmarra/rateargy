'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ExternalLink, ChevronRight } from 'lucide-react'
import BankLogo from '@/components/BankLogo'

// ── Datos hardcodeados (como requiere el spec) ────────────────────────────────
const CUENTAS = [
  { banco: 'Mercado Pago', nombre: 'Cuenta Mercado Pago', rating: 4.9, tna: '31%', retiro: 'Sí', cashback: 'No',            minimo: '$1',  url: '#', tag: '+ popular' },
  { banco: 'Ualá',         nombre: 'Cuenta Ualá',         rating: 4.8, tna: '30%', retiro: 'Sí', cashback: 'No',            minimo: '$1',  url: '#', tag: null },
  { banco: 'Lemon Cash',   nombre: 'Cuenta Lemon',        rating: 4.7, tna: '32%', retiro: 'Sí', cashback: 'Sí (cripto)',   minimo: '$1',  url: '#', tag: 'Mayor TNA' },
  { banco: 'Personal Pay', nombre: 'Personal Pay',        rating: 4.6, tna: '28%', retiro: 'Sí', cashback: 'Sí',            minimo: '$1',  url: '#', tag: null },
  { banco: 'Brubank',      nombre: 'Cuenta Brubank',      rating: 4.5, tna: '29%', retiro: 'Sí', cashback: 'No',            minimo: '$1',  url: '#', tag: null },
  { banco: 'Banco Galicia', nombre: 'Cuenta Galicia',     rating: 4.3, tna: '27%', retiro: 'No (48hs)', cashback: 'No',     minimo: '$0',  url: '#', tag: null },
  { banco: 'Banco Nación', nombre: 'Cuenta BNA',          rating: 4.2, tna: '25%', retiro: 'No', cashback: 'No',            minimo: '$0',  url: '#', tag: null },
]

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

// ── Phone mockup (billetera) ──────────────────────────────────────────────────
function PhoneMockup() {
  return (
    <div className="relative mx-auto hidden lg:block" style={{ width: 240 }}>
      <div
        className="relative rounded-[36px] p-3"
        style={{ background: '#1a1a1a', boxShadow: '0 30px 70px rgba(0,0,0,0.28)' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 rounded-b-2xl z-10" style={{ background: '#1a1a1a' }} />
        <div className="rounded-[26px] overflow-hidden bg-white">
          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-7 pb-2" style={{ background: '#f0fdf4' }}>
            <span style={{ fontSize: 10, fontWeight: 700 }}>9:41</span>
            <span style={{ fontSize: 9, color: '#9ca3af' }}>● ● ●</span>
          </div>
          {/* Header */}
          <div className="px-4 pb-3" style={{ background: '#f0fdf4' }}>
            <p style={{ fontSize: 9, color: '#9ca3af' }}>rateargy · cuentas</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Mejores rendimientos</p>
          </div>
          {/* Balance card */}
          <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #1a5c38, #166534)' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>Tu saldo rinde</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>32%<span style={{ fontSize: 10, fontWeight: 400 }}> TNA</span></p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Lemon Cash · Sin mínimo</p>
          </div>
          {/* Account rows */}
          {[
            { name: 'Mercado Pago', tna: '31%', c: '#009EE3' },
            { name: 'Ualá', tna: '30%', c: '#7B2D8B' },
            { name: 'Personal Pay', tna: '28%', c: '#00B4E1' },
          ].map((item, i) => (
            <div key={i} className="mx-3 mb-2 bg-white rounded-xl border border-[#e5e7eb] px-3 py-2.5 flex items-center justify-between" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md border flex items-center justify-center" style={{ borderColor: item.c + '40', background: item.c + '10' }}>
                  <span style={{ fontSize: 8, fontWeight: 900, color: item.c }}>{item.name[0]}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#008000' }}>{item.tna}</span>
            </div>
          ))}
          <div className="flex justify-center py-3">
            <div className="w-16 h-1 bg-[#d1d5db] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Filters ───────────────────────────────────────────────────────────────────
const FILTROS = [
  { value: 'todos', label: 'Todas' },
  { value: 'alto-rendimiento', label: 'Alto rendimiento' },
  { value: 'cashback', label: 'Con cashback' },
  { value: 'retiro-inmediato', label: 'Retiro inmediato' },
  { value: 'banco', label: 'Banco tradicional' },
]

export default function CuentasPage() {
  const [filtro, setFiltro] = useState('todos')

  const filtered = CUENTAS.filter((c) => {
    if (filtro === 'alto-rendimiento') return parseFloat(c.tna) >= 29
    if (filtro === 'cashback') return c.cashback !== 'No'
    if (filtro === 'retiro-inmediato') return c.retiro === 'Sí'
    if (filtro === 'banco') return ['Banco Galicia', 'Banco Nación'].includes(c.banco)
    return true
  })

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 max-w-xl">
              <nav className="flex items-center gap-1 text-sm text-[#9ca3af] mb-5">
                <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
                <ChevronRight size={13} />
                <span className="text-[#6b7280]">Cuentas</span>
              </nav>
              <h1 className="font-extrabold tracking-tight text-[#1a1a1a] leading-tight mb-4" style={{ fontSize: 36 }}>
                Compará cuentas bancarias<br />y billeteras digitales
              </h1>
              <p className="text-[#6b7280] leading-relaxed mb-8" style={{ fontSize: 18 }}>
                Encontrá dónde poner tu plata para que rinda más. Comparamos tasas, beneficios y costos de todos los bancos y fintechs.
              </p>
              <Link
                href="#comparar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-white transition-colors"
                style={{ background: '#1a5c38', fontSize: 15 }}
              >
                Ver comparativa
                <ChevronRight size={16} />
              </Link>
              <p className="text-xs text-[#9ca3af] mt-3">
                TNA referencial · Actualizado mensualmente · Sin costo
              </p>
            </div>
            <div className="flex-1 flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div id="comparar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Info banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-7 flex items-start gap-3">
          <span className="text-amber-500 text-lg shrink-0">⚠</span>
          <p style={{ fontSize: 14, color: '#92400e' }}>
            <strong>Tasas referenciales:</strong> La TNA de rendimiento varía frecuentemente según la política de cada entidad. Verificá siempre la tasa vigente antes de decidir.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className="px-4 py-2 rounded-full font-medium transition-colors"
              style={{
                fontSize: 14,
                background: filtro === f.value ? '#008000' : 'white',
                color: filtro === f.value ? 'white' : '#6b7280',
                border: `1px solid ${filtro === f.value ? '#008000' : '#e5e7eb'}`,
              }}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto self-center text-xs text-[#9ca3af]">{filtered.length} cuentas</span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          {/* Header */}
          <div
            className="grid px-5 py-3 border-b border-[#f3f4f6] min-w-[700px]"
            style={{
              gridTemplateColumns: '1.5fr 120px 80px 140px 120px 100px 120px',
              background: '#fafafa',
              fontSize: 13,
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <div>Entidad</div>
            <div>Rating</div>
            <div>TNA</div>
            <div>Retiro inmediato</div>
            <div>Cashback</div>
            <div>Desde</div>
            <div />
          </div>

          {/* Rows */}
          {filtered.map((c, i) => (
            <div
              key={c.banco}
              className="grid px-5 py-4 border-b border-[#f9fafb] transition-colors hover:bg-[#f9fafb] min-w-[700px] items-center"
              style={{ gridTemplateColumns: '1.5fr 120px 80px 140px 120px 100px 120px' }}
            >
              <div className="flex items-center gap-3">
                <BankLogo name={c.banco} size={40} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{c.nombre}</div>
                  <div style={{ fontSize: 13, color: '#9ca3af' }}>{c.banco}</div>
                  {c.tag && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#f0fdf4', color: '#166534', padding: '1px 6px', borderRadius: 4, border: '1px solid #86efac' }}>{c.tag}</span>
                  )}
                </div>
              </div>

              <Stars rating={c.rating} />

              <div style={{ fontSize: 16, fontWeight: 700, color: '#008000' }}>{c.tna}</div>

              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 15, color: c.retiro === 'Sí' ? '#008000' : '#6b7280' }}>
                  {c.retiro === 'Sí' ? '✓' : '✗'}
                </span>
                <span style={{ fontSize: 14, color: '#6b7280' }}>{c.retiro}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <span style={{ fontSize: 15, color: c.cashback !== 'No' ? '#008000' : '#6b7280' }}>
                  {c.cashback !== 'No' ? '✓' : '✗'}
                </span>
                <span style={{ fontSize: 14, color: '#6b7280' }}>{c.cashback}</span>
              </div>

              <div style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 600 }}>{c.minimo}</div>

              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-white transition-colors whitespace-nowrap"
                style={{ background: '#1a5c38', fontSize: 13 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
              >
                Abrir cuenta
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>

        <p className="text-xs text-[#9ca3af] mt-4">
          Las tasas de rendimiento son referenciales y varían según la política de cada entidad. Verificá siempre la tasa vigente antes de decidir. Algunos links son de afiliados.
        </p>
      </div>
    </div>
  )
}
