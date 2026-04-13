import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Artículos — Guías financieras para argentinos",
  description: "Guías educativas sobre finanzas personales en Argentina: tarjetas de crédito, dólar MEP, cuentas remuneradas y más.",
}

const ARTICULOS_PREVIEW = [
  {
    categoria: "Tarjetas",
    titulo: "Cómo elegir tu tarjeta de crédito en Argentina",
    desc: "Los 5 factores clave para no equivocarte y maximizar tu ahorro mensual.",
    emoji: "💳",
    tiempo: "5 min",
  },
  {
    categoria: "Dólares",
    titulo: "Dólar MEP paso a paso desde el homebanking",
    desc: "La forma legal y sin límite de dolarizar tus ahorros desde cualquier banco.",
    emoji: "💵",
    tiempo: "7 min",
  },
  {
    categoria: "Cuentas",
    titulo: "Mercado Pago vs Ualá: cuál rinde más en 2026",
    desc: "Comparamos tasas, beneficios y comisiones de las dos billeteras líderes.",
    emoji: "📊",
    tiempo: "6 min",
  },
  {
    categoria: "Inversiones",
    titulo: "FCI de Money Market: qué son y cómo invertir",
    desc: "La opción de renta fija más segura para tus pesos sin inmovilizarlos.",
    emoji: "📈",
    tiempo: "8 min",
  },
  {
    categoria: "Tarjetas",
    titulo: "Cuotas sin interés: dónde conviene más usarlas",
    desc: "Qué tarjetas tienen más cuotas, en qué comercios y cuándo conviene usarlas.",
    emoji: "🛒",
    tiempo: "4 min",
  },
  {
    categoria: "Ahorro",
    titulo: "Plazo fijo UVA vs tradicional: la guía definitiva",
    desc: "Cuándo conviene cada uno, cómo calcular el rendimiento y qué riesgos tiene.",
    emoji: "🏦",
    tiempo: "9 min",
  },
]

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  Tarjetas:     { bg: "#d1fae5", text: "#059669" },
  Dólares:      { bg: "#dbeafe", text: "#2563eb" },
  Cuentas:      { bg: "#ede9fe", text: "#7c3aed" },
  Inversiones:  { bg: "#fef3c7", text: "#d97706" },
  Ahorro:       { bg: "#fce7f3", text: "#db2777" },
}

export default function ArticulosPage() {
  return (
    <main style={{ minHeight: "calc(100vh - 64px)", background: "#ffffff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 120px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 999, padding: "7px 16px", marginBottom: 20,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#059669",
            boxShadow: "0 2px 10px rgba(16,185,129,0.15), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
            Educación financiera
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0a0a0a",
            margin: "0 0 20px", lineHeight: 1.05,
          }}>
            Artículos y guías
          </h1>
          <p style={{ fontSize: 18, color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.75 }}>
            Todo lo que necesitás saber sobre finanzas personales en Argentina.
            Actualizado cada semana.
          </p>
        </div>

        {/* Grid de artículos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}>
          {ARTICULOS_PREVIEW.map(({ categoria, titulo, desc, emoji, tiempo }) => {
            const cat = CAT_COLORS[categoria] ?? { bg: "#f3f4f6", text: "#6b7280" }
            return (
              <div
                key={titulo}
                style={{
                  background: "#fff",
                  border: "1px solid #f3f4f6",
                  borderRadius: 20,
                  padding: "28px 28px 24px",
                  display: "flex", flexDirection: "column", gap: 14,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}
              >
                {/* Coming soon overlay */}
                <div style={{
                  position: "absolute", top: 14, right: 14,
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #e5e7eb",
                  borderRadius: 999, padding: "3px 9px",
                  fontSize: 10, fontWeight: 700, color: "#9ca3af",
                  letterSpacing: "0.06em", textTransform: "uppercase",
                }}>
                  Próximamente
                </div>

                {/* Emoji */}
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: cat.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26,
                }}>
                  {emoji}
                </div>

                {/* Categoría */}
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: cat.text,
                }}>
                  {categoria} · {tiempo} de lectura
                </span>

                {/* Título + desc */}
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: "#111827", margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.3 }}>
                    {titulo}
                  </h2>
                  <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.65 }}>
                    {desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 64 }}>
          <p style={{ fontSize: 15, color: "#9ca3af", marginBottom: 20 }}>
            Mientras tanto, comparé tarjetas y empezá a ahorrar ahora:
          </p>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 14,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700,
            boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          }}>
            Ir al comparador
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 16, height: 16 }}>
              <path d="M4 10h12M10 4l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  )
}
