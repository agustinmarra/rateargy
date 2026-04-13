"use client"

import { useState } from "react"
import Link from "next/link"
import { TARJETAS } from "@/components/tarjetas-data"

// ── Nombre premium por estación ─────────────────────────────────────────────
const NOMBRE_PREMIUM: Record<string, string> = {
  ypf:   "Infinia",
  shell: "V-Power",
  axion: "Extreme",
  puma:  "Extra",
}

const TIPOS: { key: "super" | "premium" | "diesel"; label: string; desc: string }[] = [
  { key: "super",   label: "Súper",   desc: "Nafta regular"              },
  { key: "premium", label: "Premium", desc: "Infinia · V-Power · Extreme" },
  { key: "diesel",  label: "Diesel",  desc: "Gasoil"                     },
]

// ACTUALIZAR ACÁ CADA VEZ QUE SUBAN LOS PRECIOS
// Fuente: verificar en ypf.com, shell.com.ar o infobae.com/economia
// Última actualización: abril 2026
const ESTACIONES = [
  {
    id: "ypf",   nombre: "YPF",   color: "#0052A5",
    // Súper: $1.999 | Infinia: $2.207 | Diesel 500: $2.065
    precios: { super: 1999, premium: 2207, diesel: 2065 },
    nota: "Red más grande del país",
  },
  {
    id: "shell", nombre: "Shell", color: "#E4181C",
    // Súper: $2.049 | V-Power: $2.365 | Diesel: $2.019
    precios: { super: 2049, premium: 2365, diesel: 2019 },
    nota: "V-Power reconocida mundialmente",
  },
  {
    id: "axion", nombre: "Axion", color: "#C8181A",
    // Súper: $2.039 | Extreme: est. $2.280 | Eurodiesel: est. $2.040
    precios: { super: 2039, premium: 2280, diesel: 2040 },
    nota: "Precio competitivo con Extreme",
  },
  {
    id: "puma",  nombre: "Puma",  color: "#1a6b2a",
    // Súper: ~$1.974 | Premium: est. $2.100 | Diesel: est. $1.960
    precios: { super: 1974, premium: 2100, diesel: 1960 },
    nota: "Precio más bajo del mercado",
  },
]

const AUTOS = [
  { nombre: "Renault Kwid",   litros: 38, tipo: "hatch"  },
  { nombre: "Toyota Etios",   litros: 42, tipo: "sedan"  },
  { nombre: "Chevrolet Onix", litros: 45, tipo: "hatch"  },
  { nombre: "VW Polo / Gol",  litros: 45, tipo: "sedan"  },
  { nombre: "Toyota Corolla", litros: 55, tipo: "sedan"  },
  { nombre: "Ford Ranger",    litros: 70, tipo: "pickup" },
  { nombre: "Toyota Hilux",   litros: 80, tipo: "pickup" },
  { nombre: "Moto",           litros: 12, tipo: "moto"   },
  { nombre: "Personalizado",  litros: 0,  tipo: "edit"   },
]

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("es-AR")

// ── SVG — iconos de vehículos ────────────────────────────────────────────────

function IconHatch({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 56 30" fill="none" style={{ width: 44, height: 24 }}>
      <ellipse cx="12" cy="24" rx="5.5" ry="5.5" fill={color} />
      <ellipse cx="44" cy="24" rx="5.5" ry="5.5" fill={color} />
      <ellipse cx="12" cy="24" rx="2.5" ry="2.5" fill="white" opacity="0.5" />
      <ellipse cx="44" cy="24" rx="2.5" ry="2.5" fill="white" opacity="0.5" />
      <path d="M4 18 L10 7 L22 4 L38 4 L48 7 L52 18 L52 24 L4 24 Z" fill={color} opacity="0.9" />
      <path d="M12 17 L15 6 L26 6 L26 17 Z" fill="white" opacity="0.35" />
      <path d="M28 17 L28 6 L40 6 L44 17 Z" fill="white" opacity="0.35" />
      <line x1="27" y1="6" x2="27" y2="17" stroke={color} strokeWidth="1" />
    </svg>
  )
}

