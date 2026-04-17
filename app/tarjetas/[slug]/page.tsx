import { TARJETAS_PUBLICAS, CATS } from "@/components/tarjetas-data"
import { BancoLogo } from "@/components/BancoLogo"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export async function generateStaticParams() {
  return TARJETAS_PUBLICAS.map(t => ({ slug: t.id }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tarjeta = TARJETAS_PUBLICAS.find(t => t.id === params.slug)
  if (!tarjeta) return {}
  return {
    title: `${tarjeta.nombre} — Beneficios y descuentos 2026 | rateargy`,
    description: `Todo sobre la ${tarjeta.nombre} de ${tarjeta.banco}. Descuentos en supermercados, nafta, farmacias y más. Calculá cuánto ahorrás con tu perfil de gasto.`,
    openGraph: {
      title: `${tarjeta.nombre} — Beneficios 2026`,
      description: `Descubrí todos los beneficios de la ${tarjeta.nombre}`,
    }
  }
}

export default function TarjetaPage({ params }: { params: { slug: string } }) {
  const tarjeta = TARJETAS_PUBLICAS.find(t => t.id === params.slug)
  if (!tarjeta) notFound()

  const beneficiosActivos = CATS.filter(c =>
    tarjeta.beneficios[c.key]?.pct > 0
  )

  const formatARS = (n: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency", currency: "ARS", maximumFractionDigits: 0
    }).format(n)

  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <a href="/" style={{ color: "#0a7c4e", textDecoration: "none" }}>rateargy</a>
        <span>›</span>
        <a href="/tarjetas" style={{ color: "#0a7c4e", textDecoration: "none" }}>Tarjetas</a>
        <span>›</span>
        <span>{tarjeta.nombre}</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
        <BancoLogo banco={tarjeta.bancoId} size={56} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 4 }}>
            {tarjeta.nombre}
          </h1>
          <div style={{ fontSize: 15, color: "#475569" }}>
            {tarjeta.banco} · {tarjeta.red} · {tarjeta.costoAnual === 0 ? "Sin costo anual" : formatARS(tarjeta.costoAnual) + "/año"}
          </div>
        </div>
        {/* Mini tarjeta física */}
        <div style={{
          width: 120, height: 76, borderRadius: 10,
          background: tarjeta.gradiente, flexShrink: 0,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
        }} />
      </div>

      {/* Pills de beneficios */}
      {tarjeta.pills.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          {tarjeta.pills.map(p => (
            <span key={p} style={{
              background: "#f0fdf7", border: "1px solid #bbf7d0",
              color: "#065f46", fontSize: 13, fontWeight: 600,
              padding: "6px 14px", borderRadius: 999
            }}>{p}</span>
          ))}
        </div>
      )}

      {/* Beneficios detallados */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>
          Beneficios y descuentos
        </h2>

        {beneficiosActivos.length === 0 ? (
          <p style={{ color: "#94a3b8", fontSize: 14 }}>
            No hay beneficios cargados aún para esta tarjeta.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {beneficiosActivos.map(cat => {
              const b = tarjeta.beneficios[cat.key]
              const iconos: Record<string, string> = {
                super: "🛒", nafta: "⛽", farmacia: "💊", delivery: "🍽️",
                online: "📦", viajes: "✈️", transporte: "🚌", servicios: "💡"
              }
              return (
                <div key={cat.key} style={{
                  display: "flex", alignItems: "center", gap: 16,
                  padding: "16px 20px", background: "white",
                  border: "1px solid #f1f5f9", borderRadius: 12
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: "#f0fdf7", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0, fontSize: 20
                  }}>
                    {iconos[cat.key] ?? "✨"}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>
                      {cat.label}
                    </div>
                    <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
                      {b.dias ? `${b.dias} · ` : ""}
                      {b.lugar ? `${b.lugar} · ` : ""}
                      Tope {formatARS(b.tope)}/mes
                    </div>
                    {b.descripcion && (
                      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
                        {b.descripcion}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#0a7c4e" }}>
                      {b.pct}%
                    </div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>descuento</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* CTA */}
      {tarjeta.urlSolicitud && (
        <div style={{
          background: "linear-gradient(135deg, #f0fdf7, #ffffff)",
          border: "1.5px solid #bbf7d0", borderRadius: 16, padding: 28,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 16, marginBottom: 40
        }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 4 }}>
              ¿Querés esta tarjeta?
            </div>
            <div style={{ fontSize: 14, color: "#475569" }}>
              Te redirigimos al sitio oficial de {tarjeta.banco}
            </div>
          </div>
          <a href={tarjeta.urlSolicitud} target="_blank" rel="noopener noreferrer"
            style={{
              background: "#0a7c4e", color: "white", padding: "14px 28px",
              borderRadius: 12, fontSize: 15, fontWeight: 700,
              textDecoration: "none", display: "inline-block"
            }}>
            Solicitar {tarjeta.nombre} →
          </a>
        </div>
      )}

      {/* Link volver */}
      <div style={{ textAlign: "center" }}>
        <a href="/" style={{ color: "#0a7c4e", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
          ← Volver al comparador
        </a>
      </div>

    </main>
  )
}
