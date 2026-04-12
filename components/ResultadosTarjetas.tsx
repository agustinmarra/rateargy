"use client"

import { useState, useEffect, type CSSProperties } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TARJETAS, type Tarjeta, type CatKey, type Gastos } from "./tarjetas-data"

// ─── Utilidades ──────────────────────────────────────────────────────────────

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n)
}

function getScorePct(ahorro: number, maxAhorro: number): number {
  if (maxAhorro === 0) return 0
  return Math.round((ahorro / maxAhorro) * 100)
}

// ─── Hook: contador animado 0 → target en `duration` ms ──────────────────────
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) { setValue(0); return }
    setValue(0)
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

// ─── SVG paths por categoría — exportados para usar en page.tsx también ──────
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={CAT_SVG_PATHS[catKey]} />
    </svg>
  )
}

// ─── Labels por categoría ─────────────────────────────────────────────────────
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

// ─── SVG: chip de tarjeta ─────────────────────────────────────────────────────
function ChipSVG({ scale = 1 }: { scale?: number }) {
  const w = Math.round(24 * scale)
  const h = Math.round(18 * scale)
  return (
    <svg
      viewBox="0 0 24 18"
      style={{ width: w, height: h, flexShrink: 0 }}
      fill="none"
      stroke="rgba(255,255,255,0.55)"
      strokeWidth="1"
    >
      <rect x="1" y="1" width="22" height="16" rx="3" />
      <line x1="1" y1="6" x2="23" y2="6" />
      <line x1="1" y1="12" x2="23" y2="12" />
      <line x1="8" y1="1" x2="8" y2="17" />
      <line x1="16" y1="1" x2="16" y2="17" />
    </svg>
  )
}

