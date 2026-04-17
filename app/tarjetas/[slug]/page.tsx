import { TARJETAS_PUBLICAS, CATS, type Tarjeta, type CatKey } from "@/components/tarjetas-data"
import { BancoLogo } from "@/components/BancoLogo"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatARS = (n: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency", currency: "ARS", maximumFractionDigits: 0,
  }).format(n)

const CAT_ICONO: Record<string, string> = {
  super: "🛒", nafta: "⛽", farmacia: "💊",
  delivery: "🍽️", online: "📦", servicios: "💡",
}

const CAT_LABELS_ES: Record<string, string> = {
  super: "supermercados", nafta: "nafta y combustible",
  farmacia: "farmacias y salud", delivery: "restaurantes y delivery",
  online: "compras online", servicios: "servicios del hogar",
}

const INGRESO_ESTIMADO: Record<string, string> = {
  "galicia-eminent": "Más de $1.500.000/mes",
  "galicia-gold":    "$800.000 – $1.500.000/mes",
  "santander-gold":  "$400.000 – $800.000/mes",
  "macro-visa":      "$400.000 – $800.000/mes",
  "macro-platinum":  "$800.000 – $1.500.000/mes",
  "bna-gold":        "$400.000 – $800.000/mes",
  "supervielle":     "$400.000 – $800.000/mes",
  "icbc-platinum":   "$800.000 – $1.500.000/mes",
  "uala":            "Hasta $400.000/mes",
  "mercado-pago":    "Hasta $400.000/mes",
  "personal-pay":    "Hasta $400.000/mes",
  "credicoop":       "$400.000 – $800.000/mes",
  "patagonia":       "$400.000 – $800.000/mes",
  "cuenta-dni":      "Hasta $400.000/mes",
  "brubank":         "$800.000 – $1.500.000/mes",
  "hipotecario":     "$400.000 – $800.000/mes",
}

function getBeneficiosActivos(t: Tarjeta) {
  return CATS.filter(c => (t.beneficios[c.key]?.pct ?? 0) > 0)
}

function getValoracion(t: Tarjeta): { stars: number; label: string } {
  const n = getBeneficiosActivos(t).length
  const maxPct = Math.max(0, ...Object.values(t.beneficios).map(b => b?.pct ?? 0))
  if (n === 0)                        return { stars: 2, label: "Básica" }
  if (n === 1 && maxPct < 20)         return { stars: 3, label: "Buena" }
  if (n === 1)                        return { stars: 3, label: "Buena" }
  if (n >= 2 && maxPct >= 25)         return { stars: 4, label: "Muy buena" }
  return                                     { stars: 4, label: "Muy buena" }
}

function getCatPrincipal(t: Tarjeta) {
  let best: { key: CatKey; label: string; pct: number; tope: number } | null = null
  for (const c of CATS) {
    const b = t.beneficios[c.key]
    if (!b?.pct) continue
    if (!best || b.pct * b.tope > best.pct * best.tope) {
      best = { key: c.key, label: CAT_LABELS_ES[c.key] ?? c.key, pct: b.pct, tope: b.tope }
    }
  }
  return best
}

function getPros(t: Tarjeta): string[] {
  const pros: string[] = []
  if (t.costoAnual === 0) pros.push("Sin costo anual de mantenimiento")
  const sb = t.beneficios.super
  const nb = t.beneficios.nafta
  const fb = t.beneficios.farmacia
  const db = t.beneficios.delivery
  if (sb?.pct > 0) {
    const lugar = sb.lugar ? ` en ${sb.lugar.split(" / ")[0]}` : ""
    pros.push(`${sb.pct}% de reintegro en supermercados${lugar}`)
  }
  if (nb?.pct > 0) pros.push(`${nb.pct}% de descuento en nafta y combustible`)
  if (fb?.pct > 0) pros.push(`${fb.pct}% en farmacias adheridas`)
  if (db?.pct > 0) pros.push(`${db.pct}% en restaurantes y delivery`)
  if (pros.length < 2) pros.push("Solicitud y gestión 100% digital")
  if (pros.length < 3) pros.push("Cuotas sin interés en comercios adheridos")
  return pros.slice(0, 3)
}

