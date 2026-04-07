const STATS = [
  { value: '200+', label: 'Productos comparados', description: 'Tarjetas, cuentas, préstamos y más' },
  { value: '100%', label: 'Gratis', description: 'Sin costo, sin registro obligatorio' },
  { value: '24hs', label: 'Siempre actualizado', description: 'Tasas y datos al día con el mercado' },
  { value: '15k+', label: 'Usuarios activos', description: 'Argentinos que ya mejoraron sus finanzas' },
]

export default function StatsSection() {
  return (
    <section className="py-14 bg-[#f7f8fa] border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#e5e7eb]">
          {STATS.map((stat, i) => (
            <div key={i} className="px-6 first:pl-0 last:pr-0 py-2">
              <div className="font-extrabold text-3xl text-[#1DB954] tracking-tight mb-0.5">
                {stat.value}
              </div>
              <div className="font-semibold text-sm text-[#1a1a1a] mb-0.5">{stat.label}</div>
              <div className="text-xs text-[#9ca3af]">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
