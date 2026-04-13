"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Percent, ShoppingCart, Zap, Plane, Pill, Car, ArrowUpRight, TrendingUp, Share2, Bookmark } from "lucide-react"
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

// ─── Gradientes premium por tarjeta (override visual, no toca tarjetas-data) ──
const GRADIENTES_PREMIUM: Record<string, string> = {
  "galicia-eminent": "linear-gradient(135deg, #134e32 0%, #1a7f4f 60%, #22c55e 100%)",
  "galicia":         "linear-gradient(135deg, #0f3d24 0%, #1a6b3f 60%, #259a5b 100%)",
  "bbva":            "linear-gradient(135deg, #00437f 0%, #005cbf 60%, #1a7ae0 100%)",
  "bbva-platinum":   "linear-gradient(135deg, #1a1a2e 0%, #22304a 60%, #2d4169 100%)",
  "santander":       "linear-gradient(135deg, #7a0000 0%, #b80000 60%, #e60000 100%)",
  "santander-gold":  "linear-gradient(135deg, #5c3d00 0%, #96680a 60%, #c9940f 100%)",
  "macro":           "linear-gradient(135deg, #0a3370 0%, #1254a8 60%, #1a6fd4 100%)",
  "macro-visa":      "linear-gradient(135deg, #003d80 0%, #0055b3 60%, #1a70d1 100%)",
  "naranja-x":       "linear-gradient(135deg, #b33a00 0%, #e65200 60%, #ff6a1a 100%)",
  "bna":             "linear-gradient(135deg, #002952 0%, #003d7a 60%, #0055ab 100%)",
  "bna-gold":        "linear-gradient(135deg, #3d2a00 0%, #7a5500 60%, #b8860b 100%)",
  "supervielle":     "linear-gradient(135deg, #a30028 0%, #cc0033 60%, #e6004d 100%)",
  "icbc":            "linear-gradient(135deg, #6b0000 0%, #990000 60%, #cc1a00 100%)",
  "icbc-platinum":   "linear-gradient(135deg, #141414 0%, #2a2a2a 60%, #404040 100%)",
  "uala":            "linear-gradient(135deg, #3d006b 0%, #6200b3 60%, #8c00e6 100%)",
  "personal-pay":    "linear-gradient(135deg, #004d26 0%, #007a3d 60%, #00a854 100%)",
  "credicoop":       "linear-gradient(135deg, #002966 0%, #003d99 60%, #1a55c4 100%)",
  "patagonia":       "linear-gradient(135deg, #1e4020 0%, #336635 60%, #4d8c50 100%)",
  "provincia":       "linear-gradient(135deg, #001f40 0%, #003366 60%, #004d99 100%)",
  "cuenta-dni":      "linear-gradient(135deg, #003366 0%, #004d99 60%, #1a66b8 100%)",
}

// ─── SVG: chip + contactless ──────────────────────────────────────────────────
function ChipSVG() {
  return (
    <svg viewBox="0 0 44 34" style={{ width: 44, height: 34, flexShrink: 0 }} fill="none">
      <rect x="1" y="1" width="42" height="32" rx="4" fill="#d4a843" stroke="#b8902a" strokeWidth="0.5" />
      <rect x="5" y="5" width="34" height="24" rx="2" fill="#c9942a" />
      <line x1="1" y1="11" x2="43" y2="11" stroke="#b8902a" strokeWidth="0.5" />
      <line x1="1" y1="23" x2="43" y2="23" stroke="#b8902a" strokeWidth="0.5" />
      <line x1="15" y1="1" x2="15" y2="33" stroke="#b8902a" strokeWidth="0.5" />
      <line x1="29" y1="1" x2="29" y2="33" stroke="#b8902a" strokeWidth="0.5" />
    </svg>
  )
}

function ContactlessSVG() {
  return (
    <svg viewBox="0 0 28 28" style={{ width: 28, height: 28, flexShrink: 0 }}
      fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="14" r="1.5" fill="rgba(255,255,255,0.9)" />
      <path d="M13 10a5.66 5.66 0 010 8" stroke="rgba(255,255,255,0.75)" strokeWidth="2" />
      <path d="M17 7a10.4 10.4 0 010 14" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
      <path d="M21 4a15.1 15.1 0 010 20" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </svg>
  )
}

