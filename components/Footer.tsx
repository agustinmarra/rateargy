import Link from 'next/link'

type FooterLink = { label: string; href: string } | { label: string; href: null }

const COL_TARJETAS: FooterLink[] = [
  { label: 'Comparar tarjetas', href: '/tarjetas' },
  { label: 'Sin costo anual', href: '/tarjetas?perfil=sin-costo' },
  { label: 'Mejores para viajes', href: '/tarjetas?perfil=viajes' },
  { label: 'Día a día', href: '/tarjetas?perfil=dia-a-dia' },
  { label: 'Con cuotas sin interés', href: '/tarjetas?perfil=cuotas' },
]

const COL_RECURSOS: FooterLink[] = [
  { label: 'Guías financieras', href: '/articulos' },
  { label: 'Cómo elegir una tarjeta', href: '/articulos/como-elegir-tarjeta-de-credito-argentina-2026' },
  { label: 'Dólar MEP paso a paso', href: null },
  { label: 'MP vs Ualá', href: null },
]

const COL_EMPRESA: FooterLink[] = [
  { label: 'Sobre rateargy', href: null },
  { label: 'Metodología', href: null },
  { label: 'Contacto', href: '/contacto' },
]

const COLUMNS = [
  { title: 'Tarjetas de crédito', links: COL_TARJETAS },
  { title: 'Recursos', links: COL_RECURSOS },
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
              El comparador de tarjetas de crédito más completo de Argentina. Gratis, independiente y actualizado cada lunes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['/tarjetas', '/articulos'].map((href) => {
              const labels: Record<string, string> = {
                '/tarjetas': 'Tarjetas',
                '/articulos': 'Guías',
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
          {COLUMNS.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-semibold text-[#1a1a1a] text-xs uppercase tracking-wide mb-3">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="text-[#6b7280] text-sm hover:text-[#1a1a1a] transition-colors"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <span className="text-gray-400 text-sm cursor-default">
                        {link.label}
                      </span>
                    )}
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
              <span className="text-xs text-gray-400 cursor-default">
                Términos y condiciones
              </span>
              <span className="text-xs text-gray-400 cursor-default">
                Política de privacidad
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
