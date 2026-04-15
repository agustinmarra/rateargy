// Beneficios de apps de las petroleras (sin banco) — archivo estático
// No se sobreescribe por el sync de Google Sheets

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
