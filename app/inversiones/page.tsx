'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { ExternalLink, ChevronRight, Info } from 'lucide-react'
import { FINANCIAL_CONSTANTS } from '@/lib/constants'

// ── Datos ─────────────────────────────────────────────────────────────────────

type Riesgo = 'Bajo' | 'Medio-bajo' | 'Medio' | 'Alto' | 'Muy alto'

interface Instrumento {
  id: string
  nombre: string
  descripcion: string
  rendimiento: string
  rendimientoDetalle: string
  liquidez: string
  liquidezHs: number        // horas para ordenar
  riesgo: Riesgo
  desde: { nombre: string; url: string }[]
  tag?: string
  esCoberturaUSD?: boolean
}

const INSTRUMENTOS: Instrumento[] = [
  {
    id: 'fci-mm',
    nombre: 'FCI Money Market',
    descripcion: 'Fondo de inversión que invierte en instrumentos de muy corto plazo (plazos fijos, cauciones). Es la alternativa más usada a la caja de ahorro. El saldo rinde desde el primer día.',
    rendimiento: `~${FINANCIAL_CONSTANTS.TNA_REFERENCIAL_CUENTAS * 100}% TNA`,
    rendimientoDetalle: 'Similar a la tasa de política monetaria del BCRA. Variable y actualizable diariamente.',
    liquidez: 'Inmediata (acredita en 24 hs)',
    liquidezHs: 24,
    riesgo: 'Bajo',
    tag: 'Más usado',
    desde: [
      { nombre: 'Mercado Pago', url: 'https://www.mercadopago.com.ar/' },
      { nombre: 'Ualá', url: 'https://www.uala.com.ar/' },
      { nombre: 'Balanz', url: 'https://balanz.com/' },
      { nombre: 'IOL', url: 'https://www.invertironline.com/' },
    ],
  },
  {
    id: 'fci-rf',
    nombre: 'FCI Renta Fija',
    descripcion: 'Fondo que invierte en bonos y letras del Estado y corporativos en pesos. Rinde más que un Money Market pero tiene algo más de volatilidad. Ideal para horizontes de 1-3 meses.',
    rendimiento: '~40–55% TNA',
    rendimientoDetalle: 'Rendimiento referencial. Varía según el fondo y el contexto de tasas.',
    liquidez: '24–48 hs hábiles',
    liquidezHs: 48,
    riesgo: 'Medio-bajo',
    desde: [
      { nombre: 'Balanz', url: 'https://balanz.com/' },
      { nombre: 'IOL', url: 'https://www.invertironline.com/' },
      { nombre: 'PPI', url: 'https://www.portfoliopersonal.com/' },
    ],
  },
  {
    id: 'pf-uva',
    nombre: 'Plazo Fijo UVA',
    descripcion: 'Depósito a plazo que ajusta por inflación (UVA) más un interés adicional de ~1% anual. Ideal si querés preservar el poder adquisitivo. El dinero queda inmovilizado 90 días mínimo.',
    rendimiento: 'Inflación + ~1% anual',
    rendimientoDetalle: 'Ajuste por UVA (índice CER). En escenarios de alta inflación supera al plazo fijo tradicional.',
    liquidez: '90 días mínimo',
    liquidezHs: 90 * 24,
    riesgo: 'Bajo',
    desde: [
      { nombre: 'Banco Nación', url: 'https://www.bna.com.ar/Personas' },
      { nombre: 'Banco Galicia', url: 'https://www.galicia.com.ar/personas/cuentas' },
      { nombre: 'BBVA Argentina', url: 'https://www.bbva.com.ar/personas/cuentas.html' },
    ],
  },
  {
    id: 'dolar-mep',
    nombre: 'Dólar MEP',
    descripcion: 'Comprá dólares legales desde tu homebanking o broker operando bonos (AL30/GD30). Tipo de cambio similar al dólar libre pero 100% legal y sin límite de monto. Requiere 1 día de "parking".',
    rendimiento: 'Cobertura cambiaria',
    rendimientoDetalle: 'No genera intereses en USD. Su objetivo es dolarizar ahorros de forma legal y sin límite de monto.',
    liquidez: '24–48 hs (parking obligatorio)',
    liquidezHs: 48,
    riesgo: 'Bajo',
    tag: 'Cobertura USD',
    esCoberturaUSD: true,
    desde: [
      { nombre: 'IOL', url: 'https://www.invertironline.com/' },
      { nombre: 'Balanz', url: 'https://balanz.com/' },
      { nombre: 'PPI', url: 'https://www.portfoliopersonal.com/' },
      { nombre: 'Bull Market', url: 'https://bullmarketbrokers.com/' },
    ],
  },
  {
    id: 'cedears',
    nombre: 'CEDEARs',
    descripcion: 'Certificados que representan acciones de empresas extranjeras (Apple, Google, Amazon, Mercado Libre) cotizando en pesos en la Bolsa de Buenos Aires. Su precio ajusta por el tipo de cambio CCL.',
    rendimiento: 'Variable (ajusta por CCL)',
    rendimientoDetalle: 'Combinan el rendimiento de la acción subyacente con la variación del dólar CCL. Histórico en USD: 10–20% anual promedio (S&P 500). Alta volatilidad.',
    liquidez: 'Inmediata (horario bursátil)',
    liquidezHs: 2,
    riesgo: 'Alto',
    tag: 'Dolarizá tus ahorros',
    desde: [
      { nombre: 'IOL', url: 'https://www.invertironline.com/' },
      { nombre: 'Bull Market', url: 'https://bullmarketbrokers.com/' },
      { nombre: 'Balanz', url: 'https://balanz.com/' },
      { nombre: 'PPI', url: 'https://www.portfoliopersonal.com/' },
    ],
  },
  {
    id: 'acciones-ar',
    nombre: 'Acciones argentinas',
    descripcion: 'Acciones de empresas locales que cotizan en el Merval (YPF, Banco Galicia, Pampa Energía, etc.). Alta volatilidad, potencial de retorno elevado, pero también de pérdida. Solo para perfiles agresivos con horizonte largo.',
    rendimiento: 'Variable (alta volatilidad)',
    rendimientoDetalle: 'El Merval tuvo años con retornos de +200% y años con -50%. Para perfiles agresivos con horizonte de 2+ años.',
    liquidez: 'Inmediata (horario bursátil)',
    liquidezHs: 2,
    riesgo: 'Muy alto',
    desde: [
      { nombre: 'IOL', url: 'https://www.invertironline.com/' },
      { nombre: 'Bull Market', url: 'https://bullmarketbrokers.com/' },
      { nombre: 'Balanz', url: 'https://balanz.com/' },
    ],
  },
]

