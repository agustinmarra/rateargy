"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { TARJETAS, rankear, type Gastos, type CatKey } from "@/components/tarjetas-data"
import { formatARS, CatIcon } from "@/components/ResultadosTarjetas"

// Lazy-load resultados para no bloquear el render inicial
const ResultadosTarjetas = dynamic(() => import("@/components/ResultadosTarjetas"), { ssr: false })

// ─── Constantes ──────────────────────────────────────────────────────────────

const CAT_FIELDS: { label: string; key: CatKey }[] = [
  { label: "Supermercados",             key: "super" },
  { label: "Nafta / combustible",        key: "nafta" },
  { label: "Farmacia / salud",           key: "farmacia" },
  { label: "Restaurantes / delivery",    key: "delivery" },
  { label: "Compras online",             key: "online" },
  { label: "Viajes / turismo",           key: "viajes" },
  { label: "Transporte (SUBE/peajes)",   key: "transporte" },
  { label: "Servicios (luz, gas, tel.)", key: "servicios" },
]

const GASTOS_VACIO: Gastos = {
  super: 0, nafta: 0, farmacia: 0, delivery: 0,
  online: 0, viajes: 0, transporte: 0, servicios: 0,
}

// ─── URL helpers ─────────────────────────────────────────────────────────────

function loadFromURL(): Partial<Gastos> {
  if (typeof window === "undefined") return {}
  const params = new URLSearchParams(window.location.search)
  const result: Partial<Gastos> = {}
  for (const cat of Object.keys(GASTOS_VACIO) as CatKey[]) {
    const val = params.get(cat)
    if (val !== null) {
      const n = Number(val)
      if (!isNaN(n)) result[cat] = n
    }
  }
  return result
}

function saveToURL(g: Gastos): void {
  if (typeof window === "undefined") return
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(g)) {
    if (v > 0) params.set(k, String(v))
  }
  const qs = params.toString()
  history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname)
}

function getTotalGasto(g: Gastos): number {
  return Object.values(g).reduce((a, b) => a + b, 0)
}

