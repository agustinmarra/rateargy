"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { DM_Sans, Playfair_Display } from "next/font/google"
import { tarjetas } from "@/data/tarjetas"
import { calcularAhorro } from "@/utils/calcularAhorro"
import type { Gastos } from "@/types/tarjetas"

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500"] })
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500"], style: ["italic"] })

const ARS = (n: number) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)

function formatARS(raw: string): string {
  const num = raw.replace(/\D/g, "")
  if (!num) return ""
  return Number(num).toLocaleString("es-AR")
}

function parseARS(val: string): number {
  return Number(val.replace(/\./g, "").replace(",", ".")) || 0
}

const CAMPOS: { key: keyof Gastos; emoji: string; label: string }[] = [
  { key: "super", emoji: "🛒", label: "Supermercados" },
  { key: "nafta", emoji: "⛽", label: "Nafta / combustible" },
  { key: "transporte", emoji: "🚌", label: "Transporte (SUBE/peajes)" },
  { key: "farmacia", emoji: "💊", label: "Farmacia / salud" },
  { key: "restaurant", emoji: "🍽️", label: "Restaurantes / delivery" },
  { key: "online", emoji: "📦", label: "Compras online" },
  { key: "viajes", emoji: "✈️", label: "Viajes / turismo" },
  { key: "servicios", emoji: "💡", label: "Servicios (luz, gas, telefonía)" },
]

const HERO_CARDS = [
  { banco: "Banco Galicia", gradient: "linear-gradient(135deg, #1a7f4f 0%, #0f5c38 100%)", rot: -6, tz: 20 },
  { banco: "BBVA", gradient: "linear-gradient(135deg, #004481 0%, #002d5a 100%)", rot: 0, tz: -10 },
  { banco: "Naranja X", gradient: "linear-gradient(135deg, #e05a00 0%, #b84800 100%)", rot: 5, tz: 15 },
]

type ResultadoTarjeta = { id: string; nombre: string; banco: string; bgColor: string; color: string; pills: string[]; ahorro: number }

