'use client'

import { Check, ExternalLink } from 'lucide-react'
import { Producto } from '@/lib/types'
import BankLogo from '@/components/BankLogo'

interface CardItemProps {
  card: Producto
  rank: number
}

const RED_BADGE: Record<string, string> = {
  Visa: 'bg-[#1a1f71] text-white',
  Mastercard: 'bg-[#eb001b] text-white',
  Amex: 'bg-[#007bc1] text-white',
}

export default function CardItem({ card, rank }: CardItemProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] hover:border-[#86efac] hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f3f4f6]">
        <div className="flex items-center gap-3 min-w-0">
          <BankLogo domain={card.logo_domain} name={card.banco} size={40} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-[#1a1a1a] leading-tight">{card.nombre}</span>
              {card.red && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${RED_BADGE[card.red] ?? 'bg-[#f3f4f6] text-[#6b7280]'}`}>
                  {card.red}
                </span>
              )}
            </div>
            <span className="text-xs text-[#9ca3af] leading-tight">{card.banco}</span>
          </div>
        </div>

        {/* Score + rank */}
        <div className="text-right shrink-0 ml-3">
          <div className="flex items-baseline gap-0.5 justify-end">
            <span className="font-bold text-xl text-[#1a1a1a] leading-none">{card.puntuacion.toFixed(1)}</span>
            <span className="text-xs text-[#9ca3af]">/10</span>
          </div>
          <div className="text-[10px] text-[#9ca3af] mt-0.5">#{rank}</div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex flex-col flex-1">
        {card.tag && (
          <span className="inline-block self-start text-[10px] font-semibold px-2 py-0.5 rounded bg-[#1DB954]/10 text-[#15803d] mb-3">
            {card.tag}
          </span>
        )}

        <p className="text-xs text-[#6b7280] leading-relaxed mb-4">{card.descripcion}</p>

        <ul className="space-y-1.5 mb-5 flex-1">
          {card.beneficios.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-[#6b7280]">
              <Check size={12} className="text-[#1DB954] shrink-0 mt-0.5" />
              {b}
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6] mt-auto">
          <div>
            <div className="text-[10px] text-[#9ca3af] mb-0.5">Costo mensual</div>
            <div className="font-semibold text-sm">
              {card.costo_mensual === 0 ? (
                <span className="text-[#1DB954]">Sin costo</span>
              ) : (
                <span className="text-[#1a1a1a]">${card.costo_mensual.toLocaleString('es-AR')}</span>
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
