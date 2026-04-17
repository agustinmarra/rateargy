import { getAllArticulos } from "@/lib/articulos"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Artículos — Guías financieras para argentinos",
  description:
    "Guías educativas sobre finanzas personales en Argentina: tarjetas de crédito, dólar MEP, cuentas remuneradas y más.",
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  Tarjetas:    { bg: "#d1fae5", text: "#059669" },
  "Dólares":   { bg: "#dbeafe", text: "#2563eb" },
  Cuentas:     { bg: "#ede9fe", text: "#7c3aed" },
  Inversiones: { bg: "#fef3c7", text: "#d97706" },
  Ahorro:      { bg: "#fce7f3", text: "#db2777" },
  Cuotas:      { bg: "#ffedd5", text: "#ea580c" },
  General:     { bg: "#f3f4f6", text: "#6b7280" },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    year: "numeric", month: "long", day: "numeric",
  })
}

export default function ArticulosPage() {
  const articulos = getAllArticulos()

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
            textTransform: "uppercase" as const, color: "#059669",
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
          </p>
        </div>

        {/* Estado vacío */}
        {articulos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", maxWidth: 480, margin: "0 auto" }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>📝</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
              Estamos preparando las primeras guías
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", lineHeight: 1.7, marginBottom: 28 }}>
              Mientras tanto, usá el comparador de tarjetas para ver cuál te ahorra más plata según tu perfil de gasto.
            </p>
            <a href="/tarjetas" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "14px 28px", borderRadius: 14,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700,
              boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
            }}>
              Ver comparador de tarjetas →
            </a>
          </div>
        ) : (
          <>
            {/* Grid de artículos */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 24,
            }}>
              {articulos.map((a) => {
                const cat = CAT_COLORS[a.category] ?? { bg: "#f3f4f6", text: "#6b7280" }
                return (
                  <a
                    key={a.slug}
                    href={`/articulos/${a.slug}`}
                    style={{
                      background: "#fff",
                      border: "1px solid #f3f4f6",
                      borderRadius: 20,
                      padding: "28px 28px 24px",
                      display: "flex", flexDirection: "column", gap: 14,
                      boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                      textDecoration: "none", color: "inherit",
                      transition: "box-shadow 0.18s, transform 0.18s",
                    }}
                    className="article-card"
                  >
                    {/* Emoji */}
                    {a.coverEmoji && (
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: cat.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 26,
                      }}>
                        {a.coverEmoji}
                      </div>
                    )}

                    {/* Categoría + tiempo */}
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
                      textTransform: "uppercase" as const, color: cat.text,
                    }}>
                      {a.category} · {a.readTime} min de lectura
                    </span>

                    {/* Título + descripción */}
                    <div>
                      <h2 style={{
                        fontSize: 17, fontWeight: 800, color: "#111827",
                        margin: "0 0 8px", letterSpacing: "-0.02em", lineHeight: 1.3,
                      }}>
                        {a.title}
                      </h2>
                      <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.65 }}>
                        {a.description}
                      </p>
                    </div>

                    {/* Fecha */}
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: "auto" }}>
                      {formatDate(a.publishedAt)}
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Bottom CTA */}
            <div style={{ textAlign: "center", marginTop: 64 }}>
              <p style={{ fontSize: 15, color: "#9ca3af", marginBottom: 20 }}>
                ¿Querés saber qué tarjeta te conviene según tus gastos?
              </p>
              <a href="/" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 14,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700,
                boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
              }}>
                Ir al comparador →
              </a>
            </div>
          </>
        )}

      </div>
      <style>{`
        .article-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
          transform: translateY(-4px);
        }
      `}</style>
    </main>
  )
}
