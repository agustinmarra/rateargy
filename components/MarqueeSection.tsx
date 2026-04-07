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
  return [...items, ...items, ...items, ...items].join('   ✦   ') + '   ✦   '
}

export default function MarqueeSection() {
  const textTop = buildText(ROW_TOP)
  const textBottom = buildText(ROW_BOTTOM)

  return (
    /* Non-skewed overflow clip wrapper */
    <div style={{ overflow: 'hidden' }} className="select-none">
      {/* Skewed background container — negative margin compensates the tilt gap */}
      <div
        style={{
          background: '#1a3d2b',
          transform: 'skewY(-2deg)',
          marginTop: '-24px',
          marginBottom: '-24px',
          paddingTop: '48px',
          paddingBottom: '48px',
        }}
      >
        {/* Counter-skew so content stays perfectly horizontal */}
        <div style={{ transform: 'skewY(2deg)' }}>
          {/* Row 1 — right to left */}
          <div style={{ overflow: 'hidden', paddingBottom: 12 }}>
            <div
              className="marquee-left whitespace-nowrap"
              style={{
                color: '#4ade80',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '3px',
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              {textTop}
            </div>
          </div>

          {/* Row 2 — left to right */}
          <div style={{ overflow: 'hidden' }}>
            <div
              className="marquee-right whitespace-nowrap"
              style={{
                color: '#4ade80',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '3px',
                opacity: 0.7,
                paddingTop: 12,
                paddingBottom: 12,
              }}
            >
              {textBottom}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
