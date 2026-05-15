"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { TARJETAS_PUBLICAS } from "@/components/tarjetas-data"
import type { Tarjeta, CatKey } from "@/components/tarjetas-data"

const CATS: { key: CatKey; label: string }[] = [
  { key: "super", label: "Supermercados" },
  { key: "nafta", label: "Nafta" },
  { key: "farmacia", label: "Farmacia" },
  { key: "delivery", label: "Delivery" },
  { key: "online", label: "Compras online" },
  { key: "servicios", label: "Servicios" },
]

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)

function BeneficioCell({ tarjeta, catKey }: { tarjeta: Tarjeta; catKey: CatKey }) {
  const b = tarjeta.beneficios[catKey]
  if (!b || b.pct === 0) {
    return (
      <div style={{ textAlign: "center", color: "#cbd5e1", fontSize: 20 }}>—</div>
    )
  }
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 24, fontWeight: 900, color: "#059669" }}>{b.pct}%</div>
      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>tope {formatARS(b.tope)}/mes</div>
      {b.dias && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{b.dias}</div>}
    </div>
  )
}

export default function CompararClient() {
  const searchParams = useSearchParams()
  const [idA, setIdA] = useState(searchParams.get("a") || "")
  const [idB, setIdB] = useState(searchParams.get("b") || "")

  useEffect(() => {
    const a = searchParams.get("a")
    const b = searchParams.get("b")
    if (a) setIdA(a)
    if (b) setIdB(b)
  }, [searchParams])

  const tarjetaA = TARJETAS_PUBLICAS.find((t) => t.id === idA) || null
  const tarjetaB = TARJETAS_PUBLICAS.find((t) => t.id === idB) || null

  const updateURL = (newA: string, newB: string) => {
    const url = new URL(window.location.href)
    if (newA) url.searchParams.set("a", newA)
    else url.searchParams.delete("a")
    if (newB) url.searchParams.set("b", newB)
    else url.searchParams.delete("b")
    window.history.replaceState({}, "", url.toString())
  }

  const handleChangeA = (id: string) => { setIdA(id); updateURL(id, idB) }
  const handleChangeB = (id: string) => { setIdB(id); updateURL(idA, id) }

  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 14, fontWeight: 600,
    border: "1.5px solid #e2e8f0", background: "white", color: "#0f172a", outline: "none",
    cursor: "pointer",
  }

  return (
    <div>
      {/* Selectores */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 40 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            Tarjeta A
          </label>
          <select value={idA} onChange={(e) => handleChangeA(e.target.value)} style={selectStyle}>
            <option value="">Elegí una tarjeta...</option>
            {TARJETAS_PUBLICAS.filter((t) => t.id !== idB).map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: 20, fontWeight: 900, color: "#cbd5e1", textAlign: "center", paddingTop: 22 }}>vs</div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
            Tarjeta B
          </label>
          <select value={idB} onChange={(e) => handleChangeB(e.target.value)} style={selectStyle}>
            <option value="">Elegí una tarjeta...</option>
            {TARJETAS_PUBLICAS.filter((t) => t.id !== idA).map((t) => (
              <option key={t.id} value={t.id}>{t.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Placeholder cuando no hay selección */}
      {!tarjetaA && !tarjetaB && (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "#94a3b8" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚖️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#475569", marginBottom: 8 }}>Seleccioná dos tarjetas para comparar</div>
          <div style={{ fontSize: 14 }}>Compará beneficios, topes y costo anual lado a lado.</div>
        </div>
      )}

      {/* Tabla de comparación */}
      {(tarjetaA || tarjetaB) && (
        <div>
          {/* Headers de tarjetas */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 0, marginBottom: 0 }}>
            <div />
            {[tarjetaA, tarjetaB].map((t, i) => (
              <div key={i} style={{
                background: t ? t.gradiente : "#f8fafc",
                borderRadius: i === 0 ? "14px 0 0 0" : "0 14px 0 0",
                padding: "20px",
                textAlign: "center",
                minHeight: 90,
              }}>
                {t ? (
                  <>
                    <div style={{ fontSize: 14, fontWeight: 900, color: "white", lineHeight: 1.3 }}>{t.nombre}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 4 }}>{t.banco}</div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: "#cbd5e1" }}>—</div>
                )}
              </div>
            ))}
          </div>

          {/* Costo anual */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ padding: "16px 20px", background: "#f8fafc", fontSize: 13, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center" }}>
              Costo anual
            </div>
            {[tarjetaA, tarjetaB].map((t, i) => (
              <div key={i} style={{ padding: "16px 20px", background: "white", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #f1f5f9" }}>
                {t ? (
                  <span style={{ fontSize: 16, fontWeight: 800, color: t.costoAnual === 0 ? "#059669" : "#0f172a" }}>
                    {t.costoAnual === 0 ? "Gratis" : formatARS(t.costoAnual)}
                  </span>
                ) : <span style={{ color: "#e2e8f0" }}>—</span>}
              </div>
            ))}
          </div>

          {/* Red */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ padding: "16px 20px", background: "#f8fafc", fontSize: 13, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center" }}>
              Red
            </div>
            {[tarjetaA, tarjetaB].map((t, i) => (
              <div key={i} style={{ padding: "16px 20px", background: "white", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid #f1f5f9" }}>
                {t ? <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{t.red}</span> : <span style={{ color: "#e2e8f0" }}>—</span>}
              </div>
            ))}
          </div>

          {/* Beneficios por categoría */}
          {CATS.map((cat, idx) => {
            const aHasBenefit = tarjetaA ? tarjetaA.beneficios[cat.key].pct > 0 : false
            const bHasBenefit = tarjetaB ? tarjetaB.beneficios[cat.key].pct > 0 : false
            const rowBg = idx % 2 === 0 ? "white" : "#fafafa"

            return (
              <div key={cat.key} style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", borderBottom: "1px solid #f1f5f9" }}>
                <div style={{ padding: "16px 20px", background: "#f8fafc", fontSize: 13, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center" }}>
                  {cat.label}
                </div>
                {[tarjetaA, tarjetaB].map((t, i) => {
                  const winner = i === 0
                    ? (tarjetaA && tarjetaB ? tarjetaA.beneficios[cat.key].pct > tarjetaB.beneficios[cat.key].pct : false)
                    : (tarjetaA && tarjetaB ? tarjetaB.beneficios[cat.key].pct > tarjetaA.beneficios[cat.key].pct : false)

                  return (
                    <div key={i} style={{
                      padding: "16px 20px",
                      background: winner ? "#f0fdf4" : rowBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderLeft: "1px solid #f1f5f9",
                    }}>
                      {t ? <BeneficioCell tarjeta={t} catKey={cat.key} /> : <span style={{ color: "#e2e8f0" }}>—</span>}
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* Pills */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ padding: "16px 20px", background: "#f8fafc", fontSize: 13, fontWeight: 700, color: "#475569", display: "flex", alignItems: "flex-start", paddingTop: 20 }}>
              Beneficios extra
            </div>
            {[tarjetaA, tarjetaB].map((t, i) => (
              <div key={i} style={{ padding: "16px 20px", background: "white", borderLeft: "1px solid #f1f5f9" }}>
                {t && t.pills.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {t.pills.map((pill) => (
                      <span key={pill} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "#f0fdf4", color: "#16a34a", fontWeight: 600 }}>
                        {pill}
                      </span>
                    ))}
                  </div>
                ) : <span style={{ color: "#e2e8f0", fontSize: 13 }}>—</span>}
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 0 }}>
            <div style={{ padding: "20px", background: "#f8fafc", borderRadius: "0 0 0 14px" }} />
            {[tarjetaA, tarjetaB].map((t, i) => (
              <div key={i} style={{ padding: "20px", background: "white", borderLeft: "1px solid #f1f5f9", borderRadius: i === 1 ? "0 0 14px 0" : "0" }}>
                {t && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {t.urlSolicitud && (
                      <a
                        href={t.urlSolicitud}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block", textAlign: "center", padding: "10px 16px", borderRadius: 10,
                          background: "#059669", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none",
                        }}
                      >
                        Solicitar →
                      </a>
                    )}
                    <a
                      href={`/tarjetas/${t.id}`}
                      style={{
                        display: "block", textAlign: "center", padding: "8px 16px", borderRadius: 10,
                        background: "#f8fafc", color: "#475569", fontSize: 12, fontWeight: 600, textDecoration: "none",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      Ver detalle
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
