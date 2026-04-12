"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Percent, ShoppingCart, Zap, Plane, Pill, Car, ArrowUpRight, TrendingUp } from "lucide-react"
import { TARJETAS, type Tarjeta, type CatKey, type Gastos } from "./tarjetas-data"

// ─── Utilidades ──────────────────────────────────────────────────────────────

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n)
}

function getScorePct(ahorro: number, maxAhorro: number): number {
  if (maxAhorro === 0) return 0
  return Math.round((ahorro / maxAhorro) * 100)
}

// ─── Hook: contador 0 → target ────────────────────────────────────────────────
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    setValue(0)
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

// ─── SVG paths exportados ─────────────────────────────────────────────────────
export const CAT_SVG_PATHS: Record<CatKey, string> = {
  super:      "M3 6h18l-1.5 9H4.5L3 6zM3 6L2 2H0M8 11V8m4 3V8",
  nafta:      "M5 4h10l2 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V8l2-4zM9 12h6",
  farmacia:   "M12 5v14M5 12h14",
  delivery:   "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  online:     "M16 11a4 4 0 10-8 0 4 4 0 008 0zM12 3v2m0 12v2M3 11h2m12 0h2",
  viajes:     "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  transporte: "M8 6h8a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2zM6 10h12M8 14h1m6 0h1",
  servicios:  "M13 10V3L4 14h7v7l9-11h-7z",
}

export function CatIcon({ catKey, className, style }: { catKey: CatKey; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d={CAT_SVG_PATHS[catKey]} />
    </svg>
  )
}

// ─── Colores suaves por categoría (para los círculos del breakdown) ───────────
const CAT_COLORS: Record<CatKey, { bg: string; color: string }> = {
  super:      { bg: "#d1fae5", color: "#059669" },
  nafta:      { bg: "#fef3c7", color: "#d97706" },
  farmacia:   { bg: "#fce7f3", color: "#db2777" },
  delivery:   { bg: "#ede9fe", color: "#7c3aed" },
  online:     { bg: "#dbeafe", color: "#2563eb" },
  viajes:     { bg: "#e0f2fe", color: "#0284c7" },
  transporte: { bg: "#f3f4f6", color: "#6b7280" },
  servicios:  { bg: "#fef9c3", color: "#ca8a04" },
}

const CAT_META: Record<CatKey, { label: string }> = {
  super:      { label: "Supermercados" },
  nafta:      { label: "Nafta" },
  farmacia:   { label: "Farmacia" },
  delivery:   { label: "Delivery" },
  online:     { label: "Online" },
  viajes:     { label: "Viajes" },
  transporte: { label: "Transporte" },
  servicios:  { label: "Servicios" },
}

// ─── SVG: chip + contactless ──────────────────────────────────────────────────
function ChipSVG({ scale = 1 }: { scale?: number }) {
  return (
    <svg viewBox="0 0 24 18" style={{ width: Math.round(24*scale), height: Math.round(18*scale), flexShrink: 0 }}
      fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1">
      <rect x="1" y="1" width="22" height="16" rx="3" />
      <line x1="1" y1="6" x2="23" y2="6" /><line x1="1" y1="12" x2="23" y2="12" />
      <line x1="8" y1="1" x2="8" y2="17" /><line x1="16" y1="1" x2="16" y2="17" />
    </svg>
  )
}

function ContactlessSVG({ scale = 1 }: { scale?: number }) {
  const s = Math.round(18*scale)
  return (
    <svg viewBox="0 0 18 18" style={{ width: s, height: s, flexShrink: 0 }}
      fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="9" cy="9" r="1.5" fill="rgba(255,255,255,0.5)" stroke="none" />
      <path d="M12 6a4.24 4.24 0 010 6" />
      <path d="M14.5 3.5a7.78 7.78 0 010 11" />
    </svg>
  )
}

