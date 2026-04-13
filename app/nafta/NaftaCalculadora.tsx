"use client"

import { useState } from "react"
import Link from "next/link"
import { TARJETAS } from "@/components/tarjetas-data"

const AUTOS = [
  { nombre: "Renault Kwid",    litros: 38, icono: "🚙" },
  { nombre: "Toyota Etios",    litros: 42, icono: "🚗" },
  { nombre: "Chevrolet Onix",  litros: 45, icono: "🚗" },
  { nombre: "VW Polo / Gol",   litros: 45, icono: "🚗" },
  { nombre: "Toyota Corolla",  litros: 55, icono: "🚘" },
  { nombre: "Ford Ranger",     litros: 70, icono: "🛻" },
  { nombre: "Toyota Hilux",    litros: 80, icono: "🛻" },
  { nombre: "Moto",            litros: 12, icono: "🏍️" },
  { nombre: "Personalizado",   litros: 0,  icono: "✏️" },
]

// Nombre específico de cada variante premium por estación
const NOMBRE_PREMIUM: Record<string, string> = {
  ypf:   "Infinia",
  shell: "V-Power",
  axion: "Extreme",
  puma:  "Extra",
}

const TIPOS: { key: "super" | "premium" | "diesel"; label: string; desc: string }[] = [
  { key: "super",   label: "Súper",   desc: "Nafta regular"         },
  { key: "premium", label: "Premium", desc: "Infinia · V-Power · Extreme" },
  { key: "diesel",  label: "Diesel",  desc: "Gasoil"                },
]

// ACTUALIZAR ACÁ CADA VEZ QUE SUBAN LOS PRECIOS
// Fuente: verificar en ypf.com, shell.com.ar o infobae.com/economia
// Última actualización: abril 2026
const ESTACIONES = [
  {
    id: "ypf",   nombre: "YPF",   color: "#0052A5",
    // Súper: $1.999 | Infinia: $2.207 | Diesel 500: $2.065
    precios: { super: 1999, premium: 2207, diesel: 2065 },
    nota: "Red más grande del país",
  },
  {
    id: "shell", nombre: "Shell", color: "#E4181C",
    // Súper: $2.049 | V-Power: $2.365 | Diesel: $2.019
    precios: { super: 2049, premium: 2365, diesel: 2019 },
    nota: "V-Power reconocida mundialmente",
  },
  {
    id: "axion", nombre: "Axion", color: "#C8181A",
    // Súper: $2.039 | Extreme: est. $2.280 | Eurodiesel: est. $2.040
    precios: { super: 2039, premium: 2280, diesel: 2040 },
    nota: "Precio competitivo con Extreme",
  },
  {
    id: "puma",  nombre: "Puma",  color: "#2A7A2A",
    // Súper: ~$1.974 | Premium: est. $2.100 | Diesel: est. $1.960
    precios: { super: 1974, premium: 2100, diesel: 1960 },
    nota: "Precio más bajo del mercado",
  },
]

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-AR")

// ── Decoraciones SVG inline ──────────────────────────────────────────────────

function FuelPumpSVG() {
  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 80, height: 100, opacity: 0.18 }}>
      <rect x="8" y="20" width="44" height="70" rx="6" stroke="#f97316" strokeWidth="3"/>
      <rect x="16" y="30" width="28" height="18" rx="3" fill="#f97316"/>
      <path d="M52 35 L62 25 L70 28 L70 55 L62 58" stroke="#f97316" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="66" cy="48" r="5" stroke="#f97316" strokeWidth="2.5"/>
      <rect x="22" y="60" width="16" height="22" rx="2" fill="#f97316" opacity="0.5"/>
    </svg>
  )
}

function CarSVG() {
  return (
    <svg viewBox="0 0 140 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 140, height: 60, opacity: 0.15 }}>
      <path d="M10 38 L20 20 L50 14 L90 14 L115 20 L130 38" stroke="#f97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 38 L135 38 L135 46 Q135 50 130 50 L10 50 Q5 50 5 46 Z" fill="#f97316" opacity="0.4"/>
      <circle cx="30" cy="50" r="10" stroke="#f97316" strokeWidth="3" fill="none"/>
      <circle cx="30" cy="50" r="4" fill="#f97316" opacity="0.4"/>
      <circle cx="110" cy="50" r="10" stroke="#f97316" strokeWidth="3" fill="none"/>
      <circle cx="110" cy="50" r="4" fill="#f97316" opacity="0.4"/>
      <path d="M52 14 L44 34" stroke="#f97316" strokeWidth="2" opacity="0.6"/>
      <path d="M88 14 L88 34" stroke="#f97316" strokeWidth="2" opacity="0.6"/>
    </svg>
  )
}

