"use client"

import { useState } from "react"

// ── Datos actualizados mayo 2026 ─────────────────────────────────────────────
const BILLETERAS = [
  {
    id: "brubank",
    nombre: "Brubank",
    color: "#6C3DFF",
    emoji: "🏦",
    tramosStr: "36% hasta $750K · 24% hasta $1M",
    tramos: [
      { tope: 750_000, tna: 36 },
      { tope: 1_000_000, tna: 24 },
    ],
    tope: 1_000_000,
    acreditaSueldo: true,
    tarjetaDebito: true,
    tarjetaCredito: true,
    nota: "La más alta del mercado. Tasa escalonada.",
    destacada: true,
    href: "https://brubank.com.ar/",
  },
  {
    id: "uala",
    nombre: "Ualá",
    color: "#FF5A00",
    emoji: "🟠",
    tramosStr: "27% TNA (nivel máximo, $500K+ en ops)",
    tramos: [{ tope: 1_000_000, tna: 27 }],
    tope: 1_000_000,
    acreditaSueldo: true,
    tarjetaDebito: true,
    tarjetaCredito: true,
    nota: "Tasa progresiva. Máximo requiere $500K+ en operaciones.",
    destacada: false,
    href: "https://www.uala.com.ar/",
  },
  {
    id: "naranjax",
    nombre: "Naranja X",
    color: "#FF6D00",
    emoji: "🟧",
    tramosStr: "21% TNA hasta $1M",
    tramos: [{ tope: 1_000_000, tna: 21 }],
    tope: 1_000_000,
    acreditaSueldo: true,
    tarjetaDebito: true,
    tarjetaCredito: true,
    nota: "\"Frascos\" separados para ahorro hasta $30M con tasas adicionales.",
    destacada: false,
    href: "https://www.naranjax.com/",
  },
  {
    id: "mercadopago",
    nombre: "Mercado Pago",
    color: "#009EE3",
    emoji: "💙",
    tramosStr: "~25% TNA (FCI fluctúa diariamente)",
    tramos: [{ tope: Infinity, tna: 25 }],
    tope: Infinity,
    acreditaSueldo: true,
    tarjetaDebito: true,
    tarjetaCredito: true,
    nota: "Rinde vía FCI. El % varía según tasa de mercado.",
    destacada: false,
    href: "https://www.mercadopago.com.ar/",
  },
  {
    id: "personalpay",
    nombre: "Personal Pay",
    color: "#6D28D9",
    emoji: "🟣",
    tramosStr: "~18% TNA (FCI referencial)",
    tramos: [{ tope: Infinity, tna: 18 }],
    tope: Infinity,
    acreditaSueldo: false,
    tarjetaDebito: true,
    tarjetaCredito: false,
    nota: "Prepaga Visa, no de crédito. Rinde vía FCI.",
    destacada: false,
    href: "https://www.personalpay.com.ar/",
  },
]

function calcularRendimiento(monto: number, tramos: { tope: number; tna: number }[]): number {
  // Para simplificar: aplicamos la tna del tramo en que cae el monto
  let tna = tramos[0].tna
  for (const tramo of tramos) {
    if (monto <= tramo.tope) {
      tna = tramo.tna
      break
    }
  }
  return monto * (tna / 100) / 12
}

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)

const PRESETS = [50_000, 200_000, 500_000, 1_000_000]

export default function BilleterasCalculadora() {
  const [monto, setMonto] = useState(200_000)

  const resultados = BILLETERAS.map((b) => ({
    ...b,
    ganancia: calcularRendimiento(monto, b.tramos),
  })).sort((a, b) => b.ganancia - a.ganancia)

  return (
    <div>
      {/* Calculadora */}
      <section style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 16, padding: "28px 24px", marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          Calculá cuánto ganás por mes
        </h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>
          Ingresá el saldo promedio que mantenés en tu billetera.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setMonto(p)}
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: monto === p ? "2px solid #059669" : "1.5px solid #e2e8f0",
                background: monto === p ? "#ecfdf5" : "white",
                color: monto === p ? "#059669" : "#475569",
                transition: "all 0.15s",
              }}
            >
              {formatARS(p)}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>$</span>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(Math.max(0, Number(e.target.value)))}
            style={{
              width: 200, padding: "10px 14px", borderRadius: 10, fontSize: 16, fontWeight: 700,
              border: "1.5px solid #e2e8f0", background: "white", color: "#0f172a", outline: "none",
            }}
          />
        </div>
      </section>

      {/* Resultados */}
      <div style={{ display: "grid", gap: 14 }}>
        {resultados.map((b, i) => (
          <div
            key={b.id}
            style={{
              background: "white",
              border: i === 0 ? "2px solid #059669" : "1.5px solid #e2e8f0",
              borderRadius: 14,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* Rank */}
            <span style={{
              width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              background: i === 0 ? "#059669" : "#f1f5f9",
              color: i === 0 ? "white" : "#94a3b8",
              fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
              {i + 1}
            </span>

            {/* Logo dot + name */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 130 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: b.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 16 }}>{b.emoji.replace(/[🟠🟧🟣🏦💙]/g, "").trim() || b.nombre[0]}</span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#0f172a" }}>{b.nombre}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{b.tramosStr}</div>
              </div>
            </div>

            {/* Ganancia */}
            <div style={{ marginLeft: "auto", textAlign: "right", minWidth: 120 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: i === 0 ? "#059669" : "#0f172a" }}>
                {formatARS(b.ganancia)}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>por mes estimado</div>
            </div>

            {/* Características */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {b.acreditaSueldo && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>Cuenta sueldo</span>}
              {b.tarjetaCredito && <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: "#eff6ff", color: "#2563eb", fontWeight: 600 }}>Tarjeta crédito</span>}
            </div>

            {/* Link */}
            <a
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700,
                background: i === 0 ? "#059669" : "#f8fafc",
                color: i === 0 ? "white" : "#475569",
                textDecoration: "none", border: i === 0 ? "none" : "1px solid #e2e8f0",
                flexShrink: 0,
              }}
            >
              Ver →
            </a>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 24, lineHeight: 1.7 }}>
        Tasas de referencia mayo 2026. Las billeteras que rinden vía FCI (Mercado Pago, Personal Pay) pueden variar diariamente.
        El cálculo es estimativo y no constituye asesoramiento financiero. Verificá la tasa vigente antes de operar.
      </p>
    </div>
  )
}
