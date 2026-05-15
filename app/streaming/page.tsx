import type { Metadata } from "next"
import StreamingCalculadora from "./StreamingCalculadora"

export const metadata: Metadata = {
  title: "Precios de streaming en Argentina 2026 | rateargy",
  description: "Cuánto cuestan Netflix, Disney+, Max, Spotify, Amazon y más en Argentina. Calculá el costo total de todos tus servicios por mes.",
  openGraph: {
    title: "Precios de streaming Argentina 2026 | rateargy",
    description: "Comparador de precios de Netflix, Disney+, Max, Spotify y más en pesos argentinos.",
  },
}

const CONTEXTO = [
  {
    titulo: "¿Por qué fluctúan los precios?",
    texto:
      "Los servicios internacionales (Netflix, Disney+, Max, Apple TV+, Amazon) se cobran en dólares y la conversión al peso usa el tipo de cambio oficial más IVA (21%) y percepciones provinciales. Si sube el dólar, sube el precio en ARS aunque el servicio no haya cambiado sus tarifas.",
  },
  {
    titulo: "¿En qué tarjeta conviene pagar?",
    texto:
      "Varias tarjetas de crédito ofrecen reintegros en plataformas de streaming. Revisá el comparador de rateargy para ver cuál tarjeta te da descuentos en este rubro según tu perfil.",
  },
  {
    titulo: "¿Con cuenta familiar se puede ahorrar?",
    texto:
      "En Spotify, compartir el plan Familiar entre 6 personas baja el costo individual a menos de $1.000/mes. Netflix restringe el compartir con personas fuera del hogar. Disney+ permite múltiples perfiles dentro del mismo domicilio.",
  },
]

export default function StreamingPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 96px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <a href="/" style={{ color: "#0a7c4e", textDecoration: "none" }}>rateargy</a>
        <span>›</span>
        <span>Streaming</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Actualizado mayo 2026
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
          ¿Cuánto gastás en streaming<br />por mes?
        </h1>
        <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, maxWidth: 580 }}>
          Netflix, Disney+, Max, Spotify y más. Seleccioná los servicios que usás y calculá el total mensual y anual en pesos argentinos.
        </p>
      </div>

      <StreamingCalculadora />

      {/* Contexto */}
      <section style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>Lo que conviene saber</h2>
        <div style={{ display: "grid", gap: 16 }}>
          {CONTEXTO.map((c) => (
            <div key={c.titulo} style={{ background: "#f8fafc", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>{c.titulo}</div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, margin: 0 }}>{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ marginTop: 48, padding: "28px 24px", background: "#f0fdf4", borderRadius: 16, border: "1px solid #bbf7d0" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          Muchas tarjetas devuelven plata en streaming
        </div>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>
          Galicia, Santander y otras tarjetas ofrecen reintegros en Netflix, Spotify y plataformas de streaming.
          Usá el comparador para ver cuál te conviene según tus servicios y otros gastos.
        </p>
        <a href="/" style={{
          display: "inline-block", background: "#059669", color: "white",
          padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none",
        }}>
          Comparar tarjetas de crédito →
        </a>
      </div>
    </main>
  )
}
