"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Calculator, BarChart2, Trophy, ArrowRight, BookOpen, CreditCard, Banknote, PiggyBank, ChevronDown, X, Check, Bell, CheckCircle } from "lucide-react"
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
  { label: "Servicios (luz, gas, tel.)", key: "servicios" },
]

const GASTOS_VACIO: Gastos = {
  super: 0, nafta: 0, farmacia: 0, delivery: 0,
  online: 0, servicios: 0,
}

const STATS = [
  { value: "20",  label: "tarjetas comparadas" },
  { value: "6",   label: "categorías de gasto" },
  { value: "~3m", label: "para ver tu ranking" },
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

// ─── Elegibilidad por segmento de ingresos ────────────────────────────────────

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
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#94a3b8", margin: 0 }}>
            Ejemplo real · esta semana
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "2px 0 0" }}>
            Gasto típico de un argentino
          </p>
        </div>
        <div style={{
          background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
          border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 10, padding: "5px 11px",
          fontSize: 11, fontWeight: 700, color: "#059669",
          boxShadow: "0 2px 8px rgba(16,185,129,0.12)",
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

    </motion.div>
  )
}

// ─── MarqueeLogos ─────────────────────────────────────────────────────────────

function MarqueeLogos() {
  // Dedup: un item por banco (puede haber varias tarjetas del mismo banco)
  const seen = new Set<string>()
  const unique = TARJETAS.filter(t => {
    if (seen.has(t.banco)) return false
    seen.add(t.banco)
    return true
  })
  const items = [...unique, ...unique] // duplicar para loop infinito
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

// ─── Perfil típico para teaser ────────────────────────────────────────────────
const PERFIL_TIPICO: Gastos = {
  super: 200000, nafta: 50000, farmacia: 50000, delivery: 25000,
  online: 30000, servicios: 10000,
}

// Gradientes representativos (sin importar ResultadosTarjetas)
const TEASER_GRADIENTS: Record<string, string> = {
  "galicia-eminent": "linear-gradient(135deg, #134e32 0%, #1a7f4f 60%, #22c55e 100%)",
  "galicia":         "linear-gradient(135deg, #0f3d24 0%, #1a6b3f 60%, #259a5b 100%)",
  "bbva":            "linear-gradient(135deg, #00437f 0%, #005cbf 60%, #1a7ae0 100%)",
  "bbva-platinum":   "linear-gradient(135deg, #1a1a2e 0%, #22304a 60%, #2d4169 100%)",
  "santander":       "linear-gradient(135deg, #7a0000 0%, #b80000 60%, #e60000 100%)",
  "santander-gold":  "linear-gradient(135deg, #5c3d00 0%, #96680a 60%, #c9940f 100%)",
  "macro":           "linear-gradient(135deg, #0a3370 0%, #1254a8 60%, #1a6fd4 100%)",
  "naranja-x":       "linear-gradient(135deg, #b33a00 0%, #e65200 60%, #ff6a1a 100%)",
  "uala":            "linear-gradient(135deg, #3d006b 0%, #6200b3 60%, #8c00e6 100%)",
  "bna":             "linear-gradient(135deg, #002952 0%, #003d7a 60%, #0055ab 100%)",
}

// ─── MiniTeaser ───────────────────────────────────────────────────────────────
function MiniTeaser({ onCTA }: { onCTA: () => void }) {
  const top3 = rankear(PERFIL_TIPICO).slice(0, 3)

  return (
    <section style={{ paddingBottom: 32 }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-end", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16, marginBottom: 48,
      }}>
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 999, padding: "6px 14px", marginBottom: 14,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#059669",
            boxShadow: "0 2px 8px rgba(16,185,129,0.12)",
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Actualizado esta semana
          </div>
          <h2 style={{
            fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0a0a0a", margin: 0, lineHeight: 1.05,
          }}>
            Ejemplo de ahorro real
          </h2>
        </div>
        <button
          onClick={onCTA}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: 12,
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
            color: "#059669", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(16,185,129,0.1)",
            flexShrink: 0,
          }}
        >
          Calculá el tuyo
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Cards */}
      <div className="teaser-grid">
        {top3.map((t, i) => {
          const grad = TEASER_GRADIENTS[t.id] ?? t.gradiente
          const medals = ["🥇", "🥈", "🥉"]

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              style={{
                background: i === 0
                  ? "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)"
                  : "#ffffff",
                border: `1.5px solid ${i === 0 ? "rgba(16,185,129,0.25)" : "#f3f4f6"}`,
                borderRadius: 24,
                padding: "32px",
                position: "relative", overflow: "hidden",
                boxShadow: i === 0
                  ? "0 8px 32px rgba(16,185,129,0.12)"
                  : "0 4px 16px rgba(0,0,0,0.04)",
              }}
            >
              {/* Orb decorativo */}
              <div aria-hidden style={{
                position: "absolute", bottom: -30, right: -30, width: 120, height: 120,
                borderRadius: "50%",
                background: i === 0 ? "rgba(16,185,129,0.08)" : "rgba(0,0,0,0.03)",
                pointerEvents: "none",
              }} />

              {/* Posición + mini card */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{medals[i]}</span>
                <div style={{
                  width: 52, height: 32, borderRadius: 8,
                  background: grad, flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.nombre}
                  </p>
                  <p style={{ fontSize: 11, color: "#9ca3af", margin: 0 }}>{t.banco}</p>
                </div>
              </div>

              {/* Ahorro */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                  Ahorro mensual estimado
                </p>
                <p style={{
                  fontSize: "clamp(24px, 2.5vw, 30px)", fontWeight: 900,
                  color: i === 0 ? "#059669" : "#111827",
                  margin: 0, letterSpacing: "-0.03em", lineHeight: 1,
                }}>
                  {formatARS(t.ahorro)}
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>
                  {formatARS(t.ahorro * 12)} al año
                </p>
              </div>

              {/* Pills top beneficios */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.pills.slice(0, 2).map(p => (
                  <span key={p} style={{
                    fontSize: 11, fontWeight: 600,
                    padding: "3px 8px", borderRadius: 6,
                    background: i === 0 ? "rgba(16,185,129,0.1)" : "#f3f4f6",
                    color: i === 0 ? "#059669" : "#6b7280",
                  }}>
                    {p}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 16 }}>
        Basado en un gasto típico mensual · Los montos reales varían según tu perfil
      </p>
    </section>
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
        .teaser-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }
        @media (max-width: 768px) { .teaser-grid { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
        .partners-track { animation: marquee 30s linear infinite; }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{ position: "relative", minHeight: "100vh", background: "#ffffff", overflow: "clip" }}>

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

        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1120, margin: "0 auto", padding: "0 24px 0",
        }}>

          {/* ════ SECCIÓN 1: HERO (dos columnas) ════ */}
          <section style={{ paddingTop: 96, paddingBottom: 96 }}>
            <div className="hero-grid">

              {/* Columna izquierda */}
              <div>
                {/* Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7,
                    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                    border: "1px solid rgba(16,185,129,0.25)",
                    borderRadius: 999, padding: "7px 16px",
                    fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", color: "#059669", marginBottom: 24,
                    boxShadow: "0 2px 10px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.8)" }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px rgba(16,185,129,0.6)" }} />
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

          {/* ════ TRUST BAR ════ */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            style={{
              display: "flex", alignItems: "stretch",
              background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)",
              border: "1px solid rgba(16,185,129,0.12)",
              borderRadius: 20, overflow: "hidden",
              marginBottom: 96,
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}
          >
            {[
              { num: "+15.000", label: "argentinos esta semana" },
              { num: "Cada lunes", label: "datos actualizados" },
              { num: "100%", label: "gratis · sin registro" },
            ].map(({ num, label }, i) => (
              <div key={label} style={{
                flex: 1, textAlign: "center", padding: "24px 16px",
                borderRight: i < 2 ? "1px solid rgba(16,185,129,0.1)" : "none",
              }}>
                <p style={{ fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 900, color: "#0a0a0a", margin: "0 0 4px", letterSpacing: "-0.03em" }}>
                  {num}
                </p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </motion.div>

          {/* ════ MINI TEASER ════ */}
          <MiniTeaser onCTA={scrollToCalculadora} />

          {/* ── Separador teaser → marquee ── */}
          <div aria-hidden style={{ height:1, background:"linear-gradient(90deg, transparent, #e5e7eb 30%, #e5e7eb 70%, transparent)", marginBottom:80, marginTop: 80 }} />

          {/* ════ MARQUEE — logos bancos ════ */}
          <section style={{ marginBottom: 112 }}>
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
          background: "linear-gradient(180deg, #ffffff 0%, #f0fdf6 35%, #f7fdf9 65%, #ffffff 100%)",
          padding: "96px 24px 112px",
        }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>

            {/* Encabezado de sección */}
            <div style={{ textAlign: "center", marginBottom: 56 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7,
                background:"linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                border:"1px solid rgba(16,185,129,0.25)",
                borderRadius:999, padding:"7px 16px", marginBottom:16,
                fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#059669",
                boxShadow:"0 2px 10px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,0.6)" }} />
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24, marginBottom: 28 }}>
                {CAT_FIELDS.map(({ label, key }, idx) => (
                  <motion.div key={key}
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.06 }}
                  >
                    <label htmlFor={`input-${key}`} style={{
                      display: "flex", alignItems: "center", gap: 7,
                      fontSize: 13, fontWeight: 600, color: "#374151",
                      letterSpacing: "0.02em", marginBottom: 10, cursor: "pointer",
                    }}>
                      <CatIcon catKey={key} className="w-4 h-4 flex-shrink-0" style={{ color: "#6b7280" }} />
                      {label}
                    </label>

                    <div style={{ position: "relative" }}>
                      <div style={{ position:"absolute", inset:0, right:"auto", width:44,
                        display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
                        <CatIcon catKey={key} className="w-5 h-5" style={{ color: "#94a3b8" }} />
                      </div>
                      <div style={{ position:"absolute", inset:0, left:42, right:"auto", width:18,
                        display:"flex", alignItems:"center", pointerEvents:"none",
                        fontSize:15, color:"#94a3b8", fontWeight:500, userSelect:"none" }}>$</div>
                      <input
                        id={`input-${key}`}
                        type="number" min="0" placeholder="0"
                        value={gastos[key] === 0 ? "" : gastos[key]}
                        onChange={(e) => updateGasto(key, e.target.value)}
                        style={{
                          width:"100%", boxSizing:"border-box",
                          padding:"16px 16px 16px 62px",
                          background:"#f8fafc", border:"1.5px solid #e2e8f0",
                          borderRadius:14, fontSize: 16, color:"#0f172a", outline:"none",
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
                      padding: "20px 24px",
                      background: "linear-gradient(135deg, #f0fdf7 0%, #dcfce7 60%, #f0fdf7 100%)",
                      border: "1.5px solid #86efac",
                      borderRadius: 16,
                      marginTop: 20,
                      boxShadow: "0 4px 20px rgba(16,185,129,0.12)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(16,185,129,0.3)", flexShrink: 0 }}>
                        <BarChart2 size={22} color="white" />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Gasto mensual total</div>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                          {formatARS(getTotalGasto(gastos))}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.08em" }}>Al año serían</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", letterSpacing: "-0.02em" }}>
                        {formatARS(getTotalGasto(gastos) * 12)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* SELECTOR INGRESOS (CAMBIO 2) */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 8 }}>
                  ¿Cuál es tu ingreso mensual aproximado?
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>
                  Lo usamos para mostrarte solo las tarjetas que podés obtener con tu perfil
                </div>

                {/* Grid 2x2 */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  {[
                    { value: "bajo",     texto: "Hasta $400.000/mes",     subtexto: "Tarjetas accesibles" },
                    { value: "medio",    texto: "$400k a $800.000/mes",   subtexto: "Mayoría de tarjetas" },
                    { value: "alto",     texto: "$800k a $1.500.000/mes", subtexto: "Tarjetas premium" },
                    { value: "muy-alto", texto: "Más de $1.500.000/mes",  subtexto: "Todas las tarjetas" },
                  ].map(({ value, texto, subtexto }) => {
                    const sel = ingresos === value
                    return (
                      <button
                        key={value}
                        onClick={() => setIngresos(sel ? "" : value)}
                        style={{
                          border: `1.5px solid ${sel ? "#0a7c4e" : "#e2e8f0"}`,
                          borderRadius: 10,
                          padding: "12px 16px",
                          background: sel ? "#f0fdf7" : "white",
                          cursor: "pointer",
                          textAlign: "left",
                          transition: "all 0.2s",
                          fontSize: 13,
                          color: sel ? "#065f46" : "#374151",
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{texto}</div>
                        <div style={{ fontSize: 11, color: sel ? "#065f46" : "#94a3b8", marginTop: 2 }}>{subtexto}</div>
                      </button>
                    )
                  })}
                </div>

                {/* Opción: prefiero no indicarlo */}
                <button
                  onClick={() => setIngresos(ingresos === "nodice" ? "" : "nodice")}
                  style={{
                    width: "100%",
                    border: `1px solid ${ingresos === "nodice" ? "#0a7c4e" : "#e2e8f0"}`,
                    borderRadius: 10,
                    padding: "8px 16px",
                    background: "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s",
                    fontSize: 12,
                    color: ingresos === "nodice" ? "#065f46" : "#94a3b8",
                  }}
                >
                  Prefiero no indicarlo
                </button>
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

        {/* ── Separador calculadora → resultados ── */}
        <div aria-hidden style={{ height:1, background:"linear-gradient(90deg, transparent, #e5e7eb 30%, #e5e7eb 70%, transparent)", maxWidth:1120, margin:"0 auto" }} />

        {/* ════ RESULTADOS ════ */}
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px" }}>

          {/* Cómo funciona — solo antes de calcular */}
          <AnimatePresence>
            {resultados === null && (
              <motion.section
                key="como-funciona"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, delay: 0.2 }}
                style={{ padding: "96px 0 80px" }}
              >
                {/* Eyebrow */}
                <div style={{ textAlign: "center", marginBottom: 56 }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:7,
                    background:"linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                    border:"1px solid rgba(16,185,129,0.25)",
                    borderRadius:999, padding:"7px 16px", marginBottom:16,
                    fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#059669",
                    boxShadow:"0 2px 10px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#10b981", display:"inline-block", boxShadow:"0 0 6px rgba(16,185,129,0.6)" }} />
                    Simple y transparente
                  </div>
                  <h2 style={{ fontSize: "clamp(28px,3.2vw,44px)", fontWeight: 900, letterSpacing: "-0.04em",
                    color: "#0a0a0a", margin: "0 0 16px" }}>
                    Cómo funciona
                  </h2>
                  <p style={{ fontSize: 17, color: "#6b7280", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
                    En menos de un minuto sabés qué tarjeta te conviene más.
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
                  {COMO_FUNCIONA.map(({ Icono, num, title, desc }, i) => (
                    <motion.div key={num}
                      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 + i * 0.09 }}
                      whileHover={{ y: -4, boxShadow: "0 24px 56px rgba(0,0,0,0.09)" }}
                      style={{ position: "relative", padding: "40px 32px 36px",
                        background: "#fff", borderRadius: 28,
                        border: "1px solid rgba(0,0,0,0.06)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
                        transition: "box-shadow 0.25s", }}
                    >
                      <span style={{
                        position: "absolute", top: 16, left: 24,
                        fontSize: 96, fontWeight: 900, lineHeight: 1,
                        color: "#10b981", opacity: 0.06,
                        userSelect: "none", pointerEvents: "none",
                      }}>{num}</span>
                      <div style={{ position: "relative" }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: 18,
                          background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
                          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
                          boxShadow: "0 6px 16px rgba(16,185,129,0.2)",
                        }}>
                          <Icono size={26} color="#059669" strokeWidth={1.75} />
                        </div>
                        <h3 style={{ fontSize: 19, fontWeight: 800, color: "#111827", margin: "0 0 12px", letterSpacing: "-0.025em" }}>{title}</h3>
                        <p style={{ fontSize: 15, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>{desc}</p>
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
                  haySegmentacion={haySegmentacion}
                  noElegiblesIds={
                    haySegmentacion && ingresos && ELEGIBILIDAD[ingresos]?.length > 0
                      ? TARJETAS.filter(t => !ELEGIBILIDAD[ingresos].includes(t.id)).map(t => t.id)
                      : []
                  }
                />
              )}
            </AnimatePresence>

            {/* ── Email capture — solo post-cálculo ── */}
            {resultados !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                style={{
                  background: "linear-gradient(135deg, #f0fdf7 0%, #ffffff 100%)",
                  border: "1.5px solid #bbf7d0",
                  borderRadius: 16,
                  padding: 32,
                  marginTop: 32,
                  textAlign: "center",
                  maxWidth: 560,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                {/* Ícono campana */}
                <div style={{
                  background: "#0a7c4e", borderRadius: "50%",
                  width: 48, height: 48,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  <Bell size={22} color="white" />
                </div>

                {/* Título */}
                <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
                  ¿Cambian los beneficios de tu tarjeta?
                </p>

                {/* Subtítulo */}
                <p style={{
                  fontSize: 15, color: "#475569", lineHeight: 1.6,
                  maxWidth: 400, margin: "0 auto 24px",
                }}>
                  Te avisamos cada lunes con las promos actualizadas y si aparece una tarjeta mejor para tu perfil.
                </p>

                {emailEnviado ? (
                  /* Estado de éxito */
                  <div>
                    <CheckCircle size={40} color="#0a7c4e" style={{ margin: "0 auto 12px", display: "block" }} />
                    <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>
                      ¡Listo! Te avisamos cada lunes.
                    </p>
                    <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>
                      Revisá tu bandeja de entrada el próximo lunes.
                    </p>
                  </div>
                ) : (
                  /* Formulario */
                  <div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="email"
                        placeholder="tu@email.com"
                        value={emailInput}
                        onChange={(e) => { setEmailInput(e.target.value); setEmailError(false) }}
                        style={{
                          flex: 1, minWidth: 0,
                          padding: "12px 16px",
                          border: emailError ? "1.5px solid #f87171" : "1.5px solid #e2e8f0",
                          borderRadius: 10, fontSize: 15,
                          outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
                        }}
                        onFocus={(e) => { e.target.style.borderColor = "#0a7c4e"; e.target.style.boxShadow = "0 0 0 3px rgba(10,124,78,0.1)" }}
                        onBlur={(e) => { e.target.style.borderColor = emailError ? "#f87171" : "#e2e8f0"; e.target.style.boxShadow = "none" }}
                      />
                      <button
                        onClick={() => {
                          if (!emailInput.includes("@")) {
                            setEmailError(true)
                            return
                          }
                          localStorage.setItem("rateargy_email", emailInput)
                          localStorage.setItem("rateargy_perfil_email", JSON.stringify({
                            email: emailInput,
                            gastos,
                            timestamp: new Date().toISOString(),
                          }))
                          setEmailEnviado(true)
                          console.log("email_capturado", { email: emailInput, timestamp: new Date().toISOString() })
                        }}
                        style={{
                          background: "#0a7c4e", color: "white",
                          padding: "12px 20px", borderRadius: 10,
                          fontSize: 15, fontWeight: 600,
                          border: "none", cursor: "pointer",
                          whiteSpace: "nowrap", flexShrink: 0,
                          transition: "opacity 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88" }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
                      >
                        Avisame →
                      </button>
                    </div>
                    {emailError && (
                      <p style={{ fontSize: 13, color: "#ef4444", margin: "6px 0 0", textAlign: "left" }}>
                        Ingresá un email válido
                      </p>
                    )}
                    <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 12 }}>
                      Sin spam. Cancelás cuando quieras.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* ── Separador resultados → guías ── */}
        <div aria-hidden style={{ height:1, background:"linear-gradient(90deg, transparent, #e5e7eb 30%, #e5e7eb 70%, transparent)" }} />

        {/* ════ GUÍAS ════ */}
        <section style={{
          padding: "104px 24px 104px",
          background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
        }}>
          <div style={{ maxWidth: 1120, margin: "0 auto" }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:7,
                background:"linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                border:"1px solid rgba(16,185,129,0.25)",
                borderRadius:999, padding:"7px 16px", marginBottom:18,
                fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"#059669",
                boxShadow:"0 2px 10px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.8)" }}>
                <BookOpen size={11} color="#059669" />
                Guías financieras
              </div>
              <h2 style={{ fontSize: "clamp(30px,3.5vw,48px)", fontWeight: 900,
                letterSpacing: "-0.045em", color: "#0a0a0a", margin: "0 0 16px", lineHeight: 1.05 }}>
                Aprendé a tomar mejores decisiones
              </h2>
              <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
                Contenido educativo sobre finanzas personales en Argentina.
              </p>
            </div>

            <div className="guias-grid">
              {GUIAS.map(({ Icono, titulo, desc }, i) => {
                const paletas = [
                  { bg: "linear-gradient(145deg, #f0fdf8 0%, #dcfce7 100%)", iconBg: "linear-gradient(135deg, #10b981 0%, #059669 100%)", accent: "#059669", border: "#a7f3d0" },
                  { bg: "linear-gradient(145deg, #f0f7ff 0%, #dbeafe 100%)", iconBg: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", accent: "#2563eb", border: "#bfdbfe" },
                  { bg: "linear-gradient(145deg, #fdf5ff 0%, #ede9fe 100%)", iconBg: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)", accent: "#7c3aed", border: "#ddd6fe" },
                ]
                const { bg, iconBg, accent, border } = paletas[i % 3]

                return (
                  <motion.div
                    key={titulo}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                    whileHover={{ y: -8, boxShadow: `0 28px 64px rgba(0,0,0,0.12), 0 0 0 1.5px ${border}` }}
                    style={{
                      background: bg,
                      border: `1.5px solid ${border}`,
                      borderRadius: 28,
                      padding: "40px 36px",
                      boxShadow: "0 6px 24px rgba(0,0,0,0.05)",
                      display: "flex", flexDirection: "column",
                      minHeight: 300,
                      position: "relative", overflow: "hidden",
                      cursor: "default",
                    }}
                  >
                    {/* Orb decorativo */}
                    <div aria-hidden style={{
                      position:"absolute", bottom:-50, right:-50, width:180, height:180,
                      borderRadius:"50%", background:accent, opacity:0.06, pointerEvents:"none",
                    }} />
                    <div aria-hidden style={{
                      position:"absolute", top:-30, left:-30, width:100, height:100,
                      borderRadius:"50%", background:accent, opacity:0.04, pointerEvents:"none",
                    }} />

                    {/* Ícono */}
                    <div style={{
                      width: 68, height: 68, borderRadius: 20,
                      background: iconBg,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: 28,
                      boxShadow: `0 10px 28px ${accent}40`,
                      flexShrink: 0,
                    }}>
                      <Icono size={32} color="#fff" strokeWidth={1.5} />
                    </div>

                    {/* Contenido */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: 20, fontWeight: 900, color: "#0a0a0a",
                        margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.03em",
                      }}>
                        {titulo}
                      </h3>
                      <p style={{ fontSize: 15, color: "#6b7280", margin: 0, lineHeight: 1.75 }}>
                        {desc}
                      </p>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 700, color: accent,
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(255,255,255,0.75)", padding: "8px 16px",
                        borderRadius: 12, border: `1.5px solid ${border}`,
                        backdropFilter: "blur(8px)",
                      }}>
                        Leer guía <ArrowRight size={14} />
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#9ca3af",
                        background: "rgba(255,255,255,0.6)", padding: "5px 11px",
                        borderRadius: 999, border: "1px solid rgba(0,0,0,0.06)",
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

        {/* ── Separador guías → footer ── */}
        <div aria-hidden style={{ height:1, background:"linear-gradient(90deg, transparent, #1f2937 30%, #1f2937 70%, transparent)" }} />

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
                  { label: "Inversiones", href: "/inversiones" },
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

      </div>

      <Toast msg={toastMsg} />
    </>
  )
}
