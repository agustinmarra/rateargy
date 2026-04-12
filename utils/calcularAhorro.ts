import { Tarjeta, Gastos } from "@/types/tarjetas"
export function calcularAhorro(tarjeta: Tarjeta, gastos: Gastos): number {
  const categorias = ["super","nafta","transporte","farmacia","restaurant","online","viajes","servicios"] as const
  let total = 0
  categorias.forEach((cat) => {
    const gasto = gastos[cat] || 0
    const b = tarjeta.beneficios[cat]
    if (!b || !b.pct || gasto === 0) return
    const desc = gasto * (b.pct / 100)
    total += b.tope ? Math.min(desc, b.tope) : desc
  })
  return Math.round(total)
}
