/**
 * lib/finance.ts — Funciones puras de cálculo financiero
 *
 * Todas las funciones son puras (sin side effects) y completamente testeables.
 * Los resultados son REFERENCIALES. Las tasas reales dependen de cada entidad.
 */

// ─── Préstamos ───────────────────────────────────────────────────────────────

export interface ResultadoPrestamo {
  cuotaMensual: number
  totalAPagar: number
  totalIntereses: number
  cftea: number          // Costo Financiero Total Efectivo Anual (estimado)
  cfteMensual: number    // Tasa mensual efectiva
}

/**
 * Calcula la cuota mensual de un préstamo (sistema francés / cuota fija).
 *
 * @param monto - Capital solicitado en ARS
 * @param tna   - Tasa Nominal Anual (ej: 0.60 para 60%)
 * @param cuotas - Cantidad de cuotas
 * @param gastosMensuales - Gastos adicionales mensuales en ARS (seguro, IVA, etc.)
 *
 * Fórmula PMT: P × [r(1+r)ⁿ] / [(1+r)ⁿ - 1]
 */
export function calcularPrestamo(
  monto: number,
  tna: number,
  cuotas: number,
  gastosMensuales = 0
): ResultadoPrestamo | null {
  if (monto <= 0 || cuotas <= 0 || tna < 0) return null

  const r = tna / 12  // Tasa mensual nominal

  let cuotaBase: number
  if (r === 0) {
    cuotaBase = monto / cuotas
  } else {
    cuotaBase = monto * (r * Math.pow(1 + r, cuotas)) / (Math.pow(1 + r, cuotas) - 1)
  }

  const cuotaMensual = cuotaBase + gastosMensuales
  const totalAPagar = cuotaMensual * cuotas
  const totalIntereses = totalAPagar - monto - (gastosMensuales * cuotas)

  // CFTEA: incluye intereses + gastos adicionales
  // Aproximación: (1 + TEM_efectiva)^12 - 1
  // TEM efectiva = cuotaTotal / monto - 1 aproximado via IRR simplificado
  const tem = r + (gastosMensuales / monto)
  const cftea = Math.pow(1 + tem, 12) - 1
  const cfteMensual = tem

  return {
    cuotaMensual: Math.round(cuotaMensual),
    totalAPagar: Math.round(totalAPagar),
    totalIntereses: Math.round(totalIntereses),
    cftea: Math.round(cftea * 10000) / 100,  // 2 decimales como %
    cfteMensual: Math.round(cfteMensual * 10000) / 100,
  }
}

// ─── Cuentas / Rendimiento ───────────────────────────────────────────────────

export interface ResultadoRendimiento {
  interesesGanados: number
  saldoFinal: number
  rendimientoMensual: number
  rendimientoAnual: number
}

/**
 * Calcula cuánto rinde un saldo en una cuenta con TNA dada.
 *
 * @param capital - Saldo en ARS
 * @param tna     - Tasa Nominal Anual (ej: 0.30 para 30%)
 * @param dias    - Días que el dinero permanece invertido (default: 30)
 */
export function calcularRendimientoCuenta(
  capital: number,
  tna: number,
  dias = 30
): ResultadoRendimiento | null {
  if (capital <= 0 || tna < 0 || dias <= 0) return null

  const tasaDiaria = tna / 365
  const interesesGanados = capital * tasaDiaria * dias
  const saldoFinal = capital + interesesGanados

  // Para comparar en la UI
  const rendimientoMensual = capital * (tna / 12)
  const rendimientoAnual = capital * tna

  return {
    interesesGanados: Math.round(interesesGanados),
    saldoFinal: Math.round(saldoFinal),
    rendimientoMensual: Math.round(rendimientoMensual),
    rendimientoAnual: Math.round(rendimientoAnual),
  }
}

// ─── Conversión ──────────────────────────────────────────────────────────────

/**
 * Convierte ARS a USD al tipo de cambio indicado.
 */
export function convertirARS_USD(ars: number, tipoCambio: number): number {
  if (tipoCambio <= 0) return 0
  return Math.round((ars / tipoCambio) * 100) / 100
}

/**
 * Convierte USD a ARS al tipo de cambio indicado.
 */
export function convertirUSD_ARS(usd: number, tipoCambio: number): number {
  return Math.round(usd * tipoCambio)
}

// ─── Comparación entre prestamistas ──────────────────────────────────────────

export interface ComparacionPrestamo {
  ahorroVsMasCaro: number
  ahorroVsPromedio: number
  posicion: number   // 1 = el más barato
  totalOpciones: number
}

/**
 * Dado un conjunto de cuotas mensuales de diferentes prestamistas,
 * calcula cuánto ahorra el usuario eligiendo uno específico.
 */
export function compararPrestamistas(
  cuotaElegida: number,
  todasLasCuotas: number[],
  cuotas: number
): ComparacionPrestamo {
  const sorted = [...todasLasCuotas].sort((a, b) => a - b)
  const masCara = sorted[sorted.length - 1]
  const promedio = todasLasCuotas.reduce((s, c) => s + c, 0) / todasLasCuotas.length
  const posicion = sorted.indexOf(cuotaElegida) + 1

  return {
    ahorroVsMasCaro: Math.round((masCara - cuotaElegida) * cuotas),
    ahorroVsPromedio: Math.round((promedio - cuotaElegida) * cuotas),
    posicion,
    totalOpciones: todasLasCuotas.length,
  }
}
