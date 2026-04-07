import Link from 'next/link'
import { ExternalLink, Check } from 'lucide-react'
import { TARJETAS_MOCK } from '@/lib/data'
import BankLogo from '@/components/BankLogo'

const TOP_CARDS = TARJETAS_MOCK.slice(0, 5)

export default function TopCards() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="font-extrabold text-2xl md:text-3xl text-[#1a1a1a] tracking-tight mb-1">
              Mejores tarjetas del mes
            </h2>
            <p className="text-[#6b7280] text-sm">
              Ranking basado en beneficios, costo y experiencia de usuario.
            </p>
          </div>
          <Link href="/tarjetas" className="shrink-0 text-sm font-semibold text-[#1DB954] hover:text-[#17a349] transition-colors">
            Ver todas →
          </Link>
        </div>

        {/* Column headers */}
        <div className="hidden md:grid md:grid-cols-[2rem_220px_1fr_120px_120px] gap-4 items-center px-5 pb-2 border-b border-[#e5e7eb]">
          <div />
          <div className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Tarjeta</div>
          <div className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Beneficios destacados</div>
          <div className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Costo</div>
          <div />
        </div>

        <div className="divide-y divide-[#f3f4f6]">
          {TOP_CARDS.map((card, index) => {
            const isBest = index === 0
            return (
              <div
                key={card.id}
                className={`group relative grid grid-cols-1 md:grid-cols-[2rem_220px_1fr_120px_120px] gap-4 items-center py-5 px-5 rounded-xl transition-colors hover:bg-[#f0fdf4] ${
                  isBest ? 'border border-[#86efac] bg-[#f0fdf4] mt-3' : ''
                }`}
              >
                {isBest && (
                  <span className="absolute -top-2.5 left-5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1DB954] text-white">
                    Mejor elección
                  </span>
                )}

                {/* Rank */}
                <div className="hidden md:flex items-center justify-center">
                  <span className="text-sm font-semibold text-[#9ca3af]">{index + 1}</span>
                </div>

                {/* Identity */}
                <div className="flex items-center gap-3">
                  <BankLogo domain={card.logo_domain} name={card.banco} size={40} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-[#1a1a1a] truncate">{card.nombre}</span>
                      {card.tag && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1DB954]/10 text-[#15803d] shrink-0">
                          {card.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
                      <span className="text-xs text-[#9ca3af]">{card.banco}</span>
                      <span className="text-[#e5e7eb]">·</span>
                      <span className="font-bold text-sm text-[#1a1a1a]">{card.puntuacion.toFixed(1)}</span>
                      <span className="text-xs text-[#9ca3af]">/10</span>
                      {card.red && (
                        <>
                          <span className="text-[#e5e7eb]">·</span>
                          <span className="text-xs text-[#9ca3af]">{card.red}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <ul className="hidden md:flex flex-col gap-1">
                  {card.beneficios.slice(0, 3).map((b, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#6b7280]">
                      <Check size={11} className="text-[#1DB954] shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Cost */}
                <div className="hidden md:block">
                  <div className="text-xs text-[#9ca3af] mb-0.5">Mensual</div>
                  <div className="font-semibold text-sm">
                    {card.costo_mensual === 0 ? (
                      <span className="text-[#1DB954]">Sin costo</span>
                    ) : (
                      <span className="text-[#1a1a1a]">${card.costo_mensual.toLocaleString('es-AR')}</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div>
                  <a
                    href={card.url_afiliado}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white transition-colors whitespace-nowrap ${
                      isBest ? 'bg-[#1DB954] hover:bg-[#17a349]' : 'bg-[#1a1a1a] hover:bg-[#374151]'
                    }`}
                  >
                    Solicitar
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-[#f3f4f6]">
          <p className="text-xs text-[#9ca3af]">
            * Ranking actualizado mensualmente. Condiciones y tasas sujetas a cambios por parte de cada entidad. Algunos links son de afiliados.
          </p>
        </div>
      </div>
    </section>
  )
}
