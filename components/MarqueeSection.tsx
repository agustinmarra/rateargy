const ROW_TOP = [
  'COMPARAMOS TODO',
  'LOS DATOS SON OFICIALES',
  'SIEMPRE GRATIS',
  'INFORMACIÓN DEL BCRA',
  'ACTUALIZAMOS CADA DÍA',
  '200+ PRODUCTOS',
  'SIN LETRA CHICA',
  'RANKING INDEPENDIENTE',
]

const ROW_BOTTOM = [
  'TARJETAS DE CRÉDITO',
  'CUENTAS BANCARIAS',
  'PRÉSTAMOS PERSONALES',
  'SEGUROS DE AUTO',
  'INVERSIONES',
  'BILLETERAS VIRTUALES',
  'CRÉDITOS HIPOTECARIOS',
  'PLAZOS FIJOS',
]

function buildText(items: string[]) {
  return [...items, ...items, ...items, ...items].join('  ·  ') + '  ·  '
}

export default function MarqueeSection() {
  const textTop = buildText(ROW_TOP)
  const textBottom = buildText(ROW_BOTTOM)

  return (
    <div
      className="marquee-wrap overflow-hidden py-4 select-none"
      style={{ background: '#1a5c38' }}
    >
      {/* Row 1 — right to left */}
      <div className="overflow-hidden mb-2">
        <div className="marquee-right whitespace-nowrap font-black text-sm tracking-widest"
          style={{ color: '#4ade80' }}>
          {textTop}
        </div>
      </div>

      {/* Row 2 — left to right */}
      <div className="overflow-hidden">
        <div className="marquee-left whitespace-nowrap font-black text-sm tracking-widest"
          style={{ color: '#4ade80', opacity: 0.75 }}>
          {textBottom}
        </div>
      </div>
    </div>
  )
}
