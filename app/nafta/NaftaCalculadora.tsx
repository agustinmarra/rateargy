"use client"

import { useState } from "react"
import Link from "next/link"
import { TARJETAS } from "@/components/tarjetas-data"

const AUTOS = [
  { nombre: "Renault Kwid",    litros: 38,  icono: "🚙" },
  { nombre: "Toyota Etios",    litros: 42,  icono: "🚗" },
  { nombre: "Chevrolet Onix",  litros: 45,  icono: "🚗" },
  { nombre: "VW Polo / Gol",   litros: 45,  icono: "🚗" },
  { nombre: "Toyota Corolla",  litros: 55,  icono: "🚘" },
  { nombre: "Ford Ranger",     litros: 70,  icono: "🛻" },
  { nombre: "Toyota Hilux",    litros: 80,  icono: "🛻" },
  { nombre: "Moto",            litros: 12,  icono: "🏍️" },
  { nombre: "Personalizado",   litros: 0,   icono: "✏️" },
]

const TIPOS: { key: "super" | "premium" | "diesel"; label: string; desc: string }[] = [
  { key: "super",   label: "Súper",   desc: "Nafta común"   },
  { key: "premium", label: "Premium", desc: "Mayor octanaje" },
  { key: "diesel",  label: "Diesel",  desc: "Gasoil"        },
]

const ESTACIONES = [
  {
    id: "ypf",   nombre: "YPF",   icono: "🔵",
    precios: { super: 1080, premium: 1250, diesel: 1050 },
    pros: "Red más grande · Infinia premiun",
  },
  {
    id: "shell", nombre: "Shell", icono: "🐚",
    precios: { super: 1060, premium: 1230, diesel: 1030 },
    pros: "V-Power reconocida · Buena calidad",
  },
  {
    id: "axion", nombre: "Axion", icono: "🔴",
    precios: { super: 1050, premium: 1220, diesel: 1020 },
    pros: "Precio competitivo · Axion Extreme",
  },
  {
    id: "puma",  nombre: "Puma",  icono: "🐾",
    precios: { super: 1020, premium: 1200, diesel: 1000 },
    pros: "Precio más bajo · Zonas rurales",
  },
]

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-AR")

