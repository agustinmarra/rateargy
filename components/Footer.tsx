import Link from 'next/link'

const COL_TARJETAS = [
  { label: 'Comparar tarjetas', href: '/tarjetas' },
  { label: 'Sin costo anual', href: '/tarjetas?perfil=sin-costo' },
  { label: 'Mejores para viajes', href: '/tarjetas?perfil=viajes' },
  { label: 'Día a día', href: '/tarjetas?perfil=dia-a-dia' },
  { label: 'Con cuotas sin interés', href: '/tarjetas?perfil=cuotas' },
]

const COL_CUENTAS = [
  { label: 'Comparar cuentas', href: '/cuentas' },
  { label: 'Billeteras virtuales', href: '/billeteras' },
  { label: 'Sin costo mensual', href: '/cuentas?filtro=sin-costo' },
  { label: 'Con rendimiento', href: '/cuentas?filtro=rendimiento' },
  { label: 'Bancos digitales', href: '/cuentas?filtro=digital' },
]

const COL_PRESTAMOS = [
  { label: 'Comparar préstamos', href: '/prestamos' },
  { label: 'Aprobación rápida', href: '/prestamos?filtro=rapido' },
  { label: '100% online', href: '/prestamos?filtro=digital' },
  { label: 'Bancos estatales', href: '/prestamos?filtro=estado' },
  { label: 'Mayor plazo', href: '/prestamos?filtro=mayor-plazo' },
]

const COL_SEGUROS = [
  { label: 'Comparar seguros', href: '/seguros' },
  { label: 'Seguro todo riesgo', href: '/seguros?tipo=todo-riesgo' },
  { label: 'Terceros completo', href: '/seguros?tipo=terceros' },
  { label: 'Más económico', href: '/seguros?tipo=terceros' },
  { label: 'Cotizar seguro', href: '/seguros' },
]

const COL_INVERSIONES = [
  { label: 'Comparar inversiones', href: '/inversiones' },
  { label: 'Plazos fijos', href: '/inversiones' },
  { label: 'Fondos de inversión', href: '/inversiones' },
  { label: 'Criptomonedas', href: '/inversiones' },
  { label: 'Dólar blue hoy', href: '/' },
]

const COL_EMPRESA = [
  { label: 'Sobre rateargy', href: '/nosotros' },
  { label: 'Cómo funcionamos', href: '/como-funcionamos' },
  { label: 'Blog financiero', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Prensa', href: '/prensa' },
]

const COLUMNS = [
  { title: 'Tarjetas de crédito', links: COL_TARJETAS },
  { title: 'Cuentas y billeteras', links: COL_CUENTAS },
  { title: 'Préstamos', links: COL_PRESTAMOS },
  { title: 'Seguros', links: COL_SEGUROS },
  { title: 'Inversiones', links: COL_INVERSIONES },
  { title: 'Sobre rateargy', links: COL_EMPRESA },
]

export default function Footer() {
  return (
    <footer className="bg-[#f7f8fa] border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* Brand row */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-10 pb-8 border-b border-[#e5e7eb]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#008000] flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">R</span>
              </div>
              <span className="font-extrabold text-lg text-[#1a1a1a] tracking-tight">
                rate<span className="text-[#008000]">argy</span>
              </span>
            </Link>
            <p className="text-[#6b7280] text-sm leading-relaxed">
              El comparador de productos financieros más completo de Argentina. Gratis, independiente y actualizado diariamente.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['/tarjetas', '/cuentas', '/prestamos', '/seguros', '/inversiones'].map((href) => {
              const labels: Record<string, string> = {
                '/tarjetas': 'Tarjetas',
                '/cuentas': 'Cuentas',
                '/prestamos': 'Préstamos',
                '/seguros': 'Seguros',
                '/inversiones': 'Inversiones',
              }
              return (
                <Link
                  key={href}
                  href={href}
                  className="px-4 py-2 rounded-full border border-[#e5e7eb] text-sm font-medium text-[#6b7280] hover:border-[#86efac] hover:text-[#1a1a1a] transition-colors bg-white"
                >
                  {labels[href]}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-[#1a1a1a] text-xs uppercase tracking-wide mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-[#6b7280] text-sm hover:text-[#1a1a1a] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-[#e5e7eb] pt-6 space-y-3">
          <p className="text-xs text-[#9ca3af] leading-relaxed max-w-3xl">
            <strong className="text-[#6b7280]">Aviso de afiliados:</strong> rateargy puede recibir
            una comisión cuando accedés a un producto a través de nuestros links. Esto no afecta
            nuestras evaluaciones ni rankings, elaborados de forma independiente. Los datos son
            referenciales — verificá las condiciones con la entidad financiera antes de decidir.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-[#9ca3af]">
              © {new Date().getFullYear()} rateargy. Todos los derechos reservados. No somos una entidad financiera regulada.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/terminos" className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                Términos y condiciones
              </Link>
              <Link href="/privacidad" className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                Política de privacidad
              </Link>
              <Link href="/afiliados" className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors">
                Política de afiliados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
