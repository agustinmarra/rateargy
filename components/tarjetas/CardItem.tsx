'use client'

import Link from 'next/link'
import { ExternalLink, Star, Check } from 'lucide-react'
import { Producto } from '@/lib/types'
import BankLogo from '@/components/BankLogo'
import { toSlug } from '@/lib/utils'

interface CardItemProps {
  card: Producto
  rank: number
  isBestChoice?: boolean
  bestChoiceLabel?: string
  isComparing?: boolean
  onToggleCompare?: (id: string) => void
}

const CARD_GRADIENT: Record<string, [string, string]> = {
  'ICBC Argentina':      ['#1a237e', '#283593'],
  'Banco Galicia':       ['#b71c1c', '#e53935'],
  'BBVA Argentina':      ['#004481', '#1565c0'],
  'American Express':    ['#006FCF', '#1976d2'],
  'HSBC Argentina':      ['#DB0011', '#c62828'],
  'Banco Macro':         ['#e65100', '#f57c00'],
  'Naranja X':           ['#FF6200', '#e64a19'],
  'Santander Argentina': ['#EC0000', '#b71c1c'],
  'Banco Provincia':     ['#006837', '#2e7d32'],
  'Ualá':               ['#7B2D8B', '#6a1b9a'],
  'Lemon Cash':          ['#c68b00', '#f9a825'],
  'Mercado Pago':        ['#009EE3', '#0277bd'],
  'Brubank':             ['#005f8e', '#0288d1'],
  'Personal Pay':        ['#006a84', '#00838f'],
  'Banco Nación':        ['#003F80', '#1565c0'],
}
const DEFAULT_GRADIENT: [string, string] = ['#1a5c38', '#2e7d32']

function CardVisual({ card }: { card: Producto }) {
  const [c1, c2] = CARD_GRADIENT[card.banco] ?? DEFAULT_GRADIENT
  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden"
      style={{
        width: 200,
        height: 130,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        boxShadow: `0 8px 28px ${c1}55`,
      }}
    >
      <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(135deg, white 0%, transparent 55%)' }} />
      {/* Chip */}
      <div className="absolute top-3 left-3">
        <div
          className="w-8 h-5 rounded-sm"
          style={{ background: 'linear-gradient(135deg, #FFD700, #B8860B)', opacity: 0.85 }}
        />
      </div>
      {/* Network */}
      {card.red && (
        <div className="absolute top-3 right-3">
          <span className="text-white/90 text-[9px] font-black tracking-wider">{card.red}</span>
        </div>
      )}
      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-white/55 text-[8px] font-medium truncate">{card.banco}</div>
        <div className="text-white text-[11px] font-bold leading-tight truncate">{card.nombre}</div>
      </div>
    </div>
  )
}

function StarRating({ score }: { score: number }) {
  const filled = Math.round((score / 10) * 5)
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < filled ? 'fill-[#008000] text-[#008000]' : 'fill-[#e5e7eb] text-[#e5e7eb]'}
        />
      ))}
      <span className="text-[13px] text-[#6b7280] ml-1.5 font-medium">{score.toFixed(1)} rateargy rating</span>
    </div>
  )
}

interface MetricProps {
  label: string
  value: string
  first?: boolean
}

function Metric({ label, value, first = false }: MetricProps) {
  return (
    <div
      className="flex-1 px-4 py-3 flex flex-col justify-center"
      style={{ borderLeft: first ? 'none' : '1px solid #f3f4f6' }}
    >
      <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3 }}>
        {value}
      </div>
    </div>
  )
}

