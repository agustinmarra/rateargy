// EDITAR ACÁ: actualizá beneficios cada lunes
export const TARJETAS = [
  { id:"galicia-eminent", nombre:"Galicia Éminent", banco:"Banco Galicia", red:"Visa",
    gradiente:"linear-gradient(135deg, #1a7f4f 0%, #0d4f31 100%)",
    beneficios:{ super:{pct:25,tope:20000,dias:"jueves"}, nafta:{pct:15,tope:15000,dias:"lunes"}, farmacia:{pct:10,tope:12000}, delivery:{pct:15,tope:10000}, online:{pct:10,tope:10000}, viajes:{pct:10,tope:15000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["25% Jumbo jueves","15% nafta lunes","Cuotas sin interés"], costoAnual:0 },
  { id:"bbva-platinum", nombre:"BBVA Platinum", banco:"BBVA", red:"Visa",
    gradiente:"linear-gradient(135deg, #004481 0%, #0066cc 100%)",
    beneficios:{ super:{pct:20,tope:15000,dias:"vie/sáb"}, nafta:{pct:10,tope:10000}, farmacia:{pct:10,tope:8000}, delivery:{pct:10,tope:8000}, online:{pct:5,tope:5000}, viajes:{pct:15,tope:20000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["20% supermercados","15% viajes","Lounge aeropuerto"], costoAnual:0 },
  { id:"santander-gold", nombre:"Santander Gold", banco:"Santander", red:"Visa",
    gradiente:"linear-gradient(135deg, #cc0000 0%, #ff4444 100%)",
    beneficios:{ super:{pct:25,tope:20000,dias:"todos"}, nafta:{pct:10,tope:8000}, farmacia:{pct:10,tope:8000}, delivery:{pct:10,tope:8000}, online:{pct:10,tope:10000}, viajes:{pct:5,tope:8000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["25% super todos los días","10% nafta"], costoAnual:0 },
  { id:"macro-visa", nombre:"Macro Visa", banco:"Banco Macro", red:"Visa",
    gradiente:"linear-gradient(135deg, #b8860b 0%, #ffd700 100%)",
    beneficios:{ super:{pct:25,tope:15000,dias:"jueves"}, nafta:{pct:25,tope:15000}, farmacia:{pct:10,tope:8000}, delivery:{pct:10,tope:8000}, online:{pct:5,tope:5000}, viajes:{pct:5,tope:8000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["25% nafta","25% super jueves"], costoAnual:0 },
  { id:"naranja-x", nombre:"Naranja X", banco:"Naranja X", red:"Mastercard",
    gradiente:"linear-gradient(135deg, #e05a00 0%, #ff8c42 100%)",
    beneficios:{ super:{pct:25,tope:10000,dias:"todos"}, nafta:{pct:10,tope:6000}, farmacia:{pct:10,tope:6000}, delivery:{pct:15,tope:8000,dias:"finde"}, online:{pct:20,tope:10000}, viajes:{pct:5,tope:5000}, transporte:{pct:0,tope:0}, servicios:{pct:5,tope:3000} },
    pills:["20% online","25% DIA","15% delivery finde"], costoAnual:0 },
  { id:"bna-gold", nombre:"BNA Gold", banco:"Banco Nación", red:"Visa",
    gradiente:"linear-gradient(135deg, #003580 0%, #0055cc 100%)",
    beneficios:{ super:{pct:30,tope:12000,dias:"miércoles"}, nafta:{pct:10,tope:8000}, farmacia:{pct:10,tope:8000}, delivery:{pct:0,tope:0}, online:{pct:5,tope:5000}, viajes:{pct:5,tope:5000}, transporte:{pct:10,tope:3000}, servicios:{pct:0,tope:0} },
    pills:["30% super miércoles","Ahora 12/18"], costoAnual:0 },
  { id:"supervielle", nombre:"Supervielle Visa", banco:"Supervielle", red:"Visa",
    gradiente:"linear-gradient(135deg, #e85d04 0%, #fb923c 100%)",
    beneficios:{ super:{pct:20,tope:25000,dias:"martes"}, nafta:{pct:10,tope:6000}, farmacia:{pct:50,tope:5000}, delivery:{pct:10,tope:6000}, online:{pct:5,tope:4000}, viajes:{pct:5,tope:5000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["50% farmacias","20% super martes"], costoAnual:0 },
  { id:"icbc-platinum", nombre:"ICBC Platinum", banco:"ICBC", red:"Visa",
    gradiente:"linear-gradient(135deg, #c41230 0%, #e63950 100%)",
    beneficios:{ super:{pct:20,tope:20000,dias:"todos"}, nafta:{pct:10,tope:8000}, farmacia:{pct:10,tope:6000}, delivery:{pct:10,tope:6000}, online:{pct:10,tope:8000}, viajes:{pct:10,tope:10000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["20% super todos los días","10% viajes"], costoAnual:0 },
  { id:"uala", nombre:"Ualá", banco:"Ualá", red:"Mastercard",
    gradiente:"linear-gradient(135deg, #5b2d8e 0%, #7c3aed 100%)",
    beneficios:{ super:{pct:5,tope:5000}, nafta:{pct:0,tope:0}, farmacia:{pct:5,tope:3000}, delivery:{pct:5,tope:3000}, online:{pct:5,tope:5000}, viajes:{pct:0,tope:0}, transporte:{pct:5,tope:2000}, servicios:{pct:5,tope:3000} },
    pills:["5% cashback general","Sin costo"], costoAnual:0 },
  { id:"personal-pay", nombre:"Personal Pay", banco:"Personal Pay", red:"Visa",
    gradiente:"linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
    beneficios:{ super:{pct:25,tope:15000}, nafta:{pct:10,tope:6000}, farmacia:{pct:15,tope:6000}, delivery:{pct:10,tope:6000}, online:{pct:10,tope:8000}, viajes:{pct:5,tope:5000}, transporte:{pct:0,tope:0}, servicios:{pct:10,tope:5000} },
    pills:["25% super","15% farmacias","10% servicios"], costoAnual:0 },
  { id:"credicoop", nombre:"Credicoop Cabal", banco:"Credicoop", red:"Cabal",
    gradiente:"linear-gradient(135deg, #005a9e 0%, #0077cc 100%)",
    beneficios:{ super:{pct:20,tope:10500,dias:"jueves"}, nafta:{pct:15,tope:8000}, farmacia:{pct:10,tope:5000}, delivery:{pct:10,tope:5000}, online:{pct:5,tope:4000}, viajes:{pct:5,tope:5000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["20% super jueves","15% nafta"], costoAnual:0 },
  { id:"patagonia", nombre:"Patagonia Visa", banco:"Patagonia", red:"Visa",
    gradiente:"linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)",
    beneficios:{ super:{pct:35,tope:15000,dias:"jueves"}, nafta:{pct:10,tope:8000}, farmacia:{pct:10,tope:5000}, delivery:{pct:10,tope:5000}, online:{pct:5,tope:4000}, viajes:{pct:10,tope:10000}, transporte:{pct:0,tope:0}, servicios:{pct:0,tope:0} },
    pills:["35% La Anónima jueves","10% viajes"], costoAnual:0 },
  { id:"cuenta-dni", nombre:"Cuenta DNI", banco:"Bco. Provincia", red:"Visa",
    gradiente:"linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    beneficios:{ super:{pct:20,tope:8000,dias:"lunes"}, nafta:{pct:0,tope:0}, farmacia:{pct:5,tope:3000}, delivery:{pct:30,tope:5000,dias:"finde"}, online:{pct:5,tope:3000}, viajes:{pct:0,tope:0}, transporte:{pct:5,tope:3000}, servicios:{pct:0,tope:0} },
    pills:["30% delivery finde","20% DIA lunes"], costoAnual:0 },
]

export type Tarjeta = typeof TARJETAS[0]
export type CatKey = "super"|"nafta"|"farmacia"|"delivery"|"online"|"viajes"|"transporte"|"servicios"
export type Gastos = Record<CatKey, number>

export function calcularAhorro(t: Tarjeta, g: Gastos): number {
  return Math.round(
    (Object.keys(g) as CatKey[]).reduce((acc, cat) => {
      const b = t.beneficios[cat]
      if (!b?.pct || !g[cat]) return acc
      return acc + Math.min(g[cat] * (b.pct / 100), b.tope || Infinity)
    }, 0)
  )
}

export function rankear(gastos: Gastos) {
  return [...TARJETAS]
    .map(t => ({ ...t, ahorro: calcularAhorro(t, gastos) }))
    .sort((a, b) => b.ahorro - a.ahorro)
}
