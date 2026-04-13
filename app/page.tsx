"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Calculator, BarChart2, Trophy, ArrowRight, Shield, Zap, TrendingUp, BookOpen, CreditCard, Banknote, PiggyBank, ChevronDown, X, Check } from "lucide-react"
import { TARJETAS, rankear, type Gastos, type CatKey } from "@/components/tarjetas-data"
import { formatARS, CatIcon } from "@/components/ResultadosTarjetas"
import { BancoLogo } from "@/components/BancoLogo"

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

const STATS = [
  { value: "20", label: "tarjetas comparadas" },
  { value: "100%", label: "gratis, sin registro" },
  { value: "Lunes", label: "actualización semanal" },
]

const COMO_FUNCIONA = [
  { Icono: Calculator, num: "01", title: "Ingresá tus gastos",   desc: "Sin registro ni datos personales. Todo queda en tu navegador." },
  { Icono: BarChart2,  num: "02", title: "Calculamos tu ahorro", desc: "Comparamos 13 tarjetas en tiempo real usando sus beneficios reales." },
  { Icono: Trophy,     num: "03", title: "Elegís la mejor",      desc: "Ranking ordenado por ahorro real mensual para tu perfil de gasto." },
]


const GUIAS = [
  { Icono: CreditCard, titulo: "Cómo elegir tu tarjeta", desc: "Los 5 factores clave para no equivocarte en Argentina.", href: "/articulos/como-elegir-tarjeta-de-credito-argentina-2025" },
  { Icono: Banknote,   titulo: "Dólar MEP paso a paso",  desc: "La forma legal y sin límite de dolarizar tus ahorros.", href: "/articulos/como-comprar-dolar-mep-homebanking" },
  { Icono: PiggyBank,  titulo: "MP vs Ualá: cuál rinde más", desc: "Comparamos tasas, beneficios y funcionalidades.", href: "/articulos/mercado-pago-vs-uala-cual-rinde-mas" },
]

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

// ─── Spinner ─────────────────────────────────────────────────────────────────

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
      style={{ background: "rgba(15,23,42,0.92)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {msg}
    </div>
  )
}

// ─── DashboardPreview (hero widget) ──────────────────────────────────────────

function DashboardPreview() {
  // Mock de los top 3 resultados para un perfil típico
  const mockTop = [
    { id: "galicia-eminent",  bancoId: "galicia-eminent",  nombre: "Galicia Éminent",  banco: "Banco Galicia", ahorro: 18400, gradiente: "linear-gradient(135deg, #1a7f4f 0%, #0d4f31 100%)" },
    { id: "santander-gold",   bancoId: "santander-gold",   nombre: "Santander Gold",   banco: "Santander",     ahorro: 14200, gradiente: "linear-gradient(135deg, #cc0000 0%, #ff4444 100%)" },
    { id: "naranja-x",        bancoId: "naranja-x",        nombre: "Naranja X",        banco: "Naranja X",     ahorro: 11800, gradiente: "linear-gradient(135deg, #e05a00 0%, #ff8c42 100%)" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay: 0.2 }}
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(0,0,0,0.07)",
        borderRadius: 24,
        boxShadow: "0 32px 80px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)",
        padding: 24,
        maxWidth: 380,
        width: "100%",
      }}
    >
      {/* Header del widget */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>
            Tu ranking
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "2px 0 0" }}>
            Perfil: gasto típico mensual
          </p>
        </div>
        <div style={{
          background: "#f0fdf4", border: "1px solid #d1fae5",
          borderRadius: 8, padding: "4px 10px",
          fontSize: 11, fontWeight: 700, color: "#065f46",
        }}>
          20 tarjetas
        </div>
      </div>

      {/* Top 3 cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {mockTop.map((t, i) => (
          <div key={t.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "12px 14px",
            background: i === 0 ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" : "#f8fafc",
            border: `1.5px solid ${i === 0 ? "#86efac" : "#e2e8f0"}`,
            borderRadius: 14,
          }}>
            {/* Posición */}
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: i === 0 ? "#10b981" : "#e2e8f0",
              color: i === 0 ? "#fff" : "#64748b",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
              {i + 1}
            </div>

            {/* Mini card */}
            <div style={{
              width: 36, height: 22, borderRadius: 5,
              background: t.gradiente, flexShrink: 0,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }} />

            {/* Nombre */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111827", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {t.nombre}
              </p>
              <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>{t.banco}</p>
            </div>

            {/* Ahorro */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: i === 0 ? "#059669" : "#374151", margin: 0 }}>
                {formatARS(t.ahorro)}
              </p>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>/ mes</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f1f5f9" }}>
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px", textAlign: "center" }}>
          ↓ Ingresá tus gastos reales para ver tu ranking personalizado
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { icon: Shield, label: "Sin registro" },
            { icon: Zap,    label: "En segundos" },
            { icon: TrendingUp, label: "100% gratis" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
              background: "#f8fafc", borderRadius: 8, padding: "6px 4px",
              fontSize: 10, fontWeight: 600, color: "#64748b",
            }}>
              <Icon size={10} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── MarqueeLogos ─────────────────────────────────────────────────────────────

