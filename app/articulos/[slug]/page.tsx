import { getAllArticulos, getArticuloBySlug } from "@/lib/articulos"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import type { Metadata } from "next"

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Static generation ────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return getAllArticulos().map((a) => ({ slug: a.slug }))
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const articulo = getArticuloBySlug(slug)
  if (!articulo) return {}
  const { frontmatter: f } = articulo
  return {
    title: `${f.title} | rateargy`,
    description: f.description,
    openGraph: {
      title: f.title,
      description: f.description,
      type: "article",
      locale: "es_AR",
      publishedTime: f.publishedAt,
      modifiedTime: f.updatedAt,
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const articulo = getArticuloBySlug(slug)
  if (!articulo) notFound()

  const { frontmatter: f, content } = articulo
  const cat = CAT_COLORS[f.category] ?? { bg: "#f3f4f6", text: "#6b7280" }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: f.title,
    description: f.description,
    datePublished: f.publishedAt,
    dateModified: f.updatedAt ?? f.publishedAt,
    author: {
      "@type": "Organization",
      name: "rateargy",
      url: "https://www.rateargy.ar",
    },
    publisher: {
      "@type": "Organization",
      name: "rateargy",
      url: "https://www.rateargy.ar",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Breadcrumb */}
        <nav style={{
          fontSize: 13, color: "#94a3b8", marginBottom: 32,
          display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const,
        }}>
          <a href="/" style={{ color: "#0a7c4e", textDecoration: "none", fontWeight: 600 }}>rateargy</a>
          <span>›</span>
          <a href="/articulos" style={{ color: "#0a7c4e", textDecoration: "none", fontWeight: 600 }}>Artículos</a>
          <span>›</span>
          <span style={{ color: "#64748b" }}>{f.title}</span>
        </nav>

        {/* Header */}
        <header style={{ marginBottom: 40 }}>
          {f.coverEmoji && (
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: cat.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, marginBottom: 24,
            }}>
              {f.coverEmoji}
            </div>
          )}

          {/* Meta row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            flexWrap: "wrap" as const, marginBottom: 16,
          }}>
            <span style={{
              background: cat.bg, color: cat.text,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase" as const,
              padding: "4px 10px", borderRadius: 999,
            }}>
              {f.category}
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {f.readTime} min de lectura
            </span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>·</span>
            <span style={{ fontSize: 13, color: "#94a3b8" }}>
              {formatDate(f.publishedAt)}
            </span>
            {f.updatedAt && f.updatedAt !== f.publishedAt && (
              <>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>·</span>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>
                  Actualizado {formatDate(f.updatedAt)}
                </span>
              </>
            )}
          </div>

          <h1 style={{
            fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900,
            color: "#0f172a", letterSpacing: "-0.03em",
            lineHeight: 1.15, margin: "0 0 16px",
          }}>
            {f.title}
          </h1>

          <p style={{
            fontSize: 18, color: "#475569", lineHeight: 1.7,
            margin: 0, borderLeft: "3px solid #10b981", paddingLeft: 16,
          }}>
            {f.description}
          </p>
        </header>

        {/* MDX content */}
        <div className="mdx-prose">
          <MDXRemote source={content} />
        </div>

        {/* CTA final */}
        <div style={{
          marginTop: 56, background: "#0f172a",
          borderRadius: 20, padding: "32px 36px", textAlign: "center",
        }}>
          <div style={{
            fontSize: 20, fontWeight: 900, color: "white",
            marginBottom: 8, letterSpacing: "-0.03em",
          }}>
            Calculá cuánto ahorrás en tarjetas
          </div>
          <p style={{
            fontSize: 14, color: "rgba(255,255,255,0.6)",
            marginBottom: 24, maxWidth: 400, marginLeft: "auto", marginRight: "auto",
          }}>
            Ingresá tus gastos y te mostramos qué tarjeta te conviene según tu perfil real.
          </p>
          <a
            href="/"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white", padding: "13px 28px", borderRadius: 12,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
            }}
          >
            Ir al comparador →
          </a>
        </div>

        {/* Nav footer */}
        <div style={{
          marginTop: 32, display: "flex",
          justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap" as const, gap: 12,
        }}>
          <a href="/articulos" style={{
            color: "#0a7c4e", fontSize: 14, fontWeight: 600, textDecoration: "none",
          }}>
            ← Ver todos los artículos
          </a>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
            Información orientativa · Verificá siempre con la entidad financiera.
          </p>
        </div>

      </main>

      {/* Prose styles para el contenido MDX */}
      <style>{`
        .mdx-prose {
          font-size: 16px;
          line-height: 1.8;
          color: #374151;
        }
        .mdx-prose h2 {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.025em;
          margin: 40px 0 14px;
          line-height: 1.25;
        }
        .mdx-prose h3 {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
          margin: 28px 0 10px;
          line-height: 1.3;
        }
        .mdx-prose p {
          margin: 0 0 20px;
        }
        .mdx-prose ul, .mdx-prose ol {
          margin: 0 0 20px;
          padding-left: 24px;
        }
        .mdx-prose li {
          margin-bottom: 8px;
        }
        .mdx-prose strong {
          font-weight: 700;
          color: #111827;
        }
        .mdx-prose a {
          color: #059669;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .mdx-prose a:hover {
          color: #047857;
        }
        .mdx-prose blockquote {
          border-left: 3px solid #10b981;
          padding-left: 16px;
          margin: 24px 0;
          color: #475569;
          font-style: italic;
        }
        .mdx-prose code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
          font-family: ui-monospace, monospace;
          color: #0f172a;
        }
        .mdx-prose pre {
          background: #0f172a;
          color: #e2e8f0;
          padding: 20px 24px;
          border-radius: 12px;
          overflow-x: auto;
          margin: 24px 0;
          font-size: 14px;
        }
        .mdx-prose pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }
        .mdx-prose hr {
          border: none;
          border-top: 1px solid #f1f5f9;
          margin: 32px 0;
        }
      `}</style>
    </>
  )
}
