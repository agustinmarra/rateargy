import fs from "fs"
import path from "path"

const SHEET_ID = "1bv7iUYwgrLcKLTA715Z8p1F3RqgMwaQtXKkYLgZXCoY"

async function fetchSheet(sheetName: string): Promise<string> {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Error leyendo ${sheetName}: ${res.status}`)
  return res.text()
}

function parseCSV(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim())
  return lines.slice(1).map(line => {
    const values: string[] = []
    let current = ""
    let inQuotes = false
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue }
      if (char === "," && !inQuotes) { values.push(current.trim()); current = ""; continue }
      current += char
    }
    values.push(current.trim())
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = values[i] ?? "" })
    return row
  })
}

async function sync() {
  console.log("🔄 Leyendo Google Sheet...")

  const [tarjetasCSV, beneficiosCSV, naftaCSV, preciosCSV, semanaCSV] = await Promise.all([
    fetchSheet("TARJETAS"),
    fetchSheet("BENEFICIOS"),
    fetchSheet("NAFTA"),
    fetchSheet("PRECIOS_NAFTA"),
    fetchSheet("BENEFICIOS_SEMANA"),
  ])

  const tarjetasRaw = parseCSV(tarjetasCSV)
  const beneficiosRaw = parseCSV(beneficiosCSV)
  const naftaRaw = parseCSV(naftaCSV)
  const preciosRaw = parseCSV(preciosCSV)
  const semanaRaw = parseCSV(semanaCSV)

  console.log(`✅ Leídas: ${tarjetasRaw.length} tarjetas, ${beneficiosRaw.length} beneficios, ${naftaRaw.length} descuentos nafta`)

  // Categorías válidas
  const CATS = ["super","nafta","farmacia","delivery","online","viajes","transporte","servicios"]

  // Construir objeto de tarjetas con beneficios
  const tarjetas = tarjetasRaw.map(t => {
    // Para cada tarjeta buscar sus beneficios por categoría
    // Si hay múltiples días para la misma categoría, tomamos el tope más alto
    const beneficiosPorCat: Record<string, { pct: number; tope: number; dias: string; lugar: string; descripcion: string }> = {}

    CATS.forEach(cat => {
      const rows = beneficiosRaw.filter(b => b.tarjetaId === t.id && b.categoria === cat)
      if (rows.length === 0) {
        beneficiosPorCat[cat] = { pct: 0, tope: 0, dias: "", lugar: "", descripcion: "" }
        return
      }
      // Tomar el beneficio con mayor tope
      const best = rows.reduce((prev, curr) =>
        Number(curr.tope) > Number(prev.tope) ? curr : prev
      )
      // Combinar todos los días y lugares
      const diasUnicos = [...new Set(rows.map(r => r.dias).filter(Boolean))].join(" / ")
      const lugaresUnicos = [...new Set(rows.map(r => r.lugar).filter(Boolean))].join(" / ")
      beneficiosPorCat[cat] = {
        pct: Number(best.pct) || 0,
        tope: Number(best.tope) || 0,
        dias: diasUnicos,
        lugar: lugaresUnicos,
        descripcion: best.descripcion || ""
      }
    })

    return {
      id: t.id,
      nombre: t.nombre,
      banco: t.banco,
      bancoId: t.bancoId,
      red: t.red,
      costoAnual: Number(t.costoAnual) || 0,
      urlSolicitud: t.urlSolicitud || "",
      gradiente: getGradiente(t.bancoId),
      beneficios: beneficiosPorCat,
      pills: getPills(t.id, beneficiosPorCat),
    }
  })

  // Construir datos de nafta
  const descuentosNafta = naftaRaw.map(n => ({
    bancoId: n.bancoId,
    banco: n.banco,
    porcentaje: Number(n.pct) || 0,
    porcentajeExtra: Number(n.pcotExtra) || 0,
    segmento: n.segmento || "",
    tope: Number(n.tope) || 0,
    topeExtra: Number(n.topeExtra) || 0,
    dia: n.dia || "",
    estaciones: n.estaciones ? n.estaciones.split(" y ").map((e: string) => e.trim()) : ["Todas"],
    medio: n.medio || "",
    condicion: n.condicion || "",
    verificado: n.verificado === "SI"
  }))

  // Construir precios de nafta
  const preciosNafta: Record<string, Record<string, number>> = {}
  preciosRaw.forEach(p => {
    if (!preciosNafta[p.estacion]) preciosNafta[p.estacion] = {}
    preciosNafta[p.estacion][p.tipo] = Number(p.precio) || 0
  })

  // Construir beneficios de la semana
  const beneficiosSemana = semanaRaw.map(s => ({
    banco: s.banco,
    bancoId: s.bancoId,
    categoria: s.categoria,
    titulo: s.titulo,
    dias: s.dias,
    tope: s.tope,
    descripcion: s.descripcion,
    vigenciaHasta: s.vigenciaHasta,
    icono: s.icono
  }))

  // Generar tarjetas-data.ts
  const tarjetasContent = `// ============================================================
// GENERADO AUTOMÁTICAMENTE DESDE GOOGLE SHEETS
// NO EDITAR MANUALMENTE — usar el Sheet
// Sheet: https://docs.google.com/spreadsheets/d/${SHEET_ID}
// Última sincronización: ${new Date().toLocaleString("es-AR")}
// ============================================================

export type CatKey = "super"|"nafta"|"farmacia"|"delivery"|"online"|"viajes"|"transporte"|"servicios"
export type Gastos = Record<CatKey, number>

export type Beneficio = {
  pct: number
  tope: number
  dias: string
  lugar: string
  descripcion: string
}

export type Tarjeta = {
  id: string
  nombre: string
  banco: string
  bancoId: string
  red: string
  costoAnual: number
  urlSolicitud: string
  gradiente: string
  beneficios: Record<CatKey, Beneficio>
  pills: string[]
}

export const TARJETAS: Tarjeta[] = ${JSON.stringify(tarjetas, null, 2)}

export const CATS: { key: CatKey; label: string }[] = [
  { key: "super",      label: "Supermercados" },
  { key: "nafta",      label: "Nafta / combustible" },
  { key: "farmacia",   label: "Farmacia / salud" },
  { key: "delivery",   label: "Restaurantes / delivery" },
  { key: "online",     label: "Compras online" },
  { key: "viajes",     label: "Viajes / turismo" },
  { key: "transporte", label: "Transporte (SUBE/peajes)" },
  { key: "servicios",  label: "Servicios (luz, gas, tel.)" },
]

export function calcularAhorro(tarjeta: Tarjeta, gastos: Gastos): number {
  return Math.round(
    (Object.keys(gastos) as CatKey[]).reduce((acc, cat) => {
      const b = tarjeta.beneficios[cat]
      if (!b?.pct || !gastos[cat]) return acc
      return acc + Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity)
    }, 0)
  )
}