function DropSVG({ size = 20, opacity = 0.12 }: { size?: number; opacity?: number }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: size, height: size * 1.33, opacity }}>
      <path d="M12 2 Q20 12 20 20 A8 8 0 0 1 4 20 Q4 12 12 2Z" fill="#f97316"/>
    </svg>
  )
}

export default function NaftaCalculadora() {
  const [autoIdx,      setAutoIdx]      = useState(1)
  const [customLitros, setCustomLitros] = useState(50)
  const [pctTanque,    setPctTanque]    = useState(100)
  const [tipoNafta,    setTipoNafta]    = useState<"super" | "premium" | "diesel">("super")

  const esPersonalizado = autoIdx === AUTOS.length - 1
  const litrosTanque    = esPersonalizado ? customLitros : AUTOS[autoIdx].litros
  const litros          = Math.round(litrosTanque * pctTanque / 100)
  const trackPct        = `${((pctTanque - 10) / 90 * 100).toFixed(1)}%`

  const resultados = ESTACIONES
    .map(e => ({ ...e, pxl: e.precios[tipoNafta], total: e.precios[tipoNafta] * litros }))
    .sort((a, b) => a.total - b.total)

  const diferencia = resultados[resultados.length - 1].total - resultados[0].total

  const promoTarjetas = TARJETAS
    .filter(t => t.beneficios.nafta.pct > 0)
    .sort((a, b) => b.beneficios.nafta.pct - a.beneficios.nafta.pct)
    .slice(0, 8)

  return (
    <main style={{ minHeight: "calc(100vh - 64px)", background: "#fffdf7" }}>
      <style>{`
        .na-auto:hover  { background: #fff7ed !important; border-color: rgba(249,115,22,0.45) !important; }
        .na-range {
          -webkit-appearance: none; width: 100%; height: 7px; border-radius: 4px; outline: none; cursor: pointer;
          background: linear-gradient(to right, #f97316 0%, #f59e0b var(--pct, 100%), #e5e7eb var(--pct, 100%));
        }
        .na-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #f59e0b);
          cursor: pointer; box-shadow: 0 0 0 4px rgba(249,115,22,0.18), 0 2px 8px rgba(249,115,22,0.4);
          border: 3px solid #fff;
        }
        .na-range::-moz-range-thumb {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #f59e0b);
          cursor: pointer; box-shadow: 0 2px 8px rgba(249,115,22,0.4); border: 3px solid #fff;
        }
        .na-station { transition: transform 0.15s, box-shadow 0.15s; }
        .na-station:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.1) !important; }
        .na-promo:hover { border-color: rgba(249,115,22,0.35) !important; background: #fff7ed !important; }
        @media (max-width: 700px) {
          .na-autos    { grid-template-columns: repeat(3, 1fr) !important; }
          .na-stations { grid-template-columns: 1fr 1fr !important; }
          .na-promos   { grid-template-columns: 1fr !important; }
          .na-tipos    { flex-direction: column !important; }
        }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", overflow: "hidden",
        padding: "72px 24px 64px",
        background: "linear-gradient(160deg, #fff7ed 0%, #fffbeb 50%, #fffdf7 100%)",
        borderBottom: "1px solid rgba(249,115,22,0.12)",
        textAlign: "center",
      }}>
        {/* Decoraciones de fondo */}
        <div style={{ position: "absolute", top: 20, left: 40, transform: "rotate(-12deg)" }}>
          <FuelPumpSVG />
        </div>
        <div style={{ position: "absolute", top: 18, right: 32, transform: "rotate(8deg)" }}>
          <DropSVG size={48} opacity={0.13} />
        </div>
        <div style={{ position: "absolute", bottom: 20, left: "10%", transform: "rotate(5deg)" }}>
          <DropSVG size={30} opacity={0.09} />
        </div>
        <div style={{ position: "absolute", bottom: -10, right: "8%" }}>
          <CarSVG />
        </div>
        {/* Líneas de ruta */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 6,
          background: "repeating-linear-gradient(90deg, #f97316 0px, #f97316 40px, transparent 40px, transparent 70px)",
          opacity: 0.18,
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 24,
            background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.25)",
            borderRadius: 999, padding: "7px 16px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#ea580c",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
            Calculadora de nafta
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em",
            color: "#0f172a", margin: "0 0 16px", lineHeight: 1.05,
          }}>
            ¿Cuánto te cuesta<br />
            <span style={{ color: "#f97316" }}>llenar el tanque?</span>
          </h1>

          <p style={{ fontSize: 17, color: "#78716c", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
            Comparé YPF, Shell, Axion y Puma — y descubrí cuánto ahorrás con tu tarjeta.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── Calculadora card ──────────────────────────────────────────────────── */}
        <div style={{
          background: "#ffffff",
          border: "1.5px solid rgba(249,115,22,0.15)",
          borderRadius: 28, padding: "36px 32px",
          boxShadow: "0 4px 24px rgba(249,115,22,0.07), 0 1px 4px rgba(0,0,0,0.04)",
          marginBottom: 32,
        }}>

          {/* 1. Auto */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#f97316", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
              1 — ¿Qué auto tenés?
            </p>
            <div className="na-autos" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {AUTOS.map((auto, i) => {
                const active = autoIdx === i
                return (
                  <button
                    key={auto.nombre}
                    className="na-auto"
                    onClick={() => setAutoIdx(i)}
                    style={{
                      background: active ? "#fff7ed" : "#fafafa",
                      border: `1.5px solid ${active ? "#f97316" : "#e5e7eb"}`,
                      borderRadius: 14, padding: "13px 8px",
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{auto.icono}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#ea580c" : "#374151", lineHeight: 1.3 }}>
                      {auto.nombre}
                    </div>
                    {auto.litros > 0 && (
                      <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>
                        {auto.litros}L
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {esPersonalizado && (
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "#6b7280", fontWeight: 600 }}>Capacidad del tanque:</span>
                <input
                  type="number" min={1} max={250}
                  value={customLitros}
                  onChange={e => setCustomLitros(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 80, padding: "8px 12px", textAlign: "center",
                    background: "#fff7ed", border: "1.5px solid #f97316",
                    borderRadius: 10, fontSize: 16, fontWeight: 700, color: "#0f172a", outline: "none",
                  }}
                />
                <span style={{ fontSize: 13, color: "#6b7280" }}>litros</span>
              </div>
            )}
          </div>

          {/* 2. Slider */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#f97316", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                2 — ¿Cuánto cargás?
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: "#f97316", letterSpacing: "-0.03em" }}>{litros}L</span>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>{pctTanque}% del tanque</span>
              </div>
            </div>

            <input
              type="range" min={10} max={100} step={5}
              value={pctTanque}
              onChange={e => setPctTanque(parseInt(e.target.value))}
              className="na-range"
              style={{ "--pct": trackPct } as React.CSSProperties}
            />

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
              {[10, 25, 50, 75, 100].map(v => (
                <button
                  key={v}
                  onClick={() => setPctTanque(v)}
                  style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 0",
                    color: pctTanque === v ? "#f97316" : "#d1d5db",
                    background: "none", border: "none", cursor: "pointer", transition: "color 0.15s",
                  }}
                >
                  {v === 100 ? "Lleno" : `${v}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tipo combustible */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#f97316", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
              3 — Tipo de combustible
            </p>
            <div className="na-tipos" style={{ display: "flex", gap: 10 }}>
              {TIPOS.map(({ key, label, desc }) => {
                const active = tipoNafta === key
                return (
                  <button
                    key={key}
                    onClick={() => setTipoNafta(key)}
                    style={{
                      flex: 1, padding: "14px 8px", borderRadius: 14,
                      background: active ? "#fff7ed" : "#fafafa",
                      border: `1.5px solid ${active ? "#f97316" : "#e5e7eb"}`,
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: active ? "#ea580c" : "#374151" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Resultados por estación ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              Precio por estación
            </h2>
            {diferencia > 0 && (
              <span style={{ fontSize: 13, color: "#9ca3af" }}>
                Diferencia entre la más cara y la más barata:{" "}
                <strong style={{ color: "#f97316" }}>{fmt(diferencia)}</strong>
              </span>
            )}
          </div>

          <div className="na-stations" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {resultados.map((est, i) => {
              const esMasBarata = i === 0
              const nombreComb = tipoNafta === "premium" ? (NOMBRE_PREMIUM[est.id] ?? "Premium") : (tipoNafta === "diesel" ? "Diesel" : "Súper")
              return (
                <div
                  key={est.id}
                  className="na-station"
                  style={{
                    background: "#fff",
                    border: `2px solid ${esMasBarata ? "#f97316" : "#f3f4f6"}`,
                    borderRadius: 20, padding: "22px 18px",
                    position: "relative", overflow: "hidden",
                    boxShadow: esMasBarata ? "0 8px 28px rgba(249,115,22,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {esMasBarata && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 4,
                      background: "linear-gradient(90deg, #f97316, #f59e0b)",
                    }} />
                  )}
                  {esMasBarata && (
                    <div style={{
                      position: "absolute", top: 14, right: 12,
                      background: "linear-gradient(135deg, #f97316, #f59e0b)",
                      borderRadius: 999, padding: "3px 9px",
                      fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      Más barata
                    </div>
                  )}

                  <div style={{ fontSize: 11, fontWeight: 800, color: "#d1d5db", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                    #{i + 1}
                  </div>

                  {/* Logo de color de la estación */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 12, marginBottom: 12,
                    background: est.color, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 900, color: "#fff",
                    boxShadow: `0 4px 12px ${est.color}44`,
                  }}>
                    {est.nombre[0]}
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{est.nombre}</div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>{nombreComb}</div>

                  <div style={{
                    fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 900, letterSpacing: "-0.04em",
                    color: esMasBarata ? "#f97316" : "#0f172a", marginBottom: 4,
                  }}>
                    {fmt(est.total)}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 14 }}>
                    {fmt(est.pxl)}/litro
                  </div>
                  <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.55 }}>
                    {est.nota}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Nota de precios */}
        <p style={{ fontSize: 11, color: "#d1d5db", textAlign: "center", margin: "-24px 0 40px", lineHeight: 1.6 }}>
          Precios de referencia en CABA al 1° de abril 2026. Los precios varían por zona y se actualizan periódicamente.
        </p>

        {/* ── Promos tarjetas ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Con tu tarjeta ahorrás más
            </h2>
            <p style={{ fontSize: 14, color: "#9ca3af", margin: 0 }}>
              Descuentos reales aplicables sobre el precio final de nafta
            </p>
          </div>

          <div className="na-promos" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {promoTarjetas.map(t => {
              const nafta  = t.beneficios.nafta
              const base   = resultados[0].pxl * litros
              const ahorro = Math.min(base * nafta.pct / 100, nafta.tope)
              return (
                <div
                  key={t.id}
                  className="na-promo"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #f3f4f6",
                    borderRadius: 18, padding: "18px 20px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                    transition: "all 0.15s",
                  }}
                >
                  {/* Franja de color del gradiente */}
                  <div style={{
                    width: 4, flexShrink: 0, alignSelf: "stretch", borderRadius: 4,
                    background: t.gradiente,
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: "#0f172a",
                      marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {t.nombre}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>
                      {nafta.lugar}
                    </div>
                    {nafta.dias && (
                      <div style={{
                        display: "inline-flex", marginTop: 8,
                        background: "#fff7ed", border: "1px solid rgba(249,115,22,0.25)",
                        borderRadius: 999, padding: "2px 9px",
                        fontSize: 10, fontWeight: 700, color: "#ea580c", letterSpacing: "0.04em",
                      }}>
                        Solo {nafta.dias}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#f97316", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {nafta.pct}%
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                      tope {fmt(nafta.tope)}/mes
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginTop: 6 }}>
                      -{fmt(ahorro)} hoy
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────────── */}
        <div style={{
          textAlign: "center",
          background: "linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)",
          border: "1.5px solid rgba(249,115,22,0.2)",
          borderRadius: 24, padding: "44px 32px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decoración fondo */}
          <div style={{ position: "absolute", bottom: -10, right: 20, opacity: 0.12 }}>
            <CarSVG />
          </div>

          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#f97316", marginBottom: 14,
          }}>
            ¿Cuánto ahorrás en total?
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Comparé todas las tarjetas del mercado
          </h3>
          <p style={{ fontSize: 15, color: "#6b7280", margin: "0 0 28px", lineHeight: 1.7 }}>
            Ingresá tu gasto mensual en nafta y te mostramos cuánto ahorrás<br />
            con cada tarjeta — incluyendo supermercado, delivery y más.
          </p>
          <Link
            href="/?nafta=30000"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 30px", borderRadius: 14,
              background: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
              color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700,
              boxShadow: "0 8px 28px rgba(249,115,22,0.35)",
              position: "relative",
            }}
          >
            Ir al comparador de tarjetas
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 16, height: 16 }}>
              <path d="M4 10h12M10 4l6 6-6 6" />
            </svg>
          </Link>
        </div>

      </div>
    </main>
  )
}