export default function CardItem({
  card,
  rank,
  isBestChoice = false,
  bestChoiceLabel,
  isComparing = false,
  onToggleCompare,
}: CardItemProps) {
  const costoAnual =
    card.costo_mensual === 0
      ? 'Sin cargo anual'
      : `$${(card.costo_mensual * 12).toLocaleString('es-AR')}/año`

  return (
    <div
      className={`relative bg-white rounded-xl border transition-all overflow-hidden ${
        isBestChoice
          ? 'border-[#008000]'
          : 'border-[#e5e7eb] hover:border-[#86efac]'
      }`}
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', minHeight: 200 }}
    >
      {/* Badge */}
      {isBestChoice && bestChoiceLabel && (
        <div className="absolute -top-px left-0 right-0 flex justify-start">
          <span
            className="text-white text-[11px] font-bold px-3 py-1 rounded-b-md ml-4"
            style={{ background: '#008000' }}
          >
            ✦ Nuestra elección para: {bestChoiceLabel}
          </span>
        </div>
      )}

      <div className={`p-5 ${isBestChoice ? 'pt-8' : ''}`}>
        {/* ── Top row: card visual + identity + CTA ── */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Col 1: Card visual */}
          <div className="shrink-0 flex flex-col gap-2 items-start">
            <CardVisual card={card} />
            <span className="text-[12px] text-[#9ca3af] font-medium">#{rank} en rateargy</span>
          </div>

          {/* Col 2: Identity + rating + compare */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2.5 mb-2">
              <BankLogo name={card.banco} size={36} />
              <div className="min-w-0">
                <Link
                  href={`/tarjetas/${toSlug(card.nombre + '-' + card.banco)}`}
                  className="font-bold text-[#1a1a1a] leading-tight hover:text-[#008000] transition-colors"
                  style={{ fontSize: 22, display: 'block' }}
                >
                  {card.nombre}
                </Link>
                <div style={{ fontSize: 16, color: '#6b7280', marginTop: 2 }}>{card.banco}</div>
              </div>
            </div>

            <div className="mt-2 mb-3">
              <StarRating score={card.puntuacion} />
            </div>

            {card.tag && (
              <span
                className="inline-block font-semibold px-2 py-0.5 rounded mb-2"
                style={{ fontSize: 12, background: 'rgba(0,128,0,0.08)', color: '#166534' }}
              >
                {card.tag}
              </span>
            )}

            {/* Benefits list */}
            <ul className="space-y-1 mt-1">
              {card.beneficios.slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-start gap-1.5" style={{ fontSize: 13, color: '#6b7280' }}>
                  <Check size={12} className="text-[#008000] shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>

            {/* Compare checkbox */}
            {onToggleCompare && (
              <button
                onClick={() => onToggleCompare(card.id)}
                className="flex items-center gap-1.5 mt-3 font-medium transition-colors"
                style={{ fontSize: 13, color: isComparing ? '#008000' : '#9ca3af' }}
              >
                <div
                  className="w-4 h-4 rounded border flex items-center justify-center transition-colors"
                  style={{
                    borderColor: isComparing ? '#008000' : '#d1d5db',
                    background: isComparing ? '#008000' : 'transparent',
                  }}
                >
                  {isComparing && <Check size={10} className="text-white" />}
                </div>
                {isComparing ? 'Agregada' : 'Agregar a comparar'}
              </button>
            )}
          </div>

          {/* Col 3: CTA */}
          <div className="shrink-0 flex flex-col items-stretch lg:items-end justify-start gap-3" style={{ minWidth: 160 }}>
            <a
              href={card.url_afiliado}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center justify-center gap-1.5 w-full rounded-lg font-bold text-white uppercase transition-colors"
              style={{
                background: '#1a5c38',
                height: 48,
                fontSize: 14,
                letterSpacing: '0.04em',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
            >
              Solicitar ahora
              <ExternalLink size={14} />
            </a>
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>en el sitio del banco</p>
            <a
              href={card.url_afiliado}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline transition-colors text-center"
              style={{ fontSize: 13, color: '#2563eb', fontWeight: 500 }}
            >
              Ver tasas y condiciones →
            </a>
          </div>
        </div>

        {/* ── Metrics row — NerdWallet style horizontal ── */}
        <div
          className="flex mt-4 rounded-lg overflow-hidden"
          style={{ border: '1px solid #f3f4f6', background: '#fafafa' }}
        >
          <Metric first label="Costo anual" value={costoAnual} />
          <Metric label="Beneficio principal" value={card.beneficio_principal ?? card.beneficios[0] ?? '—'} />
          <Metric label="Cuotas sin interés" value={card.cuotas_sin_interes ?? 'Consultar'} />
          <Metric label="Ingreso mínimo" value={card.ingreso_minimo ?? 'Consultar'} />
        </div>
      </div>
    </div>
  )
}
