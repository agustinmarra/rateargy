import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Floating card 1 — main */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#6b7280] font-medium">Mejor tarjeta del mes</p>
            <p className="font-bold text-[#1a1a1a] text-base">Visa Signature ICBC</p>
          </div>
          <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#1DB954] to-[#17a349] flex items-center justify-center">
            <span className="text-[8px] text-white font-bold">VISA</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="#1DB954">
              <path d="M6 0l1.5 4h4l-3.3 2.4 1.3 4L6 8 2.5 10.4l1.3-4L.5 4h4z" />
            </svg>
          ))}
          <span className="text-xs text-[#6b7280] ml-1">9.4/10</span>
        </div>
        <div className="space-y-1.5">
          {['Salas VIP gratis', 'Sin costo anual', '3x puntos en viajes'].map((b) => (
            <div key={b} className="flex items-center gap-2 text-xs text-[#6b7280]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shrink-0" />
              {b}
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-[#6b7280]">Costo mensual</span>
          <span className="text-sm font-bold text-[#1DB954]">Gratis</span>
        </div>
      </div>

      {/* Floating card 2 — dólar data */}
      <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 z-20">
        <p className="text-[10px] text-[#9ca3af] font-medium mb-1">USD Blue hoy</p>
        <p className="font-bold text-lg text-[#1a1a1a] leading-none">$1.285</p>
        <div className="flex items-center gap-1 mt-0.5">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="#1DB954">
            <path d="M5 1l1.2 3.2H9.5L6.9 6.1l.9 3L5 7.4 2.2 9.1l.9-3L.5 4.2h3.3z" />
          </svg>
          <span className="text-[10px] text-[#1DB954] font-semibold">+0.4%</span>
        </div>
      </div>

      {/* Floating card 3 — ahorro */}
      <div className="absolute -top-4 -right-4 bg-[#f0fdf4] rounded-xl shadow-md border border-[#bbf7d0] px-4 py-3 z-20">
        <p className="text-[10px] text-[#15803d] font-medium">Ahorrás hasta</p>
        <p className="font-bold text-lg text-[#15803d] leading-none">$48.000</p>
        <p className="text-[10px] text-[#16a34a]">por año en comisiones</p>
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section
      className="bg-white pt-12 pb-16"
      style={{ background: 'linear-gradient(160deg, #ffffff 60%, #f0fdf4 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">
          {/* Left — copy */}
          <div className="flex-1 max-w-xl">
            <h1 className="font-extrabold text-4xl md:text-5xl lg:text-[3.25rem] text-[#1a1a1a] leading-[1.1] tracking-tight mb-5">
              Tomá mejores
              <br />
              decisiones{' '}
              <span className="text-[#1DB954]">financieras</span>
              <br />
              en Argentina.
            </h1>

            <p className="text-[#6b7280] text-lg mb-8 leading-relaxed max-w-md">
              Comparamos tarjetas, cuentas, préstamos e inversiones para que elijas siempre la mejor opción.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/tarjetas"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-[#1DB954] hover:bg-[#17a349] transition-colors"
              >
                Comparar tarjetas
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/prestamos"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-[#1a1a1a] bg-white border border-[#e5e7eb] hover:bg-[#f7f8fa] transition-colors"
              >
                Ver préstamos
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#9ca3af]">
              <ShieldCheck size={14} className="text-[#1DB954] shrink-0" />
              <span>Datos del BCRA · Actualizado diariamente · Sin publicidad engañosa</span>
            </div>
          </div>

          {/* Right — illustration */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}
