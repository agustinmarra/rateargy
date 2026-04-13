// ============================================================
// DATOS DE DESCUENTOS EN NAFTA — ACTUALIZAR CADA LUNES
// Fuente: verificar en sitios oficiales de cada banco
// Última actualización: abril 2026
// ============================================================

export const MES_ACTUALIZACION = "Abril 2026"

export type DescuentoNafta = {
  bancoId: string
  banco: string
  porcentaje: number
  porcentajeExtra?: number // para segmentos premium
  segmento?: string // "Éminent", "Platinum", "Selecta", etc.
  dia: string
  tope: number
  topeExtra?: number
  estaciones: string[] // ["YPF", "Shell", "Axion", "Puma"] o ["Todas"]
  condicion?: string // texto libre con condiciones especiales
  acumulable?: boolean
  medio?: string // "MODO", "App YPF", "Débito", "Crédito"
}

export const DESCUENTOS_NAFTA: DescuentoNafta[] = [
  {
    bancoId: "galicia-eminent",
    banco: "Banco Galicia",
    porcentaje: 15,
    segmento: "Éminent",
    dia: "Lunes",
    tope: 15000,
    estaciones: ["Todas"],
    medio: "MODO",
    condicion: "Pagando con Mastercard escaneando QR de MODO desde app Galicia",
  },
  {
    bancoId: "galicia-eminent",
    banco: "Banco Galicia",
    porcentaje: 10,
    segmento: "Resto de tarjetas",
    dia: "Lunes",
    tope: 10000,
    estaciones: ["Todas"],
    medio: "MODO",
    condicion: "Clientes no Éminent. Pagando con Mastercard y MODO",
  },
  {
    bancoId: "macro-visa",
    banco: "Banco Macro",
    porcentaje: 20,
    porcentajeExtra: 30,
    segmento: "Platinum / Selecta",
    dia: "Miércoles",
    tope: 15000,
    topeExtra: 25000,
    estaciones: ["YPF"],
    medio: "MODO",
    condicion: "20% para Platinum (tope $15.000). 30% para Selecta (tope $25.000)",
  },
  {
    bancoId: "bna-gold",
    banco: "Banco Nación",
    porcentaje: 20,
    dia: "Viernes",
    tope: 10000,
    estaciones: ["YPF", "Shell"],
    medio: "MODO BNA+",
    condicion: "Pagando con tarjeta de crédito Visa o Mastercard del BNA a través de MODO",
  },
  {
    bancoId: "patagonia",
    banco: "Banco Patagonia",
    porcentaje: 20,
    porcentajeExtra: 25,
    segmento: "Cuenta sueldo",
    dia: "Jueves",
    tope: 10000,
    topeExtra: 15000,
    estaciones: ["Todas"],
    condicion: "20% general (tope $10.000). 25% para cuenta sueldo (tope $15.000)",
  },
  {
    bancoId: "credicoop",
    banco: "Banco Credicoop",
    porcentaje: 15,
    porcentajeExtra: 20,
    segmento: "Cuenta sueldo",
    dia: "Viernes",
    tope: 4500,
    estaciones: ["Todas"],
    condicion: "Tope diario de $4.500. Para cuenta sueldo: 20% con tope $6.000 diario",
  },
  {
    bancoId: "santander-gold",
    banco: "Santander",
    porcentaje: 10,
    segmento: "Platinum / Black",
    dia: "Jueves",
    tope: 7500,
    estaciones: ["YPF"],
    medio: "App YPF",
    condicion: "Solo con tarjetas Visa Black o Platinum desde la App YPF",
  },
  {
    bancoId: "icbc-platinum",
    banco: "ICBC",
    porcentaje: 15,
    segmento: "Cuenta sueldo",
    dia: "Martes",
    tope: 15000,
    estaciones: ["Todas"],
    condicion: "Solo para clientes con cuenta sueldo acreditada en ICBC",
  },
  {
    bancoId: "supervielle",
    banco: "Supervielle",
    porcentaje: 10,
    dia: "Variable",
    tope: 8000,
    estaciones: ["Todas"],
    condicion: "Verificar condiciones vigentes en app Supervielle",
  },
  {
    bancoId: "mercado-pago",
    banco: "Mercado Pago",
    porcentaje: 10,
    dia: "Variable",
    tope: 6000,
    estaciones: ["YPF"],
    medio: "App Mercado Pago",
    condicion: "10% de reintegro en YPF pagando con Tarjeta de Crédito Mercado Pago. Tope $6.000/mes",
  },
  {
    bancoId: "brubank",
    banco: "Brubank",
    porcentaje: 20,
    porcentajeExtra: 30,
    segmento: "Plan Plus / Plan Ultra",
    dia: "Todos los días",
    tope: 30000,
    estaciones: ["Todas"],
    condicion: "20% Plan Plus (tope $4.000/semana). 30% Plan Ultra todos los días (tope $6.000/compra y $30.000/mes)",
  },
  {
    bancoId: "ciudad",
    banco: "Banco Ciudad",
    porcentaje: 10,
    porcentajeExtra: 15,
    segmento: "Plan Sueldo / Jubilados",
    dia: "Domingos",
    tope: 10000,
    topeExtra: 15000,
    estaciones: ["Todas"],
    medio: "MODO",
    condicion: "10% general. 15% para Plan Sueldo y Jubilados",
  },
  {
    bancoId: "hipotecario",
    banco: "Banco Hipotecario",
    porcentaje: 15,
    segmento: "Búho One",
    dia: "Martes",
    tope: 8000,
    estaciones: ["Todas"],
    condicion: "Solo clientes Búho One con Visa Signature o Platinum",
  },
]

// Beneficios de apps de las petroleras (sin banco)
export type BeneficioApp = {
  app: string
  petrolera: string
  beneficio: string
  porcentaje: number
  dia: string
  tope: string
  acumulable: boolean
}

export const BENEFICIOS_APPS: BeneficioApp[] = [
  {
    app: "App YPF + Serviclub",
    petrolera: "YPF",
    beneficio: "Carga nocturna (0 a 6hs)",
    porcentaje: 6,
    dia: "Todos los días",
    tope: "Sin tope",
    acumulable: true,
  },
  {
    app: "App YPF + Serviclub",
    petrolera: "YPF",
    beneficio: "Autodespacho",
    porcentaje: 3,
    dia: "Todos los días",
    tope: "Sin tope",
    acumulable: true,
  },
  {
    app: "App YPF",
    petrolera: "YPF",
    beneficio: "Socios ACA",
    porcentaje: 5,
    dia: "Todos los días",
    tope: "$14.500/mes",
    acumulable: true,
  },
  {
    app: "Shell Box",
    petrolera: "Shell",
    beneficio: "Combustibles V-Power premium",
    porcentaje: 10,
    dia: "Miércoles",
    tope: "$4.000/semana",
    acumulable: false,
  },
  {
    app: "Axion ON",
    petrolera: "Axion",
    beneficio: "Combustibles Quantium",
    porcentaje: 10,
    dia: "Lunes y Viernes",
    tope: "$6.500 a $12.000/mes según nivel",
    acumulable: false,
  },
]