function getContras(t: Tarjeta): string[] {
  const contras: string[] = []
  const ingreso = INGRESO_ESTIMADO[t.id] ?? ""
  if (ingreso.startsWith("Más de"))         contras.push("Requiere ingresos muy altos para ser aprobada")
  else if (ingreso.includes("800"))         contras.push("Requiere perfil de ingresos medios-altos")
  const activos = getBeneficiosActivos(t)
  const hasDias = activos.some(c => (t.beneficios[c.key]?.dias ?? "").length > 0)
  if (hasDias)                              contras.push("Descuentos válidos solo ciertos días de la semana")
  if (activos.length <= 1)                  contras.push("Cobertura de beneficios limitada a pocos rubros")
  if (contras.length < 3) contras.push("Los topes de reintegro pueden quedarse cortos en consumos altos")
  if (contras.length < 3) contras.push("Algunos beneficios requieren activación desde la app del banco")
  return contras.slice(0, 3)
}

function getAlternativas(t: Tarjeta): Tarjeta[] {
  const activeCats = new Set(
    CATS.filter(c => (t.beneficios[c.key]?.pct ?? 0) > 0).map(c => c.key)
  )
  const pool = TARJETAS_PUBLICAS.filter(o => o.id !== t.id)
  if (activeCats.size === 0) return pool.slice(0, 3)
  return pool
    .map(o => ({
      tarjeta: o,
      score: CATS.filter(c => activeCats.has(c.key) && (o.beneficios[c.key]?.pct ?? 0) > 0).length,
    }))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(x => x.tarjeta)
}

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return TARJETAS_PUBLICAS.map(t => ({ slug: t.id }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const t = TARJETAS_PUBLICAS.find(t => t.id === params.slug)
  if (!t) return {}
  const cat = getCatPrincipal(t)
  const extra = cat ? `${cat.pct}% en ${cat.label}. ` : ""
  return {
    title: `Tarjeta ${t.nombre} — Review y beneficios 2026 | rateargy`,
    description: `Review completa de la ${t.nombre} de ${t.banco}. ${extra}Sin costo anual. Calculá cuánto ahorrás según tu perfil de gasto.`,
    openGraph: {
      title: `${t.nombre} — Review y beneficios 2026`,
      description: `Beneficios, descuentos y análisis completo de la ${t.nombre} de ${t.banco}.`,
      locale: "es_AR",
      type: "article",
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TarjetaPage({ params }: { params: { slug: string } }) {
  const t = TARJETAS_PUBLICAS.find(t => t.id === params.slug)
  if (!t) notFound()

  const activos    = getBeneficiosActivos(t)
  const valoracion = getValoracion(t)
  const catPrinc   = getCatPrincipal(t)
  const pros       = getPros(t)
  const contras    = getContras(t)
  const alts       = getAlternativas(t)
  const ingreso    = INGRESO_ESTIMADO[t.id] ?? "A consultar con el banco"

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: t.nombre,
    description: `Tarjeta de crédito ${t.nombre} de ${t.banco}. Red ${t.red}.${catPrinc ? ` ${catPrinc.pct}% en ${catPrinc.label}.` : ""}`,
    brand: { "@type": "Organization", name: t.banco },
    offers: {
      "@type": "Offer",
      price: t.costoAnual,
      priceCurrency: "ARS",
      availability: "https://schema.org/InStock",
    },
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(valoracion.stars),
        bestRating: "5",
        worstRating: "1",
      },
      author: { "@type": "Organization", name: "rateargy" },
      datePublished: "2026-04-17",
      reviewBody: `La ${t.nombre} de ${t.banco} ofrece ${activos.length} beneficio${activos.length !== 1 ? "s" : ""} activo${activos.length !== 1 ? "s" : ""}.${catPrinc ? ` Destaca por sus ${catPrinc.pct}% en ${catPrinc.label} con tope de ${formatARS(catPrinc.tope)}/mes.` : ""}`,
    },
  }

  // Estrellitas (5 posiciones)
  const Stars = ({ n }: { n: number }) => (
    <span style={{ letterSpacing: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < n ? "#f59e0b" : "#e2e8f0", fontSize: 18 }}>★</span>
      ))}
    </span>
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* ── Breadcrumb ─────────────────────────────────────────────────── */}
        <nav style={{ fontSize: 13, color: "#94a3b8", marginBottom: 28, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <a href="/" style={{ color: "#0a7c4e", textDecoration: "none", fontWeight: 600 }}>rateargy</a>
          <span>›</span>
          <a href="/tarjetas" style={{ color: "#0a7c4e", textDecoration: "none", fontWeight: 600 }}>Tarjetas</a>
          <span>›</span>
          <span style={{ color: "#64748b" }}>{t.nombre}</span>
        </nav>

        {/* ── Header card ────────────────────────────────────────────────── */}
        <div style={{
          background: "white", border: "1px solid #f1f5f9", borderRadius: 20,
          padding: "28px 32px", marginBottom: 24,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>

            {/* Logo */}
            <BancoLogo banco={t.bancoId} size={64} />

            {/* Info */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                {t.banco} · {t.red}
              </div>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em", margin: "0 0 8px" }}>
                {t.nombre}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <Stars n={valoracion.stars} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{valoracion.label}</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>·</span>
                <span style={{ fontSize: 13, color: t.costoAnual === 0 ? "#059669" : "#374151", fontWeight: 600 }}>
                  {t.costoAnual === 0 ? "Sin costo anual" : `${formatARS(t.costoAnual)}/año`}
                </span>
              </div>
            </div>

            {/* Mini tarjeta + CTA */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 16, flexShrink: 0 }}>
              <div style={{
                width: 120, height: 76, borderRadius: 10,
                background: t.gradiente,
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                }} />
                <span style={{ position: "absolute", bottom: 6, left: 10, fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>
                  {t.red}
                </span>
              </div>
              {t.urlSolicitud && (
                <a
                  href={t.urlSolicitud}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#0a7c4e", color: "white",
                    padding: "10px 20px", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Solicitar en {t.banco} →
                </a>
              )}
            </div>
          </div>

          {/* Pills */}
          {t.pills.length > 0 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, paddingTop: 20, borderTop: "1px solid #f8fafc" }}>
              {t.pills.map(p => (
                <span key={p} style={{
                  background: "#f0fdf7", border: "1px solid #bbf7d0",
                  color: "#065f46", fontSize: 12, fontWeight: 600,
                  padding: "5px 12px", borderRadius: 999,
                }}>{p}</span>
              ))}
            </div>
          )}
        </div>

        {/* ── Resumen rápido ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.02em" }}>
            Resumen rápido
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12,
          }}>
            {[
              {
                label: "Costo anual",
                value: t.costoAnual === 0 ? "Sin costo" : formatARS(t.costoAnual),
                accent: t.costoAnual === 0,
              },
              {
                label: "Ingreso estimado",
                value: ingreso,
                accent: false,
              },
              {
                label: "Beneficios activos",
                value: `${activos.length} de ${CATS.length} rubros`,
                accent: activos.length > 0,
              },
              {
                label: "Valoración",
                value: valoracion.label,
                accent: true,
              },
            ].map(({ label, value, accent }) => (
              <div key={label} style={{
                background: "white", border: "1px solid #f1f5f9",
                borderRadius: 14, padding: "16px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                  {label}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: accent ? "#059669" : "#0f172a", letterSpacing: "-0.01em" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Beneficios vigentes ────────────────────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.02em" }}>
            Beneficios vigentes
          </h2>

          {activos.length === 0 ? (
            <div style={{
              background: "#f8fafc", border: "1px solid #e2e8f0",
              borderRadius: 14, padding: "24px 20px", textAlign: "center",
              color: "#94a3b8", fontSize: 14,
            }}>
              Estamos verificando los beneficios actuales. Revisá el sitio del banco para info actualizada.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {activos.map(cat => {
                const b = t.beneficios[cat.key]
                return (
                  <div key={cat.key} style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "16px 20px", background: "white",
                    border: "1px solid #f1f5f9", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
                  }}>
                    {/* Icono */}
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: "linear-gradient(135deg, #f0fdf7 0%, #dcfce7 100%)",
                      border: "1px solid #bbf7d0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontSize: 22,
                    }}>
                      {CAT_ICONO[cat.key] ?? "✨"}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 3, lineHeight: 1.5 }}>
                        {b.lugar && <span>{b.lugar}</span>}
                        {b.lugar && b.dias && <span> · </span>}
                        {b.dias && <span>{b.dias}</span>}
                        {(b.lugar || b.dias) && <span> · </span>}
                        <span>Tope {formatARS(b.tope)}/mes</span>
                      </div>
                      {b.descripcion && (
                        <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3 }}>{b.descripcion}</div>
                      )}
                    </div>

                    {/* Porcentaje */}
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 32, fontWeight: 900, color: "#059669", lineHeight: 1, letterSpacing: "-0.03em" }}>
                        {b.pct}%
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>descuento</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── ¿A quién le conviene? ──────────────────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.02em" }}>
            ¿A quién le conviene?
          </h2>
          <div style={{
            background: "linear-gradient(135deg, #f0fdf7 0%, #ffffff 100%)",
            border: "1.5px solid #bbf7d0", borderRadius: 16, padding: "24px 28px",
          }}>
            <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
              {catPrinc ? (
                <>
                  La <strong>{t.nombre}</strong> es una buena opción para quienes destinan más de{" "}
                  <strong>{formatARS(Math.round(catPrinc.tope / (catPrinc.pct / 100) * 0.5))}</strong> mensuales a{" "}
                  <strong>{catPrinc.label}</strong>
                  {t.beneficios[catPrinc.key]?.dias ? ` los ${t.beneficios[catPrinc.key].dias}` : ""}.
                  {" "}Con el tope de reintegro de <strong>{formatARS(catPrinc.tope)}/mes</strong>,
                  maximizás el beneficio cuando alcanzás ese nivel de gasto en esa categoría.
                </>
              ) : (
                <>
                  La <strong>{t.nombre}</strong> está orientada a clientes que buscan una tarjeta de respaldo
                  sin costo de mantenimiento, con acceso a cuotas sin interés y promociones puntuales.
                </>
              )}
            </div>
            <div style={{ marginTop: 16, fontSize: 12, color: "#94a3b8", fontStyle: "italic" }}>
              ✏️ Esta sección se edita manualmente para cada tarjeta. Contenido de referencia — próximamente revisión editorial.
            </div>
          </div>
        </section>

        {/* ── Pros y contras ─────────────────────────────────────────────── */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.02em" }}>
            Pros y contras
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

            {/* Pros */}
            <div style={{
              background: "white", border: "1px solid #dcfce7", borderRadius: 16, padding: "20px 24px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                ✓ Pros
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {pros.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                    <span style={{ color: "#10b981", flexShrink: 0, fontWeight: 700 }}>✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contras */}
            <div style={{
              background: "white", border: "1px solid #fce7f3", borderRadius: 16, padding: "20px 24px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e11d48", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 14 }}>
                ✗ Contras
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {contras.map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#374151", lineHeight: 1.5 }}>
                    <span style={{ color: "#f43f5e", flexShrink: 0, fontWeight: 700 }}>✗</span>
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Alternativas similares ─────────────────────────────────────── */}
        {alts.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 14, letterSpacing: "-0.02em" }}>
              Alternativas similares
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
              {alts.map(alt => {
                const altCat = getCatPrincipal(alt)
                return (
                  <a
                    key={alt.id}
                    href={`/tarjetas/${alt.id}`}
                    style={{
                      textDecoration: "none", color: "inherit",
                      display: "block", background: "white",
                      border: "1px solid #f1f5f9", borderRadius: 16, padding: "16px 18px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                      transition: "box-shadow 0.18s, transform 0.18s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    {/* Mini tarjeta visual */}
                    <div style={{
                      width: "100%", height: 48, borderRadius: 8,
                      background: alt.gradiente, marginBottom: 12,
                      boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                    }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <BancoLogo banco={alt.bancoId} size={24} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {alt.nombre}
                        </div>
                        <div style={{ fontSize: 11, color: "#64748b" }}>{alt.red}</div>
                      </div>
                    </div>
                    {altCat && (
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: "#059669",
                        background: "#f0fdf7", border: "1px solid #bbf7d0",
                        padding: "3px 8px", borderRadius: 6, display: "inline-block",
                      }}>
                        {altCat.pct}% {CAT_LABELS_ES[altCat.key] ?? altCat.key}
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          </section>
        )}

        {/* ── CTA final ──────────────────────────────────────────────────── */}
        <section style={{
          background: "#0f172a", borderRadius: 20, padding: "32px 36px",
          textAlign: "center", marginBottom: 32,
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "white", marginBottom: 8, letterSpacing: "-0.03em" }}>
            Calculá cuánto ahorrás con la {t.nombre}
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 24, maxWidth: 440, margin: "0 auto 24px" }}>
            Ingresá tus gastos reales y te mostramos exactamente qué posición ocupa esta tarjeta en tu ranking personal.
          </div>
          <a
            href={`/?tarjeta=${t.id}`}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white", padding: "14px 28px", borderRadius: 12,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
            }}
          >
            Ver mi ranking con {t.nombre.split(" ")[0]}
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ width: 16, height: 16 }}>
              <path d="M4 10h12M10 4l6 6-6 6" />
            </svg>
          </a>
        </section>

        {/* ── Navegación ─────────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <a href="/tarjetas" style={{ color: "#0a7c4e", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
            ← Ver todas las tarjetas
          </a>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
            Última verificación: abril 2026 · Los beneficios pueden cambiar sin previo aviso.
          </p>
        </div>

      </main>
    </>
  )
}