function IconSedan({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 60 30" fill="none" style={{ width: 48, height: 24 }}>
      <ellipse cx="13" cy="24" rx="5.5" ry="5.5" fill={color} />
      <ellipse cx="47" cy="24" rx="5.5" ry="5.5" fill={color} />
      <ellipse cx="13" cy="24" rx="2.5" ry="2.5" fill="white" opacity="0.5" />
      <ellipse cx="47" cy="24" rx="2.5" ry="2.5" fill="white" opacity="0.5" />
      <path d="M4 18 L12 9 L22 5 L38 5 L50 9 L56 18 L56 24 L4 24 Z" fill={color} opacity="0.9" />
      <path d="M14 17 L17 7 L28 7 L28 17 Z" fill="white" opacity="0.35" />
      <path d="M30 17 L30 7 L42 7 L46 17 Z" fill="white" opacity="0.35" />
      <line x1="29" y1="7" x2="29" y2="17" stroke={color} strokeWidth="1" />
    </svg>
  )
}

function IconPickup({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 68 30" fill="none" style={{ width: 52, height: 24 }}>
      <ellipse cx="14" cy="24" rx="6" ry="6" fill={color} />
      <ellipse cx="54" cy="24" rx="6" ry="6" fill={color} />
      <ellipse cx="14" cy="24" rx="2.5" ry="2.5" fill="white" opacity="0.5" />
      <ellipse cx="54" cy="24" rx="2.5" ry="2.5" fill="white" opacity="0.5" />
      <path d="M4 18 L10 6 L20 4 L36 4 L36 18 Z" fill={color} opacity="0.9" />
      <path d="M36 11 L36 18 L64 18 L64 11 Z" fill={color} opacity="0.65" />
      <path d="M4 18 L64 18 L64 24 L4 24 Z" fill={color} />
      <path d="M12 17 L14 7 L24 7 L24 17 Z" fill="white" opacity="0.35" />
      <line x1="36" y1="11" x2="36" y2="24" stroke="white" strokeWidth="1.5" opacity="0.4" />
      <line x1="50" y1="11" x2="50" y2="18" stroke="white" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

function IconMoto({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 50 32" fill="none" style={{ width: 40, height: 26 }}>
      <circle cx="10" cy="22" r="8" stroke={color} strokeWidth="2.5" />
      <circle cx="40" cy="22" r="8" stroke={color} strokeWidth="2.5" />
      <circle cx="10" cy="22" r="3" fill={color} opacity="0.5" />
      <circle cx="40" cy="22" r="3" fill={color} opacity="0.5" />
      <path d="M10 22 L22 10 L40 22" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M22 10 L28 4 L38 4" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M19 10 L30 10" stroke={color} strokeWidth="3" strokeLinecap="round" />
      <line x1="36" y1="4" x2="40" y2="4" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IconEdit({ color = "#10b981" }: { color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: 28, height: 28 }}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CarIcon({ tipo, color }: { tipo: string; color: string }) {
  if (tipo === "pickup") return <IconPickup color={color} />
  if (tipo === "moto")   return <IconMoto color={color} />
  if (tipo === "edit")   return <IconEdit color={color} />
  if (tipo === "sedan")  return <IconSedan color={color} />
  return <IconHatch color={color} />
}

// ── SVG — decoraciones hero ──────────────────────────────────────────────────

function SpeedometerSVG() {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 160, height: 100, opacity: 0.18 }}>
      <defs>
        <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#065f46" />
        </linearGradient>
      </defs>
      {/* Track */}
      <path d="M 16 88 A 64 64 0 0 1 144 88" stroke="#d1fae5" strokeWidth="12" fill="none" strokeLinecap="round" />
      {/* Fill */}
      <path d="M 16 88 A 64 64 0 0 1 144 88" stroke="url(#speedGrad)" strokeWidth="12" fill="none" strokeLinecap="round"
        strokeDasharray="201" strokeDashoffset="60" />
      {/* Ticks */}
      {[0,18,36,54,72,90,108,126,144,162,180].map((deg, i) => {
        const rad = ((deg - 180) * Math.PI) / 180
        const r1 = 74, r2 = i % 5 === 0 ? 62 : 68
        const cx = 80, cy = 88
        return (
          <line key={deg}
            x1={cx + r1 * Math.cos(rad)} y1={cy + r1 * Math.sin(rad)}
            x2={cx + r2 * Math.cos(rad)} y2={cy + r2 * Math.sin(rad)}
            stroke="#10b981" strokeWidth={i % 5 === 0 ? 2 : 1} strokeLinecap="round" />
        )
      })}
      {/* Needle — 65% */}
      <line x1="80" y1="88" x2="30" y2="36" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
      <circle cx="80" cy="88" r="7" fill="#10b981" />
      <circle cx="80" cy="88" r="3" fill="white" />
      {/* Labels */}
      <text x="14" y="104" fontSize="9" fill="#10b981" fontWeight="700">0</text>
      <text x="74" y="18" fontSize="9" fill="#10b981" fontWeight="700">120</text>
      <text x="136" y="104" fontSize="9" fill="#10b981" fontWeight="700">240</text>
    </svg>
  )
}

function FuelGaugeSVG() {
  return (
    <svg viewBox="0 0 70 90" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 70, height: 90, opacity: 0.18 }}>
      {/* Bomba */}
      <rect x="8" y="18" width="40" height="66" rx="6" stroke="#10b981" strokeWidth="2.5" />
      <rect x="16" y="28" width="24" height="16" rx="3" fill="#10b981" opacity="0.6" />
      {/* Pantalla / indicador */}
      <rect x="14" y="52" width="28" height="22" rx="3" fill="#10b981" opacity="0.15" stroke="#10b981" strokeWidth="1.5" />
      <line x1="20" y1="60" x2="36" y2="60" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="65" x2="30" y2="65" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
      {/* Manguera */}
      <path d="M48 28 L58 18 L64 22 L64 52 L56 56" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="60" cy="46" r="4" stroke="#10b981" strokeWidth="2" />
      {/* Gotas */}
      <path d="M34 6 Q38 12 38 16 A4 4 0 0 1 30 16 Q30 12 34 6Z" fill="#10b981" opacity="0.5" />
    </svg>
  )
}

