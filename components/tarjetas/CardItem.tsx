'use client'

import { useState } from 'react'
import { ExternalLink, Star, Check } from 'lucide-react'
import { Producto } from '@/lib/types'
import BankLogo from '@/components/BankLogo'

interface CardItemProps {
  card: Producto
  rank: number
  isBestChoice?: boolean
  bestChoiceLabel?: string
  isComparing?: boolean
  onToggleCompare?: (id: string) => void
}

// Gradientes que simulan la tarjeta física — actualizados para cada banco
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
        height: 126,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        boxShadow: `0 8px 24px ${c1}55`,
      }}
    >
      {/* Brillo diagonal */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ background: 'linear-gradient(135deg, white 0%, transparent 55%)' }}
      />
      {/* Chip */}
      <div className="absolute top-3 left-3">
        <div
          className="w-8 h-5 rounded-sm opacity-85"
          style={{
            background: 'linear-gradient(135deg, #FFD700, #B8860B)',
            boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.4)',
          }}
        />
      </div>
      {/* Red de pago */}
      {card.red && (
        <div className="absolute top-3 right-3">
          <span className="text-white/90 text-[9px] font-black tracking-wider">{card.red}</span>
        </div>
      )}
      {/* Info inferior */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="text-white/60 text-[8px] font-medium truncate">{card.banco}</div>
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
          size={12}
          className={i < filled ? 'fill-[#008000] text-[#008000]' : 'fill-[#e5e7eb] text-[#e5e7eb]'}
        />
      ))}
      <span className="text-xs text-[#6b7280] ml-1 font-medium">{score.toFixed(1)} rateargy rating</span>
    </div>
  )
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2.5 border border-[#f3f4f6]">
      <div className="text-[9px] font-semibold text-[#9ca3af] uppercase tracking-wide mb-0.5">
        {label}
      </div>
      <div className="text-xs font-semibold text-[#1a1a1a] leading-tight">{value}</div>
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
          ? 'border-[#008000] shadow-md shadow-[#008000]/10'
          : 'border-[#e5e7eb] hover:border-[#86efac] hover:shadow-sm'
      }`}
    >
      {/* Badge "Mejor elección" */}
      {isBestChoice && bestChoiceLabel && (
        <div className="absolute -top-px left-0 right-0 flex justify-start">
          <span className="bg-[#008000] text-white text-[10px] font-bold px-3 py-0.5 rounded-b-md ml-4">
            ✦ Nuestra elección para: {bestChoiceLabel}
          </span>
        </div>
      )}

      <div className={`flex flex-col lg:flex-row gap-5 p-5 ${isBestChoice ? 'pt-7' : ''}`}>
        {/* ── Col 1: Tarjeta visual ── */}
        <div className="flex lg:flex-col items-center gap-4 lg:gap-2 shrink-0">
          <CardVisual card={card} />
          <div className="hidden lg:block text-center">
            <span className="text-[10px] text-[#9ca3af] font-medium">#{rank} en rateargy</span>
          </div>
        </div>

        {/* ── Col 2: Identidad + rating + comparar ── */}
        <div className="flex-1 min-w-0 lg:min-w-[200px] lg:max-w-[240px]">
          <div className="flex items-start gap-2 mb-2">
            <BankLogo name={card.banco} size={32} />
            <div className="min-w-0">
              <div className="font-bold text-[15px] text-[#1a1a1a] leading-tight">{card.nombre}</div>
              <div className="text-xs text-[#9ca3af] mt-0.5">{card.banco}</div>
            </div>
          </div>

          <div className="mt-2 mb-3">
            <StarRating score={card.puntuacion} />
          </div>

          {card.tag && (
            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded bg-[#008000]/10 text-[#166534] mb-3">
              {card.tag}
            </span>
          )}

          {/* Checkbox comparar */}
          {onToggleCompare && (
            <button
              onClick={() => onToggleCompare(card.id)}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors mt-1 ${
                isComparing ? 'text-[#008000]' : 'text-[#9ca3af] hover:text-[#1a1a1a]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isComparing ? 'border-[#008000] bg-[#008000]' : 'border-[#d1d5db]'
                }`}
              >
                {isComparing && <Check size={10} className="text-white" />}
              </div>
              {isComparing ? 'Agregada' : 'Agregar a comparar'}
            </button>
          )}
        </div>

        {/* ── Col 3: Métricas 2×2 con bordes finos ── */}
        <div className="flex-1 min-w-0">
          <div
            className="grid grid-cols-2 rounded-lg overflow-hidden border border-[#f3f4f6]"
          >
            <MetricCell label="Costo anual" value={costoAnual} />
            <MetricCell
              label="Beneficio principal"
              value={card.beneficio_principal ?? card.beneficios[0] ?? '—'}
            />
            <MetricCell
              label="Cuotas sin interés"
              value={card.cuotas_sin_interes ?? 'Consultar'}
            />
            <MetricCell
              label="Ingreso mínimo requerido"
              value={card.ingreso_minimo ?? 'Consultar'}
            />
          </div>

          {/* Beneficios adicionales */}
          <ul className="mt-3 space-y-1">
            {card.beneficios.slice(0, 3).map((b, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#6b7280]">
                <Check size={11} className="text-[#008000] shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Col 4: CTA ── */}
        <div className="flex flex-col items-center lg:items-end justify-between gap-3 shrink-0 lg:w-40">
          <div className="w-full">
            <a
              href={card.url_afiliado}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center justify-center gap-1.5 w-full px-4 py-3 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ background: '#1a5c38' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
            >
              SOLICITAR AHORA
              <ExternalLink size={13} />
            </a>
            <p className="text-[10px] text-[#9ca3af] text-center mt-1.5">en el sitio del banco</p>
          </div>

          <a
            href={card.url_afiliado}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#2563eb] hover:underline transition-colors font-medium"
          >
            Ver tasas y condiciones →
          </a>
        </div>
      </div>
    </div>
  )
}