export default function NaftaCalculadora() {
  const [autoIdx,       setAutoIdx]       = useState(1)
  const [customLitros,  setCustomLitros]  = useState(50)
  const [pctTanque,     setPctTanque]     = useState(100)
  const [tipoNafta,     setTipoNafta]     = useState<"super" | "premium" | "diesel">("super")

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
    <main style={{ minHeight: "calc(100vh - 64px)", background: "#0a0f1e" }}>
      <style>{`
        .na-auto:hover { background: rgba(249,115,22,0.12) !important; border-color: rgba(249,115,22,0.4) !important; }
        .na-range {
          -webkit-appearance: none; width: 100%; height: 6px; border-radius: 3px; outline: none; cursor: pointer;
          background: linear-gradient(to right, #f97316 0%, #f59e0b var(--pct, 100%), rgba(255,255,255,0.1) var(--pct, 100%));
        }
        .na-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #f59e0b);
          cursor: pointer; box-shadow: 0 0 0 3px rgba(249,115,22,0.25), 0 2px 8px rgba(249,115,22,0.5);
          border: 2px solid #fff;
        }
        .na-range::-moz-range-thumb {
          width: 24px; height: 24px; border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #f59e0b);
          cursor: pointer; box-shadow: 0 2px 8px rgba(249,115,22,0.5); border: 2px solid #fff;
        }
        .na-station { transition: transform 0.15s, box-shadow 0.15s; cursor: default; }
        .na-station:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
        @media (max-width: 700px) {
          .na-autos   { grid-template-columns: repeat(3, 1fr) !important; }
          .na-stations { grid-template-columns: 1fr 1fr !important; }
          .na-promos  { grid-template-columns: 1fr !important; }
          .na-tipos   { flex-direction: column !important; }
          .na-summary { flex-direction: column !important; gap: 6px !important; }
        }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{
        padding: "72px 24px 56px", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 65%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 24,
          background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.3)",
          borderRadius: 999, padding: "7px 16px",
          fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "#f97316",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f97316", display: "inline-block" }} />
          Calculadora de nafta
        </div>

        <h1 style={{
          fontSize: "clamp(30px, 5vw, 58px)", fontWeight: 900, letterSpacing: "-0.04em",
          color: "#fff", margin: "0 0 16px", lineHeight: 1.05,
        }}>
          ¿Cuánto te cuesta<br />
          <span style={{ color: "#f97316" }}>llenar el tanque?</span>
        </h1>

        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.55)", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
          Comparé YPF, Shell, Axion y Puma — y descubrí cuánto ahorrás con tu tarjeta.
        </p>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── Calculadora card ─────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28, padding: "36px 32px",
          marginBottom: 32,
        }}>

          {/* 1. Auto */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
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
                      background: active ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${active ? "rgba(249,115,22,0.55)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 14, padding: "13px 8px",
                      cursor: "pointer", textAlign: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{auto.icono}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#f97316" : "rgba(255,255,255,0.65)", lineHeight: 1.3 }}>
                      {auto.nombre}
                    </div>
                    {auto.litros > 0 && (
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
                        {auto.litros}L
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {esPersonalizado && (
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Capacidad del tanque:</span>
                <input
                  type="number" min={1} max={250}
                  value={customLitros}
                  onChange={e => setCustomLitros(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 80, padding: "8px 12px", textAlign: "center",
                    background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(249,115,22,0.4)",
                    borderRadius: 10, fontSize: 16, fontWeight: 700, color: "#fff", outline: "none",
                  }}
                />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>litros</span>
              </div>
            )}
          </div>

          {/* 2. Slider */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                2 — ¿Cuánto cargás?
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: "#f97316", letterSpacing: "-0.03em" }}>{litros}L</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{pctTanque}% del tanque</span>
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
                    color: pctTanque === v ? "#f97316" : "rgba(255,255,255,0.25)",
                    background: "none", border: "none", cursor: "pointer",
                    transition: "color 0.15s",
                  }}
                >
                  {v === 100 ? "Lleno" : `${v}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tipo combustible */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
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
                      flex: 1, padding: "13px 8px", borderRadius: 14,
                      background: active ? "rgba(249,115,22,0.18)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${active ? "rgba(249,115,22,0.55)" : "rgba(255,255,255,0.08)"}`,
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 800, color: active ? "#f97316" : "rgba(255,255,255,0.65)" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Resultados por estación ───────────────────────────────────────────── */}
        <div style={{ marginBottom: 40 }}>
          <div className="na-summary" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, gap: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>
              Precio por estación
            </h2>
            {diferencia > 0 && (
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Diferencia entre la más cara y la más barata:{" "}
                <strong style={{ color: "#f59e0b" }}>{fmt(diferencia)}</strong>
              </span>
            )}
          </div>

          <div className="na-stations" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {resultados.map((est, i) => {
              const esMasBarata = i === 0
              return (
                <div
                  key={est.id}
                  className="na-station"
                  style={{
                    background: esMasBarata ? "rgba(249,115,22,0.1)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${esMasBarata ? "rgba(249,115,22,0.35)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 20, padding: "22px 18px", position: "relative", overflow: "hidden",
                  }}
                >
                  {esMasBarata && (
                    <div style={{
                      position: "absolute", top: 12, right: 12,
                      background: "linear-gradient(135deg, #f97316, #f59e0b)",
                      borderRadius: 999, padding: "3px 9px",
                      fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      Más barata
                    </div>
                  )}

                  <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>
                    #{i + 1}
                  </div>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{est.icono}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", marginBottom: 8 }}>{est.nombre}</div>
                  <div style={{
                    fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 900, letterSpacing: "-0.04em",
                    color: esMasBarata ? "#f97316" : "#fff", marginBottom: 4,
                  }}>
                    {fmt(est.total)}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                    {fmt(est.pxl)}/litro
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.55 }}>
                    {est.pros}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Promos tarjetas ───────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Con tu tarjeta ahorrás más
            </h2>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", margin: 0 }}>
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
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, padding: "18px 20px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: "#fff",
                      marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {t.nombre}
                    </div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.5 }}>
                      {nafta.lugar}
                    </div>
                    {nafta.dias && (
                      <div style={{
                        display: "inline-flex", marginTop: 8,
                        background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)",
                        borderRadius: 999, padding: "2px 9px",
                        fontSize: 10, fontWeight: 700, color: "#f97316", letterSpacing: "0.04em",
                      }}>
                        Solo {nafta.dias}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#f97316", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {nafta.pct}%
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
                      tope {fmt(nafta.tope)}/mes
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#10b981", marginTop: 6 }}>
                      -{fmt(ahorro)} hoy
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────────────────── */}
        <div style={{
          textAlign: "center",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 24, padding: "44px 32px",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)", marginBottom: 14,
          }}>
            ¿Cuánto ahorrás en total con tu tarjeta?
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Comparé todas las tarjetas del mercado
          </h3>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", margin: "0 0 28px", lineHeight: 1.7 }}>
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
              boxShadow: "0 8px 28px rgba(249,115,22,0.4)",
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
