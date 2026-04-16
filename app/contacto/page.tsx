"use client"

import { useState } from "react"

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" })
  const [enviado, setEnviado] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder: en producción conectar con servicio de email
    setEnviado(true)
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    padding: "14px 16px",
    background: "#f8fafc", border: "1.5px solid #e2e8f0",
    borderRadius: 12, fontSize: 15, color: "#0f172a", outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: "inherit",
  }

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, fontWeight: 600,
    color: "#374151", marginBottom: 8, letterSpacing: "0.02em",
  }

  return (
    <main style={{ minHeight: "calc(100vh - 64px)", background: "#ffffff" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px 120px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
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
            Contacto
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 900,
            letterSpacing: "-0.04em", color: "#0a0a0a",
            margin: "0 0 16px", lineHeight: 1.05,
          }}>
            Hablemos
          </h1>
          <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.75, margin: 0 }}>
            ¿Tenés una pregunta, sugerencia o querés colaborar?
            Te respondemos en menos de 48 horas.
          </p>
        </div>

        {enviado ? (
          <div style={{
            textAlign: "center", padding: "56px 40px",
            background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
            border: "1.5px solid rgba(16,185,129,0.25)",
            borderRadius: 24,
            boxShadow: "0 4px 20px rgba(16,185,129,0.1)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 12px" }}>
              ¡Mensaje enviado!
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", margin: 0, lineHeight: 1.7 }}>
              Gracias por escribirnos. Te respondemos a la brevedad.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fff",
              border: "1px solid #f3f4f6",
              borderRadius: 24,
              padding: "40px 36px",
              boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            {/* Nombre */}
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text" required placeholder="Tu nombre"
                value={form.nombre}
                onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc" }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email" required placeholder="tu@email.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc" }}
              />
            </div>

            {/* Mensaje */}
            <div>
              <label style={labelStyle}>Mensaje</label>
              <textarea
                required rows={5}
                placeholder="Contanos en qué podemos ayudarte..."
                value={form.mensaje}
                onChange={e => setForm(p => ({ ...p, mensaje: e.target.value }))}
                style={{ ...inputStyle, resize: "vertical", minHeight: 120 }}
                onFocus={e => { e.target.style.borderColor = "#10b981"; e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"; e.target.style.background = "#fff" }}
                onBlur={e => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc" }}
              />
            </div>

            {/* Botón */}
            <button
              type="submit"
              style={{
                width: "100%", height: 52,
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "#fff", border: "none", borderRadius: 14,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 6px 20px rgba(16,185,129,0.3)",
                transition: "box-shadow 0.2s, transform 0.1s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(16,185,129,0.4)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(16,185,129,0.3)"; (e.currentTarget as HTMLElement).style.transform = "none" }}
            >
              Enviar mensaje
            </button>

            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: 0 }}>
              O escribinos directo a{" "}
              <a href="mailto:contacto@rateargy.ar" style={{ color: "#059669", textDecoration: "none", fontWeight: 600 }}>
                contacto@rateargy.ar
              </a>
            </p>
          </form>
        )}

        {/* Info cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
          {[
            { icon: "⚡", label: "Respuesta rápida", desc: "Respondemos en menos de 48 horas." },
            { icon: "🔒", label: "Sin spam", desc: "Nunca compartimos tu email." },
          ].map(({ icon, label, desc }) => (
            <div key={label} style={{
              background: "#f8fafc", border: "1px solid #f3f4f6",
              borderRadius: 16, padding: "18px 20px",
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
