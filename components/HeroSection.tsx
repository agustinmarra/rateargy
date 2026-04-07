import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

function HeroIllustration() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">
      {/* Main dashboard card */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-5 z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] text-[#9ca3af] font-medium uppercase tracking-wide">Panel financiero</p>
            <p className="font-bold text-[#1a1a1a] text-base">Mis productos</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center">
            <span className="text-[#008000] font-extrabold text-xs">R</span>
          </div>
        </div>

        {/* Line chart simulation */}
        <div className="relative h-20 mb-4 bg-[#f0fdf4] rounded-lg overflow-hidden">
          <svg viewBox="0 0 220 60" className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            <line x1="0" y1="20" x2="220" y2="20" stroke="#d1fae5" strokeWidth="0.5" />
            <line x1="0" y1="40" x2="220" y2="40" stroke="#d1fae5" strokeWidth="0.5" />
            {/* Fill area */}
            <path
              d="M0 55 L30 48 L60 42 L90 35 L120 28 L150 20 L180 14 L220 8 L220 60 L0 60 Z"
              fill="url(#chartGrad)"
              opacity="0.35"
            />
            {/* Line */}
            <path
              d="M0 55 L30 48 L60 42 L90 35 L120 28 L150 20 L180 14 L220 8"
              fill="none"
              stroke="#008000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Dot at end */}
            <circle cx="220" cy="8" r="3.5" fill="#008000" />
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#008000" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#008000" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          {/* Label */}
          <div className="absolute top-2 left-2.5">
            <span className="text-[10px] font-bold text-[#166534]">Ahorro acumulado ↑</span>
          </div>
        </div>

        {/* Mejor tarjeta row */}
        <div className="flex items-center justify-between py-2.5 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-6 rounded"
              style={{ background: 'linear-gradient(135deg, #1a237e, #283593)' }}
            />
            <div>
              <p className="text-xs font-semibold text-[#1a1a1a]">Visa Signature ICBC</p>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="8" height="8" viewBox="0 0 12 12" fill="#008000">
                    <path d="M6 0l1.5 4h4l-3.3 2.4 1.3 4L6 8 2.5 10.4l1.3-4L.5 4h4z" />
                  </svg>
                ))}
                <span className="text-[9px] text-[#6b7280] ml-0.5">9.4</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-bold text-[#008000]">Gratis</span>
        </div>

        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-6 rounded"
              style={{ background: 'linear-gradient(135deg, #006837, #2e7d32)' }}
            />
            <div>
              <p className="text-xs font-semibold text-[#1a1a1a]">Cuenta Gratuita MP</p>
              <p className="text-[9px] text-[#9ca3af]">Billetera virtual</p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#008000]">Sin costo</span>
        </div>
      </div>

      {/* Floating card — dólar */}
      <div className="absolute -bottom-4 -left-6 bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 z-20">
        <p className="text-[10px] text-[#9ca3af] font-medium mb-0.5">USD Blue hoy</p>
        <p className="font-bold text-lg text-[#1a1a1a] leading-none">$1.285</p>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] text-[#008000] font-semibold">↑ +0.4%</span>
        </div>
      </div>

      {/* Floating card — ahorro */}
      <div className="absolute -top-4 -right-4 bg-[#f0fdf4] rounded-xl shadow-md border border-[#bbf7d0] px-4 py-3 z-20">
        <p className="text-[10px] text-[#166534] font-medium">Ahorrás hasta</p>
        <p className="font-bold text-lg text-[#166534] leading-none">$48.000</p>
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
              <span style={{ color: '#008000' }}>financieras</span>
              <br />
              en Argentina.
            </h1>

            <p className="text-[#6b7280] text-lg mb-8 leading-relaxed max-w-md">
              Comparamos tarjetas, cuentas, préstamos e inversiones para que elijas siempre la mejor opción.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/tarjetas"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-sm font-semibold text-white transition-colors"
                style={{ background: '#1a5c38' }}
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
              <ShieldCheck size={14} style={{ color: '#008000' }} className="shrink-0" />
              <span>Datos del BCRA · Actualizado diariamente · Sin publicidad engañosa</span>
            </div>
          </div>

          {/* Right — dashboard mockup */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  )
}
