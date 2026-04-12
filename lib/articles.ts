// ─────────────────────────────────────────────────────────────────────────────
// Artículos hardcodeados — en producción reemplazar por Supabase/CMS
// ─────────────────────────────────────────────────────────────────────────────

export type CategoriaArticulo =
  | 'tarjetas'
  | 'cuentas'
  | 'prestamos'
  | 'seguros'
  | 'inversiones'
  | 'dolar'

export type ContentBlock =
  | { type: 'p';       text: string }
  | { type: 'h2';      text: string }
  | { type: 'h3';      text: string }
  | { type: 'ul';      items: string[] }
  | { type: 'ol';      items: string[] }
  | { type: 'callout'; text: string; variant: 'tip' | 'warning' | 'info' }
  | { type: 'table';   headers: string[]; rows: string[][] }

export interface AutorArticulo {
  nombre: string
  rol: string
  iniciales: string   // para el avatar circular (ej: "ER")
  color: string       // color del avatar
}

export interface Articulo {
  slug: string
  titulo: string
  subtitulo: string
  autor: AutorArticulo
  fecha: string               // "15 de marzo de 2025"
  fechaActualizacion: string  // "10 de abril de 2026"
  categoria: CategoriaArticulo
  imagen: string              // Unsplash URL
  tiempoLectura: number       // minutos
  contenido: ContentBlock[]
  articulosRelacionados: string[]  // slugs
  recursos: { label: string; href: string }[]  // sidebar links
}

// ── Autor compartido ──────────────────────────────────────────────────────────
const EQUIPO: AutorArticulo = {
  nombre: 'Equipo rateargy',
  rol: 'Redacción financiera',
  iniciales: 'ER',
  color: '#008000',
}

