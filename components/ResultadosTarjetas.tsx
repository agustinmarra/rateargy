"use client"

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

// ─── Emojis y labels por categoría ───────────────────────────────────────────
const CAT_META: Record<CatKey, { emoji: string; label: string }> = {
  super:      { emoji: "🛒", label: "Supermercados" },
  nafta:      { emoji: "⛽", label: "Nafta" },
  farmacia:   { emoji: "💊", label: "Farmacia" },
  delivery:   { emoji: "🍽️", label: "Delivery" },
  online:     { emoji: "📦", label: "Online" },
  viajes:     { emoji: "✈️", label: "Viajes" },
  transporte: { emoji: "🚌", label: "Transporte" },
  servicios:  { emoji: "💡", label: "Servicios" },
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
        <span
          className="absolute bottom-1 left-2 text-white font-bold"
          style={{ fontSize: 7, opacity: 0.9, lineHeight: 1.2 }}
        >
          {tarjeta.banco}
        </span>
        <span
          className="absolute top-1 right-2 text-white font-semibold"
          style={{ fontSize: 7, opacity: 0.7 }}
        >
          {tarjeta.red}
        </span>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl relative overflow-hidden shadow-xl"
      style={{
        background: tarjeta.gradiente,
        width: "100%",
        maxWidth: 340,
        aspectRatio: "1.586 / 1",
      }}
    >
      {/* Chip decorativo */}
      <div
        className="absolute rounded"
        style={{
          top: "22%",
          left: "8%",
          width: 36,
          height: 28,
          background: "rgba(255,255,255,0.25)",
          border: "1.5px solid rgba(255,255,255,0.4)",
        }}
      />
      {/* Banco */}
      <span
        className="absolute top-4 left-5 text-white font-bold tracking-wide"
        style={{ fontSize: 13, opacity: 0.95 }}
      >
        {tarjeta.banco}
      </span>
      {/* Número de tarjeta */}
      <span
        className="absolute text-white font-mono tracking-widest"
        style={{ fontSize: 14, bottom: "38%", left: "8%", opacity: 0.8 }}
      >
        •••• •••• •••• 4521
      </span>
      {/* Titular y vencimiento */}
      <span
        className="absolute text-white font-semibold tracking-wider"
        style={{ fontSize: 10, bottom: "14%", left: "8%", opacity: 0.85 }}
      >
        RATEARGY USER&nbsp;&nbsp;&nbsp;12/28
      </span>
      {/* Red */}
      <span
        className="absolute bottom-4 right-5 text-white font-bold tracking-widest"
        style={{ fontSize: 13, opacity: 0.75 }}
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
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
            <th className="pb-2 text-left font-medium">Categoría</th>
            <th className="pb-2 text-right font-medium">Gasto</th>
            <th className="pb-2 text-right font-medium">Descuento</th>
            <th className="pb-2 text-right font-medium">Ahorro</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((cat) => {
            const b = tarjeta.beneficios[cat]
            const ahorroCat = Math.min(gastos[cat] * (b.pct / 100), b.tope || Infinity)
            const meta = CAT_META[cat]
            return (
              <tr key={cat} className="border-b border-gray-50">
                <td className="py-2 text-gray-700">
                  {meta.emoji} {meta.label}
                  {"dias" in b && b.dias ? (
                    <span className="ml-1 text-xs text-gray-400">({b.dias as string})</span>
                  ) : null}
                </td>
                <td className="py-2 text-right text-gray-600">{formatARS(gastos[cat])}</td>
                <td className="py-2 text-right text-emerald-600 font-medium">{b.pct}%</td>
                <td className="py-2 text-right text-emerald-700 font-semibold">
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
    emoji: string
    cat: string
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
            emoji: CAT_META[cat].emoji,
            cat: CAT_META[cat].label,
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        🔥 Beneficios que aplican a tu perfil esta semana
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {beneficios.slice(0, 4).map((b) => (
          <div
            key={b.key}
            className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3"
          >
            <span className="text-2xl">{b.emoji}</span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm">
                {b.pct}% en {b.cat} con {b.banco}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {b.dias ? `Los ${b.dias} · ` : ""}
                {b.tope ? `Hasta ${formatARS(b.tope)} de descuento` : "Sin tope"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-12"
    >
      {/* ── Header resultados ── */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tu ranking personalizado</h2>
        <span className="bg-emerald-100 text-emerald-700 text-sm font-semibold px-3 py-1 rounded-full">
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
            className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800"
          >
            Con tu tarjeta actual ({tarjetaActualData.nombre}) ahorrás{" "}
            <strong>{formatARS(ahorroActual)}/mes</strong>. Cambiando a{" "}
            <strong>{top1.nombre}</strong> ahorrarías{" "}
            <strong className="text-emerald-700">
              {formatARS(top1.ahorro - ahorroActual)} más
            </strong>
            .
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP 1 destacado ── */}
      <div className="bg-white border-2 border-emerald-400 rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            ⭐ Mejor para vos
          </span>
          <span className="text-gray-500 text-sm">{top1.banco}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Tarjeta física */}
          <MiniCard tarjeta={top1} size="lg" />

          {/* Info */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{top1.nombre}</h3>
            <p className="text-gray-500 text-sm mb-4">{top1.red}</p>

            {/* Ahorro */}
            <div className="mb-4">
              <span className="text-4xl font-extrabold text-emerald-500">
                {formatARS(top1.ahorro)}
              </span>
              <span className="text-gray-500 font-medium ml-1">/mes</span>
              <p className="text-gray-400 text-sm mt-1">
                = {formatARS(top1.ahorro * 12)} al año
              </p>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {top1.pills.map((p) => (
                <span
                  key={p}
                  className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-lg border border-emerald-100"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Score */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "100%" }} />
              </div>
              <span className="text-xs font-semibold text-emerald-600 whitespace-nowrap">
                Score 100%
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <Breakdown tarjeta={top1} gastos={gastos} />
      </div>

      {/* ── Ranking completo ── */}
      <div className="space-y-3">
        {resultados.slice(1).map((t, idx) => {
          const score = getScorePct(t.ahorro, maxAhorro)
          const diff = t.ahorro - ahorroActual
          const showDiff = tarjetaActualData && t.id !== tarjetaActual

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.6) }}
              className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center gap-4 hover:scale-[1.01] hover:shadow-md transition-all duration-200 cursor-default"
            >
              {/* Número */}
              <span className="text-2xl font-black text-gray-200 w-8 flex-shrink-0 text-center">
                {idx + 2}
              </span>

              {/* Mini tarjeta */}
              <MiniCard tarjeta={t} size="sm" />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{t.nombre}</p>
                <p className="text-gray-400 text-xs truncate">{t.banco}</p>

                {/* Barra de score */}
                <div className="mt-1.5 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{score}%</span>
                </div>
              </div>

              {/* Ahorro + diff */}
              <div className="text-right flex-shrink-0">
                <p className="font-semibold text-emerald-600 text-sm">{formatARS(t.ahorro)}/mes</p>
                {showDiff && (
                  <p
                    className={`text-xs font-medium mt-0.5 ${
                      diff >= 0 ? "text-emerald-500" : "text-red-400"
                    }`}
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
