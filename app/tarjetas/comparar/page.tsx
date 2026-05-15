import type { Metadata } from "next"
import { Suspense } from "react"
import CompararClient from "./CompararClient"

export const metadata: Metadata = {
  title: "Comparar tarjetas de crédito Argentina | rateargy",
  description: "Compará dos tarjetas de crédito lado a lado. Beneficios, topes, costos y red para todas las tarjetas de Argentina.",
}

export default function CompararPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 96px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <a href="/" style={{ color: "#0a7c4e", textDecoration: "none" }}>rateargy</a>
        <span>›</span>
        <a href="/tarjetas" style={{ color: "#0a7c4e", textDecoration: "none" }}>Tarjetas</a>
        <span>›</span>
        <span>Comparar</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Comparar tarjetas de crédito
        </h1>
        <p style={{ fontSize: 15, color: "#475569", maxWidth: 540 }}>
          Elegí dos tarjetas y mirá sus beneficios lado a lado. La celda verde indica cuál gana en cada categoría.
        </p>
      </div>

      <Suspense fallback={<div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Cargando...</div>}>
        <CompararClient />
      </Suspense>

      {/* Tip */}
      <div style={{ marginTop: 48, padding: "20px 24px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fde68a" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Tip</div>
        <p style={{ fontSize: 13, color: "#78350f", margin: 0, lineHeight: 1.7 }}>
          Esta comparación muestra beneficios máximos. Los porcentajes y topes pueden variar según tu segmento (standard, gold, black).
          Verificá con el banco antes de solicitar la tarjeta.
        </p>
      </div>

      <div style={{ marginTop: 24, textAlign: "center" }}>
        <a href="/" style={{ fontSize: 14, color: "#059669", fontWeight: 700, textDecoration: "none" }}>
          ← Ver comparador personalizado por perfil de gasto
        </a>
      </div>
    </main>
  )
}
