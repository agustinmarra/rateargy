import type { Metadata } from "next"
import NaftaCalculadora from "./NaftaCalculadora"
import { DESCUENTOS_NAFTA, BENEFICIOS_APPS, MES_ACTUALIZACION } from "@/data/nafta-data"

export const metadata: Metadata = {
  title: "Calculadora de Nafta — Ahorrá en combustible con tu tarjeta",
  description: "Calculá cuánto te cuesta llenar el tanque en YPF, Shell, Axion y Puma, y descubrí cuánto ahorrás con tu tarjeta de crédito.",
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-AR")

const PETROLERA_COLOR: Record<string, string> = {
  YPF:   "#0052A5",
  Shell: "#E4181C",
  Axion: "#C8181A",
  Puma:  "#2A7A2A",
}

export default function NaftaPage() {
  const sorted = [...DESCUENTOS_NAFTA].sort(
    (a, b) =>
      Math.max(b.porcentaje, b.porcentajeExtra ?? 0) -
      Math.max(a.porcentaje, a.porcentajeExtra ?? 0),
  )

  return (
    <>
      <NaftaCalculadora />

      {/* ── Tabla de descuentos bancarios ────────────────────────────────────── */}
      <section style={{ background: "#fffdf7", borderTop: "2px dashed rgba(249,115,22,0.15)", padding: "64px 24px 80px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto" }}>

          {/* Header sección */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 36 }}>
            <div>
              <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.03em" }}>
                Descuentos en nafta por banco
              </h2>
              <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>
                Todos los beneficios vigentes confirmados · Verificá con tu banco antes de cargar
              </p>
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 7, flexShrink: 0,
              background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)",
              borderRadius: 999, padding: "7px 14px",
              fontSize: 12, fontWeight: 700, color: "#ea580c",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
              Actualizado: {MES_ACTUALIZACION}
            </div>
          </div>

          {/* Grid de cards de descuentos */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 56,
          }}>
            {sorted.map((d, i) => {
              const maxPct = Math.max(d.porcentaje, d.porcentajeExtra ?? 0)
              return (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1.5px solid #f3f4f6",
                    borderRadius: 20,
                    padding: "22px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* Banco + segmento */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{d.banco}</div>
                      {d.segmento && (
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: "#6b7280",
                          background: "#f3f4f6", borderRadius: 999, padding: "2px 8px",
                          letterSpacing: "0.04em",
                        }}>
                          {d.segmento}
                        </span>
                      )}
                    </div>
                    {/* Porcentaje */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {d.porcentajeExtra ? (
                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af" }}>{d.porcentaje}%</span>
                          <span style={{ fontSize: 11, color: "#d1d5db" }}>–</span>
                          <span style={{ fontSize: 26, fontWeight: 900, color: "#f97316", lineHeight: 1, letterSpacing: "-0.04em" }}>{d.porcentajeExtra}%</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 28, fontWeight: 900, color: "#f97316", lineHeight: 1, letterSpacing: "-0.04em" }}>{d.porcentaje}%</span>
                      )}
                    </div>
                  </div>

                  {/* Día + tope */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#0f172a",
                      background: "#f8fafc", border: "1px solid #e5e7eb",
                      borderRadius: 999, padding: "3px 9px",
                    }}>
                      {d.dia}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, color: "#6b7280",
                      background: "#f8fafc", border: "1px solid #e5e7eb",
                      borderRadius: 999, padding: "3px 9px",
                    }}>
                      Tope {fmt(d.tope)}{d.topeExtra ? ` – ${fmt(d.topeExtra)}` : ""}
                    </span>
                    {d.medio && (
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: "#0369a1",
                        background: "#e0f2fe", border: "1px solid #bae6fd",
                        borderRadius: 999, padding: "3px 9px",
                      }}>
                        {d.medio}
                      </span>
                    )}
                  </div>

                  {/* Estaciones */}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {d.estaciones.map(est => (
                      <span
                        key={est}
                        style={{
                          fontSize: 10, fontWeight: 800, letterSpacing: "0.04em",
                          color: est === "Todas" ? "#059669" : (PETROLERA_COLOR[est] ?? "#6b7280"),
                          background: est === "Todas" ? "#ecfdf5" : "#f8fafc",
                          border: `1px solid ${est === "Todas" ? "rgba(5,150,105,0.2)" : "#e5e7eb"}`,
                          borderRadius: 999, padding: "2px 8px",
                        }}
                      >
                        {est === "Todas" ? "✓ Todas las estaciones" : est}
                      </span>
                    ))}
                  </div>

                  {/* Condición */}
                  {d.condicion && (
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, lineHeight: 1.55 }}>
                      {d.condicion}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          {/* ── Beneficios apps petroleras ──────────────────────────────────────── */}
          <div style={{
            background: "#fff",
            border: "1.5px solid rgba(249,115,22,0.15)",
            borderRadius: 24, padding: "32px 28px",
            marginBottom: 40,
          }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Descuentos propios de cada petrolera
            </h3>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 24px" }}>
              Sin necesidad de banco — descargá la app de cada estación
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}>
              {BENEFICIOS_APPS.map((a, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fafafa",
                    border: "1px solid #f3f4f6",
                    borderRadius: 16, padding: "16px 18px",
                    display: "flex", flexDirection: "column", gap: 8,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: PETROLERA_COLOR[a.petrolera] ?? "#6b7280", marginBottom: 3, letterSpacing: "0.02em" }}>
                        {a.app}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{a.beneficio}</div>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 900, color: "#f97316", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {a.porcentaje}%
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", background: "#f0f0f0", borderRadius: 999, padding: "2px 7px" }}>
                      {a.dia}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#6b7280", background: "#f0f0f0", borderRadius: 999, padding: "2px 7px" }}>
                      {a.tope}
                    </span>
                    {a.acumulable && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#ecfdf5", border: "1px solid rgba(5,150,105,0.2)", borderRadius: 999, padding: "2px 7px" }}>
                        Acumulable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nota al pie */}
          <p style={{
            fontSize: 12, color: "#d1d5db", textAlign: "center",
            lineHeight: 1.7, margin: 0,
          }}>
            Los beneficios se actualizan mensualmente. Verificá las condiciones con tu banco antes de cargar.
            La información es de carácter orientativo y puede variar sin previo aviso.
          </p>
        </div>
      </section>
    </>
  )
}
