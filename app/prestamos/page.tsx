'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { ExternalLink, ChevronRight } from 'lucide-react'
import { PRESTAMOS_MOCK } from '@/lib/data'
import BankLogo from '@/components/BankLogo'

// ── Tabla auxiliar con datos adicionales por banco ────────────────────────────
const EXTRA: Record<string, { montoMax: string; plazoMax: string; acreditacion: string }> = {
  'Banco Galicia': { montoMax: '$5.000.000', plazoMax: '48 cuotas', acreditacion: 'Instante' },
  'Banco Nación':  { montoMax: 'Según perfil', plazoMax: '60 cuotas', acreditacion: '24–48 hs' },
  'BBVA Argentina': { montoMax: '$8.000.000', plazoMax: '72 cuotas', acreditacion: 'Online' },
  'Mercado Pago':  { montoMax: 'Según historial', plazoMax: '24 cuotas', acreditacion: 'Instante' },
  'Banco Macro':   { montoMax: '$4.000.000', plazoMax: '60 cuotas', acreditacion: '24 hs' },
  'Naranja X':     { montoMax: '$2.000.000', plazoMax: '36 cuotas', acreditacion: 'Instante' },
  'Brubank':       { montoMax: '$3.000.000', plazoMax: '36 cuotas', acreditacion: 'Instante' },
  'Banco Provincia': { montoMax: '$5.000.000', plazoMax: '60 cuotas', acreditacion: '24–48 hs' },
}

function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating / 2)
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} style={{ color: i < filled ? '#008000' : '#d1d5db', fontSize: 15 }}>★</span>
      ))}
      <span className="ml-1 font-bold text-[#1a1a1a]" style={{ fontSize: 14 }}>{rating.toFixed(1)}</span>
    </div>
  )
}

// ── Calculadora ───────────────────────────────────────────────────────────────
function LoanCalculator() {
  const [monto, setMonto] = useState(500000)
  const [cuotas, setCuotas] = useState(12)

  // Cálculo ilustrativo con TNA ≈ 60% (tasa de referencia, no oficial)
  const r = 0.60 / 12
  const pmt = monto * (r * Math.pow(1 + r, cuotas)) / (Math.pow(1 + r, cuotas) - 1)
  const totalPagar = pmt * cuotas

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 sticky top-20" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      <h3 className="font-extrabold text-[#1a1a1a] mb-5" style={{ fontSize: 18 }}>
        Calculadora de cuotas
      </h3>

      {/* Monto */}
      <div className="mb-5">
        <label className="block font-semibold text-[#374151] mb-1" style={{ fontSize: 14 }}>
          ¿Cuánto necesitás?
        </label>
        <div className="font-extrabold text-[#1a1a1a] mb-2" style={{ fontSize: 24 }}>
          ${monto.toLocaleString('es-AR')}
        </div>
        <input
          type="range"
          min={100000}
          max={10000000}
          step={50000}
          value={monto}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="w-full accent-[#008000]"
        />
        <div className="flex justify-between text-xs text-[#9ca3af] mt-1">
          <span>$100.000</span>
          <span>$10.000.000</span>
        </div>
      </div>

      {/* Cuotas */}
      <div className="mb-6">
        <label className="block font-semibold text-[#374151] mb-1" style={{ fontSize: 14 }}>
          ¿En cuántas cuotas?
        </label>
        <select
          value={cuotas}
          onChange={(e) => setCuotas(Number(e.target.value))}
          className="w-full border border-[#e5e7eb] rounded-lg px-3 py-2.5 focus:outline-none focus:border-[#008000] transition-colors"
          style={{ fontSize: 14 }}
        >
          {[6, 12, 18, 24, 36, 48].map((n) => (
            <option key={n} value={n}>{n} cuotas</option>
          ))}
        </select>
      </div>

      {/* Resultado */}
      <div className="bg-[#f0fdf4] rounded-xl p-4 border border-[#86efac] mb-4">
        <p className="text-[#374151] mb-1" style={{ fontSize: 13 }}>
          Tu cuota mensual sería de aproximadamente
        </p>
        <p className="font-extrabold text-[#008000]" style={{ fontSize: 32 }}>
          ${Math.round(pmt).toLocaleString('es-AR')}
        </p>
        <p className="text-[#6b7280] mt-1" style={{ fontSize: 12 }}>
          Total a pagar: <strong>${Math.round(totalPagar).toLocaleString('es-AR')}</strong>
        </p>
      </div>

      <p className="text-[#9ca3af] leading-relaxed" style={{ fontSize: 12 }}>
        ⚠ Cálculo ilustrativo a TNA referencial ≈ 60%. La cuota real depende de la entidad y tu perfil crediticio. Siempre verificá el CFT antes de firmar.
      </p>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
const FILTROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'rapido', label: 'Aprobación rápida' },
  { value: 'digital', label: '100% digital' },
  { value: 'mayor-plazo', label: 'Mayor plazo' },
  { value: 'estado', label: 'Banco estatal' },
]