// ─── SVG: símbolo contactless ─────────────────────────────────────────────────
function ContactlessSVG({ scale = 1 }: { scale?: number }) {
  const size = Math.round(18 * scale)
  return (
    <svg
      viewBox="0 0 18 18"
      style={{ width: size, height: size, flexShrink: 0 }}
      fill="none"
      stroke="rgba(255,255,255,0.5)"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
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
      <div
        className="rounded-lg flex-shrink-0"
        style={{
          background: tarjeta.gradiente,
          width: 80,
          height: 50,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Chip pequeño */}
        <div style={{ position: "absolute", top: 6, left: 6 }}>
          <ChipSVG scale={0.55} />
        </div>
        {/* Contactless pequeño */}
        <div style={{ position: "absolute", top: 5, right: 5 }}>
          <ContactlessSVG scale={0.65} />
        </div>
        <span
          className="absolute bottom-1.5 left-2 text-white font-bold"
          style={{ fontSize: 6.5, opacity: 0.92, lineHeight: 1.2 }}
        >
          {tarjeta.banco}
        </span>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl relative overflow-hidden shadow-2xl"
      style={{
        background: tarjeta.gradiente,
        width: "100%",
        maxWidth: 340,
        aspectRatio: "1.586 / 1",
      }}
    >
      {/* Brillo sutil en el borde superior */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Banco */}
      <span
        className="absolute top-4 left-5 text-white font-bold tracking-wide"
        style={{ fontSize: 13, opacity: 0.95 }}
      >
        {tarjeta.banco}
      </span>

      {/* Chip — arriba izquierda, debajo del nombre */}
      <div style={{ position: "absolute", top: "34%", left: "8%" }}>
        <ChipSVG scale={1} />
      </div>

      {/* Contactless — arriba derecha */}
      <div style={{ position: "absolute", top: "16%", right: "7%" }}>
        <ContactlessSVG scale={1} />
      </div>

      {/* Número */}
      <span
        className="absolute text-white font-mono tracking-widest"
        style={{ fontSize: 13, bottom: "36%", left: "8%", opacity: 0.75 }}
      >
        •••• •••• •••• 4521
      </span>

      {/* Titular y vencimiento */}
      <span
        className="absolute text-white font-semibold tracking-wider"
        style={{ fontSize: 9.5, bottom: "13%", left: "8%", opacity: 0.85 }}
      >
        RATEARGY USER&nbsp;&nbsp;&nbsp;12/28
      </span>

      {/* Red */}
      <span
        className="absolute bottom-4 right-5 text-white font-bold tracking-widest"
        style={{ fontSize: 12, opacity: 0.75 }}
      >
        {tarjeta.red === "Mastercard" ? "MC" : tarjeta.red.toUpperCase()}
      </span>
    </div>
  )
}

// ─── Breakdown por categoría (solo top 1) ─────────────────────────────────────
function Breakdown({
  tarjeta,
  gastos,
}: {
  tarjeta: Tarjeta & { ahorro: number }
  gastos: Gastos
}) {
  const rows = (Object.keys(gastos) as CatKey[]).filter(
    (cat) => gastos[cat] > 0 && tarjeta.beneficios[cat]?.pct > 0
  )
  if (rows.length === 0) return null

  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr
            className="text-xs uppercase tracking-wide border-b"
            style={{ color: "#94a3b8", borderColor: "rgba(0,0,0,0.06)" }}
          >
            <th className="pb-2 text-left font-medium">Categoría</th>
            <th className="pb-2 text-right font-medium">Gasto</th>
            <th className="pb-2 text-right font-medium">Desc.</th>
            <th className="pb-2 text-right font-medium">Ahorro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((cat) => {
            const b = tarjeta.beneficios[cat]
            const ahorroCat = Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity)
            const meta = CAT_META[cat]
            return (
              <tr key={cat} className="border-b" style={{ borderColor: "rgba(0,0,0,0.04)" }}>
                <td className="py-2 text-gray-700">
                  <span className="flex items-center gap-1.5">
                    <CatIcon catKey={cat} className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    {meta.label}
                    {"dias" in b && b.dias ? (
                      <span className="text-[10px] text-gray-400">({b.dias as string})</span>
                    ) : null}
                  </span>
                </td>
                <td className="py-2 text-right text-gray-500 text-xs">{formatARS(gastos[cat])}</td>
                <td className="py-2 text-right font-semibold text-xs" style={{ color: "#10b981" }}>
                  {b.pct}%
                </td>
                <td className="py-2 text-right font-semibold text-xs" style={{ color: "#059669" }}>
                  {formatARS(ahorroCat)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Beneficios del mes ───────────────────────────────────────────────────────
function BeneficiosMes({
  resultados,
  gastos,
}: {
  resultados: Array<Tarjeta & { ahorro: number }>
  gastos: Gastos
}) {
  type Bene = {
    catKey: CatKey
    banco: string
    pct: number
    tope: number
    dias?: string
    key: string
  }

  const beneficios: Bene[] = []
  const top3 = resultados.slice(0, 3)

  for (const t of top3) {
    for (const cat of Object.keys(gastos) as CatKey[]) {
      if (gastos[cat] > 0 && t.beneficios[cat]?.pct > 0) {
        const b = t.beneficios[cat]
        const key = `${t.id}-${cat}`
        if (!beneficios.find((x) => x.key === key)) {
          beneficios.push({
            catKey: cat,
            banco: t.banco,
            pct: b.pct,
            tope: b.tope,
            dias: "dias" in b ? (b.dias as string | undefined) : undefined,
            key,
          })
        }
      }
    }
    if (beneficios.length >= 4) break
  }

  if (beneficios.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-lg font-bold mb-4" style={{ color: "#0a0a0a" }}>
        Beneficios que aplican a tu perfil esta semana
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {beneficios.slice(0, 4).map((b) => (
          <div
            key={b.key}
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.15)",
            }}
          >
            <span
              className="rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                width: 36,
                height: 36,
                background: "rgba(16,185,129,0.12)",
              }}
            >
              <CatIcon catKey={b.catKey} className="w-4 h-4" style={{ color: "#10b981" }} />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-sm" style={{ color: "#0a0a0a" }}>
                {b.pct}% en {CAT_META[b.catKey].label} con {b.banco}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                {b.dias ? `Los ${b.dias} · ` : ""}
                {b.tope ? `Hasta ${formatARS(b.tope)}` : "Sin tope"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Ahorro animado (top 1) ───────────────────────────────────────────────────
function AhorroAnimado({ value }: { value: number }) {
  const display = useCountUp(value, 800)
  return <>{formatARS(display)}</>
}

// ─── Componente principal de resultados ──────────────────────────────────────
interface ResultadosTarjetasProps {
  resultados: Array<Tarjeta & { ahorro: number }>
  gastos: Gastos
  tarjetaActual: string
}

export default function ResultadosTarjetas({
  resultados,
  gastos,
  tarjetaActual,
}: ResultadosTarjetasProps) {
  const totalGasto = Object.values(gastos).reduce((a, b) => a + b, 0)
  const maxAhorro = resultados[0]?.ahorro ?? 0
  const tarjetaActualData = TARJETAS.find((t) => t.id === tarjetaActual)
  const ahorroActual = resultados.find((t) => t.id === tarjetaActual)?.ahorro ?? 0
  const top1 = resultados[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="mt-12"
    >
      {/* ── Header resultados ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold" style={{ color: "#0a0a0a" }}>
          Tu ranking personalizado
        </h2>
        <span
          className="text-sm font-semibold px-3 py-1 rounded-full"
          style={{
            background: "rgba(16,185,129,0.1)",
            color: "#059669",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          Gasto total: {formatARS(totalGasto)}/mes
        </span>
      </div>

      {/* ── Banner tarjeta actual ── */}
      <AnimatePresence>
        {tarjetaActualData && tarjetaActual !== top1.id && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-xl px-4 py-3 text-sm"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.3)",
              color: "#92400e",
            }}
          >
            Con tu tarjeta actual ({tarjetaActualData.nombre}) ahorrás{" "}
            <strong>{formatARS(ahorroActual)}/mes</strong>. Cambiando a{" "}
            <strong>{top1.nombre}</strong> ahorrarías{" "}
            <strong style={{ color: "#059669" }}>{formatARS(top1.ahorro - ahorroActual)} más</strong>.
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP 1 destacado ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.08 }}
        className="rounded-2xl p-6 mb-6"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(16,185,129,0.35)",
          boxShadow: "0 20px 60px rgba(16,185,129,0.12), 0 4px 16px rgba(0,0,0,0.06)",
        }}
      >
        {/* Badge */}
        <div className="flex items-center gap-2 mb-5">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full tracking-wide"
            style={{ background: "#10b981", color: "white" }}
          >
            ★ Mejor para vos
          </span>
          <span className="text-gray-400 text-sm">{top1.banco}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Tarjeta física */}
          <MiniCard tarjeta={top1} size="lg" />

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ color: "#0a0a0a" }}>
              {top1.nombre}
            </h3>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>
              {top1.red}
            </p>

            {/* Ahorro con contador animado */}
            <div className="mb-4">
              <span className="text-4xl font-extrabold" style={{ color: "#10b981" }}>
                <AhorroAnimado value={top1.ahorro} />
              </span>
              <span className="font-medium ml-1" style={{ color: "#6b7280" }}>/mes</span>
              <p className="text-sm mt-1" style={{ color: "#94a3b8" }}>
                = {formatARS(top1.ahorro * 12)} al año
              </p>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {top1.pills.map((p) => (
                <span
                  key={p}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    color: "#059669",
                    border: "1px solid rgba(16,185,129,0.15)",
                  }}
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Score 100% */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 h-2 rounded-full overflow-hidden"
                style={{ background: "rgba(16,185,129,0.1)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #10b981, #059669)" }}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs font-semibold" style={{ color: "#10b981" }}>
                Score 100%
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <Breakdown tarjeta={top1} gastos={gastos} />
      </motion.div>

      {/* ── Ranking completo (#2 en adelante) ── */}
      <div className="space-y-2">
        {resultados.slice(1).map((t, idx) => {
          const score = getScorePct(t.ahorro, maxAhorro)
          const diff = t.ahorro - ahorroActual
          const showDiff = tarjetaActualData && t.id !== tarjetaActual

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: Math.min(idx * 0.04, 0.6),
              }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl cursor-default"
              style={{
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(0,0,0,0.06)",
                transition: "box-shadow 0.2s, transform 0.2s, border-color 0.2s",
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 8px 24px rgba(99,102,241,0.1)",
                borderColor: "rgba(99,102,241,0.25)",
              }}
            >
              {/* Número */}
              <span
                className="text-xl font-black w-7 flex-shrink-0 text-center select-none"
                style={{ color: "#e2e8f0" }}
              >
                {idx + 2}
              </span>

              {/* Mini tarjeta */}
              <MiniCard tarjeta={t} size="sm" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: "#1e293b" }}>
                  {t.nombre}
                </p>
                <p className="text-xs truncate" style={{ color: "#94a3b8" }}>
                  {t.banco}
                </p>

                {/* Barra de score — indigo para #2+ */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div
                    className="flex-1 h-1 rounded-full overflow-hidden"
                    style={{ background: "rgba(0,0,0,0.06)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #6366f1, #818cf8)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 0.6, delay: Math.min(idx * 0.04, 0.6) + 0.1 }}
                    />
                  </div>
                  <span className="text-[10px] flex-shrink-0" style={{ color: "#6366f1", fontWeight: 600 }}>
                    {score}%
                  </span>
                </div>
              </div>

              {/* Ahorro + diff */}
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-sm" style={{ color: "#10b981" }}>
                  {formatARS(t.ahorro)}/mes
                </p>
                {showDiff && (
                  <p
                    className="text-[11px] font-medium mt-0.5"
                    style={{ color: diff >= 0 ? "#10b981" : "#f87171" }}
                  >
                    {diff >= 0 ? "+" : ""}
                    {formatARS(diff)} vs tu tarjeta
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
