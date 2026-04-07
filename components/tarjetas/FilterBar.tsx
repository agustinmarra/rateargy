'use client'

import { PerfilUso } from '@/lib/types'

const FILTROS: { value: PerfilUso; label: string }[] = [
  { value: 'todos', label: 'Todas' },
  { value: 'viajes', label: 'Viajes' },
  { value: 'dia-a-dia', label: 'Día a día' },
  { value: 'sin-costo', label: 'Sin costo' },
  { value: 'cuotas', label: 'Cuotas' },
]

interface FilterBarProps {
  selected: PerfilUso
  onChange: (value: PerfilUso) => void
  total: number
}

export default function FilterBar({ selected, onChange, total }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => onChange(f.value)}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
              selected === f.value
                ? 'bg-[#1DB954] text-white'
                : 'bg-white text-[#6b7280] border border-[#e5e7eb] hover:border-[#86efac] hover:text-[#1a1a1a]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <span className="text-xs text-[#9ca3af] shrink-0">
        {total} tarjeta{total !== 1 ? 's' : ''}
      </span>
    </div>
  )
}