// ─── Spinner SVG ─────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div
      className="fixed bottom-5 right-5 text-white px-4 py-2.5 rounded-xl text-sm shadow-2xl z-50 pointer-events-none"
      style={{
        background: "rgba(15,23,42,0.92)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {msg}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [gastos, setGastos] = useState<Gastos>(GASTOS_VACIO)
  const [resultados, setResultados] = useState<ReturnType<typeof rankear> | null>(null)
  const [loading, setLoading] = useState(false)
  const [tarjetaActual, setTarjetaActual] = useState("")
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Inicializar desde URL params
  useEffect(() => {
    const fromURL = loadFromURL()
    if (Object.keys(fromURL).length > 0) {
      setGastos((prev) => ({ ...prev, ...fromURL }))
    }
  }, [])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const handleCalcular = useCallback(() => {
    setLoading(true)
    saveToURL(gastos)
    setTimeout(() => {
      setResultados(rankear(gastos))
      setLoading(false)
      setTimeout(() => {
        document.getElementById("resultados-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 120)
    }, 420)
  }, [gastos])

  const handleGuardarPerfil = useCallback(() => {
    localStorage.setItem("rateargy_perfil", JSON.stringify(gastos))
    showToast("✓ Perfil guardado")
  }, [gastos, showToast])

  const handleCargarPerfil = useCallback(() => {
    try {
      const raw = localStorage.getItem("rateargy_perfil")
      if (raw) {
        setGastos(JSON.parse(raw) as Gastos)
        showToast("✓ Perfil cargado")
      } else {
        showToast("No hay perfil guardado")
      }
    } catch {
      showToast("Error al cargar el perfil")
    }
  }, [showToast])

  const updateGasto = useCallback((key: CatKey, value: string) => {
    const n = value === "" ? 0 : Math.max(0, Number(value))
    setGastos((prev) => ({ ...prev, [key]: n }))
  }, [])

  const totalGasto = getTotalGasto(gastos)

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Keyframes: shimmer del botón ── */}
      <style>{`
        @keyframes slideShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        /* Ocultar flechas en inputs numéricos */
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      {/* ── Wrapper con fondo y orbs ── */}
      <div
        style={{
          position: "relative",
          minHeight: "100vh",
          background: "#fafafa",
          overflow: "hidden",
        }}
      >
        {/* Orb 1 — verde esmeralda */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            top: -200,
            left: -100,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
        {/* Orb 2 — índigo */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
            bottom: -100,
            right: -150,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ════════════════════════════════════════════════════════════
            SECCIÓN 1 — HEADER glass morphism
        ════════════════════════════════════════════════════════════ */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              maxWidth: 960,
              margin: "0 auto",
              padding: "0 24px",
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            {/* Logo — TODO: reemplazar por logo final */}
            <a href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
              <span style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.02em" }}>
                <span style={{ color: "#10b981" }}>r</span>
                <span style={{ color: "#0a0a0a" }}>ateargy</span>
              </span>
            </a>

            {/* Badge "Actualizado cada lunes" */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: 999,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                color: "#059669",
                flexShrink: 0,
              }}
            >
              <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
              Actualizado cada lunes
            </div>
          </div>
        </header>

        {/* ── Contenido principal ── */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 960,
            margin: "0 auto",
            padding: "0 24px 80px",
            // Dot grid pattern
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='%23000' fill-opacity='0.06'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        >

          {/* ════════════════════════════════════════════════════════════
              SECCIÓN 2 — HERO
          ════════════════════════════════════════════════════════════ */}
          <section style={{ paddingTop: 64, paddingBottom: 16 }}>

            {/* Eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#10b981",
                marginBottom: 16,
              }}
            >
              Comparador de tarjetas · Argentina · 2026
            </motion.p>

            {/* H1 con gradiente en "calculada." */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              style={{
                fontSize: "clamp(34px, 5.5vw, 52px)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                color: "#0a0a0a",
                margin: "0 0 16px",
              }}
            >
              La tarjeta que más
              <br />
              te conviene,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #10b981 0%, #6366f1 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                calculada.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                fontSize: 16,
                color: "#6b7280",
                maxWidth: 480,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Ingresá tus gastos mensuales y te mostramos exactamente cuánto
              ahorrás con cada tarjeta argentina. 13 tarjetas comparadas.
            </motion.p>
          </section>

          {/* ════════════════════════════════════════════════════════════
              SECCIÓN 3 — CALCULADORA
          ════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
              borderRadius: 24,
              padding: 32,
              marginTop: 32,
              marginBottom: 0,
            }}
          >

            {/* Grid de inputs — EDITAR ACÁ si cambian las categorías */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}
            >
              {CAT_FIELDS.map(({ label, key }, idx) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.06 }}
                >
                  {/* Label */}
                  <label
                    htmlFor={`input-${key}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginBottom: 6,
                      cursor: "pointer",
                    }}
                  >
                    <CatIcon catKey={key} className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#94a3b8" }} />
                    {label}
                  </label>

                  {/* Input wrapper */}
                  <div style={{ position: "relative" }}>
                    {/* Ícono izquierda */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        right: "auto",
                        width: 38,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <CatIcon catKey={key} className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} />
                    </div>

                    {/* Prefix $ */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        left: 36,
                        right: "auto",
                        width: 16,
                        display: "flex",
                        alignItems: "center",
                        pointerEvents: "none",
                        fontSize: 14,
                        color: "#94a3b8",
                        fontWeight: 500,
                        userSelect: "none",
                      }}
                    >
                      $
                    </div>

                    <input
                      id={`input-${key}`}
                      type="number"
                      min="0"
                      placeholder="0"
                      value={gastos[key] === 0 ? "" : gastos[key]}
                      onChange={(e) => updateGasto(key, e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "11px 14px 11px 54px",
                        background: "#f8fafc",
                        border: "1.5px solid #e2e8f0",
                        borderRadius: 12,
                        fontSize: 14,
                        color: "#0f172a",
                        outline: "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#10b981"
                        e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"
                        e.target.style.background = "#ffffff"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0"
                        e.target.style.boxShadow = "none"
                        e.target.style.background = "#f8fafc"
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Select tarjeta actual */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  marginBottom: 6,
                }}
              >
                Tengo actualmente:
              </label>
              <select
                value={tarjetaActual}
                onChange={(e) => setTarjetaActual(e.target.value)}
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "9px 14px",
                  fontSize: 14,
                  color: "#374151",
                  outline: "none",
                  width: "100%",
                  maxWidth: 320,
                  cursor: "pointer",
                }}
              >
                <option value="">Ninguna / no sé</option>
                {TARJETAS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} — {t.banco}
                  </option>
                ))}
              </select>
            </div>

            {/* Gasto total en tiempo real */}
            {totalGasto > 0 && (
              <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12, textAlign: "center" }}>
                Gasto total ingresado:{" "}
                <strong style={{ color: "#475569" }}>{formatARS(totalGasto)}/mes</strong>
              </p>
            )}

            {/* Botón calcular con shimmer */}
            <motion.button
              onClick={handleCalcular}
              disabled={loading || totalGasto === 0}
              whileHover={!loading && totalGasto > 0 ? { y: -1, boxShadow: "0 12px 32px rgba(16,185,129,0.4)" } : {}}
              whileTap={!loading && totalGasto > 0 ? { scale: 0.98 } : {}}
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: 52,
                background: totalGasto === 0 || loading
                  ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                  : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                borderRadius: 14,
                fontSize: 15,
                fontWeight: 600,
                cursor: totalGasto === 0 || loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: totalGasto > 0 && !loading ? "0 8px 24px rgba(16,185,129,0.3)" : "none",
                transition: "background 0.2s, box-shadow 0.2s",
                marginBottom: 12,
              }}
            >
              {/* Shimmer — solo visible cuando el botón está activo */}
              {!loading && totalGasto > 0 && (
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "40%",
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                    animation: "slideShimmer 2.2s infinite",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Contenido del botón */}
              <span style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                {loading ? (
                  <>
                    <Spinner />
                    Calculando…
                  </>
                ) : (
                  <>
                    Calcular mi ahorro
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18 }}>
                      <path d="M4 10h12M10 4l6 6-6 6" />
                    </svg>
                  </>
                )}
              </span>
            </motion.button>

            {totalGasto === 0 && !loading && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>
                Ingresá al menos un monto para calcular
              </p>
            )}

            {/* Botones secundarios */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleGuardarPerfil}
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "#64748b",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0" }}
              >
                Guardar perfil
              </button>
              <button
                onClick={handleCargarPerfil}
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "#64748b",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: "pointer",
                  transition: "background 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.borderColor = "#cbd5e1" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0" }}
              >
                Cargar perfil
              </button>
            </div>
          </motion.section>

          {/* ════════════════════════════════════════════════════════════
              SECCIÓN 4 — RESULTADOS (lazy, spring animation)
          ════════════════════════════════════════════════════════════ */}
          <div id="resultados-section">
            <AnimatePresence>
              {resultados !== null && (
                <ResultadosTarjetas
                  resultados={resultados}
                  gastos={gastos}
                  tarjetaActual={tarjetaActual}
                />
              )}
            </AnimatePresence>
          </div>

          {/* ════════════════════════════════════════════════════════════
              SECCIÓN 5 — FOOTER mínimo
          ════════════════════════════════════════════════════════════ */}
          <footer
            style={{
              marginTop: 64,
              paddingTop: 24,
              borderTop: "1px solid rgba(0,0,0,0.06)",
              textAlign: "center",
              fontSize: 12,
              color: "#94a3b8",
              lineHeight: 1.6,
            }}
          >
            © 2026 rateargy · Datos actualizados abril 2026 · La información es orientativa y no
            constituye asesoramiento financiero.
          </footer>
        </div>
      </div>

      {/* Toast global */}
      <Toast msg={toastMsg} />
    </>
  )
}
