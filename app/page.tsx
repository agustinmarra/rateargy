"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Calculator, BarChart2, Trophy, ArrowRight, BookOpen, CreditCard, PiggyBank, ChevronDown, X, Check, Bell, CheckCircle } from "lucide-react"
import { TARJETAS_PUBLICAS, rankear, type Gastos, type CatKey } from "@/components/tarjetas-data"
import { formatARS, CatIcon } from "@/components/ResultadosTarjetas"
import { BancoLogo } from "@/components/BancoLogo"

const ResultadosTarjetas = dynamic(() => import("@/components/ResultadosTarjetas"), { ssr: false })

// ─── Constantes ───────────────────────────────────────────────────────────────

const CAT_FIELDS: { label: string; key: CatKey }[] = [
  { label: "Supermercados",             key: "super" },
  { label: "Nafta / combustible",        key: "nafta" },
  { label: "Farmacia / salud",           key: "farmacia" },
  { label: "Restaurantes / delivery",    key: "delivery" },
  { label: "Compras online",             key: "online" },
  { label: "Servicios (luz, gas, tel.)", key: "servicios" },
]

const GASTOS_VACIO: Gastos = {
  super: 0, nafta: 0, farmacia: 0, delivery: 0,
  online: 0, servicios: 0,
}

const COMO_FUNCIONA = [
  { Icono: Calculator, num: "1", title: "Ingresá tus gastos",   desc: "Sin registro ni datos personales. Ponés cuánto gastás por categoría." },
  { Icono: BarChart2,  num: "2", title: "Calculamos tu ahorro", desc: `Comparamos ${TARJETAS_PUBLICAS.length} tarjetas usando sus beneficios y topes reales.` },
  { Icono: Trophy,     num: "3", title: "Elegís la mejor",      desc: "Ranking ordenado por ahorro real mensual para tu perfil de gasto." },
]

const GUIAS = [
  { Icono: CreditCard, titulo: "Cómo elegir tu tarjeta", desc: "Los factores clave para no equivocarte al elegir en Argentina.", href: "/articulos/como-elegir-tarjeta-de-credito-argentina-2026" },
  { Icono: BookOpen,   titulo: "7 errores al elegir tarjeta", desc: "Los errores más comunes que hacen que la gente pierda plata.", href: "/articulos/errores-comunes-al-elegir-tarjeta-argentina" },
  { Icono: PiggyBank,  titulo: "Cómo funciona el ranking", desc: "La metodología detrás de los cálculos de ahorro de rateargy.", href: "/articulos/como-funciona-el-ranking-de-rateargy" },
]

const ELEGIBILIDAD: Record<string, string[]> = {
  "bajo": [
    "naranja-x", "uala", "mercado-pago", "cuenta-dni", "personal-pay"
  ],
  "medio": [
    "naranja-x", "uala", "mercado-pago", "cuenta-dni", "personal-pay",
    "bna-gold", "macro-visa", "santander-gold", "credicoop",
    "supervielle", "patagonia", "hipotecario"
  ],
  "alto": [
    "naranja-x", "uala", "mercado-pago", "cuenta-dni", "personal-pay",
    "bna-gold", "macro-visa", "santander-gold", "credicoop",
    "supervielle", "patagonia", "hipotecario",
    "bbva-platinum", "santander-platinum", "macro-platinum",
    "icbc-platinum", "galicia-gold", "brubank"
  ],
  "muy-alto": [],
  "nodice": [],
}

