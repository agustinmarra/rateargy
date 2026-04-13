import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Calculadora de Nafta — Ahorrá en combustible con tu tarjeta",
  description: "Calculá cuánto ahorrás en nafta con tu tarjeta de crédito según los beneficios actuales.",
}

export default function NaftaPage() {
  return (
    <main style={{ minHeight: "calc(100vh - 64px)", background: "#ffffff" }}>
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 120px" }}>

        {/* Eyebrow */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
            border: "1px solid rgba(217,119,6,0.25)",
            borderRadius: 999, padding: "7px 16px", marginBottom: 24,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase", color: "#d97706",
            boxShadow: "0 2px 10px rgba(217,119,6,0.12), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            Próximamente
          </div>

          <h1 style={{
            fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0a0a0a",
            margin: "0 0 20px", lineHeight: 1.05,
          }}>
            Calculadora de Nafta
          </h1>
          <p style={{
            fontSize: 18, color: "#6b7280", maxWidth: 520,
            margin: "0 auto 56px", lineHeight: 1.75,
          }}>
            Calculá cuánto ahorrás en combustible con cada tarjeta de crédito
            según los descuentos actuales en YPF, Shell y Axion.
          </p>
        </div>

        {/* Card placeholder */}
        <div style={{
          maxWidth: 520, margin: "0 auto",
          background: "linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%)",
          border: "2px dashed rgba(217,119,6,0.25)",
          borderRadius: 28, padding: "56px 40px",
          textAlign: "center",
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: 32,
          }}>
            ⛽
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            En construcción
          </h2>
          <p style={{ fontSize: 15, color: "#9ca3af", lineHeight: 1.7, margin: 0 }}>
            Estamos armando esta calculadora con los descuentos
            reales de las estaciones de servicio. Volvé pronto.
          </p>

          <div style={{
            display: "inline-flex", gap: 16, marginTop: 32,
            padding: "16px 24px",
            background: "rgba(255,255,255,0.7)",
            borderRadius: 16, border: "1px solid rgba(217,119,6,0.15)",
          }}>
            {[
              { label: "YPF", pct: "15%" },
              { label: "Shell", pct: "10%" },
              { label: "Axion", pct: "12%" },
            ].map(({ label, pct }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#d97706" }}>{pct}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA a tarjetas */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>
            Mientras tanto, comparé los beneficios en nafta de todas las tarjetas:
          </p>
          <a href="/" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 28px", borderRadius: 14,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff", textDecoration: "none", fontSize: 15, fontWeight: 700,
            boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
          }}>
            Ir al comparador de tarjetas
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 16, height: 16 }}>
              <path d="M4 10h12M10 4l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  )
}
