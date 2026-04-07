'use client'

import { useState, useMemo } from 'react'
import { PRESTAMOS_MOCK } from '@/lib/data'
import { Check, ExternalLink, Info, AlertTriangle } from 'lucide-react'
import BankLogo from '@/components/BankLogo'

const FILTROS = [
  { value: 'todos', label: 'Todos' },
  { value: 'rapido', label: 'Aprobación rápida' },
  { value: 'digital', label: '100% digital' },
  { value: 'mayor-plazo', label: 'Mayor plazo' },
  { value: 'estado', label: 'Banco estatal' },
]

const FILTRO_MAP: Record<string, (p: typeof PRESTAMOS_MOCK[0]) => boolean> = {
  todos: () => true,
  rapido: (p) =>
    p.beneficios.some((b) => b.toLowerCase().includes('minuto') || b.toLowerCase().includes('instant') || b.toLowerCase().includes('rápida')),
  digital: (p) =>
    p.beneficios.some((b) => b.toLowerCase().includes('online') || b.toLowerCase().includes('app') || b.toLowerCase().includes('digital')),
  'mayor-plazo': (p) =>
    p.beneficios.some((b) => b.toLowerCase().includes('72') || b.toLowerCase().includes('60')),
  estado: (p) => ['Banco Nación', 'Banco Provincia'].includes(p.banco),
}

export default function PrestamosPage() {
  const [filtro, setFiltro] = useState('todos')

  const filtered = useMemo(() => {
    return PRESTAMOS_MOCK.filter(FILTRO_MAP[filtro]).sort((a, b) => b.puntuacion - a.puntuacion)
  }, [filtro])

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[#1DB954] font-semibold text-xs uppercase tracking-widest mb-2">Comparador</p>
          <h1 className="font-extrabold text-3xl md:text-4xl text-[#1a1a1a] tracking-tight mb-2">
            Préstamos personales
          </h1>
          <p className="text-[#6b7280] text-base max-w-xl">
            Comparamos los mejores préstamos personales de Argentina por proceso, monto y condiciones.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
          <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">Importante:</span> Las tasas (TNA/CFT) varían frecuentemente según la política del BCRA y el perfil del solicitante. Siempre verificá la <strong>tasa vigente y el CFT</strong> directamente con el banco antes de firmar.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4 mb-7">
          <Info size={15} className="text-[#1DB954] mt-0.5 shrink-0" />
          <p className="text-sm text-[#374151]">
            <span className="font-semibold text-[#1a1a1a]">¿Cómo comparamos?</span> Evaluamos proceso de solicitud, monto máximo, plazo, requisitos y experiencia del cliente. No publicamos tasas específicas porque cambian constantemente.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value)}
                className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filtro === f.value
                    ? 'bg-[#1DB954] text-white'
                    : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:border-[#86efac] hover:text-[#1a1a1a]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#9ca3af] shrink-0">{filtered.length} préstamos</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((prestamo, index) => (
            <div
              key={prestamo.id}
              className="bg-white rounded-xl border border-[#e5e7eb] hover:border-[#86efac] hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-[#f3f4f6]">
                <div className="flex items-center gap-3 min-w-0">
                  <BankLogo name={prestamo.banco} size={40} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className="font-semibold text-sm text-[#1a1a1a] leading-tight">{prestamo.nombre}</span>
                      {prestamo.tag && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#1DB954]/10 text-[#15803d] shrink-0">
                          {prestamo.tag}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#9ca3af]">{prestamo.banco}</span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div className="flex items-baseline gap-0.5 justify-end">
                    <span className="font-bold text-xl text-[#1a1a1a] leading-none">{prestamo.puntuacion.toFixed(1)}</span>
                    <span className="text-xs text-[#9ca3af]">/10</span>
                  </div>
                  <div className="text-[10px] text-[#9ca3af] mt-0.5">#{index + 1}</div>
                </div>
              </div>

              <div className="px-5 py-4 flex flex-col flex-1">
                <p className="text-xs text-[#6b7280] leading-relaxed mb-4">{prestamo.descripcion}</p>
                <ul className="space-y-1.5 mb-5 flex-1">
                  {prestamo.beneficios.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#6b7280]">
                      <Check size={12} className="text-[#1DB954] shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between pt-4 border-t border-[#f3f4f6] mt-auto">
                  <div>
                    <div className="text-[10px] text-[#9ca3af] mb-0.5">Tasa</div>
                    <div className="font-semibold text-xs text-[#6b7280]">Consultá tasa vigente</div>
                  </div>
                  <a
                    href={prestamo.url_afiliado}
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
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#e5e7eb]">
          <p className="text-xs text-[#9ca3af] text-center max-w-2xl mx-auto">
            Las tasas, montos y condiciones son referenciales y sujetos a cambio. Verificá siempre la tasa vigente y el CFT antes de contratar. Algunos links son de afiliados.
          </p>
        </div>
      </div>
    </div>
  )
}