export default function HomePage() {
  const [fields, setFields] = useState<Record<keyof Gastos, string>>({
    super: "", nafta: "", transporte: "", farmacia: "",
    restaurant: "", online: "", viajes: "", servicios: "",
  })
  const [resultados, setResultados] = useState<ResultadoTarjeta[] | null>(null)
  const [loading, setLoading] = useState(false)

  const totalGasto = Object.values(fields).reduce((s, v) => s + parseARS(v), 0)

  function handleChange(key: keyof Gastos, val: string) {
    const raw = val.replace(/\D/g, "")
    setFields(f => ({ ...f, [key]: formatARS(raw) }))
  }

  async function calcular() {
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const gastos = {} as Gastos
    for (const c of CAMPOS) gastos[c.key] = parseARS(fields[c.key])
    const ranked = tarjetas
      .map(t => ({ ...t, ahorro: calcularAhorro(t, gastos) }))
      .sort((a, b) => b.ahorro - a.ahorro)
    setResultados(ranked)
    setLoading(false)
    setTimeout(() => {
      document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }

  const meshBg = {
    background: "radial-gradient(ellipse at 20% 50%, #e8f5ee 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #f0fdf4 0%, transparent 40%), radial-gradient(ellipse at 60% 80%, #f5f4f0 0%, transparent 40%), #ffffff",
  }

  return (
    <div className={dmSans.className} style={{ ...meshBg, minHeight: "100vh", position: "relative" }}>
      {/* Grain texture */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* ─── HERO ─── */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 60px" }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48, alignItems: "center" }}>
            {/* Left col */}
            <div style={{ maxWidth: 620 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "#e8f5ee", color: "#1a7f4f", border: "1px solid #c6e8d4",
                  borderRadius: 999, padding: "6px 14px", fontSize: 13, fontWeight: 500,
                  marginBottom: 24,
                }}>
                ✦ Actualizado cada lunes · Gratis · Sin registro
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                className={playfair.className}
                style={{
                  fontSize: "clamp(36px, 5vw, 54px)", fontWeight: 500,
                  letterSpacing: "-0.03em", lineHeight: 1.05,
                  color: "#0a0a0a", margin: "0 0 20px",
                }}>
                La tarjeta que más<br />
                <em>te conviene, calculada.</em>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                style={{ fontSize: 18, color: "#6b7280", maxWidth: 480, lineHeight: 1.6, margin: "0 0 28px" }}>
                Ingresá tus gastos mensuales y te mostramos exactamente cuánto ahorrás con cada tarjeta argentina. 15 tarjetas comparadas. Actualización semanal.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {["15 tarjetas", "8 categorías", "Actualización semanal"].map(stat => (
                  <span key={stat} style={{
                    border: "1px solid #e5e7eb", borderRadius: 999,
                    padding: "6px 14px", fontSize: 13, color: "#374151",
                    background: "rgba(255,255,255,0.7)",
                  }}>{stat}</span>
                ))}
              </motion.div>
            </div>

            {/* Right col — floating cards */}
            <div className="hero-cards" style={{ position: "relative", height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {HERO_CARDS.map((c, i) => (
                <div
                  key={c.banco}
                  style={{
                    position: "absolute",
                    width: 280, height: 170,
                    borderRadius: 16,
                    background: c.gradient,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
                    transform: `rotate(${c.rot}deg) translateY(${c.tz}px)`,
                    padding: 20,
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    zIndex: i === 1 ? 3 : i === 0 ? 1 : 2,
                    animation: i === 1 ? "cardFloat 3s ease-in-out infinite alternate" : "none",
                  }}>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 500 }}>{c.banco}</span>
                  <div>
                    <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, letterSpacing: 2, marginBottom: 8 }}>•••• •••• •••• 4521</div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>RATEARGY USER</span>
                      <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>12/28</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CALCULADORA ─── */}
        <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -4, boxShadow: "0 48px 100px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)" }}
            style={{
              background: "white",
              borderRadius: 24,
              boxShadow: "0 32px 80px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.05)",
              padding: "32px",
              transition: "box-shadow 0.3s ease",
            }}>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 20, fontWeight: 500, color: "#0a0a0a" }}>¿Cuánto gastás por mes?</span>
              <span style={{
                background: "#e8f5ee", color: "#1a7f4f",
                borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 500,
              }}>2026</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}
              className="campos-grid">
              {CAMPOS.map(c => (
                <div key={c.key}>
                  <label style={{
                    display: "block", fontSize: 11,
                    textTransform: "uppercase", letterSpacing: "0.08em",
                    color: "#9ca3af", marginBottom: 6, fontWeight: 500,
                  }}>
                    {c.emoji} {c.label}
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                      color: "#9ca3af", fontSize: 14, userSelect: "none",
                    }}>$</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={fields[c.key]}
                      onChange={e => handleChange(c.key, e.target.value)}
                      placeholder="0"
                      style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "10px 12px 10px 26px",
                        border: "1px solid #e5e7eb",
                        borderRadius: 10,
                        fontSize: 14, color: "#0a0a0a",
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        background: "#fafafa",
                      }}
                      onFocus={e => {
                        e.target.style.borderColor = "#1a7f4f"
                        e.target.style.boxShadow = "0 0 0 3px rgba(26,127,79,0.15)"
                        e.target.style.background = "#fff"
                      }}
                      onBlur={e => {
                        e.target.style.borderColor = "#e5e7eb"
                        e.target.style.boxShadow = "none"
                        e.target.style.background = "#fafafa"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <motion.button
              onClick={calcular}
              disabled={loading || totalGasto === 0}
              whileHover={!loading && totalGasto > 0 ? { scale: 1.01, backgroundColor: "#0f5c38" } : {}}
              whileTap={!loading && totalGasto > 0 ? { scale: 0.99 } : {}}
              style={{
                width: "100%", height: 52,
                background: totalGasto === 0 ? "#9ca3af" : "#1a7f4f",
                color: "white", border: "none",
                borderRadius: 12, fontSize: 15, fontWeight: 500,
                cursor: totalGasto === 0 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "background 0.2s",
              }}>
              {loading ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                    </path>
                  </svg>
                  Calculando...
                </>
              ) : "Ver qué tarjeta me conviene →"}
            </motion.button>
          </motion.div>
        </section>

        {/* ─── RESULTADOS ─── */}
        <AnimatePresence>
          {resultados && (
            <motion.section
              id="resultados"
              key="resultados"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
              style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 80px" }}>

              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{ fontSize: 28, fontWeight: 600, color: "#0a0a0a", margin: "0 0 8px" }}>
                  Tu ranking personalizado
                </h2>
                <p style={{ color: "#6b7280", fontSize: 16, margin: 0 }}>
                  Basado en {ARS(totalGasto)} de gasto mensual
                </p>
              </div>

              {/* Top 3 podio */}
              <div className="podio-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
                {resultados.slice(0, 3).map((t, i) => {
                  const maxAhorro = resultados[0].ahorro
                  const score = maxAhorro > 0 ? (t.ahorro / maxAhorro) * 100 : 0
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      style={{
                        background: t.bgColor,
                        border: i === 0 ? "2px solid #1a7f4f" : "1px solid #e5e7eb",
                        borderRadius: 16,
                        padding: 20,
                        transform: i === 0 ? "translateY(-12px)" : "none",
                        position: "relative",
                        boxShadow: i === 0 ? "0 12px 40px rgba(26,127,79,0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
                      }}>
                      {i === 0 && (
                        <span style={{
                          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                          background: "#1a7f4f", color: "white",
                          borderRadius: 999, padding: "4px 12px", fontSize: 11, fontWeight: 600,
                          whiteSpace: "nowrap",
                        }}>Mejor para vos</span>
                      )}
                      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{t.banco}</div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: "#0a0a0a", marginBottom: 12 }}>{t.nombre}</div>
                      <div style={{ fontSize: 28, fontWeight: 600, color: "#1a7f4f", lineHeight: 1, marginBottom: 4 }}>
                        {ARS(t.ahorro)}
                      </div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
                        = {ARS(t.ahorro * 12)} al año
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                        {t.pills.slice(0, 2).map(p => (
                          <span key={p} style={{
                            background: "rgba(255,255,255,0.7)", borderRadius: 6,
                            padding: "3px 8px", fontSize: 10, color: "#374151",
                          }}>{p}</span>
                        ))}
                      </div>
                      <div style={{ background: "rgba(0,0,0,0.08)", borderRadius: 4, height: 4, overflow: "hidden" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                          style={{ height: "100%", background: "#1a7f4f", borderRadius: 4 }}
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Tabla completa */}
              <div style={{
                background: "white",
                borderRadius: 16,
                border: "1px solid #f3f4f6",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                marginBottom: 24,
              }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#6b7280", fontSize: 12 }}>#</th>
                      <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 500, color: "#6b7280", fontSize: 12 }}>Tarjeta</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#6b7280", fontSize: 12 }}>Ahorro/mes</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#6b7280", fontSize: 12 }}>Ahorro/año</th>
                      <th style={{ padding: "12px 16px", textAlign: "right", fontWeight: 500, color: "#6b7280", fontSize: 12 }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultados.map((t, i) => {
                      const maxAhorro = resultados[0].ahorro
                      const score = maxAhorro > 0 ? Math.round((t.ahorro / maxAhorro) * 100) : 0
                      return (
                        <tr
                          key={t.id}
                          style={{
                            borderBottom: "1px solid #f9fafb",
                            borderLeft: i === 0 ? "3px solid #1a7f4f" : "3px solid transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <td style={{ padding: "12px 16px", color: "#9ca3af", fontWeight: 500 }}>{i + 1}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <div style={{ fontWeight: 500, color: "#0a0a0a" }}>{t.nombre}</div>
                            <div style={{ fontSize: 12, color: "#9ca3af" }}>{t.banco}</div>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right", fontWeight: 600, color: "#1a7f4f" }}>
                            {ARS(t.ahorro)}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right", color: "#374151" }}>
                            {ARS(t.ahorro * 12)}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                              <div style={{ width: 60, background: "#f3f4f6", borderRadius: 4, height: 4, overflow: "hidden" }}>
                                <div style={{ width: `${score}%`, height: "100%", background: "#1a7f4f", borderRadius: 4 }} />
                              </div>
                              <span style={{ fontSize: 12, color: "#9ca3af", minWidth: 28, textAlign: "right" }}>{score}%</span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", margin: 0 }}>
                Estimaciones basadas en beneficios vigentes. Actualizamos cada lunes.
              </p>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── CÓMO FUNCIONA ─── */}
        <section style={{
          background: "white", borderTop: "1px solid #f3f4f6", borderBottom: "1px solid #f3f4f6",
          padding: "80px 24px",
        }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2 style={{ textAlign: "center", fontSize: 28, fontWeight: 600, color: "#0a0a0a", marginBottom: 56 }}>
              Cómo funciona
            </h2>
            <div className="pasos-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
              {[
                { num: "01", title: "Ingresá tus gastos", desc: "Completá cuánto gastás por mes en cada categoría. No necesitás registrarte ni dar datos personales." },
                { num: "02", title: "Calculamos tu ahorro", desc: "Analizamos los beneficios reales de las 15 tarjetas argentinas más usadas y calculamos cuánto ahorrás con cada una." },
                { num: "03", title: "Elegí la mejor", desc: "Te mostramos un ranking ordenado por ahorro real. La tarjeta #1 es la que más plata te devuelve en base a tus hábitos." },
              ].map((p, i) => (
                <div key={p.num} className="paso-item" style={{
                  padding: "0 32px",
                  borderRight: i < 2 ? "1px solid #f3f4f6" : "none",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute", top: -8, left: 24,
                    fontSize: 72, fontWeight: 700, color: "#e8f5ee",
                    lineHeight: 1, userSelect: "none", zIndex: 0,
                  }}>{p.num}</div>
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0a0a0a", margin: "48px 0 8px" }}>{p.title}</h3>
                    <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{
          borderTop: "1px solid #f3f4f6",
          padding: "24px",
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>rateargy</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>·</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>Datos actualizados cada lunes</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>·</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>© 2026</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>·</span>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>No somos asesores financieros. La información es orientativa.</span>
        </footer>
      </div>

      <style>{`
        @keyframes cardFloat {
          from { transform: rotate(0deg) translateY(-8px); }
          to   { transform: rotate(0deg) translateY(8px); }
        }
        @media (min-width: 768px) {
          .hero-grid { grid-template-columns: 60fr 40fr !important; }
        }
        @media (max-width: 767px) {
          .hero-cards { display: none !important; }
          .podio-grid { grid-template-columns: 1fr !important; }
          .pasos-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .paso-item { border-right: none !important; padding: 0 !important; }
          .campos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
