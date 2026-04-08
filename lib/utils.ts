/**
 * Convierte un nombre de banco/producto a slug URL-safe.
 * Ej: "Banco Galicia" → "banco-galicia"
 *     "Ualá" → "uala"
 */
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Formatea un número como moneda ARS.
 * Ej: 1500000 → "$1.500.000"
 */
export function formatARS(amount: number): string {
  return `$${amount.toLocaleString('es-AR')}`
}

/**
 * Formatea un porcentaje.
 * Ej: 0.60 → "60%"  |  0.325 → "32,5%"
 */
export function formatPercent(rate: number, decimals = 1): string {
  return `${(rate * 100).toFixed(decimals).replace('.', ',')}%`
}

/**
 * Clamp a value between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
