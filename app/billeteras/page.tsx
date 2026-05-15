import type { Metadata } from "next"
import BilleterasCalculadora from "./BilleterasCalculadora"

export const metadata: Metadata = {
  title: "Billeteras digitales Argentina 2026: cuál paga más | rateargy",
  description: "Compará las tasas de cuentas remuneradas de Brubank, Ualá, Naranja X, Mercado Pago y más. Calculá cuánto ganás por mes según tu saldo.",
  openGraph: {
    title: "Billeteras digitales — ¿cuál paga más? | rateargy",
    description: "Comparador de cuentas remuneradas Argentina 2026",
  },
}

const BILLETERAS_INFO = [
  { nombre: "Brubank", tna: "36% / 24%", descripcion: "Tasa escalonada. La más alta del mercado para saldos hasta $750.000." },
  { nombre: "Ualá", tna: "hasta 27%", descripcion: "Tasa progresiva según nivel de actividad mensual en la plataforma." },
  { nombre: "Naranja X", tna: "21%", descripcion: "Tasa fija para saldos en cuenta. También ofrece 'Frascos' para ahorro a mayor plazo." },
  { nombre: "Mercado Pago", tna: "~25%", descripcion: "Rinde a través de FCI (Fondo Común de Inversión). La tasa varía diariamente." },
  { nombre: "Personal Pay", tna: "~18%", descripcion: "Billetera de Telecom. Tarjeta prepaga Visa, no de crédito. Rinde vía FCI." },
]

export default function BilleterasPage() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 96px" }}>

      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
        <a href="/" style={{ color: "#0a7c4e", textDecoration: "none" }}>rateargy</a>
        <span>›</span>
        <span>Billeteras</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>
          Actualizado mayo 2026
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
          ¿Cuál billetera digital<br />paga más en Argentina?
        </h1>
        <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, maxWidth: 580 }}>
          Las cuentas remuneradas de Brubank, Ualá, Naranja X y Mercado Pago compiten por ofrecerte la mayor tasa.
          Calculá cuánto ganás por mes según tu saldo.
        </p>
      </div>

      {/* Calculadora interactiva */}
      <BilleterasCalculadora />

      {/* Guía rápida */}
      <section style={{ marginTop: 60 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Cómo funciona cada una</h2>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
          No todas las billeteras remunera de la misma forma. La diferencia entre FCI y cuenta propia puede importar.
        </p>
        <div style={{ display: "grid", gap: 12 }}>
          {BILLETERAS_INFO.map((b) => (
            <div key={b.nombre} style={{ background: "#f8fafc", borderRadius: 12, padding: "16px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ minWidth: 80 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#059669" }}>{b.tna}</div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" }}>TNA ref.</div>
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 3 }}>{b.nombre}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{b.descripcion}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Conceptos clave */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 20 }}>¿FCI o cuenta propia?</h2>
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "20px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Cuenta remunerada propia</div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>
              La billetera paga una tasa fija sobre tu saldo. Es más predecible: sabés cuánto vas a ganar.
              Brubank, Ualá y Naranja X usan este modelo.
            </p>
          </div>
          <div style={{ background: "white", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "20px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Fondo Común de Inversión (FCI)</div>
            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, margin: 0 }}>
              Tu saldo se invierte en un fondo de money market. El rendimiento varía diariamente según el mercado.
              Mercado Pago y Personal Pay usan este esquema.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div style={{ marginTop: 48, padding: "28px 24px", background: "#f0fdf4", borderRadius: 16, border: "1px solid #bbf7d0" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>
          ¿También querés optimizar tu tarjeta de crédito?
        </div>
        <p style={{ fontSize: 14, color: "#475569", marginBottom: 16 }}>
          La billetera te hace ganar en el dinero parado. La tarjeta te hace ahorrar en cada compra. Combinadas, el impacto es mayor.
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