function HeroCarSVG() {
  return (
    <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 200, height: 80, opacity: 0.14 }}>
      {/* Ruedas */}
      <circle cx="42" cy="64" r="14" stroke="#10b981" strokeWidth="3" />
      <circle cx="42" cy="64" r="5" fill="#10b981" opacity="0.4" />
      <circle cx="158" cy="64" r="14" stroke="#10b981" strokeWidth="3" />
      <circle cx="158" cy="64" r="5" fill="#10b981" opacity="0.4" />
      {/* Carrocería */}
      <path d="M10 50 L26 22 L60 14 L130 14 L168 22 L190 50 L190 64 L10 64 Z"
        fill="#10b981" opacity="0.35" />
      <path d="M10 50 L190 50 L190 64 L10 64 Z" fill="#10b981" opacity="0.5" />
      {/* Vidrios */}
      <path d="M34 48 L42 20 L68 16 L68 48 Z" fill="#059669" opacity="0.4" />
      <path d="M70 48 L70 16 L116 16 L116 48 Z" fill="#059669" opacity="0.4" />
      <path d="M118 48 L118 16 L148 18 L158 48 Z" fill="#059669" opacity="0.4" />
      {/* Líneas de velocidad */}
      <line x1="0" y1="56" x2="8" y2="56" stroke="#10b981" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="0" y1="62" x2="6" y2="62" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="0" y1="50" x2="5" y2="50" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}

// ── Logo de estación con fallback ────────────────────────────────────────────
// Para agregar logos reales: guardá YPF.png, shell.png, axion.png, puma.png en /public/logos/
// y van a aparecer automáticamente.

