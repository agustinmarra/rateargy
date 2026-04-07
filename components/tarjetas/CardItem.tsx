'use client'

import { Check, ExternalLink } from 'lucide-react'
import { Producto } from '@/lib/types'

interface CardItemProps {
  card: Producto
  rank: number
}

export default function CardItem({ card, rank }: CardItemProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] hover:border-[#86efac] hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f3f4f6]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-8 rounded border border-[#e5e7eb] bg-[#f7f8fa] flex items-center justify-center shrink-0">
            <span className="text-[9px] font-bold text-[#6b7280] uppercase tracking-tight">
              {card.red}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-[#1a1a1a]">{card.nombre}</span>
              {card.tag && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1DB954]/10 text-[#15803d]">
                  {card.tag}
                </span>
              )}
            </div>
            <span className="text-xs text-[#9ca3af]">{card.banco}</span>
          </div>
        </div>

        {/* Score */}
        <div className="text-right shrink-0 ml-2">
          <div className="flex items-baseline gap-0.5 justify-end">
            <span className="font-bold text-xl text-[#1a1a1a] leading-none">
              {card.puntuacion.toFixed(1)}
            </span>
            <span className="text-xs text-[#9ca3af]">/10</span>
          </div>
          <div className="text-[10px] text-[#9ca3af] mt-0.5">#{rank}</div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-xs text-[#6b7280] leading-relaxed mb-4">{card.descripcion}</p>

        <ul className="space-y-1.5 mb-5">
          {card.beneficios.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#6b7280]">
              <Check size={12} className="text-[#1DB954] shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6]">
          <div>
            <div className="text-[10px] text-[#9ca3af] mb-0.5">Costo mensual</div>
            <div className="font-semibold text-sm text-[#1a1a1a]">
              {card.costo_mensual === 0 ? (
                <span className="text-[#1DB954]">Sin costo</span>
              ) : (
                `$${card.costo_mensual.toLocaleString('es-AR')}`
              )}
            </div>
          </div>
          <a
            href={card.url_afiliado}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-[#1DB954] hover:bg-[#17a349] transition-colors"
          >
            Solicitar
            <ExternalLink size={11} />
          </a>
        </div>
      </div>
    </div>
  )
}
