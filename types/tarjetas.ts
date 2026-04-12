export interface Beneficio { pct: number; tope: number; dias?: string }
export interface Tarjeta { id: string; nombre: string; banco: string; color: string; bgColor: string; costoAnual: number; beneficios: { super: Beneficio; nafta: Beneficio; transporte: Beneficio; farmacia: Beneficio; restaurant: Beneficio; online: Beneficio; viajes: Beneficio; servicios: Beneficio }; pills: string[] }
export interface Gastos { super: number; nafta: number; transporte: number; farmacia: number; restaurant: number; online: number; viajes: number; servicios: number }
