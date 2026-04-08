// ─────────────────────────────────────────────────────────────────────────────
// Constantes financieras de referencia — Argentina
// IMPORTANTE: Estos valores son referenciales. Actualizar periódicamente.
// Fuentes: BCRA, INDEC, sitios oficiales de cada entidad.
// ─────────────────────────────────────────────────────────────────────────────

export const FINANCIAL_CONSTANTS = {
  // Tasas de referencia BCRA (actualizar mensualmente)
  TNA_REFERENCIAL_PRESTAMOS: 0.60,    // 60% TNA referencial préstamos personales
  TNA_REFERENCIAL_CUENTAS: 0.30,      // 30% TNA rendimiento cuentas/billeteras
  TNA_PLAZO_FIJO_30D: 0.32,           // 32% TNA plazo fijo 30 días referencial
  TASA_POLITICA_MONETARIA: 0.32,      // Tasa de política monetaria del BCRA

  // Inflación (INDEC — actualizar mensualmente)
  INFLACION_ANUAL_ESTIMADA: 0.50,     // 50% inflación anual estimada
  INFLACION_MENSUAL_ESTIMADA: 0.034,  // ~3.4% mensual

  // Dólar (valores placeholder — en producción conectar a API)
  DOLAR_OFICIAL_COMPRA: 1070,
  DOLAR_OFICIAL_VENTA: 1110,
  DOLAR_MEP: 1150,
  DOLAR_BLUE_COMPRA: 1180,
  DOLAR_BLUE_VENTA: 1200,
  DOLAR_CCL: 1155,

  // Umbrales para UI
  TNA_ALTO_RENDIMIENTO: 0.29,         // >= 29% TNA = "alto rendimiento"
  PUNTUACION_DESTACADA: 9.0,          // >= 9.0 = "destacado" en la UI

  // Texto de actualización
  ULTIMA_ACTUALIZACION: 'Abril 2026',
} as const

export type FinancialConstants = typeof FINANCIAL_CONSTANTS