// ── Artículos ─────────────────────────────────────────────────────────────────
export const ARTICULOS: Articulo[] = [
  {
    slug: 'como-elegir-tarjeta-de-credito-argentina-2025',
    titulo: 'Cómo elegir tu tarjeta de crédito en Argentina en 2025',
    subtitulo: 'Costo anual, beneficios y cuotas sin interés: todo lo que necesitás saber para no equivocarte.',
    autor: EQUIPO,
    fecha: '12 de febrero de 2025',
    fechaActualizacion: '10 de abril de 2026',
    categoria: 'tarjetas',
    imagen: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
    tiempoLectura: 6,
    recursos: [
      { label: 'Comparar tarjetas de crédito', href: '/tarjetas' },
      { label: 'Tarjetas sin costo anual', href: '/tarjetas?perfil=sin-costo' },
      { label: 'Mejores para viajes', href: '/tarjetas?perfil=viajes' },
      { label: 'Con cuotas sin interés', href: '/tarjetas?perfil=cuotas' },
    ],
    contenido: [
      { type: 'p', text: 'Elegir una tarjeta de crédito en Argentina no es tan simple como parece. Con la inflación, los cambios de tasas y la multiplicación de opciones digitales, lo que era conveniente hace un año puede no serlo hoy. En esta guía te explicamos los factores clave para tomar la mejor decisión.' },
      { type: 'h2', text: '1. Lo primero: ¿para qué la vas a usar?' },
      { type: 'p', text: 'El mejor punto de partida es pensar en tu comportamiento de gasto real. ¿Comprás seguido en supermercados? ¿Viajás al exterior? ¿Usás combustible todos los días? ¿Querés financiar compras en cuotas sin interés? Cada perfil tiene una tarjeta más conveniente.' },
      { type: 'callout', variant: 'tip', text: 'Truco: mirá tus últimos 3 resúmenes bancarios y anotá en qué categorías gastás más. Eso define qué beneficios te conviene priorizar.' },
      { type: 'h2', text: '2. El costo anual: la trampa más común' },
      { type: 'p', text: 'Muchas tarjetas tienen un costo de mantenimiento mensual que, multiplicado por 12, representa un gasto importante. En Argentina, los costos van desde $0 (tarjetas digitales como Naranja X, Ualá o Lemon) hasta más de $100.000 anuales en tarjetas premium como Amex Platinum.' },
      { type: 'p', text: 'La regla de oro: el costo anual solo vale la pena si los beneficios que usás efectivamente superan ese monto. Una tarjeta con acceso a salas VIP en aeropuertos solo conviene si viajás al menos 4-5 veces por año.' },
      { type: 'h2', text: '3. Cuotas sin interés: el diferencial argentino' },
      { type: 'p', text: 'Argentina tiene uno de los sistemas de cuotas sin interés más desarrollados del mundo. Los programas AHORA 3, AHORA 6, AHORA 12 y AHORA 18 te permiten financiar compras en cuotas sin pagar intereses, siempre que uses tarjetas adheridas.' },
      { type: 'ul', items: [
        'AHORA 3 y 6: disponibles en la mayoría de tarjetas sin cargo adicional',
        'AHORA 12 y 18: generalmente requieren adherirse al programa específico',
        'Tarjetas premium (Galicia Black, BBVA Visa Black): tienen cuotas sin interés propias en más de 600 comercios',
      ]},
      { type: 'h2', text: '4. Beneficios reales vs. beneficios de papel' },
      { type: 'p', text: 'Muchas tarjetas publicitan descuentos que en la práctica son difíciles de usar: requieren mínimo de gasto, son en comercios con poca cobertura o tienen cupos agotados permanentemente. Antes de elegir, buscá reseñas reales de usuarios argentinos.' },
      { type: 'callout', variant: 'warning', text: 'Prestá atención a los descuentos en supermercados: generalmente aplican solo 1 o 2 días por semana, tienen tope de reintegro y requieren pagar el total (no en cuotas).' },
      { type: 'h2', text: '5. Las mejores opciones según perfil en 2025' },
      { type: 'table', headers: ['Perfil', 'Tarjeta recomendada', 'Por qué'], rows: [
        ['Sin costo', 'Naranja X Visa', '0 mantenimiento, cuotas en toda la red'],
        ['Viajes', 'ICBC Visa Signature', 'Salas VIP, seguro de viaje automático'],
        ['Día a día', 'Galicia Mastercard Black', 'Cashback + descuentos en supermercados'],
        ['Jóvenes / sin historial', 'Ualá Mastercard', 'Sin banco, sin requisitos de ingreso'],
        ['Cripto', 'Lemon Cash Visa', 'Cashback en USDT en cada compra'],
      ]},
      { type: 'h2', text: 'Conclusión' },
      { type: 'p', text: 'No existe la tarjeta perfecta universal. La mejor tarjeta es la que se adapta a tus gastos reales, no a los que creés que vas a tener. Usá nuestro comparador para filtrar por perfil y ver las opciones rankeadas según lo que más importa para vos.' },
    ],
    articulosRelacionados: [
      'mercado-pago-vs-uala-cual-rinde-mas',
      'aseguradoras-mas-baratas-auto-argentina',
      'como-comprar-dolar-mep-homebanking',
    ],
  },
  {
    slug: 'mercado-pago-vs-uala-cual-rinde-mas',
    titulo: 'Mercado Pago vs Ualá: cuál rinde más tu plata hoy',
    subtitulo: 'Comparamos tasas, beneficios y funcionalidades de las dos billeteras más usadas de Argentina.',
    autor: EQUIPO,
    fecha: '3 de marzo de 2025',
    fechaActualizacion: '10 de abril de 2026',
    categoria: 'cuentas',
    imagen: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    tiempoLectura: 5,
    recursos: [
      { label: 'Comparar cuentas y billeteras', href: '/cuentas' },
      { label: 'Billeteras con mayor TNA', href: '/cuentas?filtro=alto-rendimiento' },
      { label: 'Con retiro inmediato', href: '/cuentas?filtro=retiro-inmediato' },
      { label: 'Comparar inversiones', href: '/inversiones' },
    ],
    contenido: [
      { type: 'p', text: 'Mercado Pago y Ualá son las dos billeteras digitales más usadas de Argentina, con más de 20 millones y 4 millones de usuarios respectivamente. Ambas ofrecen rendimiento automático sobre el saldo, tarjeta prepaga y servicios financieros. ¿Cuál conviene más en 2025?' },
      { type: 'callout', variant: 'info', text: 'Dato clave: las tasas de rendimiento son variables y cambian según la política del BCRA. Siempre verificá la tasa vigente en la app antes de decidir.' },
      { type: 'h2', text: 'Rendimiento del saldo: el factor más importante' },
      { type: 'p', text: 'Ambas invierten tu saldo en Fondos Comunes de Inversión money market, que a su vez invierten en plazos fijos y cauciones de muy corto plazo. Históricamente Mercado Pago tuvo tasas similares a Ualá, con variaciones de 1-3 puntos porcentuales según el momento.' },
      { type: 'table', headers: ['Característica', 'Mercado Pago', 'Ualá'], rows: [
        ['TNA referencial', '~31%', '~30%'],
        ['Inversión mínima', '$1', '$1'],
        ['Retiro inmediato', 'Sí (CVU)', 'Sí (CVU)'],
        ['Acreditación del rendimiento', 'Diaria', 'Diaria'],
        ['FCI subyacente', 'Mercado Fondos', 'Alpha Value'],
      ]},
      { type: 'h2', text: 'Tarjeta: Visa vs Mastercard' },
      { type: 'p', text: 'Mercado Pago emite una Visa prepaga que puede usarse para pagos online y presenciales. Ualá tiene una Mastercard prepaga. En la práctica, ambas redes tienen aceptación similar en Argentina. La diferencia está en los beneficios adicionales y el cashback.' },
      { type: 'h2', text: '¿Cuál tiene mejor ecosistema?' },
      { type: 'p', text: 'Mercado Pago tiene la ventaja de estar integrado con Mercado Libre, el e-commerce más grande de Argentina. Podés usar el saldo para comprar en ML con cuotas, pagar servicios, cargar la SUBE y acceder a Mercado Crédito. El ecosistema es notablemente más amplio.' },
      { type: 'p', text: 'Ualá, en cambio, es más especializada: mejor experiencia de usuario en inversiones (más opciones de FCI), préstamos personales 100% digitales y una comunidad más activa de finanzas personales.' },
      { type: 'h2', text: 'Nuestra recomendación' },
      { type: 'callout', variant: 'tip', text: 'No tenés que elegir una sola. Muchos usuarios usan Mercado Pago para el día a día (pago de servicios, compras en ML) y Ualá para inversiones. Ambas son gratuitas.' },
      { type: 'ul', items: [
        'Si comprás en Mercado Libre frecuentemente: Mercado Pago sin dudas',
        'Si priorizás el rendimiento y las inversiones: Ualá tiene mejor UX',
        'Para pagos en comercios: ambas funcionan igual',
        'Para préstamos personales: Ualá tiene el proceso más simple',
      ]},
    ],
    articulosRelacionados: [
      'como-elegir-tarjeta-de-credito-argentina-2025',
      'aseguradoras-mas-baratas-auto-argentina',
      'como-comprar-dolar-mep-homebanking',
    ],
  },
  {
    slug: 'aseguradoras-mas-baratas-auto-argentina',
    titulo: 'Las aseguradoras más baratas para tu auto en Argentina',
    subtitulo: 'Comparamos precios de seguro todo riesgo y terceros en las principales aseguradoras del país.',
    autor: EQUIPO,
    fecha: '18 de marzo de 2025',
    fechaActualizacion: '10 de abril de 2026',
    categoria: 'seguros',
    imagen: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
    tiempoLectura: 7,
    recursos: [
      { label: 'Comparar seguros de auto', href: '/seguros' },
      { label: 'Seguros todo riesgo', href: '/seguros?tipo=todo-riesgo' },
      { label: 'Terceros completo', href: '/seguros?tipo=terceros' },
      { label: 'Cotizar seguro', href: '/seguros' },
    ],
    contenido: [
      { type: 'p', text: 'El precio del seguro de auto en Argentina varía enormemente según la aseguradora, la cobertura elegida, el modelo y año del vehículo, y la zona geográfica. En este artículo te mostramos un ranking referencial de las opciones más convenientes para cada necesidad.' },
      { type: 'callout', variant: 'warning', text: 'Los precios que mencionamos son referenciales para un auto de valor medio en CABA. Tu cotización real puede variar hasta un 40% según modelo, año, zona y historial de siniestros.' },
      { type: 'h2', text: '¿Qué cobertura necesitás?' },
      { type: 'p', text: 'Antes de comparar precios, definí qué cobertura necesitás. La diferencia en precio entre responsabilidad civil (obligatoria) y todo riesgo puede ser de hasta 4x.' },
      { type: 'ul', items: [
        'Responsabilidad Civil (RC): obligatoria por ley, cubre solo daños a terceros. Desde ~$9.500/mes',
        'Terceros Completo: RC + robo total + incendio. El punto medio más popular. Desde ~$17.000/mes',
        'Todo Riesgo: cubre daños propios también. La más cara pero la más completa. Desde ~$28.000/mes',
      ]},
      { type: 'h2', text: 'Ranking de aseguradoras por precio en 2025' },
      { type: 'p', text: 'Para un auto de valor aproximado de $20.000.000 en CABA, estos son los precios referenciales mensuales:' },
      { type: 'table', headers: ['Aseguradora', 'Todo Riesgo', 'Terceros Completo', 'RC', 'Rating'], rows: [
        ['Mercado Seguros', '$65.000', '$24.000', '$9.500', '4.1 ★'],
        ['Federación Patronal', '$72.000', '$27.000', 'N/D', '4.3 ★'],
        ['La Caja', '$78.000', '$29.000', 'N/D', '4.4 ★'],
        ['Sancor Seguros', '$85.000', '$32.000', 'N/D', '4.8 ★'],
        ['MAPFRE Argentina', '$92.000', '$35.000', 'N/D', '4.6 ★'],
        ['Zurich Argentina', '$98.000', '$38.000', 'N/D', '4.5 ★'],
      ]},
      { type: 'h2', text: '¿La más barata es la mejor?' },
      { type: 'p', text: 'No necesariamente. Al elegir un seguro, el precio es solo uno de los factores. Tan importante como el precio son:' },
      { type: 'ul', items: [
        'Tiempo de respuesta ante siniestros (fundamental)',
        'Red de talleres propios y convenios',
        'Facilidad para denunciar online (app o WhatsApp)',
        'Atención al cliente 24 hs',
        'Solidez financiera de la aseguradora',
      ]},
      { type: 'callout', variant: 'tip', text: 'Sancor Seguros tiene el mejor rating de nuestros usuarios (4.8) gracias a su respuesta rápida en siniestros y la cobertura de granizo sin franquicia, clave en zonas del interior del país.' },
      { type: 'h2', text: 'Cómo ahorrar en el seguro de auto' },
      { type: 'p', text: 'Algunos consejos probados para reducir el costo de tu seguro:' },
      { type: 'ol', items: [
        'Cotizá en al menos 3 aseguradoras distintas antes de renovar',
        'Si tu auto tiene más de 10 años, considerá bajar a Terceros Completo',
        'Preguntá por descuentos por buen historial o conductor joven adicional',
        'Cotizá en aseguradoras digitales (Mercado Seguros) para la cobertura básica',
        'Revizá el valor de tu auto cada 6 meses y ajustá la suma asegurada',
      ]},
    ],
    articulosRelacionados: [
      'como-elegir-tarjeta-de-credito-argentina-2025',
      'mercado-pago-vs-uala-cual-rinde-mas',
      'como-comprar-dolar-mep-homebanking',
    ],
  },
  {
    slug: 'como-comprar-dolar-mep-homebanking',
    titulo: 'Cómo comprar dólar MEP desde el homebanking paso a paso',
    subtitulo: 'La forma legal y sin límite de dolarizar tus ahorros desde cualquier broker o banco.',
    autor: EQUIPO,
    fecha: '28 de marzo de 2025',
    fechaActualizacion: '10 de abril de 2026',
    categoria: 'dolar',
    imagen: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80',
    tiempoLectura: 8,
    recursos: [
      { label: 'Comparar inversiones', href: '/inversiones' },
      { label: 'Comparar cuentas bancarias', href: '/cuentas' },
      { label: 'FCI Money Market', href: '/inversiones' },
      { label: 'CEDEARs', href: '/inversiones' },
    ],
    contenido: [
      { type: 'p', text: 'El dólar MEP (también llamado "dólar bolsa") es la forma legal y sin límite de monto de comprar dólares en Argentina. A diferencia del dólar oficial (con límite de USD 200/mes) o el blue (informal), el MEP no tiene tope y es completamente legal.' },
      { type: 'callout', variant: 'info', text: 'El dólar MEP se opera comprando un bono en pesos (como el AL30 o GD30) y vendiéndolo en dólares en la Bolsa. El precio resultante es el "tipo de cambio MEP".' },
      { type: 'h2', text: '¿Qué necesitás para operar?' },
      { type: 'ul', items: [
        'Una cuenta comitente en un broker (IOL, Balanz, PPI, Bull Market, etc.)',
        'DNI argentino o residente permanente',
        'Cuenta bancaria en Argentina para transferir los pesos',
        'CUIT/CUIL activo',
      ]},
      { type: 'h2', text: 'Paso a paso: cómo comprar dólar MEP' },
      { type: 'ol', items: [
        'Abrí una cuenta en un broker. IOL (Invertir Online) y Balanz son los más usados. El proceso es 100% online y tarda 24-48 hs.',
        'Transferí los pesos que querés convertir a tu cuenta comitente mediante CVU o CBU.',
        'Comprá el bono AL30 (o GD30) en pesos. Buscalo en el panel del broker como "AL30" en el mercado de contado.',
        'Esperá 24 hs hábiles (el "parking" obligatorio establecido por la CNV).',
        'Al día siguiente, vendé el mismo bono pero ahora en dólares (lo verás como "AL30D" o similar).',
        'Los dólares quedan en tu cuenta comitente. Podés retirarlos a una cuenta bancaria en USD.',
      ]},
      { type: 'callout', variant: 'warning', text: 'El parking de 24 hs es obligatorio. No podés comprar y vender el bono el mismo día. Si lo hacés, la operación puede ser anulada por el broker.' },
      { type: 'h2', text: '¿Cuánto cuesta operar?' },
      { type: 'p', text: 'El costo del MEP tiene dos componentes: la comisión del broker (generalmente 0.1-0.5% de la operación) y el spread entre el precio de compra y venta del bono. En total, el costo suele ser de 1-2% sobre el monto operado.' },
      { type: 'h2', text: 'MEP vs. otras alternativas' },
      { type: 'table', headers: ['Alternativa', 'Límite', 'Legalidad', 'Precio'], rows: [
        ['Dólar oficial', 'USD 200/mes', 'Legal', '+ impuestos (~1.070 + 30% = ~$1.400)'],
        ['Dólar MEP', 'Sin límite', 'Legal', '~$1.150 (referencial)'],
        ['Dólar CCL', 'Sin límite', 'Legal', '~$1.155 (referencial)'],
        ['Dólar blue', 'Sin límite', 'Informal', '~$1.200 (referencial)'],
      ]},
      { type: 'h2', text: '¿Cuándo conviene comprar MEP?' },
      { type: 'callout', variant: 'tip', text: 'El MEP conviene cuando necesitás dolarizar más de USD 200 al mes, querés hacerlo de forma legal con registro, o querés tener dólares en una cuenta bancaria real (no en efectivo).' },
      { type: 'p', text: 'En contextos de alta inflación como Argentina, dolarizar una parte de los ahorros es una estrategia de preservación de capital válida. El MEP es la alternativa más conveniente para montos medianos y altos por su legalidad y precio.' },
    ],
    articulosRelacionados: [
      'mercado-pago-vs-uala-cual-rinde-mas',
      'como-elegir-tarjeta-de-credito-argentina-2025',
      'aseguradoras-mas-baratas-auto-argentina',
    ],
  },
]

export const CATEGORIA_LABELS: Record<CategoriaArticulo, string> = {
  tarjetas:    'Tarjetas',
  cuentas:     'Cuentas',
  prestamos:   'Préstamos',
  seguros:     'Seguros',
  inversiones: 'Inversiones',
  dolar:       'Dólar',
}

export const CATEGORIA_COLORS: Record<CategoriaArticulo, { bg: string; color: string }> = {
  tarjetas:    { bg: '#f0fdf4', color: '#166534' },
  cuentas:     { bg: '#eff6ff', color: '#1d4ed8' },
  prestamos:   { bg: '#fffbeb', color: '#92400e' },
  seguros:     { bg: '#f5f3ff', color: '#5b21b6' },
  inversiones: { bg: '#fdf2f8', color: '#9d174d' },
  dolar:       { bg: '#ecfdf5', color: '#065f46' },
}