// ─── Mini tarjeta física ──────────────────────────────────────────────────────
function MiniCard({ tarjeta, size = "lg" }: { tarjeta: Tarjeta; size?: "sm" | "lg" }) {
  if (size === "sm") {
    return (
      <div style={{ background: tarjeta.gradiente, width: 80, height: 50,
        borderRadius: 10, position: "relative", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ position:"absolute", top:6, left:6 }}><ChipSVG scale={0.55} /></div>
        <div style={{ position:"absolute", top:5, right:5 }}><ContactlessSVG scale={0.65} /></div>
        <span style={{ position:"absolute", bottom:5, left:7,
          fontSize:6.5, fontWeight:700, color:"white", opacity:0.9, lineHeight:1.2 }}>
          {tarjeta.banco}
        </span>
      </div>
    )
  }

  return (
    <div style={{ background: tarjeta.gradiente, width:"100%", maxWidth:340,
      aspectRatio:"1.586/1", borderRadius:20, position:"relative", overflow:"hidden",
      boxShadow:"0 16px 48px rgba(0,0,0,0.2)" }}>
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%)", pointerEvents:"none" }} />
      <span style={{ position:"absolute", top:16, left:20, fontSize:13, fontWeight:700,
        color:"white", opacity:0.95, letterSpacing:"0.02em" }}>{tarjeta.banco}</span>
      <div style={{ position:"absolute", top:"34%", left:"8%" }}><ChipSVG scale={1} /></div>
      <div style={{ position:"absolute", top:"16%", right:"7%" }}><ContactlessSVG scale={1} /></div>
      <span style={{ position:"absolute", fontSize:13, bottom:"36%", left:"8%",
        color:"white", fontFamily:"monospace", letterSpacing:"0.2em", opacity:0.75 }}>
        •••• •••• •••• 4521
      </span>
      <span style={{ position:"absolute", fontSize:9.5, bottom:"13%", left:"8%",
        color:"white", fontWeight:600, letterSpacing:"0.06em", opacity:0.85 }}>
        RATEARGY USER&nbsp;&nbsp;&nbsp;12/28
      </span>
      <span style={{ position:"absolute", bottom:16, right:20, fontSize:12, fontWeight:700,
        color:"white", letterSpacing:"0.08em", opacity:0.75 }}>
        {tarjeta.red === "Mastercard" ? "MC" : tarjeta.red.toUpperCase()}
      </span>
    </div>
  )
}

