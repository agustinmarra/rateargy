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
  return [...items, ...items, ...items, ...items].join('  ✦  ') + '  ✦  '
}

export default function MarqueeSection() {
  const textTop = buildText(ROW_TOP)
  const textBottom = buildText(ROW_BOTTOM)

  return (
    /* outer: skewed -2deg como NerdWallet */
    <div
      className="overflow-hidden select-none"
      style={{
        background: '#1a5c38',
        transform: 'skewY(-2deg)',
        margin: '0 0',
        padding: '2rem 0',
      }}
    >
      {/* inner: counter-skew so text stays horizontal */}
      <div style={{ transform: 'skewY(2deg)' }}>
        {/* Row 1 — right to left */}
        <div className="overflow-hidden mb-3">
          <div
            className="marquee-left whitespace-nowrap font-black tracking-[2px]"
            style={{ color: '#4ade80', fontSize: 14 }}
          >
            {textTop}
          </div>
        </div>

        {/* Row 2 — left to right */}
        <div className="overflow-hidden">
          <div
            className="marquee-right whitespace-nowrap font-black tracking-[2px]"
            style={{ color: '#4ade80', fontSize: 14, opacity: 0.75 }}
          >
            {textBottom}
          </div>
        </div>
      </div>
    </div>
  )
}