export function rankear(gastos: Gastos) {
  return [...TARJETAS]
    .map(t => ({ ...t, ahorro: calcularAhorro(t, gastos) }))
    .sort((a, b) => b.ahorro - a.ahorro)
}
`

  // Generar nafta-data.ts
  const naftaContent = `// ============================================================
// GENERADO AUTOMÁTICAMENTE DESDE GOOGLE SHEETS
// NO EDITAR MANUALMENTE — usar el Sheet
// Última sincronización: ${new Date().toLocaleString("es-AR")}
// ============================================================

export const MES_ACTUALIZACION = "${getMesActual()}"

export const DESCUENTOS_NAFTA = ${JSON.stringify(descuentosNafta, null, 2)}

export const PRECIOS_NAFTA = ${JSON.stringify(preciosNafta, null, 2)}

export const LITROS_TANQUE = 45

export const BENEFICIOS_SEMANA = ${JSON.stringify(beneficiosSemana, null, 2)}
`

  // Escribir archivos
  const componentsDir = path.join(process.cwd(), "components")
  const dataDir = path.join(process.cwd(), "data")

  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  fs.writeFileSync(path.join(componentsDir, "tarjetas-data.ts"), tarjetasContent)
  fs.writeFileSync(path.join(dataDir, "nafta-data.ts"), naftaContent)

  console.log("✅ components/tarjetas-data.ts actualizado")
  console.log("✅ data/nafta-data.ts actualizado")
  console.log(`📊 ${tarjetas.length} tarjetas sincronizadas`)
  console.log(`⛽ ${descuentosNafta.length} descuentos de nafta sincronizados`)
  console.log("🎉 Sincronización completada")
}

function getMesActual(): string {
  return new Date().toLocaleDateString("es-AR", { month: "long", year: "numeric" })
}

function getGradiente(bancoId: string): string {
  const gradientes: Record<string, string> = {
    "galicia": "linear-gradient(135deg, #134e32 0%, #1a7f4f 60%, #22c55e 100%)",
    "bbva": "linear-gradient(135deg, #0a2540 0%, #004481 60%, #0ea5e9 100%)",
    "santander": "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 60%, #f87171 100%)",
    "macro": "linear-gradient(135deg, #78350f 0%, #b45309 60%, #fbbf24 100%)",
    "naranja-x": "linear-gradient(135deg, #7c2d12 0%, #c2410c 60%, #fb923c 100%)",
    "bna": "linear-gradient(135deg, #0c1445 0%, #1e3a8a 60%, #3b82f6 100%)",
    "supervielle": "linear-gradient(135deg, #431407 0%, #9a3412 60%, #f97316 100%)",
    "icbc": "linear-gradient(135deg, #4c0519 0%, #9f1239 60%, #fb7185 100%)",
    "uala": "linear-gradient(135deg, #2e1065 0%, #5b21b6 60%, #a78bfa 100%)",
    "mercado-pago": "linear-gradient(135deg, #003087 0%, #009ee3 60%, #00b1ea 100%)",
    "personal-pay": "linear-gradient(135deg, #1e1b4b 0%, #3730a3 60%, #818cf8 100%)",
    "credicoop": "linear-gradient(135deg, #0c2340 0%, #1e40af 60%, #60a5fa 100%)",
    "patagonia": "linear-gradient(135deg, #052e16 0%, #166534 60%, #4ade80 100%)",
    "provincia": "linear-gradient(135deg, #0d3d3d 0%, #0f766e 60%, #2dd4bf 100%)",
    "brubank": "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 60%, #7c3aed 100%)",
    "hipotecario": "linear-gradient(135deg, #0c1445 0%, #1e3a8a 60%, #60a5fa 100%)",
  }
  return gradientes[bancoId] || "linear-gradient(135deg, #1f2937 0%, #374151 100%)"
}

function getPills(id: string, beneficios: Record<string, any>): string[] {
  const pills: string[] = []
  if (beneficios.super?.pct > 0) {
    const dias = beneficios.super.dias ? ` ${beneficios.super.dias}` : ""
    const lugar = beneficios.super.lugar ? ` en ${beneficios.super.lugar.split(" / ")[0]}` : ""
    pills.push(`${beneficios.super.pct}%${lugar}${dias}`)
  }
  if (beneficios.nafta?.pct > 0) {
    pills.push(`${beneficios.nafta.pct}% nafta${beneficios.nafta.dias ? " " + beneficios.nafta.dias : ""}`)
  }
  if (beneficios.farmacia?.pct > 0) {
    pills.push(`${beneficios.farmacia.pct}% farmacias`)
  }
  if (beneficios.online?.pct > 0) {
    pills.push(`${beneficios.online.pct}% online`)
  }
  return pills.slice(0, 4)
}

sync().catch(console.error)