// ─── Breakdown por categoría — PROBLEMA 6 ────────────────────────────────────
function Breakdown({ tarjeta, gastos }: { tarjeta: Tarjeta & { ahorro: number }; gastos: Gastos }) {
  // Muestra TODAS las categorías donde el usuario gasta (con o sin beneficio)
  const rows = (Object.keys(gastos) as CatKey[]).filter((cat) => gastos[cat] > 0)
  if (rows.length === 0) return null

  return (
    <div style={{ marginTop: 24 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase",
        letterSpacing: "0.06em", marginBottom: 8 }}>Detalle por categoría</p>
      <div>
        {rows.map((cat) => {
          const b = tarjeta.beneficios[cat]
          const tieneDesc = b?.pct > 0
          const ahorroCat = tieneDesc ? Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity) : 0
          const { bg, color } = CAT_COLORS[cat]

          return (
            <div key={cat} style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 0", borderBottom: "1px solid #f9fafb",
              background: tieneDesc ? "transparent" : "#fafafa",
            }}>
              {/* Ícono en círculo de color */}
              <div style={{ width:32, height:32, borderRadius:"50%", background: bg,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <CatIcon catKey={cat} className="w-3.5 h-3.5" style={{ color }} />
              </div>

              {/* Nombre + días */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize:14, fontWeight:500, color:"#111827", margin:0, lineHeight:1.3 }}>
                  {CAT_META[cat].label}
                  {"dias" in b && b.dias ? (
                    <span style={{ fontSize:11, color:"#9ca3af", marginLeft:4 }}>({b.dias as string})</span>
                  ) : null}
                </p>
                {!tieneDesc && (
                  <p style={{ fontSize:12, color:"#9ca3af", margin:0 }}>Sin beneficio en esta categoría</p>
                )}
              </div>

              {/* Gasto */}
              <span style={{ fontSize:14, color:"#6b7280", flexShrink:0 }}>
                {formatARS(gastos[cat])}
              </span>

              {/* Ahorro */}
              <span style={{ fontSize:14, fontWeight:700, color: tieneDesc ? "#10b981" : "#d1d5db",
                flexShrink:0, minWidth:72, textAlign:"right" }}>
                {tieneDesc ? `+ ${formatARS(ahorroCat)}` : "—"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Lucide icon por categoría ───────────────────────────────────────────────
type LucideIcon = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>

const CAT_LUCIDE: Record<CatKey, LucideIcon> = {
  super: ShoppingCart, nafta: Car, farmacia: Pill, delivery: Zap,
  online: CreditCard, viajes: Plane, transporte: Car, servicios: Zap,
}

// ─── Beneficios de la semana — grid estilo NerdWallet ────────────────────────
function BeneficiosMes({ resultados, gastos }: {
  resultados: Array<Tarjeta & { ahorro: number }>
  gastos: Gastos
}) {
  type Bene = { catKey: CatKey; nombre: string; banco: string; pct: number; tope: number; dias?: string; ahorroReal: number; key: string }

  const beneficios: Bene[] = []
  for (const cat of Object.keys(gastos) as CatKey[]) {
    if (gastos[cat] <= 0) continue
    let bestTarjeta: (Tarjeta & { ahorro: number }) | null = null
    let bestPct = 0
    for (const t of resultados) {
      const b = t.beneficios[cat]
      if (b?.pct > bestPct) { bestPct = b.pct; bestTarjeta = t }
    }
    if (bestTarjeta && bestPct > 0) {
      const b = bestTarjeta.beneficios[cat]
      beneficios.push({
        catKey: cat, nombre: bestTarjeta.nombre, banco: bestTarjeta.banco,
        pct: b.pct, tope: b.tope,
        dias: "dias" in b ? (b.dias as string | undefined) : undefined,
        ahorroReal: Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity),
        key: `best-${cat}`,
      })
    }
  }

  const visibles = beneficios.sort((a, b) => b.ahorroReal - a.ahorroReal).slice(0, 6)
  if (visibles.length === 0) return null

  return (
    <div style={{ marginTop: 56 }}>
      <style>{`
        .beneficios-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        @media (min-width:768px) { .beneficios-grid { grid-template-columns:repeat(3,1fr); } }
      `}</style>

      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
        <h2 style={{ fontSize:32, fontWeight:800, letterSpacing:"-0.02em", color:"#111827", margin:0 }}>
          Beneficios que aplican a tu perfil
        </h2>
        <span style={{ background:"#d1fae5", color:"#059669", fontSize:12, fontWeight:700,
          padding:"3px 10px", borderRadius:999, letterSpacing:"0.02em", whiteSpace:"nowrap" }}>
          Esta semana
        </span>
      </div>

      <div className="beneficios-grid">
        {visibles.map((b) => {
          const Icon = CAT_LUCIDE[b.catKey]
          const descParts: string[] = []
          if (b.dias) descParts.push(`Los ${b.dias}`)
          descParts.push(`${b.pct}% con ${b.banco}`)

          return (
            <motion.div key={b.key}
              whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(16,185,129,0.12)", borderColor: "#10b981" }}
              transition={{ duration: 0.18 }}
              style={{ background:"white", border:"1px solid #e5e7eb", borderRadius:16, padding:24,
                position:"relative", cursor:"default" }}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
                <div style={{ width:44, height:44, borderRadius:"50%", background:"#d1fae5",
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon size={20} color="#10b981" strokeWidth={1.75} />
                </div>
                <ArrowUpRight size={18} color="#9ca3af" strokeWidth={1.75} />
              </div>
              <p style={{ marginTop:16, fontSize:15, fontWeight:600, color:"#111827", lineHeight:1.3 }}>
                {b.pct}% en {CAT_META[b.catKey].label}
              </p>
              <p style={{ marginTop:6, fontSize:13, color:"#6b7280", lineHeight:1.5 }}>
                {descParts.join(" · ")}
              </p>
              <p style={{ marginTop:12, fontSize:13, fontWeight:600, color:"#10b981" }}>
                Hasta {formatARS(b.ahorroReal)} de ahorro
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Banner cambio recomendado ───────────────────────────────────────────────
function BannerCambio({ tarjetaActualNombre, ganadosaNombre, diferenciaAhorro }: {
  tarjetaActualNombre: string
  ganadosaNombre: string
  diferenciaAhorro: number
}) {
  const ahorroAnimado = useCountUp(diferenciaAhorro, 1200)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        background: "linear-gradient(135deg, #0a7c4e 0%, #059669 50%, #34d399 100%)",
        borderRadius: 16,
        padding: "24px 28px",
        marginBottom: 28,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(10,124,78,0.25), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
    >
      {/* Brillo decorativo 1 */}
      <div aria-hidden style={{
        position: "absolute", top: -60, right: -60, width: 200, height: 200,
        borderRadius: "50%", background: "rgba(255,255,255,0.08)", pointerEvents: "none",
      }} />
      {/* Brillo decorativo 2 */}
      <div aria-hidden style={{
        position: "absolute", bottom: -40, left: -20, width: 140, height: 140,
        borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none",
      }} />

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 20, position: "relative", zIndex: 1, flexWrap: "wrap",
      }}>
        {/* Lado izquierdo */}
        <div>
          <div style={{
            background: "rgba(255,255,255,0.15)", borderRadius: 12,
            width: 48, height: 48, display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: 12,
          }}>
            <TrendingUp size={24} color="white" />
          </div>
          <p style={{
            fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6,
          }}>
            Cambio recomendado
          </p>
          <p style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.2 }}>
            Pasá de {tarjetaActualNombre} a {ganadosaNombre}
          </p>
        </div>

        {/* Lado derecho */}
        <div style={{
          background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "16px 20px",
          backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)",
          textAlign: "center", flexShrink: 0,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600, marginBottom: 4 }}>
            Ahorrarías
          </p>
          <p style={{ fontSize: 32, fontWeight: 900, color: "white", letterSpacing: "-0.03em", lineHeight: 1 }}>
            {formatARS(ahorroAnimado)}
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
            más por mes
          </p>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
            = {formatARS(diferenciaAhorro * 12)} al año
          </p>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Ahorro animado ───────────────────────────────────────────────────────────
function AhorroAnimado({ value }: { value: number }) {
  return <>{formatARS(useCountUp(value, 800))}</>
}

// ─── Barra de score — PROBLEMA 5 ─────────────────────────────────────────────
function ScoreBar({ pct, isTop1 = false }: { pct: number; isTop1?: boolean }) {
  return (
    <div>
      <div style={{ height:8, borderRadius:999, background:"#f3f4f6", overflow:"hidden" }}>
        <motion.div
          style={{ height:"100%", borderRadius:999,
            background: isTop1
              ? "linear-gradient(90deg, #10b981, #059669)"
              : "linear-gradient(90deg, #6366f1, #818cf8)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
      <p style={{ fontSize:12, color:"#9ca3af", marginTop:4 }}>
        {pct}% del máximo posible
      </p>
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────────────────
interface ResultadosTarjetasProps {
  resultados: Array<Tarjeta & { ahorro: number }>
  gastos: Gastos
  tarjetaActual: string
}

export default function ResultadosTarjetas({ resultados, gastos, tarjetaActual }: ResultadosTarjetasProps) {
  const totalGasto   = Object.values(gastos).reduce((a, b) => a + b, 0)
  const maxAhorro    = resultados[0]?.ahorro ?? 0
  const tarjetaActualData = TARJETAS.find((t) => t.id === tarjetaActual)
  const ahorroActual = resultados.find((t) => t.id === tarjetaActual)?.ahorro ?? 0
  const top1         = resultados[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* ── Header ranking — PROBLEMA 2: títulos 32px 800 */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:12, marginBottom:24 }}>
        <h2 style={{ fontSize:32, fontWeight:800, letterSpacing:"-0.02em", color:"#111827", margin:0 }}>
          Tu ranking personalizado
        </h2>
        <span style={{ background:"rgba(16,185,129,0.1)", color:"#059669",
          border:"1px solid rgba(16,185,129,0.2)", borderRadius:999,
          fontSize:14, fontWeight:600, padding:"4px 14px" }}>
          {formatARS(totalGasto)}/mes
        </span>
      </div>

      {/* ── Banner tarjeta actual — premium */}
      <AnimatePresence>
        {tarjetaActualData && tarjetaActual !== top1.id && (
          <BannerCambio
            tarjetaActualNombre={tarjetaActualData.nombre}
            ganadosaNombre={top1.nombre}
            diferenciaAhorro={(top1?.ahorro ?? 0) - ahorroActual}
          />
        )}
      </AnimatePresence>

      {/* ════════════ TOP 1 — PROBLEMA 4 ════════════ */}
      <motion.div
        initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }}
        transition={{ type:"spring", stiffness:280, damping:28, delay:0.08 }}
        style={{
          padding:40,                                     // PROBLEMA 4
          borderRadius:24,                                // PROBLEMA 4
          background:"linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)", // PROBLEMA 4
          boxShadow:"0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(16,185,129,0.2)", // PROBLEMA 4
          borderLeft:"4px solid #10b981",                // PROBLEMA 4
          marginBottom:16,
          position:"relative",
          overflow:"hidden",
        }}
      >
        {/* Badge — PROBLEMA 4 */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
          <span style={{
            background:"#10b981", color:"white",
            fontSize:12, fontWeight:600,                  // PROBLEMA 4
            padding:"6px 14px", borderRadius:999,         // PROBLEMA 4
            letterSpacing:"0.04em",                       // PROBLEMA 4
          }}>
            Mejor para vos
          </span>
          <span style={{ fontSize:13, fontWeight:500, color:"#6b7280" }}>{top1.banco}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          <MiniCard tarjeta={top1} size="lg" />

          <div>
            {/* Nombre — PROBLEMA 2: 18px 700 */}
            <h3 style={{ fontSize:18, fontWeight:700, color:"#111827", margin:"0 0 4px" }}>
              {top1.nombre}
            </h3>
            {/* Banco — PROBLEMA 2: 13px 500 */}
            <p style={{ fontSize:13, fontWeight:500, color:"#6b7280", marginBottom:20 }}>
              {top1.red}
            </p>

            {/* Ahorro — PROBLEMA 2: 48px 900 */}
            <div style={{ marginBottom:20 }}>
              <span style={{ fontSize:48, fontWeight:900, color:"#10b981", lineHeight:1 }}>
                <AhorroAnimado value={top1.ahorro} />
              </span>
              <span style={{ fontSize:16, fontWeight:500, color:"#6b7280", marginLeft:4 }}>/mes</span>
              <p style={{ fontSize:14, color:"#9ca3af", marginTop:4 }}>
                = {formatARS(top1.ahorro * 12)} al año
              </p>
            </div>

            {/* Pills */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
              {top1.pills.map((p) => (
                <span key={p} style={{
                  fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:8,
                  background:"rgba(16,185,129,0.08)", color:"#059669",
                  border:"1px solid rgba(16,185,129,0.15)",
                }}>{p}</span>
              ))}
            </div>

            {/* Score — PROBLEMA 5: 8px, "X% del máximo posible" */}
            <ScoreBar pct={100} isTop1 />
          </div>
        </div>

        {/* Breakdown — PROBLEMA 6 */}
        <Breakdown tarjeta={top1} gastos={gastos} />
      </motion.div>

      {/* ════════════ RANKING #2+ — PROBLEMA 4 ════════════ */}
      <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:0 }}>
        {resultados.slice(1).map((t, idx) => {
          const score    = getScorePct(t.ahorro, maxAhorro)
          const diff     = t.ahorro - ahorroActual
          const showDiff = tarjetaActualData && t.id !== tarjetaActual

          return (
            <motion.div
              key={t.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ type:"spring", stiffness:300, damping:30, delay: Math.min(idx*0.04, 0.6) }}
              whileHover={{ y:-2, boxShadow:"0 8px 32px rgba(0,0,0,0.08)", borderColor:"#d1fae5" }}
              style={{
                padding:"20px 24px",                      // PROBLEMA 4
                borderRadius:16,                          // PROBLEMA 4
                border:"1px solid #f3f4f6",               // PROBLEMA 4
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)",  // PROBLEMA 4
                background:"white",
                display:"flex", alignItems:"center", gap:16,
                position:"relative", overflow:"hidden",
                cursor:"default",
                transition:"box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              {/* Número decorativo — PROBLEMA 4: absolute top-right 32px #f3f4f6 */}
              <span style={{
                position:"absolute", top:8, right:14,
                fontSize:32, fontWeight:900, color:"#f3f4f6",
                lineHeight:1, userSelect:"none", pointerEvents:"none",
              }}>{idx + 2}</span>

              <MiniCard tarjeta={t} size="sm" />

              <div style={{ flex:1, minWidth:0, position:"relative", zIndex:1 }}>
                {/* Nombre — PROBLEMA 2 */}
                <p style={{ fontSize:15, fontWeight:700, color:"#111827", margin:"0 0 2px",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {t.nombre}
                </p>
                {/* Banco — PROBLEMA 2 */}
                <p style={{ fontSize:13, fontWeight:500, color:"#6b7280", margin:"0 0 10px",
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {t.banco}
                </p>
                {/* Barra score — PROBLEMA 5 */}
                <ScoreBar pct={score} isTop1={false} />
              </div>

              {/* Ahorro */}
              <div style={{ textAlign:"right", flexShrink:0, position:"relative", zIndex:1 }}>
                <p style={{ fontSize:15, fontWeight:700, color:"#10b981", margin:0 }}>
                  {formatARS(t.ahorro)}/mes
                </p>
                {showDiff && (
                  <p style={{ fontSize:12, fontWeight:600, marginTop:3,
                    color: diff >= 0 ? "#10b981" : "#f87171" }}>
                    {diff >= 0 ? "+" : ""}{formatARS(diff)} vs tu tarjeta
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Beneficios del mes ── */}
      <BeneficiosMes resultados={resultados} gastos={gastos} />
    </motion.div>
  )
}