// ─── URL helpers ──────────────────────────────────────────────────────────────

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

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div className="fixed bottom-5 right-5 text-white px-4 py-2.5 rounded-xl text-sm shadow-2xl z-50 pointer-events-none"
      style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {msg}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [gastos, setGastos]         = useState<Gastos>(GASTOS_VACIO)
  const [resultados, setResultados] = useState<ReturnType<typeof rankear> | null>(null)
  const [loading, setLoading]       = useState(false)
  const [tarjetaActual, setTarjetaActual] = useState("")
  const [toastMsg, setToastMsg]     = useState<string | null>(null)
  const [selectorAbierto, setSelectorAbierto] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [emailEnviado, setEmailEnviado] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [ingresos, setIngresos] = useState<string>("")
  const [haySegmentacion, setHaySegmentacion] = useState(false)

  const resultadosRef  = useRef<HTMLDivElement>(null)
  const calculadoraRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fromURL = loadFromURL()
    if (Object.keys(fromURL).length > 0) setGastos((p) => ({ ...p, ...fromURL }))
  }, [])

  useEffect(() => {
    if (!selectorAbierto) return
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest("[data-selector]")) setSelectorAbierto(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [selectorAbierto])

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2200)
  }, [])

  const handleCalcular = useCallback(() => {
    setLoading(true)
    saveToURL(gastos)
    setTimeout(() => {
      const ranked = rankear(gastos)
      const tieneSegmentacion = ingresos !== "" && ingresos !== "muy-alto" && ingresos !== "nodice"
      setHaySegmentacion(tieneSegmentacion)

      let finalRanked = ranked
      if (tieneSegmentacion && ELEGIBILIDAD[ingresos]?.length > 0) {
        const elegibles   = ranked.filter(t =>  ELEGIBILIDAD[ingresos].includes(t.id))
        const noElegibles = ranked.filter(t => !ELEGIBILIDAD[ingresos].includes(t.id))
        finalRanked = [...elegibles, ...noElegibles]
      }

      setResultados(finalRanked)
      setLoading(false)
      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }, 420)
  }, [gastos, ingresos])

  const handleGuardarPerfil = useCallback(() => {
    localStorage.setItem("rateargy_perfil", JSON.stringify(gastos))
    showToast("✓ Perfil guardado")
  }, [gastos, showToast])

  const handleCargarPerfil = useCallback(() => {
    try {
      const raw = localStorage.getItem("rateargy_perfil")
      if (raw) { setGastos(JSON.parse(raw) as Gastos); showToast("✓ Perfil cargado") }
      else showToast("No hay perfil guardado")
    } catch { showToast("Error al cargar el perfil") }
  }, [showToast])

  const updateGasto = useCallback((key: CatKey, value: string) => {
    setGastos((p) => ({ ...p, [key]: value === "" ? 0 : Math.max(0, Number(value)) }))
  }, [])

  const totalGasto = getTotalGasto(gastos)

  const scrollToCalculadora = () => {
    calculadoraRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .calc-card { padding: 48px 52px; }
        @media (max-width: 640px) { .calc-card { padding: 24px 20px; } }
        .guias-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        @media (max-width: 900px) { .guias-grid { grid-template-columns: 1fr; } }
        .hero-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(91,160,208,0.08);
          border: 1px solid rgba(91,160,208,0.2);
          border-radius: 999px; padding: 6px 16px;
          font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.6);
          letter-spacing: 0.02em; margin-bottom: 28px;
        }
        .input-wrap:focus-within label { color: #2B7CB5; }
      `}</style>

      {/* ════ HERO — fondo oscuro ════ */}
      <section style={{
        background: "linear-gradient(160deg, #0c1118 0%, #0f1923 60%, #111820 100%)",
        padding: "72px 24px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow celeste sutil */}
        <div aria-hidden style={{
          position: "absolute", top: -100, left: "30%",
          width: 500, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(91,160,208,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Glow dorado sutil */}
        <div aria-hidden style={{
          position: "absolute", bottom: -60, right: "20%",
          width: 350, height: 200, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* Badge */}
          <div className="hero-pill">
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5BA0D0", display: "inline-block" }} />
            <span style={{ color: "#5BA0D0" }}>{TARJETAS_PUBLICAS.length} tarjetas</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Gratis</span>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <span>Actualizado cada lunes</span>
          </div>

          {/* H1 */}
          <h1 style={{
            fontSize: "clamp(38px, 6vw, 72px)",
            fontWeight: 900,
            letterSpacing: "-0.045em",
            lineHeight: 1.0,
            color: "#ffffff",
            margin: "0 0 20px",
          }}>
            La tarjeta que más<br />
            te conviene,{" "}
            <span style={{
              background: "linear-gradient(90deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              calculada.
            </span>
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.75,
            margin: "0 0 36px",
            maxWidth: 520,
          }}>
            Ingresá cuánto gastás por mes en supermercado, nafta y delivery.
            Te decimos exactamente cuánto ahorrás con cada tarjeta argentina.
          </p>

          {/* CTA — dorado */}
          <button
            onClick={scrollToCalculadora}
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
              backgroundSize: "200% auto",
              color: "#0C1623", border: "none", borderRadius: 12,
              padding: "15px 32px", fontSize: 15, fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(201,168,76,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
              transition: "box-shadow 0.15s, transform 0.15s",
              letterSpacing: "-0.01em",
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,168,76,0.5)"; e.currentTarget.style.transform = "translateY(-1px)" }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            Calculá tu ahorro
            <ArrowRight size={16} />
          </button>

          {/* Stats strip */}
          <div style={{
            display: "flex", gap: 40, marginTop: 52,
            paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.06)",
            flexWrap: "wrap",
          }}>
            {[
              { value: `${TARJETAS_PUBLICAS.length}`, label: "tarjetas comparadas" },
              { value: "6",   label: "categorías de gasto" },
              { value: "~2 min", label: "para ver tu ranking" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", letterSpacing: "-0.03em" }}>{value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 3, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CALCULADORA ════ */}
      <div style={{ background: "#f8fafc", padding: "0 24px 80px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* Card calculadora */}
          <motion.section
            ref={calculadoraRef}
            className="calc-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              background: "#ffffff",
              border: "1px solid rgba(0,0,0,0.07)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.07)",
              borderRadius: 24,
              marginTop: -32,
              scrollMarginTop: 80,
              position: "relative",
              zIndex: 2,
            }}
          >

            {/* Header calculadora */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                ¿Cuánto gastás por mes?
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                Completá las categorías que aplican. Los demás pueden quedar en cero.
              </p>
            </div>

            {/* Grid inputs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20, marginBottom: 28 }}>
              {CAT_FIELDS.map(({ label, key }) => (
                <div key={key} className="input-wrap">
                  <label htmlFor={`input-${key}`} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    fontSize: 12, fontWeight: 700, color: "#475569",
                    letterSpacing: "0.03em", textTransform: "uppercase",
                    marginBottom: 8, cursor: "pointer",
                    transition: "color 0.15s",
                  }}>
                    <CatIcon catKey={key} className="w-3.5 h-3.5 flex-shrink-0" />
                    {label}
                  </label>

                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                      fontSize: 15, color: "#94a3b8", fontWeight: 500, pointerEvents: "none",
                      userSelect: "none",
                    }}>$</span>
                    <input
                      id={`input-${key}`}
                      type="number" min="0" placeholder="0"
                      value={gastos[key] === 0 ? "" : gastos[key]}
                      onChange={(e) => updateGasto(key, e.target.value)}
                      style={{
                        width: "100%", boxSizing: "border-box",
                        padding: "13px 14px 13px 28px",
                        background: "#f8fafc", border: "1.5px solid #e2e8f0",
                        borderRadius: 12, fontSize: 16, fontWeight: 600,
                        color: "#0f172a", outline: "none",
                        transition: "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#5BA0D0"
                        e.target.style.boxShadow = "0 0 0 3px rgba(91,160,208,0.12)"
                        e.target.style.background = "#fff"
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e2e8f0"
                        e.target.style.boxShadow = "none"
                        e.target.style.background = "#f8fafc"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Tarjeta actual */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: 10 }}>
                ¿Tenés una tarjeta actualmente? <span style={{ color: "#94a3b8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
              </div>

              <div style={{ position: "relative" }} data-selector="true">
                <div
                  onClick={() => setSelectorAbierto(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    border: selectorAbierto ? "1.5px solid #5BA0D0" : "1.5px solid #e2e8f0",
                    borderRadius: 12,
                    background: "white",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    boxShadow: selectorAbierto ? "0 0 0 3px rgba(91,160,208,0.12)" : "none",
                    userSelect: "none",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {tarjetaActual ? (
                      <>
                        <BancoLogo banco={tarjetaActual} size={28} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>
                            {TARJETAS_PUBLICAS.find(t => t.id === tarjetaActual)?.nombre}
                          </div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>
                            {TARJETAS_PUBLICAS.find(t => t.id === tarjetaActual)?.banco}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 14, color: "#94a3b8" }}>Seleccioná tu tarjeta actual...</div>
                    )}
                  </div>
                  <motion.div animate={{ rotate: selectorAbierto ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} color="#94a3b8" />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {selectorAbierto && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.99 }}
                      transition={{ duration: 0.12 }}
                      style={{
                        position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
                        background: "white", border: "1.5px solid #e2e8f0", borderRadius: 16,
                        boxShadow: "0 16px 48px rgba(0,0,0,0.1)", zIndex: 100,
                        overflow: "hidden", maxHeight: 300, overflowY: "auto",
                      }}
                    >
                      <div
                        onClick={() => { setTarjetaActual(""); setSelectorAbierto(false) }}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "11px 16px", cursor: "pointer",
                          borderBottom: "1px solid #f8fafc",
                          background: tarjetaActual === "" ? "#f0fdf7" : "white",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc" }}
                        onMouseLeave={e => { e.currentTarget.style.background = tarjetaActual === "" ? "#f0fdf7" : "white" }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <X size={12} color="#94a3b8" />
                        </div>
                        <span style={{ fontSize: 14, color: "#94a3b8" }}>Ninguna / no sé</span>
                      </div>

                      {TARJETAS_PUBLICAS.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => { setTarjetaActual(t.id); setSelectorAbierto(false) }}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "11px 16px", cursor: "pointer",
                            background: tarjetaActual === t.id ? "#f0fdf7" : "white",
                            borderBottom: "1px solid #f8fafc",
                          }}
                          onMouseEnter={e => { if (tarjetaActual !== t.id) e.currentTarget.style.background = "#f8fafc" }}
                          onMouseLeave={e => { e.currentTarget.style.background = tarjetaActual === t.id ? "#f0fdf7" : "white" }}
                        >
                          <BancoLogo banco={t.id} size={28} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{t.nombre}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{t.banco} · {t.red}</div>
                          </div>
                          <div style={{ width: 36, height: 22, borderRadius: 6, background: t.gradiente, flexShrink: 0 }} />
                          {tarjetaActual === t.id && (
                            <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Check size={10} color="white" />
                            </div>
                          )}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Gasto total */}
              {totalGasto > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px 20px",
                    background: "#f0fdf7",
                    border: "1px solid #bbf7d0",
                    borderRadius: 12, marginTop: 14,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Gasto mensual total</div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>
                      {formatARS(totalGasto)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>Al año</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#16a34a" }}>
                      {formatARS(totalGasto * 12)}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Ingresos */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", letterSpacing: "0.03em", textTransform: "uppercase", marginBottom: 6 }}>
                Ingreso mensual aproximado
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                Para mostrarte solo las tarjetas que podés obtener con tu perfil
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                {[
                  { value: "bajo",     texto: "Hasta $400.000",      subtexto: "Tarjetas accesibles" },
                  { value: "medio",    texto: "$400k – $800.000",     subtexto: "Mayoría de tarjetas" },
                  { value: "alto",     texto: "$800k – $1.500.000",   subtexto: "Tarjetas premium" },
                  { value: "muy-alto", texto: "Más de $1.500.000",    subtexto: "Todas las tarjetas" },
                ].map(({ value, texto, subtexto }) => {
                  const sel = ingresos === value
                  return (
                    <button
                      key={value}
                      onClick={() => setIngresos(sel ? "" : value)}
                      style={{
                        border: `1.5px solid ${sel ? "#5BA0D0" : "#e2e8f0"}`,
                        borderRadius: 10, padding: "11px 14px",
                        background: sel ? "#EDF5FB" : "white",
                        cursor: "pointer", textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: sel ? "#1A4F6E" : "#374151" }}>{texto}</div>
                      <div style={{ fontSize: 11, color: sel ? "#2B7CB5" : "#94a3b8", marginTop: 2 }}>{subtexto}</div>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setIngresos(ingresos === "nodice" ? "" : "nodice")}
                style={{
                  width: "100%", border: `1px solid ${ingresos === "nodice" ? "#5BA0D0" : "#e2e8f0"}`,
                  borderRadius: 10, padding: "8px 14px", background: "transparent",
                  cursor: "pointer", textAlign: "left", fontSize: 12,
                  color: ingresos === "nodice" ? "#14532d" : "#94a3b8",
                  transition: "all 0.15s",
                }}
              >
                Prefiero no indicarlo
              </button>
            </div>

            {/* Botón calcular */}
            <button
              onClick={handleCalcular}
              disabled={loading || totalGasto === 0}
              style={{
                width: "100%", height: 58,
                background: totalGasto === 0 || loading
                  ? "#e2e8f0"
                  : "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
                backgroundSize: "200% auto",
                color: totalGasto === 0 || loading ? "#94a3b8" : "#0C1623", border: "none", borderRadius: 14,
                fontSize: 16, fontWeight: 800,
                cursor: totalGasto === 0 || loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: totalGasto > 0 && !loading ? "0 4px 24px rgba(201,168,76,0.35), 0 1px 0 rgba(255,255,255,0.25) inset" : "none",
                transition: "box-shadow 0.15s, transform 0.1s",
                letterSpacing: "-0.01em",
                marginBottom: 12,
              }}
              onMouseEnter={e => { if (totalGasto > 0 && !loading) { e.currentTarget.style.boxShadow = "0 8px 32px rgba(201,168,76,0.5)"; e.currentTarget.style.transform = "translateY(-1px)" } }}
              onMouseLeave={e => { if (totalGasto > 0 && !loading) { e.currentTarget.style.boxShadow = "0 4px 24px rgba(201,168,76,0.35)"; e.currentTarget.style.transform = "translateY(0)" } }}
            >
              {loading ? (
                <><Spinner />Calculando…</>
              ) : (
                <>Ver mi ranking de tarjetas
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 16, height: 16 }}>
                    <path d="M4 10h12M10 4l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>

            {totalGasto === 0 && !loading && (
              <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", margin: "0 0 12px" }}>
                Ingresá al menos un monto para calcular
              </p>
            )}

            {/* Guardar / cargar */}
            <div style={{ display: "flex", gap: 8 }}>
              {(["guardar", "cargar"] as const).map((action) => (
                <button key={action}
                  onClick={action === "guardar" ? handleGuardarPerfil : handleCargarPerfil}
                  style={{
                    flex: 1, fontSize: 12, color: "#64748b",
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    borderRadius: 10, padding: "8px 12px", cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc" }}
                >
                  {action === "guardar" ? "Guardar perfil" : "Cargar perfil"}
                </button>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* ════ RESULTADOS ════ */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* Cómo funciona — solo antes de calcular */}
        <AnimatePresence>
          {resultados === null && (
            <motion.section
              key="como-funciona"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
              style={{ padding: "80px 0 72px" }}
            >
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", margin: "0 0 12px" }}>
                  Cómo funciona
                </h2>
                <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
                  En menos de dos minutos sabés qué tarjeta te conviene más.
                </p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                {COMO_FUNCIONA.map(({ Icono, num, title, desc }) => (
                  <div key={num} style={{
                    padding: "32px 28px",
                    background: "#fff",
                    borderRadius: 20,
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "#f0fdf4",
                      border: "1px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 20,
                    }}>
                      <Icono size={22} color="#2B7CB5" strokeWidth={1.75} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: "#C9A84C", letterSpacing: "0.06em", marginBottom: 8 }}>
                      PASO {num}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 8px", letterSpacing: "-0.02em" }}>{title}</h3>
                    <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.65 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Resultados */}
        <div ref={resultadosRef} style={{ scrollMarginTop: 80, paddingTop: resultados ? 64 : 0 }}>
          <AnimatePresence>
            {resultados !== null && (
              <ResultadosTarjetas
                resultados={resultados}
                gastos={gastos}
                tarjetaActual={tarjetaActual}
                haySegmentacion={haySegmentacion}
                noElegiblesIds={
                  haySegmentacion && ingresos && ELEGIBILIDAD[ingresos]?.length > 0
                    ? TARJETAS_PUBLICAS.filter(t => !ELEGIBILIDAD[ingresos].includes(t.id)).map(t => t.id)
                    : []
                }
              />
            )}
          </AnimatePresence>

          {/* Email capture — solo post-cálculo */}
          {resultados !== null && (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                background: "#f0fdf7",
                border: "1px solid #bbf7d0",
                borderRadius: 16, padding: "28px 32px",
                marginTop: 32, textAlign: "center",
                maxWidth: 520, marginLeft: "auto", marginRight: "auto",
              }}
            >
              <div style={{
                background: "#16a34a", borderRadius: "50%",
                width: 44, height: 44,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <Bell size={20} color="white" />
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
                ¿Cambian los beneficios de tu tarjeta?
              </p>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, maxWidth: 380, margin: "0 auto 20px" }}>
                Te avisamos cada lunes con las promos actualizadas y si aparece una tarjeta mejor para tu perfil.
              </p>

              {emailEnviado ? (
                <div>
                  <CheckCircle size={36} color="#16a34a" style={{ margin: "0 auto 10px", display: "block" }} />
                  <p style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>¡Listo! Te avisamos cada lunes.</p>
                  <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>Revisá tu bandeja el próximo lunes.</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="email" placeholder="tu@email.com" value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setEmailError(false) }}
                      style={{
                        flex: 1, minWidth: 0, padding: "11px 14px",
                        border: emailError ? "1.5px solid #f87171" : "1.5px solid #d1fae5",
                        borderRadius: 10, fontSize: 14, outline: "none",
                        background: "white",
                        transition: "border-color 0.15s",
                      }}
                      onFocus={e => { e.target.style.borderColor = "#16a34a" }}
                      onBlur={e => { e.target.style.borderColor = emailError ? "#f87171" : "#d1fae5" }}
                    />
                    <button
                      onClick={async () => {
                        if (!emailInput.includes("@")) { setEmailError(true); return }
                        try {
                          await fetch("/api/suscribir", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: emailInput, gastos }),
                          })
                        } catch {}
                        setEmailEnviado(true)
                      }}
                      style={{
                        background: "#16a34a", color: "white",
                        padding: "11px 18px", borderRadius: 10,
                        fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer",
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}
                    >
                      Avisame →
                    </button>
                  </div>
                  {emailError && <p style={{ fontSize: 12, color: "#ef4444", margin: "6px 0 0", textAlign: "left" }}>Ingresá un email válido</p>}
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10 }}>Sin spam. Cancelás cuando quieras.</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* ════ GUÍAS ════ */}
      <section style={{ padding: "88px 24px", background: "#f8fafc", marginTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#C9A84C", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Guías financieras
            </div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#0f172a", margin: 0 }}>
              Aprendé a elegir mejor
            </h2>
          </div>

          <div className="guias-grid">
            {GUIAS.map(({ Icono, titulo, desc, href }) => (
              <a
                key={titulo}
                href={href}
                style={{ textDecoration: "none" }}
              >
                <div style={{
                  background: "#ffffff",
                  border: "1px solid rgba(0,0,0,0.07)",
                  borderRadius: 20,
                  padding: "32px 28px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  display: "flex", flexDirection: "column",
                  minHeight: 220,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)"
                    ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)"
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"
                    ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 20,
                  }}>
                    <Icono size={22} color="#C9A84C" strokeWidth={1.75} />
                  </div>

                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                    {titulo}
                  </h3>
                  <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px", lineHeight: 1.65, flex: 1 }}>
                    {desc}
                  </p>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#C9A84C", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Leer guía <ArrowRight size={13} />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Toast msg={toastMsg} />
    </>
  )
}
