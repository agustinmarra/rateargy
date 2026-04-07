'use client'

import { useState, useMemo } from 'react'
import FilterBar from '@/components/tarjetas/FilterBar'
import CardItem from '@/components/tarjetas/CardItem'
import { TARJETAS_MOCK } from '@/lib/data'
import { PerfilUso } from '@/lib/types'
import { Info } from 'lucide-react'

const PERFIL_MAP: Record<PerfilUso, (p: typeof TARJETAS_MOCK[0]) => boolean> = {
  todos: () => true,
  viajes: (p) =>
    p.beneficios.some(
      (b) =>
        b.toLowerCase().includes('viaje') ||
        b.toLowerCase().includes('vip') ||
        b.toLowerCase().includes('aeropuerto')
    ),
  'dia-a-dia': (p) =>
    p.beneficios.some(
      (b) =>
        b.toLowerCase().includes('supermercado') ||
        b.toLowerCase().includes('día') ||
        b.toLowerCase().includes('cashback') ||
        b.toLowerCase().includes('combustible')
    ),
  'sin-costo': (p) => p.costo_mensual === 0,
  cuotas: (p) =>
    p.beneficios.some(
      (b) => b.toLowerCase().includes('cuota') || b.toLowerCase().includes('interés')
    ),
}

export default function TarjetasPage() {
  const [perfil, setPerfil] = useState<PerfilUso>('todos')
  const [comparing, setComparing] = useState<string[]>([])

  function toggleCompare(id: string) {
    setComparing((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const filtered = useMemo(() => {
    const fn = PERFIL_MAP[perfil]
    return TARJETAS_MOCK.filter(fn).sort((a, b) => b.puntuacion - a.puntuacion)
  }, [perfil])

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Page header */}
      <div className="bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-[#1DB954] font-semibold text-xs uppercase tracking-widest mb-2">
            Comparador
          </p>
          <h1 className="font-extrabold text-3xl md:text-4xl text-[#1a1a1a] tracking-tight mb-2">
            Tarjetas de crédito
          </h1>
          <p className="text-[#6b7280] text-base max-w-xl">
            Comparamos las mejores tarjetas del mercado argentino para que elijas la ideal según tu perfil.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info banner */}
        <div className="flex items-start gap-3 bg-[#f0fdf4] border border-[#86efac] rounded-xl p-4 mb-7">
          <Info size={15} className="text-[#1DB954] mt-0.5 shrink-0" />
          <p className="text-sm text-[#374151]">
            <span className="font-semibold text-[#1a1a1a]">¿Cómo elegimos?</span> Evaluamos
            beneficios, costo, red de aceptación y experiencia de usuario. Puntuaciones
            independientes de cualquier acuerdo comercial.
          </p>
        </div>

        <FilterBar selected={perfil} onChange={setPerfil} total={filtered.length} />

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-semibold text-lg text-[#1a1a1a] mb-1">Sin resultados</p>
            <p className="text-[#6b7280] text-sm">Probá cambiando el filtro de perfil.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((card, index) => (
              <CardItem
                key={card.id}
                card={card}
                rank={index + 1}
                isBestChoice={index === 0}
                bestChoiceLabel={index === 0 ? 'Viajes' : undefined}
                isComparing={comparing.includes(card.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-[#e5e7eb]">
          <p className="text-xs text-[#9ca3af] text-center max-w-2xl mx-auto">
            Algunos links son de afiliados. Si solicitás una tarjeta a través de rateargy podemos
            recibir una comisión, lo que nos permite mantener el servicio gratuito. Esto no influye
            en nuestras puntuaciones ni recomendaciones.
          </p>
        </div>
      </div>
    </div>
  )
}
