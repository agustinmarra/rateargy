import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, ChevronRight, Check, X } from 'lucide-react'
import { TARJETAS_MOCK } from '@/lib/data'
import { toSlug } from '@/lib/utils'
import BankLogo from '@/components/BankLogo'
import StarRating from '@/components/atoms/StarRating'
import Badge from '@/components/atoms/Badge'

// ── Static params para las 12 tarjetas ───────────────────────────────────────
export function generateStaticParams() {
  return TARJETAS_MOCK.map((card) => ({
    slug: toSlug(card.nombre + '-' + card.banco),
  }))
}

// ── Colores por banco (igual que CardItem) ────────────────────────────────────
const CARD_GRADIENT: Record<string, [string, string]> = {
  'ICBC Argentina':      ['#1a237e', '#283593'],
  'Banco Galicia':       ['#b71c1c', '#e53935'],
  'BBVA Argentina':      ['#004481', '#1565c0'],
  'American Express':    ['#006FCF', '#1976d2'],
  'HSBC Argentina':      ['#DB0011', '#c62828'],
  'Banco Macro':         ['#e65100', '#f57c00'],
  'Naranja X':           ['#FF6200', '#e64a19'],
  'Santander Argentina': ['#EC0000', '#b71c1c'],
  'Banco Provincia':     ['#006837', '#2e7d32'],
  'Ualá':               ['#7B2D8B', '#6a1b9a'],
  'Lemon Cash':          ['#c68b00', '#f9a825'],
  'Mercado Pago':        ['#009EE3', '#0277bd'],
}
const DEFAULT_GRADIENT: [string, string] = ['#1a5c38', '#2e7d32']

