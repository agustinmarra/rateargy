import { TARJETAS } from "@/components/tarjetas-data"
import { BancoLogo } from "@/components/BancoLogo"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comparador de tarjetas de crédito Argentina 2026 | rateargy",
  description: "Compará todas las tarjetas de crédito de Argentina. Descubrí cuál te da más beneficios en supermercados, nafta, farmacias y más según tu perfil de gasto.",
  openGraph: {
    title: "Todas las tarjetas de crédito — rateargy",
    description: "Comparador de tarjetas de crédito para Argentina 2026",
  }
}

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0
  }).format(n)

export default function TarjetasPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <a href="/" style={{ color: "#0a7c4e", textDecoration: "none" }}>rateargy</a>
        <span>›</span>
        <span>Tarjetas</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", marginBottom: 8 }}>
          Tarjetas de crédito en Argentina
        </h1>
        <p style={{ fontSize: 16, color: "#475569", maxWidth: 600 }}>
          {TARJETAS.length} tarjetas comparadas. Usá el comparador para ver cuál te conviene según tu perfil de gasto.
        </p>
        <div style={{ marginTop: 20 }}>
          <a href="/" style={{
            display: "inline-block",
            background: "#0a7c4e", color: "white",
            padding: "12px 24px", borderRadius: 10,
            fontSize: 14, fontWeight: 700, textDecoration: "none"
          }}>
            Comparar con mi perfil →
          </a>
        </div>
      </div>

      {/* Grid */}
      <style>{`
        .tarjetas-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px) { .tarjetas-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .tarjetas-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (max-width: 480px) { .tarjetas-grid { grid-template-columns: 1fr; } }
        .tarjeta-card {
          text-decoration: none;
          color: inherit;
          display: block;
          background: white;
          border: 1px solid #f1f5f9;
          border-radius: 16px;
          padding: 20px;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }
        .tarjeta-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.1);
        }
      `}</style>

      <div className="tarjetas-grid">
        {TARJETAS.map(t => {
          const beneficiosActivos = Object.values(t.beneficios).filter(b => (b?.pct ?? 0) > 0).length

          return (
            <a key={t.id} href={`/tarjetas/${t.id}`} className="tarjeta-card">
              {/* Mini card visual */}
              <div style={{
                width: "100%", height: 60, borderRadius: 8,
                background: t.gradiente, marginBottom: 16,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 60%)"
                }} />
                <span style={{
                  position: "absolute", bottom: 6, left: 10,
                  fontSize: 8, fontWeight: 700, color: "white", opacity: 0.9
                }}>{t.banco}</span>
              </div>

              {/* Logo + nombre */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <BancoLogo banco={t.bancoId} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.2,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {t.nombre}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>{t.red}</div>
                </div>
              </div>

              {/* Costo anual */}
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                {t.costoAnual === 0
                  ? <span style={{ color: "#059669", fontWeight: 600 }}>Sin costo anual</span>
                  : formatARS(t.costoAnual) + "/año"}
              </div>

              {/* Pills */}
              {t.pills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {t.pills.slice(0, 3).map(p => (
                    <span key={p} style={{
                      background: "#f0fdf7", border: "1px solid #bbf7d0",
                      color: "#065f46", fontSize: 10, fontWeight: 600,
                      padding: "3px 8px", borderRadius: 999
                    }}>{p}</span>
                  ))}
                </div>
              )}

              {/* Beneficios activos */}
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {beneficiosActivos > 0
                  ? <span style={{ color: "#0a7c4e", fontWeight: 600 }}>{beneficiosActivos} beneficios activos</span>
                  : "Sin beneficios cargados"}
              </div>
            </a>
          )
        })}
      </div>

      {/* CTA bottom */}
      <div style={{ marginTop: 60, textAlign: "center", padding: "40px 24px",
        background: "linear-gradient(135deg, #f0fdf7, #ffffff)",
        border: "1.5px solid #bbf7d0", borderRadius: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>
          ¿No sabés cuál elegir?
        </h2>
        <p style={{ fontSize: 15, color: "#475569", marginBottom: 20 }}>
          Ingresá tus gastos mensuales y calculamos cuál te ahorra más plata.
        </p>
        <a href="/" style={{
          display: "inline-block",
          background: "#0a7c4e", color: "white",
          padding: "14px 32px", borderRadius: 12,
          fontSize: 15, fontWeight: 700, textDecoration: "none"
        }}>
          Calcular mi ahorro →
        </a>
      </div>

    </main>
  )
}