const RIESGO_STYLE: Record<Riesgo, { color: string; bg: string; border: string }> = {
  'Bajo':      { color: '#166534', bg: '#f0fdf4', border: '#86efac' },
  'Medio-bajo':{ color: '#065f46', bg: '#ecfdf5', border: '#6ee7b7' },
  'Medio':     { color: '#92400e', bg: '#fffbeb', border: '#fcd34d' },
  'Alto':      { color: '#9a3412', bg: '#fff7ed', border: '#fdba74' },
  'Muy alto':  { color: '#7f1d1d', bg: '#fef2f2', border: '#fca5a5' },
}

// ── Phone mockup ──────────────────────────────────────────────────────────────
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
            <p style={{ fontSize: 9, color: '#9ca3af' }}>rateargy · inversiones</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Tu portafolio ideal</p>
          </div>
          {/* Portfolio total */}
          <div className="mx-3 mb-3 rounded-xl p-3" style={{ background: 'linear-gradient(135deg, #1a5c38, #166534)' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>Mejor rendimiento hoy</p>
            <p style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>FCI MM<span style={{ fontSize: 9, fontWeight: 400 }}> sin riesgo</span></p>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>~32% TNA · Liquidez inmediata</p>
          </div>
          {/* Instruments */}
          {[
            { name: 'FCI Money Market', tag: 'Bajo riesgo', pct: '~32% TNA', c: '#008000' },
            { name: 'CEDEARs', tag: 'Dólar CCL', pct: 'Variable', c: '#7c3aed' },
            { name: 'PF UVA', tag: 'Anti-inflación', pct: 'UVA +1%', c: '#0284c7' },
          ].map((item, i) => (
            <div key={i} className="mx-3 mb-2 bg-white rounded-xl border border-[#e5e7eb] px-3 py-2.5 flex items-center justify-between" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md border flex items-center justify-center" style={{ borderColor: item.c + '40', background: item.c + '10' }}>
                  <span style={{ fontSize: 8, fontWeight: 900, color: item.c }}>{item.name[0]}</span>
                </div>
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#1a1a1a' }}>{item.name}</p>
                  <p style={{ fontSize: 8, color: '#9ca3af' }}>{item.tag}</p>
                </div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: item.c }}>{item.pct}</span>
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

// ── Filtros ───────────────────────────────────────────────────────────────────
const FILTROS = [
  { value: 'todos',    label: 'Todos' },
  { value: 'bajo',     label: 'Bajo riesgo' },
  { value: 'medio',    label: 'Riesgo medio' },
  { value: 'alto',     label: 'Alto riesgo' },
  { value: 'usd',      label: 'Cobertura USD' },
]

// ── Íconos de riesgo ──────────────────────────────────────────────────────────
function RiesgoBar({ riesgo }: { riesgo: Riesgo }) {
  const levels: Record<Riesgo, number> = {
    'Bajo': 1, 'Medio-bajo': 2, 'Medio': 3, 'Alto': 4, 'Muy alto': 5,
  }
  const { color, bg, border } = RIESGO_STYLE[riesgo]
  const filled = levels[riesgo]
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((n) => (
          <div
            key={n}
            className="rounded-sm"
            style={{
              width: 8, height: 12,
              background: n <= filled ? color : '#e5e7eb',
              opacity: n <= filled ? (0.4 + n * 0.12) : 1,
            }}
          />
        ))}
      </div>
      <span
        style={{ fontSize: 11, fontWeight: 700, color, background: bg, border: `1px solid ${border}`, padding: '1px 6px', borderRadius: 4, display: 'inline-block', whiteSpace: 'nowrap' }}
      >
        {riesgo}
      </span>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function InversionesPage() {
  const [filtro, setFiltro] = useState('todos')
  const [expandido, setExpandido] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return INSTRUMENTOS.filter((i) => {
      if (filtro === 'bajo')  return i.riesgo === 'Bajo' || i.riesgo === 'Medio-bajo'
      if (filtro === 'medio') return i.riesgo === 'Medio'
      if (filtro === 'alto')  return i.riesgo === 'Alto' || i.riesgo === 'Muy alto'
      if (filtro === 'usd')   return i.esCoberturaUSD || i.id === 'cedears'
      return true
    })
  }, [filtro])

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left */}
            <div className="flex-1 max-w-xl">
              <nav className="flex items-center gap-1 text-sm text-[#9ca3af] mb-5">
                <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
                <ChevronRight size={13} />
                <span className="text-[#6b7280]">Inversiones</span>
              </nav>
              <h1 className="font-extrabold tracking-tight text-[#1a1a1a] leading-tight mb-4" style={{ fontSize: 36 }}>
                Compará opciones de inversión<br />en Argentina
              </h1>
              <p className="text-[#6b7280] leading-relaxed mb-8" style={{ fontSize: 18 }}>
                FCI, CEDEARs y más. Sin jerga, explicado simple. Encontrá dónde poner tus ahorros según tu perfil de riesgo.
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
                Rendimientos referenciales · Actualizado mensualmente · Sin costo
              </p>
            </div>

            {/* Right */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido ────────────────────────────────────────────────── */}
      <div id="comparar" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Disclaimer educativo ────────────────────────────────────── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <p style={{ fontSize: 14, color: '#92400e' }}>
            <strong>Información educativa:</strong> Esta comparativa es orientativa y no constituye asesoramiento financiero. Los rendimientos son referenciales y no garantizados. Consultá con un asesor financiero matriculado (CNV) antes de invertir.
          </p>
        </div>

        {/* ── Perfil helper ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: '🛡',
              titulo: 'Perfil conservador',
              desc: 'Priorizás no perder dinero. Preferís rendimiento bajo pero seguro.',
              opciones: 'FCI Money Market · Plazo Fijo UVA · Dólar MEP',
              color: '#166534',
              bg: '#f0fdf4',
              border: '#86efac',
            },
            {
              icon: '⚖',
              titulo: 'Perfil moderado',
              desc: 'Aceptás algo de variación para obtener más rendimiento.',
              opciones: 'FCI Renta Fija · CEDEARs (parte)',
              color: '#1d4ed8',
              bg: '#eff6ff',
              border: '#bfdbfe',
            },
            {
              icon: '🚀',
              titulo: 'Perfil agresivo',
              desc: 'Buscás máximo rendimiento y aceptás alta volatilidad.',
              opciones: 'CEDEARs · Acciones argentinas · FCI Renta Variable',
              color: '#9a3412',
              bg: '#fff7ed',
              border: '#fdba74',
            },
          ].map((p) => (
            <div
              key={p.titulo}
              className="rounded-xl p-4"
              style={{ background: p.bg, border: `1px solid ${p.border}` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.titulo}</span>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, lineHeight: 1.5 }}>{p.desc}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: p.color }}>→ {p.opciones}</p>
            </div>
          ))}
        </div>

        {/* ── Filtros ─────────────────────────────────────────────────── */}
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
          <span className="ml-auto self-center text-xs text-[#9ca3af]">{filtered.length} instrumentos</span>
        </div>

        {/* ── Tabla ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-x-auto mb-4" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>

          {/* Header */}
          <div
            className="grid px-5 py-3 border-b border-[#f3f4f6] min-w-[820px]"
            style={{
              gridTemplateColumns: '2fr 160px 150px 130px 200px 110px',
              background: '#fafafa',
              fontSize: 12,
              fontWeight: 600,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <div>Instrumento</div>
            <div>Rendimiento ref.</div>
            <div>Liquidez</div>
            <div>Riesgo</div>
            <div>Desde dónde operar</div>
            <div />
          </div>

          {/* Rows */}
          {filtered.map((inst) => {
            const isOpen = expandido === inst.id
            return (
              <div key={inst.id} className="border-b border-[#f9fafb] last:border-b-0">
                {/* Main row */}
                <div
                  className="grid px-5 py-4 hover:bg-[#f9fafb] transition-colors min-w-[820px] items-center cursor-pointer"
                  style={{ gridTemplateColumns: '2fr 160px 150px 130px 200px 110px' }}
                  onClick={() => setExpandido(isOpen ? null : inst.id)}
                >
                  {/* Instrumento */}
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{inst.nombre}</span>
                      {inst.tag && (
                        <span style={{ fontSize: 11, fontWeight: 700, background: '#f0fdf4', color: '#166534', padding: '1px 6px', borderRadius: 4, border: '1px solid #86efac', whiteSpace: 'nowrap' }}>
                          {inst.tag}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>
                      {isOpen ? '▲' : '▼'} {isOpen ? 'Ocultar detalle' : 'Ver descripción'}
                    </p>
                  </div>

                  {/* Rendimiento */}
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: inst.esCoberturaUSD ? '#1d4ed8' : '#008000' }}>
                      {inst.rendimiento}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', lineHeight: 1.4 }}>referencial</div>
                  </div>

                  {/* Liquidez */}
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: inst.liquidezHs <= 24 ? '#008000' : inst.liquidezHs <= 48 ? '#374151' : '#92400e' }}>
                      {inst.liquidez.split('(')[0].trim()}
                    </div>
                    {inst.liquidez.includes('(') && (
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>
                        ({inst.liquidez.split('(')[1].replace(')', '')})
                      </div>
                    )}
                  </div>

                  {/* Riesgo */}
                  <RiesgoBar riesgo={inst.riesgo} />

                  {/* Desde dónde */}
                  <div className="flex flex-wrap gap-1">
                    {inst.desde.slice(0, 3).map((d) => (
                      <a
                        key={d.nombre}
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline"
                        style={{ fontSize: 12, color: '#2563eb', whiteSpace: 'nowrap' }}
                      >
                        {d.nombre}
                        {inst.desde.indexOf(d) < inst.desde.slice(0, 3).length - 1 && <span style={{ color: '#9ca3af' }}>,</span>}
                      </a>
                    ))}
                    {inst.desde.length > 3 && (
                      <span style={{ fontSize: 12, color: '#9ca3af' }}>+{inst.desde.length - 3} más</span>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href={inst.desde[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg font-semibold text-white transition-colors whitespace-nowrap"
                    style={{ background: '#1a5c38', fontSize: 13 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
                  >
                    Empezar
                    <ExternalLink size={12} />
                  </a>
                </div>

                {/* Expandido */}
                {isOpen && (
                  <div className="px-5 pb-5 min-w-[820px] bg-[#f9fafb] border-t border-[#f3f4f6]">
                    <div className="flex flex-col sm:flex-row gap-6 pt-4">
                      {/* Descripción */}
                      <div className="flex-1">
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>¿Qué es?</h4>
                        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{inst.descripcion}</p>
                      </div>
                      {/* Rendimiento detalle */}
                      <div style={{ minWidth: 220 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>Sobre el rendimiento</h4>
                        <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{inst.rendimientoDetalle}</p>
                        {/* Todos los brokers */}
                        {inst.desde.length > 0 && (
                          <div className="mt-3">
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>Dónde operar:</p>
                            <div className="flex flex-wrap gap-2">
                              {inst.desde.map((d) => (
                                <a
                                  key={d.nombre}
                                  href={d.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border hover:border-[#86efac] hover:text-[#1a1a1a] transition-colors"
                                  style={{ fontSize: 12, color: '#2563eb', borderColor: '#e5e7eb', background: 'white' }}
                                >
                                  {d.nombre}
                                  <ExternalLink size={9} />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── Disclaimer legal ────────────────────────────────────────── */}
        <div className="bg-[#f9fafb] border border-[#e5e7eb] rounded-xl p-5 mt-6">
          <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>⚠ Aviso importante</p>
          <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.7 }}>
            Esta información es <strong>educativa</strong> y no constituye asesoramiento financiero, recomendación de inversión ni oferta de compra o venta de ningún instrumento financiero.
            Los rendimientos pasados no garantizan rendimientos futuros. Los instrumentos financieros implican riesgos, incluida la posible pérdida del capital invertido.
            <strong> Consultá con un asesor financiero independiente matriculado ante la CNV antes de tomar cualquier decisión de inversión.</strong>
          </p>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
            Rendimientos referenciales al {FINANCIAL_CONSTANTS.ULTIMA_ACTUALIZACION}. Sujetos a cambios sin previo aviso. rateargy no es una entidad financiera regulada.
          </p>
        </div>

      </div>
    </div>
  )
}
