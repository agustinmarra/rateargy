// tarjetas-data.ts — ACTUALIZADO ABRIL 2026
export type CatKey = "super" | "nafta" | "farmacia" | "delivery" | "online" | "viajes" | "transporte" | "servicios";

export type Gastos = Record<CatKey, number>;

export type Beneficio = {
  pct: number;   // decimal: 0.25 = 25%
  tope: number;  // tope en pesos por período
  dias?: string;
  lugar?: string;
  descripcion: string;
};

export type Tarjeta = {
  id: string;
  bancoId: string;
  nombre: string;
  banco: string;
  red: "Visa" | "Mastercard";
  gradiente: string;
  beneficios: Partial<Record<CatKey, Beneficio>>;
  pills: string[];
  costoAnual: number;
};

export const TARJETAS: Tarjeta[] = [
  // ── Galicia ──────────────────────────────────────────────────────────────────
  {
    id: "galicia-eminent",
    bancoId: "galicia",
    nombre: "Galicia Éminent Visa Signature",
    banco: "Banco Galicia",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #134e32 0%, #1a7f4f 60%, #22c55e 100%)",
    beneficios: {
      super:    { pct: 0.25, tope: 25000, dias: "martes y jueves", lugar: "Jumbo / Coto / La Anónima", descripcion: "25% reintegro martes y jueves con MODO" },
      nafta:    { pct: 0.20, tope: 15000, dias: "lunes", lugar: "YPF / Axion", descripcion: "20% nafta lunes con MODO" },
      farmacia: { pct: 0.15, tope: 8000,  dias: "todos los días", lugar: "Farmacity adheridas", descripcion: "15% farmacias" },
      delivery: { pct: 0.10, tope: 6000,  dias: "miércoles", lugar: "PedidosYa / Rappi", descripcion: "10% delivery miércoles" },
    },
    pills: ["25% Jumbo martes", "20% nafta lunes", "15% farmacias"],
    costoAnual: 0,
  },
  {
    id: "galicia-gold",
    bancoId: "galicia",
    nombre: "Galicia Visa Gold",
    banco: "Banco Galicia",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #166534 0%, #4ade80 100%)",
    beneficios: {
      super: { pct: 0.20, tope: 20000, dias: "martes y jueves", lugar: "Jumbo / Coto", descripcion: "20% reintegro martes y jueves" },
      nafta: { pct: 0.15, tope: 12000, dias: "lunes", lugar: "YPF", descripcion: "15% nafta lunes YPF" },
    },
    pills: ["20% Jumbo martes", "15% nafta lunes"],
    costoAnual: 0,
  },

  // ── BBVA ─────────────────────────────────────────────────────────────────────
  {
    id: "bbva-platinum",
    bancoId: "bbva",
    nombre: "BBVA Visa Platinum",
    banco: "BBVA Argentina",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #0a2540 0%, #004481 60%, #0ea5e9 100%)",
    beneficios: {
      super:    { pct: 0.30, tope: 22000, dias: "jueves", lugar: "Coto / Carrefour", descripcion: "30% supermercados jueves" },
      farmacia: { pct: 0.15, tope: 8000,  dias: "todos los días", lugar: "Farmacity", descripcion: "15% farmacias" },
      online:   { pct: 0.10, tope: 10000, dias: "todos los días", descripcion: "10% compras online" },
    },
    pills: ["30% Coto jueves", "15% farmacias", "10% online"],
    costoAnual: 0,
  },
  {
    id: "bbva",
    bancoId: "bbva",
    nombre: "BBVA Visa Clásica",
    banco: "BBVA Argentina",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #1a3a5c 0%, #1a5fa8 60%, #3b82f6 100%)",
    beneficios: {
      super:    { pct: 0.20, tope: 15000, dias: "jueves", lugar: "Coto / Carrefour", descripcion: "20% supermercados jueves" },
      farmacia: { pct: 0.10, tope: 5000,  dias: "todos los días", lugar: "Farmacity", descripcion: "10% farmacias" },
    },
    pills: ["20% Coto jueves", "10% farmacias"],
    costoAnual: 0,
  },

  // ── Santander ─────────────────────────────────────────────────────────────────
  {
    id: "santander-gold",
    bancoId: "santander",
    nombre: "Santander Visa Gold",
    banco: "Santander",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #5c3d00 0%, #96680a 60%, #c9940f 100%)",
    beneficios: {
      super:    { pct: 0.25, tope: 18000, dias: "viernes", lugar: "Carrefour / Día", descripcion: "25% supermercados viernes" },
      nafta:    { pct: 0.10, tope: 7500,  dias: "jueves", lugar: "YPF", descripcion: "10% nafta jueves app YPF" },
      delivery: { pct: 0.10, tope: 5000,  dias: "martes", lugar: "PedidosYa", descripcion: "10% delivery martes" },
    },
    pills: ["25% Carrefour viernes", "10% nafta jueves"],
    costoAnual: 0,
  },
  {
    id: "santander",
    bancoId: "santander",
    nombre: "Santander Visa Clásica",
    banco: "Santander",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #7a0000 0%, #b80000 60%, #e60000 100%)",
    beneficios: {
      super: { pct: 0.15, tope: 12000, dias: "viernes", lugar: "Carrefour / Día", descripcion: "15% supermercados viernes" },
    },
    pills: ["15% Carrefour viernes"],
    costoAnual: 0,
  },

  // ── Macro ─────────────────────────────────────────────────────────────────────
  {
    id: "macro-visa",
    bancoId: "macro",
    nombre: "Macro Visa Selecta",
    banco: "Banco Macro",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #0a3370 0%, #1254a8 60%, #1a6fd4 100%)",
    beneficios: {
      super: { pct: 0.25, tope: 20000, dias: "lunes", lugar: "Vea / Walmart", descripcion: "25% supermercados lunes con MODO" },
      nafta: { pct: 0.20, tope: 15000, dias: "miércoles", lugar: "YPF", descripcion: "20% nafta miércoles MODO (Selecta)" },
    },
    pills: ["25% Vea lunes", "20% nafta miércoles"],
    costoAnual: 0,
  },
  {
    id: "macro",
    bancoId: "macro",
    nombre: "Macro Visa Platinum",
    banco: "Banco Macro",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #0f2a5e 0%, #1a47a0 60%, #2563eb 100%)",
    beneficios: {
      super: { pct: 0.20, tope: 15000, dias: "lunes", lugar: "Vea / Walmart", descripcion: "20% supermercados lunes" },
      nafta: { pct: 0.15, tope: 10000, dias: "miércoles", lugar: "YPF", descripcion: "15% nafta miércoles MODO" },
    },
    pills: ["20% Vea lunes", "15% nafta miércoles"],
    costoAnual: 0,
  },

  // ── Naranja X ─────────────────────────────────────────────────────────────────
  {
    id: "naranja-x",
    bancoId: "naranja-x",
    nombre: "Naranja X Visa",
    banco: "Naranja X",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #b33a00 0%, #e65200 60%, #ff6a1a 100%)",
    beneficios: {
      delivery: { pct: 0.15, tope: 8000,  dias: "todos los días", lugar: "PedidosYa / Rappi", descripcion: "15% delivery" },
      online:   { pct: 0.15, tope: 10000, dias: "todos los días", descripcion: "15% compras online" },
    },
    pills: ["15% delivery", "15% online"],
    costoAnual: 0,
  },

  // ── Banco Nación ─────────────────────────────────────────────────────────────
  {
    id: "bna-gold",
    bancoId: "bna",
    nombre: "BNA Visa Gold",
    banco: "Banco Nación",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #003a6b 0%, #005aaa 60%, #0073cc 100%)",
    beneficios: {
      super: { pct: 0.25, tope: 18000, dias: "martes", lugar: "Coto / Carrefour", descripcion: "25% supermercados martes" },
      nafta: { pct: 0.20, tope: 10000, dias: "viernes", lugar: "YPF / Shell", descripcion: "20% nafta viernes MODO BNA+" },
    },
    pills: ["25% Coto martes", "20% nafta viernes"],
    costoAnual: 0,
  },
  {
    id: "bna",
    bancoId: "bna",
    nombre: "BNA Visa Clásica",
    banco: "Banco Nación",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #002952 0%, #003d7a 60%, #0055ab 100%)",
    beneficios: {
      super: { pct: 0.15, tope: 12000, dias: "martes", lugar: "Coto", descripcion: "15% supermercados martes" },
      nafta: { pct: 0.15, tope: 8000,  dias: "viernes", lugar: "YPF", descripcion: "15% nafta viernes" },
    },
    pills: ["15% Coto martes", "15% nafta viernes"],
    costoAnual: 0,
  },

  // ── Supervielle ──────────────────────────────────────────────────────────────
  {
    id: "supervielle",
    bancoId: "supervielle",
    nombre: "Supervielle Visa",
    banco: "Supervielle",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #6d1a7e 0%, #9d28b0 60%, #c040d4 100%)",
    beneficios: {
      super: { pct: 0.20, tope: 15000, dias: "miércoles", descripcion: "20% supermercados miércoles" },
      nafta: { pct: 0.10, tope: 8000,  dias: "variable", descripcion: "10% nafta (verificar app)" },
    },
    pills: ["20% super miércoles", "10% nafta"],
    costoAnual: 0,
  },

  // ── ICBC ─────────────────────────────────────────────────────────────────────
  {
    id: "icbc-platinum",
    bancoId: "icbc",
    nombre: "ICBC Visa Platinum",
    banco: "ICBC",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #7c0000 0%, #b30000 60%, #e00000 100%)",
    beneficios: {
      super:    { pct: 0.25, tope: 20000, dias: "lunes", descripcion: "25% supermercados lunes" },
      nafta:    { pct: 0.15, tope: 15000, dias: "martes", descripcion: "15% nafta martes (cuenta sueldo)" },
      farmacia: { pct: 0.10, tope: 6000,  dias: "todos los días", descripcion: "10% farmacias" },
    },
    pills: ["25% super lunes", "15% nafta martes", "10% farmacias"],
    costoAnual: 0,
  },
  {
    id: "icbc",
    bancoId: "icbc",
    nombre: "ICBC Visa Clásica",
    banco: "ICBC",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #9b1212 0%, #cc2222 60%, #e84040 100%)",
    beneficios: {
      super: { pct: 0.15, tope: 12000, dias: "lunes", descripcion: "15% supermercados lunes" },
      nafta: { pct: 0.10, tope: 8000,  dias: "martes", descripcion: "10% nafta martes" },
    },
    pills: ["15% super lunes", "10% nafta martes"],
    costoAnual: 0,
  },

  // ── Ualá ─────────────────────────────────────────────────────────────────────
  {
    id: "uala",
    bancoId: "uala",
    nombre: "Ualá Mastercard",
    banco: "Ualá",
    red: "Mastercard",
    gradiente: "linear-gradient(135deg, #3d006b 0%, #6200b3 60%, #8c00e6 100%)",
    beneficios: {
      delivery: { pct: 0.20, tope: 10000, dias: "todos los días", lugar: "PedidosYa / Rappi", descripcion: "20% delivery" },
      online:   { pct: 0.15, tope: 10000, dias: "todos los días", descripcion: "15% compras online" },
    },
    pills: ["20% delivery", "15% online"],
    costoAnual: 0,
  },

  // ── Personal Pay ─────────────────────────────────────────────────────────────
  {
    id: "personal-pay",
    bancoId: "personal-pay",
    nombre: "Personal Pay Mastercard",
    banco: "Personal Pay",
    red: "Mastercard",
    gradiente: "linear-gradient(135deg, #003d6b 0%, #006bb3 60%, #0090e6 100%)",
    beneficios: {
      delivery:   { pct: 0.15, tope: 8000, dias: "todos los días", descripcion: "15% delivery" },
      online:     { pct: 0.10, tope: 8000, dias: "todos los días", descripcion: "10% compras online" },
      transporte: { pct: 0.30, tope: 5000, dias: "todos los días", descripcion: "30% en recargas SUBE" },
    },
    pills: ["15% delivery", "30% SUBE", "10% online"],
    costoAnual: 0,
  },

  // ── Credicoop ─────────────────────────────────────────────────────────────────
  {
    id: "credicoop",
    bancoId: "credicoop",
    nombre: "Credicoop Mastercard",
    banco: "Banco Credicoop",
    red: "Mastercard",
    gradiente: "linear-gradient(135deg, #003366 0%, #004fa3 60%, #0066cc 100%)",
    beneficios: {
      super: { pct: 0.15, tope: 10000, dias: "lunes", descripcion: "15% supermercados lunes" },
      nafta: { pct: 0.15, tope: 4500,  dias: "viernes", descripcion: "15% nafta viernes (tope $4.500/día)" },
    },
    pills: ["15% super lunes", "15% nafta viernes"],
    costoAnual: 0,
  },

  // ── Patagonia ─────────────────────────────────────────────────────────────────
  {
    id: "patagonia",
    bancoId: "patagonia",
    nombre: "Patagonia Visa",
    banco: "Banco Patagonia",
    red: "Visa",
    gradiente: "linear-gradient(135deg, #003d3d 0%, #006666 60%, #008080 100%)",
    beneficios: {
      super: { pct: 0.20, tope: 15000, dias: "miércoles", descripcion: "20% supermercados miércoles" },
      nafta: { pct: 0.20, tope: 10000, dias: "jueves", descripcion: "20% nafta jueves" },
    },
    pills: ["20% super miércoles", "20% nafta jueves"],
    costoAnual: 0,
  },

  // ── Cuenta DNI / Provincia ────────────────────────────────────────────────────
  {
    id: "cuenta-dni",
    bancoId: "provincia",
    nombre: "Cuenta DNI Mastercard",
    banco: "Banco Provincia",
    red: "Mastercard",
    gradiente: "linear-gradient(135deg, #0d4a0d 0%, #1a7a1a 60%, #24a824 100%)",
    beneficios: {
      super:    { pct: 0.15, tope: 10000, dias: "viernes", descripcion: "15% supermercados viernes" },
      farmacia: { pct: 0.10, tope: 5000,  dias: "todos los días", descripcion: "10% farmacias" },
    },
    pills: ["15% super viernes", "10% farmacias"],
    costoAnual: 0,
  },

  // ── Mercado Pago ─────────────────────────────────────────────────────────────
  {
    id: "mercado-pago",
    bancoId: "mercado-pago",
    nombre: "Tarjeta Mercado Pago",
    banco: "Mercado Pago",
    red: "Mastercard",
    gradiente: "linear-gradient(135deg, #003087 0%, #009ee3 60%, #00b1ea 100%)",
    beneficios: {
      delivery: { pct: 0.30, tope: 12000, dias: "todos los días", lugar: "Mercado Delivery", descripcion: "30% Mercado Delivery" },
      online:   { pct: 0.20, tope: 15000, dias: "todos los días", descripcion: "20% compras en Mercado Libre" },
      nafta:    { pct: 0.10, tope: 6000,  dias: "variable", lugar: "YPF", descripcion: "10% nafta YPF app Mercado Pago" },
    },
    pills: ["30% Mercado Delivery", "20% Mercado Libre", "10% nafta YPF"],
    costoAnual: 0,
  },
];

// ─── calcularAhorro ───────────────────────────────────────────────────────────
// Suma el ahorro máximo aplicable de cada categoría para una tarjeta y perfil de gastos.
// Diseño defensivo: cualquier campo undefined/NaN es ignorado, nunca devuelve NaN.
export function calcularAhorro(tarjeta: Tarjeta, gastos: Gastos): number {
  let total = 0;
  for (const cat of Object.keys(gastos) as CatKey[]) {
    const b = tarjeta.beneficios[cat];
    const gasto = gastos[cat] ?? 0;
    if (!b || !gasto || !b.pct || !b.tope) continue;
    const ahorro = Math.min(gasto * b.pct, b.tope);
    if (isNaN(ahorro)) continue;
    total += ahorro;
  }
  return Math.round(total);
}

// ─── rankear ─────────────────────────────────────────────────────────────────
// Devuelve los tarjetas ordenadas por ahorro descendente, con el campo `ahorro` incluido.
export function rankear(gastos: Gastos): (Tarjeta & { ahorro: number })[] {
  return [...TARJETAS]
    .map(t => ({ ...t, ahorro: calcularAhorro(t, gastos) }))
    .sort((a, b) => b.ahorro - a.ahorro);
}
