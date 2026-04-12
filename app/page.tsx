"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { TARJETAS, rankear, type Gastos, type CatKey } from "@/components/tarjetas-data"
import { formatARS } from "@/components/ResultadosTarjetas"

// Lazy-load resultados para no bloquear el render inicial
const ResultadosTarjetas = dynamic(() => import("@/components/ResultadosTarjetas"), { ssr: false })

// ─── Constantes ──────────────────────────────────────────────────────────────

const CAT_FIELDS: { emoji: string; label: string; key: CatKey }[] = [
  { emoji: "🛒", label: "Supermercados",              key: "super" },
  { emoji: "⛽", label: "Nafta / combustible",         key: "nafta" },
  { emoji: "💊", label: "Farmacia / salud",            key: "farmacia" },
  { emoji: "🍽️", label: "Restaurantes / delivery",    key: "delivery" },
  { emoji: "📦", label: "Compras online",              key: "online" },
  { emoji: "✈️", label: "Viajes / turismo",            key: "viajes" },
  { emoji: "🚌", label: "Transporte (SUBE/peajes)",    key: "transporte" },
  { emoji: "💡", label: "Servicios (luz, gas, tel.)",  key: "servicios" },
]

const GASTOS_VACIO: Gastos = {
  super: 0, nafta: 0, farmacia: 0, delivery: 0,
  online: 0, viajes: 0, transporte: 0, servicios: 0,
}

// ─── Utilidades URL ───────────────────────────────────────────────────────────

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
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  )
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm shadow-lg z-50 pointer-events-none">
      {msg}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  // ── Estado ──
  const [gastos, setGastos] = useState<Gastos>(GASTOS_VACIO)
  const [resultados, setResultados] = useState<ReturnType<typeof rankear> | null>(null)
  const [loading, setLoading] = useState(false)
  const [tarjetaActual, setTarjetaActual] = useState("")
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // ── Inicializar desde URL ──
  useEffect(() => {
    const fromURL = loadFromURL()
    if (Object.keys(fromURL).length > 0) {
      setGastos((prev) => ({ ...prev, ...fromURL }))
    }
  }, [])

  // ── Helpers ──
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 2000)
  }, [])

  const handleCalcular = useCallback(() => {
    setLoading(true)
    saveToURL(gastos)
    setTimeout(() => {
      setResultados(rankear(gastos))
      setLoading(false)
      setTimeout(() => {
        document.getElementById("resultados-section")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 100)
    }, 400)
  }, [gastos])

  const handleGuardarPerfil = useCallback(() => {
    localStorage.setItem("rateargy_perfil", JSON.stringify(gastos))
    showToast("¡Perfil guardado!")
  }, [gastos, showToast])

  const handleCargarPerfil = useCallback(() => {
    try {
      const raw = localStorage.getItem("rateargy_perfil")
      if (raw) {
        const parsed = JSON.parse(raw) as Gastos
        setGastos(parsed)
        showToast("¡Perfil cargado!")
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

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ════════════════════════════════════════════════════════════
          SECCIÓN 1 — HEADER
      ════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

          {/* Logo — TODO: reemplazar por logo final cuando el usuario decida */}
          <a href="/" className="flex-shrink-0">
            <span className="text-[20px] font-semibold">
              <span style={{ color: "#10b981" }}>r</span>
              <span className="text-gray-900">ateargy</span>
            </span>
          </a>

          {/* Tagline — oculto en mobile */}
          <p className="hidden md:block text-sm text-gray-400 text-center flex-1">
            La tarjeta que más te conviene, calculada.
          </p>

          {/* Botón actualizar */}
          <button
            onClick={() => window.location.reload()}
            className="flex-shrink-0 border border-emerald-500 text-emerald-600 text-sm px-3 py-1 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            ↻ Actualizar
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-16">

        {/* ════════════════════════════════════════════════════════════
            SECCIÓN 2 — HERO / INPUT
        ════════════════════════════════════════════════════════════ */}
        <section className="pt-12 pb-8">

          {/* Títulos */}
          <h1 className="text-[32px] md:text-[48px] font-bold text-gray-900 leading-tight mb-3">
            ¿Cuánto gastás<br className="md:hidden" /> por mes?
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-8">
            Calculamos tu ahorro real con las 13 tarjetas argentinas más usadas.
          </p>

          {/* Grid de inputs — EDITAR ACÁ si cambian las categorías */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {CAT_FIELDS.map(({ emoji, label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  {emoji} {label}
                </label>
                <div className="relative">
                  {/* Prefix $ */}
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400 font-medium text-sm select-none">
                    $
                  </div>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={gastos[key] === 0 ? "" : gastos[key]}
                    onChange={(e) => updateGasto(key, e.target.value)}
                    className="border border-gray-200 rounded-xl px-4 py-3 pl-8 w-full text-gray-800 text-base focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Select tarjeta actual */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Tengo actualmente:
            </label>
            <select
              value={tarjetaActual}
              onChange={(e) => setTarjetaActual(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-full sm:w-auto bg-white"
            >
              <option value="">Ninguna / no sé</option>
              {TARJETAS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} — {t.banco}
                </option>
              ))}
            </select>
          </div>

          {/* Botón calcular */}
          <button
            onClick={handleCalcular}
            disabled={loading || totalGasto === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl px-8 py-4 text-lg font-semibold mt-2 transition-all duration-200 flex items-center justify-center"
          >
            {loading ? (
              <>
                <Spinner />
                Calculando…
              </>
            ) : (
              <>
                Calcular mi ahorro
                <span className="ml-2">→</span>
              </>
            )}
          </button>

          {totalGasto === 0 && !loading && (
            <p className="text-center text-gray-400 text-xs mt-2">
              Ingresá al menos un monto para calcular
            </p>
          )}

          {/* Gasto total en tiempo real */}
          {totalGasto > 0 && (
            <p className="text-center text-gray-500 text-sm mt-2">
              Gasto total ingresado:{" "}
              <span className="font-semibold text-gray-700">{formatARS(totalGasto)}/mes</span>
            </p>
          )}

          {/* Botones secundarios */}
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleGuardarPerfil}
              className="flex-1 sm:flex-none text-sm text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              💾 Guardar perfil
            </button>
            <button
              onClick={handleCargarPerfil}
              className="flex-1 sm:flex-none text-sm text-gray-600 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              📂 Cargar perfil
            </button>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════
            SECCIÓN 3 + 4 — RESULTADOS (lazy, animado)
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
            SECCIÓN 5 — FOOTER
        ════════════════════════════════════════════════════════════ */}
        <footer className="mt-16 pt-6 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400">
            © 2026 rateargy · Datos actualizados abril 2026 · La información es orientativa y no
            constituye asesoramiento financiero.
          </p>
        </footer>
      </main>

      {/* Toast global */}
      <Toast msg={toastMsg} />
    </div>
  )
}