// ─── Mini tarjeta física ──────────────────────────────────────────────────────
function MiniCard({ tarjeta, size = "lg" }: { tarjeta: Tarjeta; size?: "sm" | "lg" }) {
  const gradient = GRADIENTES_PREMIUM[tarjeta.id] ?? tarjeta.gradiente

  if (size === "sm") {
    return (
      <div style={{ background: gradient, width: 80, height: 50,
        borderRadius: 8, position: "relative", overflow: "hidden", flexShrink: 0,
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <div style={{ position:"absolute", inset:0,
          background:"linear-gradient(145deg, rgba(255,255,255,0.12) 0%, transparent 60%)", pointerEvents:"none" }} />
        <span style={{ position:"absolute", bottom:5, left:7,
          fontSize:6.5, fontWeight:700, color:"white", opacity:0.9, lineHeight:1.2 }}>
          {tarjeta.banco}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      background: gradient,
      width: "100%", maxWidth: 320, height: 200,
      borderRadius: 20, position: "relative", overflow: "hidden",
      boxShadow: "0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
    }}>
      {/* Brillo superior */}
      <div style={{ position:"absolute", inset:0,
        background:"linear-gradient(145deg, rgba(255,255,255,0.18) 0%, transparent 55%)", pointerEvents:"none" }} />
      {/* Shine sweep */}
      <div aria-hidden style={{
        position:"absolute", top:0, left:0, width:"40%", height:"100%",
        background:"linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
        animation:"shine 3.5s ease-in-out infinite", pointerEvents:"none",
      }} />

      <span style={{ position:"absolute", top:18, left:22, fontSize:16, fontWeight:700,
        color:"white", opacity:0.95, letterSpacing:"0.02em" }}>{tarjeta.banco}</span>

      <div style={{ position:"absolute", top:"36%", left:"7%" }}><ChipSVG /></div>
      <div style={{ position:"absolute", top:"18%", right:"7%" }}><ContactlessSVG /></div>

      <span style={{ position:"absolute", fontSize:16, bottom:"34%", left:"7%",
        color:"white", fontFamily:"monospace", letterSpacing:"0.2em", opacity:0.75 }}>
        •••• •••• •••• 4521
      </span>
      <span style={{ position:"absolute", fontSize:10, bottom:"12%", left:"7%",
        color:"white", fontWeight:600, letterSpacing:"0.06em", opacity:0.85 }}>
        RATEARGY USER&nbsp;&nbsp;&nbsp;12/28
      </span>
      <span style={{ position:"absolute", bottom:18, right:22, fontSize:13, fontWeight:700,
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
                <p style={{ fontSize:13, fontWeight:600, color:"#111827", margin:0, lineHeight:1.3 }}>
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

// ─── Gradientes de fondo por categoría para BeneficiosMes ────────────────────
const CAT_GRAD_BG: Record<CatKey, string> = {
  super:      "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
  nafta:      "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
  farmacia:   "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)",
  delivery:   "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
  online:     "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  viajes:     "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
  transporte: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
  servicios:  "linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)",
}

// ─── Beneficios que aplican a tu perfil (solo visible post-cálculo) ───────────
function BeneficiosMes({ resultados, gastos }: {
  resultados: Array<Tarjeta & { ahorro: number }>
  gastos: Gastos
}) {
  type Bene = {
    catKey: CatKey; nombre: string; banco: string
    pct: number; tope: number; dias?: string; lugar?: string
    ahorroReal: number; key: string
  }

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
        dias: b.dias,
        lugar: b.lugar,
        ahorroReal: Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity),
        key: `best-${cat}`,
      })
    }
  }

  const visibles = beneficios.sort((a, b) => b.ahorroReal - a.ahorroReal).slice(0, 6)
  if (visibles.length === 0) return null

  return (
    <div style={{ marginTop: 64 }}>
      {/* Clase propia — no pisa .beneficios-grid de page.tsx */}
      <style>{`
        .bperfil-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px) { .bperfil-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 480px)  { .bperfil-grid { grid-template-columns: 1fr; } }
      `}</style>

      {/* Header de sección */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:28 }}>
        <h2 style={{ fontSize:28, fontWeight:900, letterSpacing:"-0.03em", color:"#0a0a0a", margin:0 }}>
          Beneficios que aplican a tu perfil
        </h2>
        <span style={{
          background:"linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
          color:"#065f46", fontSize:12, fontWeight:700,
          padding:"5px 14px", borderRadius:999, letterSpacing:"0.03em", whiteSpace:"nowrap",
          border:"1px solid #6ee7b7",
        }}>
          Esta semana
        </span>
      </div>

      <div className="bperfil-grid">
        {visibles.map((b, idx) => {
          const Icon = CAT_LUCIDE[b.catKey]
          const { bg, color } = CAT_COLORS[b.catKey]
          const gradBg = CAT_GRAD_BG[b.catKey]

          return (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -5, boxShadow: `0 16px 48px rgba(0,0,0,0.1)` }}
              style={{
                background: gradBg,
                border: "1.5px solid rgba(0,0,0,0.06)",
                borderRadius: 22,
                padding: "24px 22px",
                minHeight: 200,
                position: "relative", overflow: "hidden",
                cursor: "default",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}
            >
              {/* Blob decorativo */}
              <div aria-hidden style={{
                position:"absolute", bottom:-28, right:-28, width:100, height:100,
                borderRadius:"50%", background:color, opacity:0.1, pointerEvents:"none",
              }} />

              {/* Top row: ícono + badge día */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{
                  width:52, height:52, borderRadius:16, background:bg,
                  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
                  boxShadow:`0 4px 12px ${color}33`,
                }}>
                  <Icon size={24} color={color} strokeWidth={1.75} />
                </div>
                {b.dias && (
                  <div style={{
                    background:"rgba(255,255,255,0.85)", backdropFilter:"blur(8px)",
                    borderRadius:999, padding:"4px 10px",
                    fontSize:11, fontWeight:700, color, border:`1px solid ${color}33`,
                  }}>
                    {b.dias.charAt(0).toUpperCase() + b.dias.slice(1)}
                  </div>
                )}
              </div>

              {/* Cuerpo */}
              <div>
                {/* Porcentaje grande */}
                <p style={{ fontSize:32, fontWeight:900, color, margin:"0 0 2px", letterSpacing:"-0.03em", lineHeight:1 }}>
                  {b.pct}%
                </p>
                {/* Categoría */}
                <p style={{ fontSize:13, fontWeight:700, color:"#374151", margin:"0 0 6px" }}>
                  {CAT_META[b.catKey].label}
                </p>
                {/* Lugar */}
                {b.lugar && (
                  <p style={{ fontSize:13, fontWeight:500, color:"#6b7280", margin:"0 0 4px", lineHeight:1.4 }}>
                    {b.lugar}
                  </p>
                )}
                {/* Banco */}
                <p style={{ fontSize:12, color:"#9ca3af", margin:"0 0 12px" }}>
                  con {b.banco}
                </p>

                {/* Footer: tope + ahorro */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                  <span style={{ fontSize:11, color:"#9ca3af" }}>
                    Tope: {formatARS(b.tope)}/mes
                  </span>
                  <span style={{
                    fontSize:12, fontWeight:700, color,
                    background:"rgba(255,255,255,0.7)", borderRadius:8, padding:"3px 8px",
                    border:`1px solid ${color}22`,
                  }}>
                    + {formatARS(b.ahorroReal)}
                  </span>
                </div>
              </div>
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
      <p style={{ fontSize:14, fontWeight:800, color:"#0a7c4e", marginTop:4 }}>
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
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Header ranking — PROBLEMA 2: títulos 32px 800 */}
      <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", gap:12, marginBottom:24 }}>
        <h2 style={{ fontSize:36, fontWeight:900, letterSpacing:"-0.03em", color:"#111827", margin:0 }}>
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
          padding:48,
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
              <span style={{ fontSize:"clamp(48px, 6vw, 64px)", fontWeight:900, color:"#10b981", lineHeight:1, letterSpacing:"-0.04em" }}>
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

        {/* Breakdown */}
        <Breakdown tarjeta={top1} gastos={gastos} />
      </motion.div>

      {/* ── Botones compartir / guardar ── */}
      <div style={{ display:"flex", gap:12, margin:"16px 0" }}>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={async () => {
            const text = `Mi mejor tarjeta en rateargy: ${top1.nombre} — ahorrás ${formatARS(top1.ahorro)}/mes`
            try {
              if (navigator.share) {
                await navigator.share({ title: "rateargy — Mi ranking", text, url: "https://rateargy.ar" })
              } else {
                await navigator.clipboard.writeText(text + " · rateargy.ar")
              }
            } catch {}
          }}
          style={{
            flex: 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            padding:"12px 20px", borderRadius:12, border:"none", cursor:"pointer",
            background:"linear-gradient(135deg, #059669 0%, #10b981 100%)",
            color:"white", fontSize:14, fontWeight:600,
            boxShadow:"0 4px 16px rgba(16,185,129,0.3)",
          }}
        >
          <Share2 size={16} />
          Compartir mi resultado
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => {
            try {
              localStorage.setItem("rateargy_perfil", JSON.stringify({
                resultados: resultados.map(r => ({ id: r.id, nombre: r.nombre, ahorro: r.ahorro })),
                tarjetaActual,
                savedAt: new Date().toISOString(),
              }))
            } catch {}
          }}
          style={{
            flex: 1, display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            padding:"12px 20px", borderRadius:12, cursor:"pointer",
            background:"white", border:"1px solid #e5e7eb",
            color:"#374151", fontSize:14, fontWeight:600,
            boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <Bookmark size={16} />
          Guardar mi perfil
        </motion.button>
      </div>

      {/* ════════════ RANKING #2+ ════════════ */}
      <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:0 }}>
        {resultados.slice(1).map((t, idx) => {
          const score    = getScorePct(t.ahorro, maxAhorro)
          const diff     = t.ahorro - ahorroActual
          const showDiff = tarjetaActualData && t.id !== tarjetaActual

          return (
            <motion.div
              key={t.id}
              initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
              whileHover={{ scale:1.02, y:-3, boxShadow:"0 12px 40px rgba(0,0,0,0.1)" }}
              transition={{ delay: idx * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding:"20px 24px",
                borderRadius:16,
                border:"1px solid #f3f4f6",
                boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
                background:"white",
                display:"flex", alignItems:"center", gap:16,
                position:"relative", overflow:"hidden",
                cursor:"default",
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
                <p style={{ fontSize:22, fontWeight:900, color:"#10b981", margin:0, letterSpacing:"-0.02em" }}>
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