function CardVisualLarge({ banco, nombre, red }: { banco: string; nombre: string; red?: string }) {
  const [c1, c2] = CARD_GRADIENT[banco] ?? DEFAULT_GRADIENT
  return (
    <div
      className="relative rounded-2xl overflow-hidden mx-auto"
      style={{
        width: 320,
        height: 200,
        background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
        boxShadow: `0 20px 60px ${c1}60`,
      }}
    >
      <div className="absolute inset-0 opacity-15" style={{ background: 'linear-gradient(135deg, white 0%, transparent 55%)' }} />
      {/* Chip */}
      <div className="absolute top-5 left-5">
        <div className="w-11 h-8 rounded" style={{ background: 'linear-gradient(135deg, #FFD700, #B8860B)', opacity: 0.9 }} />
      </div>
      {/* Red */}
      {red && (
        <div className="absolute top-5 right-5">
          <span className="text-white/90 text-sm font-black tracking-widest">{red}</span>
        </div>
      )}
      {/* Número decorativo */}
      <div className="absolute bottom-12 left-5 right-5">
        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: '3px', fontFamily: 'monospace' }}>
          •••• •••• •••• ••••
        </span>
      </div>
      {/* Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>{banco}</div>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{nombre}</div>
      </div>
    </div>
  )
}

// ── Indicadores de perfil ─────────────────────────────────────────────────────
function perfilIdeal(card: (typeof TARJETAS_MOCK)[0]) {
  const b = card.beneficios.join(' ').toLowerCase()
  const items: { icon: string; label: string; match: boolean }[] = [
    { icon: '✈', label: 'Viajeros frecuentes', match: b.includes('vip') || b.includes('viaje') || b.includes('aeropuerto') },
    { icon: '🛒', label: 'Compras del día a día', match: b.includes('supermercado') || b.includes('cashback') || b.includes('combustible') },
    { icon: '💳', label: 'Sin costo anual', match: card.costo_mensual === 0 },
    { icon: '🏦', label: 'Cuotas sin interés', match: b.includes('cuota') || b.includes('interés') },
    { icon: '🌎', label: 'Compras en el exterior', match: b.includes('exterior') || b.includes('internacional') },
    { icon: '📱', label: 'Todo desde la app', match: b.includes('app') || b.includes('digital') || b.includes('online') },
  ]
  return items
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TarjetaDetailPage({ params }: { params: { slug: string } }) {
  const card = TARJETAS_MOCK.find(
    (c) => toSlug(c.nombre + '-' + c.banco) === params.slug
  )

  if (!card) notFound()

  const costoAnual = card.costo_mensual === 0
    ? 'Sin cargo anual'
    : `$${(card.costo_mensual * 12).toLocaleString('es-AR')}/año`

  const perfil = perfilIdeal(card)

  return (
    <div className="min-h-screen bg-[#f7f8fa]">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-[#9ca3af] mb-6">
            <Link href="/" className="hover:text-[#1a1a1a] transition-colors">Inicio</Link>
            <ChevronRight size={13} />
            <Link href="/tarjetas" className="hover:text-[#1a1a1a] transition-colors">Tarjetas de crédito</Link>
            <ChevronRight size={13} />
            <span className="text-[#6b7280] truncate">{card.nombre}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Left: card + stats */}
            <div className="flex-1 min-w-0">
              {/* Identity */}
              <div className="flex items-center gap-3 mb-4">
                <BankLogo name={card.banco} size={48} />
                <div>
                  <p style={{ fontSize: 14, color: '#6b7280' }}>{card.banco}</p>
                  <h1 style={{ fontSize: 30, fontWeight: 900, color: '#1a1a1a', lineHeight: 1.1 }}>
                    {card.nombre}
                  </h1>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {card.tag && <Badge variant="green">{card.tag}</Badge>}
                {card.red && <Badge variant="blue">{card.red}</Badge>}
                {card.costo_mensual === 0 && <Badge variant="green">Sin costo anual</Badge>}
              </div>

              {/* Rating */}
              <div className="mb-4">
                <StarRating score={card.puntuacion} size={16} />
              </div>

              <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.6, maxWidth: 520 }}>
                {card.descripcion}
              </p>
            </div>

            {/* Right: card visual + CTA */}
            <div className="shrink-0 w-full lg:w-auto flex flex-col items-center gap-6">
              <CardVisualLarge banco={card.banco} nombre={card.nombre} red={card.red} />
              <a
                href={card.url_afiliado}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all"
                style={{ background: '#1a5c38', height: 54, fontSize: 16, width: 320 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
              >
                Solicitar ahora
                <ExternalLink size={16} />
              </a>
              <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', maxWidth: 280 }}>
                Serás redirigido al sitio oficial de {card.banco}. rateargy puede recibir una comisión.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contenido principal ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Columna principal ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Ficha rápida */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="px-6 py-4 border-b border-[#f3f4f6]" style={{ background: '#fafafa' }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>Ficha rápida</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-[#f3f4f6]">
                {[
                  { label: 'Costo anual', value: costoAnual },
                  { label: 'Beneficio principal', value: card.beneficio_principal ?? card.beneficios[0] },
                  { label: 'Cuotas sin interés', value: card.cuotas_sin_interes ?? 'Consultar' },
                  { label: 'Ingreso mínimo', value: card.ingreso_minimo ?? 'Consultar' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-4">
                    <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 6 }}>{label}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Beneficios completos */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 16 }}>
                Beneficios incluidos
              </h2>
              <ul className="space-y-3">
                {card.beneficios.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#f0fdf4', border: '1px solid #86efac' }}>
                      <Check size={11} className="text-[#008000]" />
                    </div>
                    <span style={{ fontSize: 15, color: '#374151', lineHeight: 1.5 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Para quién es ideal */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a', marginBottom: 4 }}>
                ¿Para quién es ideal esta tarjeta?
              </h2>
              <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 16 }}>
                Basado en los beneficios del producto, esta tarjeta es una buena opción para:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {perfilIdeal(card).map(({ icon, label, match }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{
                      background: match ? '#f0fdf4' : '#fafafa',
                      border: `1px solid ${match ? '#86efac' : '#f3f4f6'}`,
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{icon}</span>
                    <span style={{ fontSize: 14, fontWeight: match ? 600 : 400, color: match ? '#166534' : '#9ca3af' }}>
                      {label}
                    </span>
                    {match
                      ? <Check size={14} className="text-[#008000] ml-auto shrink-0" />
                      : <X size={14} className="text-[#d1d5db] ml-auto shrink-0" />
                    }
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-[#9ca3af] leading-relaxed">
              La información es referencial. Verificá las condiciones vigentes directamente con {card.banco} antes de solicitar la tarjeta. Algunas características pueden variar según tu perfil crediticio.
            </p>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────── */}
          <div className="w-full lg:w-72 shrink-0 space-y-5">

            {/* CTA sidebar */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BankLogo name={card.banco} size={32} />
                <div>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{card.banco}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>{card.nombre}</p>
                </div>
              </div>
              <div className="border-t border-[#f3f4f6] pt-3 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span style={{ fontSize: 13, color: '#6b7280' }}>Costo anual</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{costoAnual}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: 13, color: '#6b7280' }}>Red</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{card.red ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ fontSize: 13, color: '#6b7280' }}>Rating rateargy</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#008000' }}>{card.puntuacion.toFixed(1)} / 10</span>
                </div>
              </div>
              <a
                href={card.url_afiliado}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full flex items-center justify-center gap-2 rounded-lg font-bold text-white transition-colors"
                style={{ background: '#1a5c38', height: 48, fontSize: 14 }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#14532d' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#1a5c38' }}
              >
                Solicitar ahora
                <ExternalLink size={14} />
              </a>
              <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                en el sitio oficial de {card.banco}
              </p>
            </div>

            {/* Ver más tarjetas */}
            <div className="bg-white rounded-xl border border-[#e5e7eb] p-5" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', marginBottom: 12 }}>
                Otras tarjetas destacadas
              </h3>
              <div className="space-y-3">
                {TARJETAS_MOCK
                  .filter((c) => c.id !== card.id)
                  .slice(0, 3)
                  .map((other) => (
                    <Link
                      key={other.id}
                      href={`/tarjetas/${toSlug(other.nombre + '-' + other.banco)}`}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-[#f9fafb] transition-colors"
                    >
                      <BankLogo name={other.banco} size={32} />
                      <div className="min-w-0">
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }} className="truncate">{other.nombre}</p>
                        <p style={{ fontSize: 12, color: '#9ca3af' }}>{other.puntuacion.toFixed(1)} rateargy rating</p>
                      </div>
                    </Link>
                  ))}
              </div>
              <Link
                href="/tarjetas"
                className="block text-center mt-3 font-semibold hover:underline"
                style={{ fontSize: 13, color: '#008000' }}
              >
                Ver todas las tarjetas →
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
