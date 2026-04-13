// EDITAR ACÁ: actualizá beneficios cada lunes
// Estructura de cada tarjeta:
//   id, bancoId, nombre, banco, red, gradiente
//   beneficios: { [cat]: { pct, tope, dias?, lugar?, descripcion? } }
//   pills, costoAnual

export type CatKey = "super" | "nafta" | "farmacia" | "delivery" | "online" | "viajes" | "transporte" | "servicios"
export type Gastos = Record<CatKey, number>

export interface Beneficio {
  pct: number
  tope: number
  dias?: string
  lugar?: string
  descripcion?: string
}

export interface Tarjeta {
  id: string
  bancoId: string
  nombre: string
  banco: string
  red: string
  gradiente: string
  beneficios: Record<CatKey, Beneficio>
  pills: string[]
  costoAnual: number
}

export const TARJETAS: Tarjeta[] = [

  // ─── GALICIA ────────────────────────────────────────────────────────────────

  {
    id: "galicia-eminent", bancoId: "galicia-eminent",
    nombre: "Galicia Éminent Visa Signature", banco: "Banco Galicia", red: "Visa Signature",
    gradiente: "linear-gradient(135deg, #1a7f4f 0%, #0d4f31 100%)",
    beneficios: {
      super:      { pct: 25, tope: 20000, dias: "jueves",   lugar: "Jumbo / Disco / Vea",        descripcion: "25% de reintegro los jueves en Jumbo, Disco y Vea, hasta $20.000/mes" },
      nafta:      { pct: 15, tope: 15000, dias: "lunes",    lugar: "YPF / Axion / Shell",        descripcion: "15% los lunes en YPF, Axion y Shell, hasta $15.000/mes" },
      farmacia:   { pct: 10, tope: 12000,                   lugar: "Farmacity / Farmacias del Ahorro", descripcion: "10% en farmacias adheridas, hasta $12.000/mes" },
      delivery:   { pct: 15, tope: 10000,                   lugar: "PedidosYa / Rappi",          descripcion: "15% en apps de delivery, hasta $10.000/mes" },
      online:     { pct: 10, tope: 10000,                   lugar: "Compras online generales",   descripcion: "10% cashback en compras online, hasta $10.000/mes" },
      viajes:     { pct: 10, tope: 15000,                   lugar: "Despegar / Almundo",         descripcion: "10% en plataformas de viajes, hasta $15.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["25% Jumbo/Disco jueves", "15% nafta lunes", "Visa Signature", "Cuotas sin interés"],
    costoAnual: 0,
  },

  {
    id: "galicia", bancoId: "galicia",
    nombre: "Galicia Visa Gold", banco: "Banco Galicia", red: "Visa",
    gradiente: "linear-gradient(135deg, #0f3d24 0%, #1a6b3f 60%, #259a5b 100%)",
    beneficios: {
      super:      { pct: 20, tope: 15000, dias: "jueves",   lugar: "Jumbo / Disco / Vea",        descripcion: "20% los jueves en Jumbo, Disco y Vea, hasta $15.000/mes" },
      nafta:      { pct: 10, tope: 10000, dias: "lunes",    lugar: "YPF / Shell",                descripcion: "10% los lunes en YPF y Shell, hasta $10.000/mes" },
      farmacia:   { pct: 10, tope:  8000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $8.000/mes" },
      delivery:   { pct: 10, tope:  8000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $8.000/mes" },
      online:     { pct: 10, tope:  8000,                   lugar: "Compras online generales",   descripcion: "10% en compras online, hasta $8.000/mes" },
      viajes:     { pct:  5, tope: 10000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $10.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% Jumbo jueves", "10% nafta lunes", "Cuotas sin interés"],
    costoAnual: 0,
  },

  // ─── BBVA ───────────────────────────────────────────────────────────────────

  {
    id: "bbva-platinum", bancoId: "bbva-platinum",
    nombre: "BBVA Visa Platinum", banco: "BBVA Argentina", red: "Visa Platinum",
    gradiente: "linear-gradient(135deg, #004481 0%, #0066cc 100%)",
    beneficios: {
      super:      { pct: 20, tope: 15000, dias: "vie/sáb",  lugar: "Walmart / Changomas",        descripcion: "20% los viernes y sábados en Walmart y Changomas, hasta $15.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct: 10, tope:  8000,                   lugar: "Farmacity / Farmacias del Ahorro", descripcion: "10% en farmacias adheridas, hasta $8.000/mes" },
      delivery:   { pct: 10, tope:  8000,                   lugar: "PedidosYa / Rappi",          descripcion: "10% en delivery, hasta $8.000/mes" },
      online:     { pct:  5, tope:  5000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $5.000/mes" },
      viajes:     { pct: 15, tope: 20000,                   lugar: "Despegar / Almundo",         descripcion: "15% en plataformas de viajes, hasta $20.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% supermercados vie/sáb", "15% viajes", "Visa Platinum", "Lounge aeropuerto"],
    costoAnual: 0,
  },

  {
    id: "bbva", bancoId: "bbva",
    nombre: "BBVA Visa Gold", banco: "BBVA Argentina", red: "Visa",
    gradiente: "linear-gradient(135deg, #00437f 0%, #005cbf 60%, #1a7ae0 100%)",
    beneficios: {
      super:      { pct: 15, tope: 12000, dias: "martes",   lugar: "Walmart / Carrefour",        descripcion: "15% los martes en Walmart y Carrefour, hasta $12.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct: 10, tope:  6000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $6.000/mes" },
      delivery:   { pct: 10, tope:  6000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $6.000/mes" },
      online:     { pct: 10, tope:  8000,                   lugar: "Compras online generales",   descripcion: "10% en compras online, hasta $8.000/mes" },
      viajes:     { pct: 10, tope: 12000,                   lugar: "Despegar",                   descripcion: "10% en Despegar, hasta $12.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["15% supermercados martes", "10% viajes", "Cuotas sin interés"],
    costoAnual: 0,
  },

  // ─── SANTANDER ──────────────────────────────────────────────────────────────

  {
    id: "santander-gold", bancoId: "santander-gold",
    nombre: "Santander Visa Gold", banco: "Santander Argentina", red: "Visa",
    gradiente: "linear-gradient(135deg, #cc0000 0%, #ff4444 100%)",
    beneficios: {
      super:      { pct: 25, tope: 20000, dias: "todos",    lugar: "Coto / DIA",                 descripcion: "25% todos los días en Coto y DIA, hasta $20.000/mes" },
      nafta:      { pct: 10, tope:  7500, dias: "jueves",    lugar: "YPF (App YPF)",              descripcion: "10% los jueves en YPF con Visa Platinum/Black desde la App YPF, hasta $7.500/mes" },
      farmacia:   { pct: 10, tope:  8000,                   lugar: "Farmacity / Dr. Ahorro",     descripcion: "10% en farmacias adheridas, hasta $8.000/mes" },
      delivery:   { pct: 10, tope:  8000,                   lugar: "PedidosYa / Rappi",          descripcion: "10% en delivery, hasta $8.000/mes" },
      online:     { pct: 10, tope: 10000,                   lugar: "Compras online generales",   descripcion: "10% en compras online, hasta $10.000/mes" },
      viajes:     { pct:  5, tope:  8000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $8.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["25% Coto/DIA todos los días", "10% online y delivery"],
    costoAnual: 0,
  },

  {
    id: "santander", bancoId: "santander",
    nombre: "Santander Mastercard", banco: "Santander Argentina", red: "Mastercard",
    gradiente: "linear-gradient(135deg, #7a0000 0%, #b80000 60%, #e60000 100%)",
    beneficios: {
      super:      { pct: 20, tope: 15000, dias: "todos",    lugar: "Coto / DIA",                 descripcion: "20% todos los días en Coto y DIA, hasta $15.000/mes" },
      nafta:      { pct: 10, tope:  6000,                   lugar: "Shell / YPF",                descripcion: "10% en Shell y YPF, hasta $6.000/mes" },
      farmacia:   { pct: 10, tope:  6000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $6.000/mes" },
      delivery:   { pct: 10, tope:  6000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $6.000/mes" },
      online:     { pct: 10, tope:  8000,                   lugar: "Compras online generales",   descripcion: "10% en compras online, hasta $8.000/mes" },
      viajes:     { pct:  5, tope:  6000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $6.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% Coto/DIA todos los días", "10% farmacia y delivery"],
    costoAnual: 0,
  },

  // ─── MACRO ──────────────────────────────────────────────────────────────────

  {
    id: "macro-visa", bancoId: "macro-visa",
    nombre: "Macro Visa Gold", banco: "Banco Macro", red: "Visa",
    gradiente: "linear-gradient(135deg, #b8860b 0%, #ffd700 100%)",
    beneficios: {
      super:      { pct: 25, tope: 15000, dias: "jueves",   lugar: "Jumbo / Disco",              descripcion: "25% los jueves en Jumbo y Disco, hasta $15.000/mes" },
      nafta:      { pct: 20, tope: 15000, dias: "miércoles", lugar: "YPF (MODO)",                 descripcion: "20% los miércoles en YPF pagando con MODO, hasta $15.000/mes" },
      farmacia:   { pct: 10, tope:  8000,                   lugar: "Farmacity / Dr. Ahorro",     descripcion: "10% en farmacias adheridas, hasta $8.000/mes" },
      delivery:   { pct: 10, tope:  8000,                   lugar: "PedidosYa / Rappi",          descripcion: "10% en delivery, hasta $8.000/mes" },
      online:     { pct:  5, tope:  5000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $5.000/mes" },
      viajes:     { pct:  5, tope:  8000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $8.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% nafta miércoles MODO", "25% super jueves", "Cuotas sin interés"],
    costoAnual: 0,
  },

  {
    id: "macro", bancoId: "macro",
    nombre: "Macro Mastercard Gold", banco: "Banco Macro", red: "Mastercard",
    gradiente: "linear-gradient(135deg, #0a3370 0%, #1254a8 60%, #1a6fd4 100%)",
    beneficios: {
      super:      { pct: 20, tope: 12000, dias: "jueves",   lugar: "Jumbo / Disco / Vea",        descripcion: "20% los jueves en Jumbo, Disco y Vea, hasta $12.000/mes" },
      nafta:      { pct: 20, tope: 12000,                   lugar: "YPF / Axion",                descripcion: "20% en YPF y Axion, hasta $12.000/mes" },
      farmacia:   { pct: 10, tope:  6000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $6.000/mes" },
      delivery:   { pct: 10, tope:  6000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $6.000/mes" },
      online:     { pct:  5, tope:  4000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $4.000/mes" },
      viajes:     { pct:  5, tope:  6000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $6.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% nafta todos los días", "20% super jueves"],
    costoAnual: 0,
  },

  // ─── NARANJA X ──────────────────────────────────────────────────────────────

  {
    id: "naranja-x", bancoId: "naranja-x",
    nombre: "Naranja X Mastercard", banco: "Naranja X", red: "Mastercard",
    gradiente: "linear-gradient(135deg, #e05a00 0%, #ff8c42 100%)",
    beneficios: {
      super:      { pct: 25, tope: 10000, dias: "todos",    lugar: "DIA / Changomas",            descripcion: "25% todos los días en DIA y Changomas, hasta $10.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct: 10, tope:  6000,                   lugar: "Farmacias del Ahorro",       descripcion: "10% en Farmacias del Ahorro, hasta $6.000/mes" },
      delivery:   { pct: 15, tope:  8000, dias: "finde",    lugar: "PedidosYa / Rappi",          descripcion: "15% los fines de semana en PedidosYa y Rappi, hasta $8.000/mes" },
      online:     { pct: 20, tope: 10000,                   lugar: "MercadoLibre / Tiendas online", descripcion: "20% en compras online en MercadoLibre y tiendas adheridas, hasta $10.000/mes" },
      viajes:     { pct:  5, tope:  5000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $5.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  5, tope:  3000,                   lugar: "Netflix / Spotify / servicios digitales", descripcion: "5% en servicios digitales, hasta $3.000/mes" },
    },
    pills: ["20% compras online", "25% DIA todos los días", "15% delivery finde"],
    costoAnual: 0,
  },

  // ─── BANCO NACIÓN ───────────────────────────────────────────────────────────

  {
    id: "bna-gold", bancoId: "bna-gold",
    nombre: "BNA Visa Gold", banco: "Banco Nación", red: "Visa",
    gradiente: "linear-gradient(135deg, #003580 0%, #0055cc 100%)",
    beneficios: {
      super:      { pct: 30, tope: 12000, dias: "miércoles", lugar: "Coto / Carrefour / Walmart", descripcion: "30% los miércoles en Coto, Carrefour y Walmart, hasta $12.000/mes" },
      nafta:      { pct: 20, tope: 10000, dias: "viernes",   lugar: "YPF / Shell (MODO BNA+)",    descripcion: "20% los viernes en YPF y Shell pagando con MODO BNA+, hasta $10.000/mes" },
      farmacia:   { pct: 10, tope:  8000,                   lugar: "Farmacity / Dr. Ahorro",     descripcion: "10% en farmacias adheridas, hasta $8.000/mes" },
      delivery:   { pct:  0, tope:     0 },
      online:     { pct:  5, tope:  5000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $5.000/mes" },
      viajes:     { pct:  5, tope:  5000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $5.000/mes" },
      transporte: { pct: 10, tope:  3000,                   lugar: "SUBE / subte / colectivo",   descripcion: "10% en carga SUBE y transporte público, hasta $3.000/mes" },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["30% super miércoles", "Ahora 12 y 18 cuotas", "10% transporte SUBE"],
    costoAnual: 0,
  },

  {
    id: "bna", bancoId: "bna",
    nombre: "BNA Visa Clásica", banco: "Banco Nación", red: "Visa",
    gradiente: "linear-gradient(135deg, #002952 0%, #003d7a 60%, #0055ab 100%)",
    beneficios: {
      super:      { pct: 25, tope: 10000, dias: "miércoles", lugar: "Coto / Carrefour",           descripcion: "25% los miércoles en Coto y Carrefour, hasta $10.000/mes" },
      nafta:      { pct:  5, tope:  6000,                   lugar: "YPF",                        descripcion: "5% en YPF, hasta $6.000/mes" },
      farmacia:   { pct:  5, tope:  5000,                   lugar: "Farmacity",                  descripcion: "5% en Farmacity, hasta $5.000/mes" },
      delivery:   { pct:  0, tope:     0 },
      online:     { pct:  5, tope:  4000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $4.000/mes" },
      viajes:     { pct:  0, tope:     0 },
      transporte: { pct: 10, tope:  2000,                   lugar: "SUBE",                       descripcion: "10% en carga SUBE, hasta $2.000/mes" },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["25% super miércoles", "Ahora 12 cuotas", "10% SUBE"],
    costoAnual: 0,
  },

  // ─── SUPERVIELLE ────────────────────────────────────────────────────────────

  {
    id: "supervielle", bancoId: "supervielle",
    nombre: "Supervielle Visa Gold", banco: "Supervielle", red: "Visa",
    gradiente: "linear-gradient(135deg, #e85d04 0%, #fb923c 100%)",
    beneficios: {
      super:      { pct: 20, tope: 25000, dias: "martes",   lugar: "Coto / La Anónima / Walmart", descripcion: "20% los martes en Coto, La Anónima y Walmart, hasta $25.000/mes" },
      nafta:      { pct: 10, tope:  8000, dias: "variable",  lugar: "Todas las estaciones",       descripcion: "10% en estaciones adheridas, hasta $8.000/mes. Verificar condiciones en app" },
      farmacia:   { pct: 50, tope:  5000,                   lugar: "Farmacity",                  descripcion: "50% en Farmacity, hasta $5.000/mes" },
      delivery:   { pct: 10, tope:  6000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $6.000/mes" },
      online:     { pct:  5, tope:  4000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $4.000/mes" },
      viajes:     { pct:  5, tope:  5000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $5.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["50% Farmacity", "20% super martes", "Cuotas sin interés"],
    costoAnual: 0,
  },

  // ─── ICBC ───────────────────────────────────────────────────────────────────

  {
    id: "icbc-platinum", bancoId: "icbc-platinum",
    nombre: "ICBC Visa Platinum", banco: "ICBC Argentina", red: "Visa Platinum",
    gradiente: "linear-gradient(135deg, #c41230 0%, #e63950 100%)",
    beneficios: {
      super:      { pct: 20, tope: 20000, dias: "todos",    lugar: "Walmart / Carrefour / Jumbo", descripcion: "20% todos los días en Walmart, Carrefour y Jumbo, hasta $20.000/mes" },
      nafta:      { pct: 15, tope: 15000, dias: "martes",    lugar: "Todas (cuenta sueldo)",      descripcion: "15% los martes para clientes con cuenta sueldo acreditada en ICBC, hasta $15.000/mes" },
      farmacia:   { pct: 10, tope:  6000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $6.000/mes" },
      delivery:   { pct: 10, tope:  6000,                   lugar: "PedidosYa / Rappi",          descripcion: "10% en delivery, hasta $6.000/mes" },
      online:     { pct: 10, tope:  8000,                   lugar: "MercadoLibre / tiendas online", descripcion: "10% en compras online, hasta $8.000/mes" },
      viajes:     { pct: 10, tope: 10000,                   lugar: "Despegar / Almundo",         descripcion: "10% en plataformas de viajes, hasta $10.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% super todos los días", "15% nafta martes", "Visa Platinum"],
    costoAnual: 0,
  },

  {
    id: "icbc", bancoId: "icbc",
    nombre: "ICBC Visa Gold", banco: "ICBC Argentina", red: "Visa",
    gradiente: "linear-gradient(135deg, #6b0000 0%, #990000 60%, #cc1a00 100%)",
    beneficios: {
      super:      { pct: 15, tope: 15000, dias: "todos",    lugar: "Walmart / Carrefour",        descripcion: "15% todos los días en Walmart y Carrefour, hasta $15.000/mes" },
      nafta:      { pct: 10, tope:  6000,                   lugar: "YPF / Shell",                descripcion: "10% en YPF y Shell, hasta $6.000/mes" },
      farmacia:   { pct: 10, tope:  5000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $5.000/mes" },
      delivery:   { pct: 10, tope:  5000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $5.000/mes" },
      online:     { pct: 10, tope:  6000,                   lugar: "Compras online generales",   descripcion: "10% en compras online, hasta $6.000/mes" },
      viajes:     { pct: 10, tope:  8000,                   lugar: "Despegar",                   descripcion: "10% en Despegar, hasta $8.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["15% super todos los días", "10% viajes", "Cuotas sin interés"],
    costoAnual: 0,
  },

  // ─── UALÁ ────────────────────────────────────────────────────────────────────

  {
    id: "uala", bancoId: "uala",
    nombre: "Ualá Mastercard", banco: "Ualá", red: "Mastercard",
    gradiente: "linear-gradient(135deg, #5b2d8e 0%, #7c3aed 100%)",
    beneficios: {
      super:      { pct:  5, tope:  5000,                   lugar: "Supermercados generales",    descripcion: "5% cashback en supermercados, hasta $5.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct:  5, tope:  3000,                   lugar: "Farmacias generales",        descripcion: "5% cashback en farmacias, hasta $3.000/mes" },
      delivery:   { pct:  5, tope:  3000,                   lugar: "PedidosYa / Rappi",          descripcion: "5% cashback en apps de delivery, hasta $3.000/mes" },
      online:     { pct:  5, tope:  5000,                   lugar: "Compras online generales",   descripcion: "5% cashback en compras online, hasta $5.000/mes" },
      viajes:     { pct:  0, tope:     0 },
      transporte: { pct:  5, tope:  2000,                   lugar: "SUBE / Uber / Cabify",       descripcion: "5% cashback en transporte, hasta $2.000/mes" },
      servicios:  { pct:  5, tope:  3000,                   lugar: "Netflix / Spotify / servicios digitales", descripcion: "5% en servicios digitales, hasta $3.000/mes" },
    },
    pills: ["5% cashback general", "Sin costo de mantenimiento", "App 100% digital"],
    costoAnual: 0,
  },

  // ─── PERSONAL PAY ───────────────────────────────────────────────────────────

  {
    id: "personal-pay", bancoId: "personal-pay",
    nombre: "Personal Pay Visa", banco: "Personal Pay", red: "Visa",
    gradiente: "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
    beneficios: {
      super:      { pct: 25, tope: 15000,                   lugar: "Carrefour / DIA / Walmart",  descripcion: "25% en Carrefour, DIA y Walmart adheridos, hasta $15.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct: 15, tope:  6000,                   lugar: "Farmacias del Ahorro / Farmacity", descripcion: "15% en farmacias adheridas, hasta $6.000/mes" },
      delivery:   { pct: 10, tope:  6000,                   lugar: "PedidosYa / Rappi",          descripcion: "10% en delivery, hasta $6.000/mes" },
      online:     { pct: 10, tope:  8000,                   lugar: "Tiendas online adheridas",   descripcion: "10% en compras online, hasta $8.000/mes" },
      viajes:     { pct:  5, tope:  5000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $5.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct: 10, tope:  5000,                   lugar: "Servicios digitales / streaming", descripcion: "10% en servicios digitales y streaming, hasta $5.000/mes" },
    },
    pills: ["25% super Carrefour/DIA", "15% farmacias", "10% servicios digitales"],
    costoAnual: 0,
  },

  // ─── CREDICOOP ──────────────────────────────────────────────────────────────

  {
    id: "credicoop", bancoId: "credicoop",
    nombre: "Credicoop Cabal", banco: "Credicoop", red: "Cabal",
    gradiente: "linear-gradient(135deg, #005a9e 0%, #0077cc 100%)",
    beneficios: {
      super:      { pct: 20, tope: 10500, dias: "jueves",   lugar: "Coto / DIA",                 descripcion: "20% los jueves en Coto y DIA, hasta $10.500/mes" },
      nafta:      { pct: 15, tope:  4500, dias: "viernes",   lugar: "Todas las estaciones",       descripcion: "15% los viernes en todas las estaciones, tope $4.500 diario (no mensual)" },
      farmacia:   { pct: 10, tope:  5000,                   lugar: "Farmacias del Ahorro",       descripcion: "10% en Farmacias del Ahorro, hasta $5.000/mes" },
      delivery:   { pct: 10, tope:  5000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $5.000/mes" },
      online:     { pct:  5, tope:  4000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $4.000/mes" },
      viajes:     { pct:  5, tope:  5000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $5.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% Coto/DIA jueves", "15% nafta", "Red Cabal nacional"],
    costoAnual: 0,
  },

  // ─── PATAGONIA ──────────────────────────────────────────────────────────────

  {
    id: "patagonia", bancoId: "patagonia",
    nombre: "Patagonia Visa Gold", banco: "Banco Patagonia", red: "Visa",
    gradiente: "linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)",
    beneficios: {
      super:      { pct: 35, tope: 15000, dias: "jueves",   lugar: "La Anónima",                 descripcion: "35% los jueves en La Anónima, hasta $15.000/mes" },
      nafta:      { pct: 20, tope: 10000, dias: "jueves",    lugar: "Todas las estaciones",       descripcion: "20% los jueves en todas las estaciones, hasta $10.000/mes. 25% para cuenta sueldo" },
      farmacia:   { pct: 10, tope:  5000,                   lugar: "Farmacity",                  descripcion: "10% en Farmacity, hasta $5.000/mes" },
      delivery:   { pct: 10, tope:  5000,                   lugar: "PedidosYa",                  descripcion: "10% en PedidosYa, hasta $5.000/mes" },
      online:     { pct:  5, tope:  4000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $4.000/mes" },
      viajes:     { pct: 10, tope: 10000,                   lugar: "Despegar / Almundo",         descripcion: "10% en plataformas de viajes, hasta $10.000/mes" },
      transporte: { pct:  0, tope:     0 },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["35% La Anónima jueves", "10% viajes", "Fuerte en Patagonia"],
    costoAnual: 0,
  },

  // ─── PROVINCIA ──────────────────────────────────────────────────────────────

  {
    id: "cuenta-dni", bancoId: "cuenta-dni",
    nombre: "Cuenta DNI Visa", banco: "Bco. Provincia", red: "Visa",
    gradiente: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    beneficios: {
      super:      { pct: 20, tope:  8000, dias: "lunes",    lugar: "DIA / Carrefour Express",    descripcion: "20% los lunes en DIA y Carrefour Express, hasta $8.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct:  5, tope:  3000,                   lugar: "Farmacias adheridas",        descripcion: "5% en farmacias adheridas, hasta $3.000/mes" },
      delivery:   { pct: 30, tope:  5000, dias: "finde",    lugar: "PedidosYa / Rappi",          descripcion: "30% los fines de semana en PedidosYa y Rappi, hasta $5.000/mes" },
      online:     { pct:  5, tope:  3000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $3.000/mes" },
      viajes:     { pct:  0, tope:     0 },
      transporte: { pct:  5, tope:  3000,                   lugar: "SUBE",                       descripcion: "5% en carga SUBE, hasta $3.000/mes" },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["30% delivery finde", "20% DIA lunes", "App del Bco. Provincia"],
    costoAnual: 0,
  },

  {
    id: "provincia", bancoId: "provincia",
    nombre: "Provincia Mastercard Gold", banco: "Banco Provincia", red: "Mastercard",
    gradiente: "linear-gradient(135deg, #001f40 0%, #003366 60%, #004d99 100%)",
    beneficios: {
      super:      { pct: 15, tope:  8000, dias: "lunes",    lugar: "DIA / Coto",                 descripcion: "15% los lunes en DIA y Coto, hasta $8.000/mes" },
      nafta:      { pct:  0, tope:     0 },
      farmacia:   { pct: 10, tope:  5000,                   lugar: "Farmacias del Ahorro",       descripcion: "10% en Farmacias del Ahorro, hasta $5.000/mes" },
      delivery:   { pct: 20, tope:  6000, dias: "finde",    lugar: "PedidosYa",                  descripcion: "20% los fines de semana en PedidosYa, hasta $6.000/mes" },
      online:     { pct:  5, tope:  4000,                   lugar: "Compras online generales",   descripcion: "5% en compras online, hasta $4.000/mes" },
      viajes:     { pct:  5, tope:  6000,                   lugar: "Despegar",                   descripcion: "5% en Despegar, hasta $6.000/mes" },
      transporte: { pct: 10, tope:  3000,                   lugar: "SUBE",                       descripcion: "10% en carga SUBE, hasta $3.000/mes" },
      servicios:  { pct:  0, tope:     0 },
    },
    pills: ["20% delivery finde", "10% SUBE", "15% super lunes"],
    costoAnual: 0,
  },

]

export function calcularAhorro(t: Tarjeta, g: Gastos): number {
  return Math.round(
    (Object.keys(g) as CatKey[]).reduce((acc, cat) => {
      const b = t.beneficios[cat as CatKey]
      if (!b?.pct || !g[cat as CatKey]) return acc
      return acc + Math.min(g[cat as CatKey] * (b.pct / 100), b.tope || Infinity)
    }, 0)
  )
}

export function rankear(gastos: Gastos) {
  return [...TARJETAS]
    .map(t => ({ ...t, ahorro: calcularAhorro(t, gastos) }))
    .sort((a, b) => b.ahorro - a.ahorro)
}