export default function PrestamosPage() {
  const [filtro, setFiltro] = useState('todos')

  const filtered = useMemo(() => {
    return PRESTAMOS_MOCK.filter((p) => {
      if (filtro === 'rapido') return p.beneficios.some((b) => b.toLowerCase().includes('minuto') || b.toLowerCase().includes('instant') || b.toLowerCase().includes('rápida'))
      if (filtro === 'digital') return p.beneficios.some((b) => b.toLowerCase().includes('online') || b.toLowerCase().includes('app') || b.toLowerCase().includes('digital'))
      if (filtro === 'mayor-plazo') return p.beneficios.some((b) => b.toLowerCase().includes('72') || b.toLowerCase().includes('60'))
      if (filtro === 'estado') return ['Banco Nación', 'Banco Provincia'].includes(p.banco)
      return true
    }).sort((a, b) => b.puntuacion - a.puntuacion)
  }, [filtro])

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-1 text-sm text-[#9ca3af] mb-5">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <ChevronRight size={13} />
            <span className="text-[#6b7280]">Préstamos</span>
          </nav>
          <h1 className="font-extrabold tracking-tight text-[#1a1a1a] leading-tight mb-3" style={{ fontSize: 36 }}>
            Compará préstamos personales en Argentina
          </h1>
          <p className="text-[#6b7280] max-w-2xl" style={{ fontSize: 18 }}>
            Las tasas más bajas del mercado. Comparamos bancos y fintechs para que pagues menos intereses.
          </p>
        </div>
      </section>

      {/* ── Main content: calculadora + tabla ────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <span className="text-amber-500 text-lg shrink-0">⚠</span>
          <p style={{ fontSize: 14, color: '#92400e' }}>
            <strong>Importante:</strong> Las tasas (TNA/CFT) varían frecuentemente según la política del BCRA y el perfil del solicitante. Siempre verificá la tasa vigente y el CFT directamente con el banco antes de firmar.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — calculadora */}
          <div className="w-full lg:w-80 shrink-0">
            <LoanCalculator />
          </div>

          {/* Right — tabla */}
          <div className="flex-1 min-w-0">
            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-5">
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
              <span className="ml-auto self-center text-xs text-[#9ca3af]">{filtered.length} préstamos</span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              {/* Header */}
              <div
                className="grid px-5 py-3 border-b border-[#f3f4f6] min-w-[680px]"
                style={{
                  gridTemplateColumns: '1.5fr 130px 80px 130px 110px 100px 110px',
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
                <div>Monto máx.</div>
                <div>Plazo máx.</div>
                <div>Acreditación</div>
                <div />
              </div>

              {/* Rows */}
              {filtered.map((p, i) => {
                const extra = EXTRA[p.banco] ?? { montoMax: 'A consultar', plazoMax: 'A consultar', acreditacion: 'A consultar' }
                return (
                  <div
                    key={p.id}
                    className="grid px-5 py-4 border-b border-[#f9fafb] hover:bg-[#f9fafb] transition-colors min-w-[680px] items-center"
                    style={{ gridTemplateColumns: '1.5fr 130px 80px 130px 110px 100px 110px' }}
                  >
                    <div className="flex items-center gap-3">
                      <BankLogo name={p.banco} size={40} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{p.nombre}</div>
                        <div style={{ fontSize: 13, color: '#9ca3af' }}>{p.banco}</div>
                        {p.tag && (
                          <span style={{ fontSize: 11, fontWeight: 700, background: '#f0fdf4', color: '#166534', padding: '1px 6px', borderRadius: 4, border: '1px solid #86efac' }}>{p.tag}</span>
                        )}
                      </div>
                    </div>

                    <Stars rating={p.puntuacion} />

                    <div style={{ fontSize: 14, color: '#6b7280' }}>Consultar</div>

                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{extra.montoMax}</div>

                    <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{extra.plazoMax}</div>

                    <div style={{ fontSize: 14, color: extra.acreditacion === 'Instante' ? '#008000' : '#6b7280', fontWeight: extra.acreditacion === 'Instante' ? 700 : 400 }}>
                      {extra.acreditacion}
                    </div>

                    <a
                      href={p.url_afiliado}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-white transition-colors whitespace-nowrap"
                      style={{ background: '#1a5c38', fontSize: 13 }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
                    >
                      Solicitar
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )
              })}
            </div>

            <p className="text-xs text-[#9ca3af] mt-4">
              Montos y plazos referenciales, sujetos a aprobación crediticia. TNA variable — consultá la tasa vigente y el CFT antes de contratar. Algunos links son de afiliados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