function MarqueeLogos() {
  const items = [...TARJETAS, ...TARJETAS] // duplicar para loop
  return (
    <div style={{ overflow: "hidden", position: "relative", padding: "6px 0" }}>
      {/* Fade izquierdo */}
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, zIndex: 1,
        background: "linear-gradient(to right, #fafafa, transparent)", pointerEvents: "none" }} />
      {/* Fade derecho */}
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 1,
        background: "linear-gradient(to left, #fafafa, transparent)", pointerEvents: "none" }} />

      <div className="partners-track" style={{ display: "flex", gap: 16, alignItems: "center" }}>
        {items.map((t, i) => (
          <div key={`${t.id}-${i}`} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 999, padding: "8px 16px",
            flexShrink: 0, whiteSpace: "nowrap",
          }}>
            <BancoLogo banco={t.bancoId} size={20} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{t.banco}</span>
          </div>
        ))}
      </div>
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
      setResultados(rankear(gastos))
      setLoading(false)
      setTimeout(() => {
        resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }, 420)
  }, [gastos])

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

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes slideShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes shine {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        .calc-card { padding: 52px; }
        @media (max-width: 640px) { .calc-card { padding: 24px; } }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: center;
        }
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .hero-preview { display: none; }
        }
        .guias-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 768px) { .guias-grid { grid-template-columns: 1fr; } }
        .partners-track { animation: marquee 30s linear infinite; }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{ position: "relative", minHeight: "100vh", background: "#ffffff", overflow: "hidden" }}>

        {/* Orbs decorativos */}
        <div aria-hidden style={{ position:"absolute", width:900, height:900, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(16,185,129,0.09) 0%, transparent 65%)",
          top:-320, left:-220, pointerEvents:"none", zIndex:0 }} />
        <div aria-hidden style={{ position:"absolute", width:700, height:700, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 65%)",
          bottom:-100, right:-250, pointerEvents:"none", zIndex:0 }} />
        <div aria-hidden style={{ position:"absolute", width:400, height:400, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)",
          top:"40%", right:"5%", pointerEvents:"none", zIndex:0 }} />

        {/* ════ HEADER ════ */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50, height: 64,
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}>
          <div style={{
            maxWidth: 1120, margin: "0 auto", padding: "0 24px",
            height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <a href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>
                <span style={{ color: "#10b981" }}>r</span>
                <span style={{ color: "#111827" }}>ateargy</span>
              </span>
              <span style={{
                display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                background: "#10b981", animation: "pulse-dot 2s ease-in-out infinite",
              }} />
            </a>

            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#f0fdf4", border: "1px solid #d1fae5",
              borderRadius: 999, padding: "6px 14px",
              fontSize: 12, fontWeight: 600, color: "#065f46",
            }}>
              ✓ Actualizado cada lunes
            </div>
          </div>
        </header>

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1120, margin: "0 auto", padding: "0 24px 0",
        }}>

          {/* ════ SECCIÓN 1: HERO (dos columnas) ════ */}
          <section style={{ paddingTop: 112, paddingBottom: 96 }}>
            <div className="hero-grid">

              {/* Columna izquierda */}
              <div>
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6,
                    background: "#f0fdf4", border: "1px solid #d1fae5",
                    borderRadius: 999, padding: "5px 12px",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                    textTransform: "uppercase", color: "#065f46", marginBottom: 24 }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
                  Comparador financiero · Argentina · 2026
                </motion.div>

                {/* H1 */}
                <motion.h1
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
                  style={{
                    fontSize: "clamp(40px, 5vw, 68px)",
                    fontWeight: 900, letterSpacing: "-0.045em",
                    lineHeight: 1.0, color: "#0a0a0a",
                    margin: "0 0 28px",
                  }}
                >
                  La tarjeta que más<br />
                  te conviene,{" "}
                  <span style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 60%, #6366f1 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>
                    calculada.
                  </span>
                </motion.h1>

                {/* Subtítulo */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
                  style={{ fontSize: 19, fontWeight: 400, color: "#4b5563",
                    maxWidth: 500, lineHeight: 1.75, margin: "0 0 40px" }}
                >
                  Ingresá tus gastos mensuales y te mostramos exactamente
                  cuánto ahorrás con cada tarjeta argentina. 20 tarjetas. Gratis.
                </motion.p>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
                  style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
                >
                  <motion.button
                    onClick={scrollToCalculadora}
                    whileHover={{ y: -3, boxShadow: "0 20px 48px rgba(16,185,129,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      position: "relative", overflow: "hidden",
                      display: "inline-flex", alignItems: "center", gap: 10,
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#fff", border: "none", borderRadius: 16,
                      padding: "16px 32px", fontSize: 16, fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 12px 32px rgba(16,185,129,0.35)",
                    }}
                  >
                    <span aria-hidden style={{
                      position:"absolute", top:0, bottom:0, width:"40%",
                      background:"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                      animation:"slideShimmer 2.5s infinite", pointerEvents:"none",
                    }} />
                    Calculá tu ahorro gratis
                    <ArrowRight size={18} />
                  </motion.button>

                  <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500 }}>
                    Sin registro · En segundos
                  </span>
                </motion.div>

                {/* Stats strip */}
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
                  style={{ display: "flex", gap: 36, marginTop: 48, flexWrap: "wrap",
                    paddingTop: 40, borderTop: "1px solid #f3f4f6" }}
                >
                  {STATS.map(({ value, label }) => (
                    <div key={label}>
                      <p style={{ fontSize: 28, fontWeight: 900, color: "#111827", margin: 0, letterSpacing: "-0.03em" }}>
                        {value}
                      </p>
                      <p style={{ fontSize: 13, color: "#6b7280", margin: "3px 0 0" }}>{label}</p>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Columna derecha — dashboard preview */}
              <div className="hero-preview" style={{ display: "flex", justifyContent: "flex-end" }}>
                <DashboardPreview />
              </div>
            </div>
          </section>

          {/* ════ MARQUEE — logos bancos ════ */}
          <section style={{ marginBottom: 80 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
              color: "#94a3b8", textAlign: "center", marginBottom: 20 }}>
              Comparamos 20 tarjetas líderes de Argentina
            </p>
            <div className="partners-wrap">
              <MarqueeLogos />
            </div>
          </section>
        </div>

        {/* ════ SECCIÓN CALCULADORA ════ */}
        <div style={{
          background: "linear-gradient(180deg, #ffffff 0%, #f0fdf4 40%, #ffffff 100%)",
          padding: "0 24px 96px",
        }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>

            {/* Encabezado de sección */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                background:"#f0fdf4", border:"1px solid #d1fae5",
                borderRadius:999, padding:"5px 14px", marginBottom:16,
                fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#065f46" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", display:"inline-block" }} />
                Calculadora personalizada
              </div>
              <h2 style={{ fontSize: "clamp(30px, 3.5vw, 48px)", fontWeight: 900,
                letterSpacing: "-0.04em", color: "#0a0a0a", margin: "0 0 16px" }}>
                ¿Cuánto podés ahorrar?
              </h2>
              <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                Ingresá tus gastos mensuales y calculamos el ranking al instante.
              </p>
            </div>

            {/* Card de la calculadora */}
            <motion.section
              ref={calculadoraRef}
              className="calc-card"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                background: "rgba(255,255,255,0.98)",
                backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 48px 100px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,1)",
                borderRadius: 28,
                scrollMarginTop: 80,
              }}
            >
              {/* Grid inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 24 }}>
                {CAT_FIELDS.map(({ label, key }, idx) => (
                  <motion.div key={key}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                  >
                    <label htmlFor={`input-${key}`} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      fontSize: 13, fontWeight: 600, color: "#374151",
                      letterSpacing: "0.02em", marginBottom: 8, cursor: "pointer",
                    }}>
                      <CatIcon catKey={key} className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#94a3b8" }} />
                      {label}
                    </label>

                    <div style={{ position: "relative" }}>
                      <div style={{ position:"absolute", inset:0, right:"auto", width:38,
                        display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                        <CatIcon catKey={key} className="w-4 h-4" style={{ color: "#94a3b8" }} />
                      </div>
                      <div style={{ position:"absolute", inset:0, left:36, right:"auto", width:16,
                        display:"flex", alignItems:"center", pointerEvents:"none",
                        fontSize:15, color:"#94a3b8", fontWeight:500, userSelect:"none" }}>$</div>
                      <input
                        id={`input-${key}`}
                        type="number" min="0" placeholder="0"
                        value={gastos[key] === 0 ? "" : gastos[key]}
                        onChange={(e) => updateGasto(key, e.target.value)}
                        style={{
                          width:"100%", boxSizing:"border-box",
                          padding:"12px 14px 12px 54px",
                          background:"#f8fafc", border:"1.5px solid #e2e8f0",
                          borderRadius:12, fontSize: 16, color:"#0f172a", outline:"none",
                          transition:"border-color 0.15s, box-shadow 0.15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor="#10b981"; e.target.style.boxShadow="0 0 0 3px rgba(16,185,129,0.1)"; e.target.style.background="#fff" }}
                        onBlur={(e)  => { e.target.style.borderColor="#e2e8f0"; e.target.style.boxShadow="none"; e.target.style.background="#f8fafc" }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* SELECTOR TARJETA ACTUAL + GASTO TOTAL */}
              <div style={{ marginBottom: 28 }}>

                {/* Label */}
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: "#f0fdf7", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CreditCard size={12} color="#0a7c4e" />
                  </div>
                  ¿Tenés una tarjeta actualmente? <span style={{ color: "#94a3b8", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>(opcional)</span>
                </div>

                {/* Trigger + dropdown envueltos en position relative */}
                <div style={{ position: "relative" }} data-selector="true">

                  {/* Trigger */}
                  <div
                    onClick={() => setSelectorAbierto(v => !v)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 16px",
                      border: selectorAbierto ? "1.5px solid #0a7c4e" : "1.5px solid #e2e8f0",
                      borderRadius: 12,
                      background: "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: selectorAbierto ? "0 0 0 3px rgba(10,124,78,0.1)" : "none",
                      userSelect: "none",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {tarjetaActual ? (
                        <>
                          <BancoLogo banco={tarjetaActual} size={32} />
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>
                              {TARJETAS.find(t => t.id === tarjetaActual)?.nombre}
                            </div>
                            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                              {TARJETAS.find(t => t.id === tarjetaActual)?.banco}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: 15, color: "#94a3b8" }}>Seleccioná tu tarjeta actual...</div>
                      )}
                    </div>
                    <motion.div animate={{ rotate: selectorAbierto ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} color="#94a3b8" />
                    </motion.div>
                  </div>

                  {/* Dropdown panel */}
                  <AnimatePresence>
                    {selectorAbierto && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        style={{
                          position: "absolute",
                          top: "calc(100% + 8px)",
                          left: 0, right: 0,
                          background: "white",
                          border: "1.5px solid #e2e8f0",
                          borderRadius: 16,
                          boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.04)",
                          zIndex: 100,
                          overflow: "hidden",
                          maxHeight: 320,
                          overflowY: "auto",
                        }}
                      >
                        {/* Opción ninguna */}
                        <div
                          onClick={() => { setTarjetaActual(""); setSelectorAbierto(false) }}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            padding: "12px 16px",
                            cursor: "pointer",
                            borderBottom: "1px solid #f8fafc",
                            background: tarjetaActual === "" ? "#f0fdf7" : "white",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f8fafc")}
                          onMouseLeave={e => (e.currentTarget.style.background = tarjetaActual === "" ? "#f0fdf7" : "white")}
                        >
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f1f5f9", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <X size={14} color="#94a3b8" />
                          </div>
                          <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 500 }}>Ninguna / no sé</span>
                        </div>

                        {/* Lista de tarjetas */}
                        {TARJETAS.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => { setTarjetaActual(t.id); setSelectorAbierto(false) }}
                            style={{
                              display: "flex", alignItems: "center", gap: 12,
                              padding: "12px 16px",
                              cursor: "pointer",
                              background: tarjetaActual === t.id ? "#f0fdf7" : "white",
                              borderBottom: "1px solid #f8fafc",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={e => { if (tarjetaActual !== t.id) e.currentTarget.style.background = "#f8fafc" }}
                            onMouseLeave={e => { e.currentTarget.style.background = tarjetaActual === t.id ? "#f0fdf7" : "white" }}
                          >
                            <BancoLogo banco={t.id} size={32} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{t.nombre}</div>
                              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 1 }}>{t.banco} · {t.red}</div>
                            </div>
                            <div style={{ width: 40, height: 26, borderRadius: 6, background: t.gradiente, flexShrink: 0 }} />
                            {tarjetaActual === t.id && (
                              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#0a7c4e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Check size={12} color="white" />
                              </div>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card gasto total */}
                {getTotalGasto(gastos) > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px",
                      background: "linear-gradient(135deg, #f0fdf7 0%, #f8fafc 100%)",
                      border: "1px solid #bbf7d0",
                      borderRadius: 12,
                      marginTop: 16,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#0a7c4e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <BarChart2 size={18} color="white" />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Gasto mensual total</div>
                        <div style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                          {formatARS(getTotalGasto(gastos))}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Al año serían</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "#0a7c4e", letterSpacing: "-0.01em" }}>
                        {formatARS(getTotalGasto(gastos) * 12)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Botón calcular */}
              <motion.button
                onClick={handleCalcular}
                disabled={loading || totalGasto === 0}
                whileHover={!loading && totalGasto > 0 ? { y: -1, boxShadow: "0 12px 32px rgba(16,185,129,0.4)" } : {}}
                whileTap={!loading && totalGasto > 0 ? { scale: 0.98 } : {}}
                style={{
                  position:"relative", overflow:"hidden",
                  width:"100%", height:60, marginTop: 28,
                  background: totalGasto === 0 || loading
                    ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)"
                    : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color:"white", border:"none", borderRadius:18,
                  fontSize:16, fontWeight:700,
                  cursor: totalGasto === 0 || loading ? "not-allowed" : "pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow: totalGasto > 0 && !loading ? "0 8px 24px rgba(16,185,129,0.3)" : "none",
                  transition:"background 0.2s, box-shadow 0.2s",
                  marginBottom:12,
                }}
              >
                {!loading && totalGasto > 0 && (
                  <span aria-hidden style={{
                    position:"absolute", top:0, bottom:0, width:"40%",
                    background:"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                    animation:"slideShimmer 2.2s infinite", pointerEvents:"none",
                  }} />
                )}
                <span style={{ position:"relative", zIndex:1, display:"flex", alignItems:"center", gap:8 }}>
                  {loading ? (
                    <><Spinner />Calculando…</>
                  ) : (
                    <>Calcular mi ahorro
                      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width:18, height:18 }}>
                        <path d="M4 10h12M10 4l6 6-6 6" />
                      </svg>
                    </>
                  )}
                </span>
              </motion.button>

              {totalGasto === 0 && !loading && (
                <p style={{ textAlign:"center", fontSize:12, color:"#94a3b8", margin:"0 0 12px" }}>
                  Ingresá al menos un monto para calcular
                </p>
              )}

              {/* Guardar / cargar perfil */}
              <div style={{ display:"flex", gap:10 }}>
                {(["guardar","cargar"] as const).map((action) => (
                  <button key={action}
                    onClick={action === "guardar" ? handleGuardarPerfil : handleCargarPerfil}
                    style={{ flex:1, fontSize:13, color:"#64748b", background:"#f8fafc",
                      border:"1.5px solid #e2e8f0", borderRadius:10, padding:"8px 12px",
                      cursor:"pointer", transition:"background 0.15s, border-color 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background="#f1f5f9"; e.currentTarget.style.borderColor="#cbd5e1" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background="#f8fafc"; e.currentTarget.style.borderColor="#e2e8f0" }}
                  >
                    {action === "guardar" ? "Guardar perfil" : "Cargar perfil"}
                  </button>
                ))}
              </div>
            </motion.section>
          </div>
        </div>

        {/* ════ RESULTADOS ════ */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>

          {/* Cómo funciona — solo antes de calcular */}
          <AnimatePresence>
            {resultados === null && (
              <motion.section
                key="como-funciona"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, delay: 0.2 }}
                style={{ padding: "96px 0 0" }}
              >
                <h2 style={{ fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 900, letterSpacing: "-0.04em",
                  color: "#0a0a0a", marginBottom: 56, textAlign: "center" }}>
                  Cómo funciona
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24 }}>
                  {COMO_FUNCIONA.map(({ Icono, num, title, desc }, i) => (
                    <motion.div key={num}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.09 }}
                      style={{ position: "relative", padding: "36px 28px 32px",
                        background: "rgba(255,255,255,0.95)", borderRadius: 24,
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.06)" }}
                    >
                      <span style={{
                        position: "absolute", top: 12, left: 20,
                        fontSize: 88, fontWeight: 900, lineHeight: 1,
                        color: "#10b981", opacity: 0.07,
                        userSelect: "none", pointerEvents: "none",
                      }}>{num}</span>
                      <div style={{ position: "relative" }}>
                        <div style={{
                          width: 52, height: 52, borderRadius: 16,
                          background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
                          boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
                        }}>
                          <Icono size={24} color="#059669" strokeWidth={1.75} />
                        </div>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: "0 0 10px", letterSpacing: "-0.02em" }}>{title}</h3>
                        <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.65 }}>{desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Resultados */}
          <div ref={resultadosRef} style={{ scrollMarginTop: 80, paddingTop: resultados ? 80 : 0 }}>
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
        </div>

        {/* ════ GUÍAS ════ */}
        <section style={{ padding: "96px 24px 96px", background: "#f9fafb" }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6,
                background:"#f0fdf4", border:"1px solid #d1fae5",
                borderRadius:999, padding:"5px 14px", marginBottom:16,
                fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#065f46" }}>
                <BookOpen size={11} color="#059669" />
                Guías financieras
              </div>
              <h2 style={{ fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 900,
                letterSpacing: "-0.045em", color: "#0a0a0a", margin: "0 0 14px" }}>
                Aprendé a tomar mejores decisiones
              </h2>
              <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
                Contenido educativo sobre finanzas personales en Argentina.
              </p>
            </div>

            <div className="guias-grid">
              {GUIAS.map(({ Icono, titulo, desc }, i) => {
                const gradientes = [
                  { bg: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)", iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", accent: "#059669" },
                  { bg: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)", iconBg: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", accent: "#2563eb" },
                  { bg: "linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)", iconBg: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)", accent: "#9333ea" },
                ]
                const { bg, iconBg, accent } = gradientes[i % 3]

                return (
                  <motion.div
                    key={titulo}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.1 }}
                    whileHover={{ y: -6, boxShadow: "0 24px 56px rgba(0,0,0,0.1)" }}
                    style={{
                      background: bg,
                      border: "1.5px solid rgba(0,0,0,0.05)",
                      borderRadius: 26,
                      padding: "36px 32px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      display: "flex", flexDirection: "column",
                      minHeight: 280,
                      position: "relative", overflow: "hidden",
                      cursor: "default",
                    }}
                  >
                    {/* Orb decorativo de fondo */}
                    <div aria-hidden style={{
                      position:"absolute", bottom:-40, right:-40, width:160, height:160,
                      borderRadius:"50%", background:accent, opacity:0.07, pointerEvents:"none",
                    }} />

                    {/* Ícono */}
                    <div style={{
                      width: 60, height: 60, borderRadius: 18,
                      background: iconBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 24,
                      boxShadow: `0 8px 24px ${accent}33`,
                      flexShrink: 0,
                    }}>
                      <Icono size={28} color="#fff" strokeWidth={1.75} />
                    </div>

                    {/* Contenido */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: 19, fontWeight: 900, color: "#0a0a0a",
                        margin: "0 0 12px", lineHeight: 1.25, letterSpacing: "-0.03em",
                      }}>
                        {titulo}
                      </h3>
                      <p style={{ fontSize: 15, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>
                        {desc}
                      </p>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: accent,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(255,255,255,0.7)", padding: "7px 14px",
                        borderRadius: 10, border: `1px solid ${accent}22`,
                      }}>
                        Leer guía <ArrowRight size={13} />
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#9ca3af",
                        background: "rgba(255,255,255,0.6)", padding: "4px 10px",
                        borderRadius: 999,
                      }}>
                        Próximamente
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ════ FOOTER OSCURO ════ */}
        <footer style={{
          background: "#0a0a0a",
          padding: "72px 24px 48px",
          color: "#fff",
        }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48,
              marginBottom: 48, flexWrap: "wrap" }}
              className="footer-grid">

              {/* Brand */}
              <div>
                <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>
                    <span style={{ color: "#10b981" }}>r</span>
                    <span style={{ color: "#fff" }}>ateargy</span>
                  </span>
                </a>
                <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, maxWidth: 320, margin: "0 0 20px" }}>
                  El comparador financiero independiente de Argentina. Comparamos tarjetas de crédito y más para que tomés las mejores decisiones.
                </p>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 999, padding: "5px 12px",
                  fontSize: 11, fontWeight: 700, color: "#10b981" }}>
                  ✓ Actualizado abril 2026
                </div>
              </div>

              {/* Productos */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#4b5563", marginBottom: 16 }}>
                  Productos
                </p>
                {[
                  { label: "Tarjetas de crédito", href: "/tarjetas" },
                  { label: "Guías financieras", href: "/articulos" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ display: "block", fontSize: 14,
                    color: "#9ca3af", textDecoration: "none", marginBottom: 10,
                    transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="#9ca3af"}>
                    {label}
                  </a>
                ))}
              </div>

              {/* Información */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "#4b5563", marginBottom: 16 }}>
                  Información
                </p>
                {[
                  { label: "Guías financieras", href: "/articulos" },
                  { label: "Metodología", href: "/metodologia" },
                  { label: "Sobre rateargy", href: "/nosotros" },
                  { label: "Contacto", href: "/contacto" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ display: "block", fontSize: 14,
                    color: "#9ca3af", textDecoration: "none", marginBottom: 10,
                    transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="#9ca3af"}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: "1px solid #1f2937", paddingTop: 24,
              display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <p style={{ fontSize: 12, color: "#4b5563", margin: 0 }}>
                © 2026 rateargy · Información orientativa, no constituye asesoramiento financiero.
              </p>
              <div style={{ display: "flex", gap: 16 }}>
                {[
                  { label: "Términos", href: "/terminos" },
                  { label: "Privacidad", href: "/privacidad" },
                ].map(({ label, href }) => (
                  <a key={label} href={href} style={{ fontSize: 12, color: "#4b5563",
                    textDecoration: "none", transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color="#9ca3af"}
                    onMouseLeave={e => e.currentTarget.style.color="#4b5563"}>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>

        <style>{`
          @media (max-width: 768px) {
            .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          }
        `}</style>
      </div>

      <Toast msg={toastMsg} />
    </>
  )
}
