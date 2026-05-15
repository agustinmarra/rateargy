"use client"

import { useState } from "react"

const SERVICIOS = [
  {
    id: "netflix",
    nombre: "Netflix",
    color: "#E50914",
    planes: [
      { nombre: "Con anuncios", precio: 3900 },
      { nombre: "Estándar", precio: 8200 },
      { nombre: "Premium (4K)", precio: 12500 },
    ],
  },
  {
    id: "disney",
    nombre: "Disney+",
    color: "#113CCF",
    planes: [
      { nombre: "Básico", precio: 11900 },
      { nombre: "Premium (ESPN + F1)", precio: 23800 },
    ],
  },
  {
    id: "max",
    nombre: "Max",
    color: "#002BE7",
    planes: [
      { nombre: "Básico", precio: 9930 },
      { nombre: "Estándar", precio: 12837 },
      { nombre: "Platinum (4 dev)", precio: 15438 },
    ],
  },
  {
    id: "amazon",
    nombre: "Amazon Prime",
    color: "#FF9900",
    planes: [
      { nombre: "Mensual", precio: 7954 },
    ],
  },
  {
    id: "appletv",
    nombre: "Apple TV+",
    color: "#555",
    planes: [
      { nombre: "Plan único", precio: 11189 },
    ],
  },
  {
    id: "spotify",
    nombre: "Spotify",
    color: "#1DB954",
    planes: [
      { nombre: "Individual", precio: 3299 },
      { nombre: "Dúo", precio: 4399 },
      { nombre: "Familiar", precio: 5499 },
      { nombre: "Estudiantes", precio: 1799 },
    ],
  },
  {
    id: "paramount",
    nombre: "Paramount+",
    color: "#0064FF",
    planes: [
      { nombre: "Plan único", precio: 2228 },
    ],
  },
  {
    id: "youtube",
    nombre: "YouTube Premium",
    color: "#FF0000",
    planes: [
      { nombre: "Plan Lite", precio: 2705 },
    ],
  },
]

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)

type Selection = { [serviceId: string]: number } // serviceId -> plan index, -1 = not selected

export default function StreamingCalculadora() {
  const [seleccion, setSeleccion] = useState<Selection>({})

  const totalMensual = Object.entries(seleccion).reduce((acc, [id, planIdx]) => {
    if (planIdx < 0) return acc
    const servicio = SERVICIOS.find((s) => s.id === id)
    if (!servicio) return acc
    return acc + servicio.planes[planIdx].precio
  }, 0)

  const totalAnual = totalMensual * 12

  const seleccionados = Object.values(seleccion).filter((v) => v >= 0).length

  return (
    <div>
      <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
        Seleccioná los servicios que usás (o querés contratar) y el plan. El total se actualiza en tiempo real.
      </p>

      <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        {SERVICIOS.map((s) => {
          const planSeleccionado = seleccion[s.id] ?? -1
          const activo = planSeleccionado >= 0

          return (
            <div
              key={s.id}
              style={{
                background: "white",
                border: activo ? `2px solid ${s.color}` : "1.5px solid #e2e8f0",
                borderRadius: 14,
                padding: "16px 20px",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Toggle */}
                  <button
                    onClick={() => {
                      setSeleccion((prev) => {
                        const next = { ...prev }
                        if (activo) {
                          next[s.id] = -1
                        } else {
                          next[s.id] = 0
                        }
                        return next
                      })
                    }}
                    style={{
                      width: 22, height: 22, borderRadius: 6, border: activo ? "none" : "2px solid #cbd5e1",
                      background: activo ? s.color : "white",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {activo && <span style={{ color: "white", fontSize: 13, fontWeight: 900 }}>✓</span>}
                  </button>

                  {/* Dot */}
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />

                  <span style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{s.nombre}</span>
                </div>

                {/* Plan selector */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.planes.map((plan, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSeleccion((prev) => ({ ...prev, [s.id]: idx }))}
                      style={{
                        padding: "5px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                        border: planSeleccionado === idx ? `2px solid ${s.color}` : "1.5px solid #e2e8f0",
                        background: planSeleccionado === idx ? `${s.color}15` : "white",
                        color: planSeleccionado === idx ? s.color : "#64748b",
                        transition: "all 0.1s",
                      }}
                    >
                      {plan.nombre} — {formatARS(plan.precio)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Total */}
      <div style={{
        background: seleccionados > 0 ? "#0f172a" : "#f8fafc",
        borderRadius: 16,
        padding: "24px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        transition: "background 0.2s",
      }}>
        <div>
          <div style={{ fontSize: 13, color: seleccionados > 0 ? "#94a3b8" : "#94a3b8", marginBottom: 4 }}>
            {seleccionados === 0 ? "Seleccioná servicios para calcular" : `${seleccionados} servicio${seleccionados > 1 ? "s" : ""} seleccionado${seleccionados > 1 ? "s" : ""}`}
          </div>
          {seleccionados > 0 && (
            <div style={{ fontSize: 32, fontWeight: 900, color: "white" }}>
              {formatARS(totalMensual)}<span style={{ fontSize: 16, fontWeight: 500, color: "#94a3b8" }}>/mes</span>
            </div>
          )}
        </div>
        {seleccionados > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Al año</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9" }}>{formatARS(totalAnual)}</div>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 16, lineHeight: 1.7 }}>
        Precios de referencia mayo 2026. Los servicios del exterior (Netflix, Disney+, Max, Apple TV+, Amazon) se cobran en USD al tipo de cambio oficial más impuestos (IVA + percepciones), por lo que el precio final puede variar mes a mes.
      </p>
    </div>
  )
}