function StationLogo({ id, nombre, color, size = 44 }: { id: string; nombre: string; color: string; size?: number }) {
  const [err, setErr] = useState(false)
  const radius = Math.round(size * 0.27)
  const initials = nombre.slice(0, 3).toUpperCase()
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: color, overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      boxShadow: `0 4px 14px ${color}55`,
    }}>
      {!err ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/logos/${id}.png`}
          alt={nombre}
          onError={() => setErr(true)}
          style={{ width: "85%", height: "85%", objectFit: "contain" }}
        />
      ) : (
        <span style={{ fontSize: Math.round(size * 0.32), fontWeight: 900, color: "#fff", letterSpacing: "-0.03em" }}>
          {initials}
        </span>
      )}
    </div>
  )
}

// ── SVG — iconos de tipo combustible ────────────────────────────────────────

function IconDrop({ color = "#10b981", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" style={{ width: size, height: size * 1.33 }}>
      <path d="M12 2 Q20 12 20 20 A8 8 0 0 1 4 20 Q4 12 12 2Z" fill={color} />
    </svg>
  )
}

function IconStar({ color = "#10b981", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size }}>
      <path d="M12 2 L14.4 9.2 L22 9.2 L16 13.8 L18.4 21 L12 16.4 L5.6 21 L8 13.8 L2 9.2 L9.6 9.2 Z"
        fill={color} />
    </svg>
  )
}

function IconGear({ color = "#10b981", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: size, height: size }}>
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2.2" />
      <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
        stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// ────────────────────────────────────────────────────────────────────────────

export default function NaftaCalculadora() {
  const [autoIdx,      setAutoIdx]      = useState(1)
  const [customLitros, setCustomLitros] = useState(50)
  const [pctTanque,    setPctTanque]    = useState(100)
  const [tipoNafta,    setTipoNafta]    = useState<"super" | "premium" | "diesel">("super")

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
    <main style={{ minHeight: "calc(100vh - 64px)", background: "#f7fffe" }}>
      <style>{`
        .na-auto:hover { background: #ecfdf5 !important; border-color: rgba(16,185,129,0.5) !important; }
        .na-range {
          -webkit-appearance: none; width: 100%; height: 7px; border-radius: 4px; outline: none; cursor: pointer;
          background: linear-gradient(to right, #10b981 0%, #059669 var(--pct, 100%), #e2e8f0 var(--pct, 100%));
        }
        .na-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer; box-shadow: 0 0 0 4px rgba(16,185,129,0.18), 0 2px 8px rgba(16,185,129,0.4);
          border: 3px solid #fff;
        }
        .na-range::-moz-range-thumb {
          width: 26px; height: 26px; border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: pointer; box-shadow: 0 2px 8px rgba(16,185,129,0.4); border: 3px solid #fff;
        }
        .na-station { transition: transform 0.15s, box-shadow 0.15s; }
        .na-station:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.09) !important; }
        .na-promo:hover { border-color: rgba(16,185,129,0.3) !important; background: #f0fdf4 !important; }
        @media (max-width: 700px) {
          .na-autos    { grid-template-columns: repeat(3, 1fr) !important; }
          .na-stations { grid-template-columns: 1fr 1fr !important; }
          .na-promos   { grid-template-columns: 1fr !important; }
          .na-tipos    { flex-direction: column !important; }
        }
      `}</style>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", overflow: "hidden",
        padding: "72px 24px 64px",
        background: "linear-gradient(160deg, #ecfdf5 0%, #f0fdf4 55%, #f7fffe 100%)",
        borderBottom: "1px solid rgba(16,185,129,0.12)",
        textAlign: "center",
      }}>
        {/* Decoraciones */}
        <div style={{ position: "absolute", top: 16, left: 32, transform: "rotate(-8deg)" }}>
          <FuelGaugeSVG />
        </div>
        <div style={{ position: "absolute", top: 12, right: 28, transform: "rotate(6deg)" }}>
          <SpeedometerSVG />
        </div>
        <div style={{ position: "absolute", bottom: -8, right: "6%" }}>
          <HeroCarSVG />
        </div>
        {/* Líneas de ruta */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 5,
          background: "repeating-linear-gradient(90deg, #10b981 0px, #10b981 36px, transparent 36px, transparent 60px)",
          opacity: 0.22,
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 24,
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 999, padding: "7px 16px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#059669",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "navbar-pulse 2s ease-in-out infinite" }} />
            Calculadora de nafta
          </div>

          <h1 style={{
            fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em",
            color: "#0f172a", margin: "0 0 16px", lineHeight: 1.05,
          }}>
            ¿Cuánto te cuesta<br />
            <span style={{ color: "#10b981" }}>llenar el tanque?</span>
          </h1>

          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 500, margin: "0 auto", lineHeight: 1.75 }}>
            Comparé YPF, Shell, Axion y Puma — y descubrí cuánto ahorrás con tu tarjeta.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "48px 24px 100px" }}>

        {/* ── Calculadora card ──────────────────────────────────────────────────── */}
        <div style={{
          background: "#ffffff",
          border: "1.5px solid rgba(16,185,129,0.15)",
          borderRadius: 28, padding: "36px 32px",
          boxShadow: "0 4px 24px rgba(16,185,129,0.06), 0 1px 4px rgba(0,0,0,0.04)",
          marginBottom: 32,
        }}>

          {/* 1. Auto */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
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
                      background: active ? "#ecfdf5" : "#f8fafc",
                      border: `1.5px solid ${active ? "#10b981" : "#e2e8f0"}`,
                      borderRadius: 14, padding: "14px 8px 12px",
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 28, marginBottom: 8 }}>
                      <CarIcon tipo={auto.tipo} color={active ? "#10b981" : "#94a3b8"} />
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: active ? "#059669" : "#475569", lineHeight: 1.3 }}>
                      {auto.nombre}
                    </div>
                    {auto.litros > 0 && (
                      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 3 }}>
                        {auto.litros}L
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {esPersonalizado && (
              <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Capacidad del tanque:</span>
                <input
                  type="number" min={1} max={250}
                  value={customLitros}
                  onChange={e => setCustomLitros(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: 80, padding: "8px 12px", textAlign: "center",
                    background: "#ecfdf5", border: "1.5px solid #10b981",
                    borderRadius: 10, fontSize: 16, fontWeight: 700, color: "#0f172a", outline: "none",
                  }}
                />
                <span style={{ fontSize: 13, color: "#64748b" }}>litros</span>
              </div>
            )}
          </div>

          {/* 2. Slider */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
                2 — ¿Cuánto cargás?
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 30, fontWeight: 900, color: "#10b981", letterSpacing: "-0.03em" }}>{litros}L</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{pctTanque}% del tanque</span>
              </div>
            </div>

            {/* Gauge visual */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                type="range" min={10} max={100} step={5}
                value={pctTanque}
                onChange={e => setPctTanque(parseInt(e.target.value))}
                className="na-range"
                style={{ "--pct": trackPct } as React.CSSProperties}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {[10, 25, 50, 75, 100].map(v => (
                <button
                  key={v}
                  onClick={() => setPctTanque(v)}
                  style={{
                    fontSize: 11, fontWeight: 700, padding: "4px 0",
                    color: pctTanque === v ? "#10b981" : "#cbd5e1",
                    background: "none", border: "none", cursor: "pointer", transition: "color 0.15s",
                  }}
                >
                  {v === 100 ? "Lleno" : `${v}%`}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Tipo combustible */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 16px" }}>
              3 — Tipo de combustible
            </p>
            <div className="na-tipos" style={{ display: "flex", gap: 10 }}>
              {TIPOS.map(({ key, label, desc }) => {
                const active = tipoNafta === key
                const Icon = key === "super" ? IconDrop : key === "premium" ? IconStar : IconGear
                return (
                  <button
                    key={key}
                    onClick={() => setTipoNafta(key)}
                    style={{
                      flex: 1, padding: "14px 8px", borderRadius: 14,
                      background: active ? "#ecfdf5" : "#f8fafc",
                      border: `1.5px solid ${active ? "#10b981" : "#e2e8f0"}`,
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
                      <Icon color={active ? "#10b981" : "#94a3b8"} size={20} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: active ? "#059669" : "#475569" }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>{desc}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Resultados por estación ────────────────────────────────────────────── */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, gap: 12, flexWrap: "wrap" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.02em" }}>
              Precio por estación
            </h2>
            {diferencia > 0 && (
              <span style={{ fontSize: 13, color: "#94a3b8" }}>
                Diferencia más cara vs más barata:{" "}
                <strong style={{ color: "#10b981" }}>{fmt(diferencia)}</strong>
              </span>
            )}
          </div>

          <div className="na-stations" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {resultados.map((est, i) => {
              const esMasBarata = i === 0
              const nombreComb = tipoNafta === "premium" ? (NOMBRE_PREMIUM[est.id] ?? "Premium") : (tipoNafta === "diesel" ? "Diesel" : "Súper")
              return (
                <div
                  key={est.id}
                  className="na-station"
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${esMasBarata ? "#10b981" : "#f1f5f9"}`,
                    borderRadius: 20, padding: "22px 18px",
                    position: "relative", overflow: "hidden",
                    boxShadow: esMasBarata ? "0 8px 28px rgba(16,185,129,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {esMasBarata && (
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: 3,
                      background: "linear-gradient(90deg, #10b981, #059669)",
                    }} />
                  )}
                  {esMasBarata && (
                    <div style={{
                      position: "absolute", top: 13, right: 12,
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      borderRadius: 999, padding: "3px 9px",
                      fontSize: 9, fontWeight: 800, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase",
                    }}>
                      Más barata
                    </div>
                  )}

                  <div style={{ fontSize: 10, fontWeight: 800, color: "#cbd5e1", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 14 }}>
                    #{i + 1}
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <StationLogo id={est.id} nombre={est.nombre} color={est.color} size={44} />
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 2 }}>{est.nombre}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>{nombreComb}</div>

                  <div style={{
                    fontSize: "clamp(20px, 2.5vw, 26px)", fontWeight: 900, letterSpacing: "-0.04em",
                    color: esMasBarata ? "#10b981" : "#0f172a", marginBottom: 4,
                  }}>
                    {fmt(est.total)}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 14 }}>
                    {fmt(est.pxl)}/litro
                  </div>
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.55 }}>
                    {est.nota}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Nota de precios */}
        <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", margin: "12px 0 40px", lineHeight: 1.6 }}>
          Precios de referencia en CABA al 1° de abril 2026. Los precios varían por zona y se actualizan periódicamente.
        </p>

        {/* ── Promos tarjetas ────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
              Con tu tarjeta ahorrás más
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", margin: 0 }}>
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
                  className="na-promo"
                  style={{
                    background: "#fff",
                    border: "1.5px solid #f1f5f9",
                    borderRadius: 18, padding: "18px 20px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{
                    width: 4, flexShrink: 0, alignSelf: "stretch", borderRadius: 4,
                    background: t.gradiente,
                  }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 700, color: "#0f172a",
                      marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {t.nombre}
                    </div>
                    <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>
                      {nafta.lugar}
                    </div>
                    {nafta.dias && (
                      <div style={{
                        display: "inline-flex", marginTop: 8,
                        background: "#ecfdf5", border: "1px solid rgba(16,185,129,0.25)",
                        borderRadius: 999, padding: "2px 9px",
                        fontSize: 10, fontWeight: 700, color: "#059669", letterSpacing: "0.04em",
                      }}>
                        Solo {nafta.dias}
                      </div>
                    )}
                  </div>

                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "#10b981", letterSpacing: "-0.04em", lineHeight: 1 }}>
                      {nafta.pct}%
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
                      tope {fmt(nafta.tope)}/mes
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#059669", marginTop: 6 }}>
                      -{fmt(ahorro)} hoy
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────────────── */}
        <div style={{
          textAlign: "center",
          background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
          border: "1.5px solid rgba(16,185,129,0.2)",
          borderRadius: 24, padding: "44px 32px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", bottom: -8, right: 16, opacity: 0.1 }}>
            <HeroCarSVG />
          </div>

          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#10b981", marginBottom: 14,
          }}>
            ¿Cuánto ahorrás en total?
          </div>
          <h3 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 12px", letterSpacing: "-0.03em" }}>
            Comparé todas las tarjetas del mercado
          </h3>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 28px", lineHeight: 1.7 }}>
            Ingresá tu gasto mensual en nafta y te mostramos cuánto ahorrás<br />
            con cada tarjeta — incluyendo supermercado, delivery y más.
          </p>
          <Link
            href="/?nafta=30000"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "15px 30px", borderRadius: 14,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700,
              boxShadow: "0 8px 28px rgba(16,185,129,0.35)",
              position: "relative",
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
