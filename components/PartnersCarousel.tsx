'use client'

import BankLogo from '@/components/BankLogo'

const PARTNERS = [
  'Banco Galicia',
  'BBVA Argentina',
  'Santander Argentina',
  'Naranja X',
  'Ualá',
  'Mercado Pago',
  'ICBC Argentina',
  'HSBC Argentina',
  'Banco Macro',
  'Banco Provincia',
  'Lemon Cash',
  'Brubank',
  'Personal Pay',
  'Banco Nación',
]

// Duplicate for seamless loop
const TRACK = [...PARTNERS, ...PARTNERS]

export default function PartnersCarousel() {
  return (
    <section className="py-10 bg-white border-t border-[#f3f4f6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <p className="text-xs font-semibold text-[#9ca3af] uppercase tracking-widest text-center">
          Productos que aparecen en rateargy
        </p>
      </div>

      <div className="overflow-hidden partners-wrap">
        <div className="partners-track flex items-center gap-10 w-max">
          {TRACK.map((name, i) => (
            <div
              key={i}
              className="partners-logo shrink-0"
              style={{ filter: 'grayscale(100%) opacity(0.45)', transition: 'filter 0.25s ease' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.filter = 'grayscale(0%) opacity(1)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.filter = 'grayscale(100%) opacity(0.45)'
              }}
            >
              <BankLogo name={name} size={48} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
