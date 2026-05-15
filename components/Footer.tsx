import Link from 'next/link'

type FooterLink = { label: string; href: string }

const COL_HERRAMIENTAS: FooterLink[] = [
  { label: 'Comparador de tarjetas', href: '/tarjetas' },
  { label: 'Calculadora de nafta', href: '/nafta' },
  { label: 'Guías financieras', href: '/articulos' },
]

const COL_GUIAS: FooterLink[] = [
  { label: 'Cómo elegir tu tarjeta', href: '/articulos/como-elegir-tarjeta-de-credito-argentina-2026' },
  { label: '7 errores al elegir tarjeta', href: '/articulos/errores-comunes-al-elegir-tarjeta-argentina' },
  { label: 'Cómo funciona el ranking', href: '/articulos/como-funciona-el-ranking-de-rateargy' },
]

const COL_EMPRESA: FooterLink[] = [
  { label: 'Metodología', href: '/metodologia' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Términos y privacidad', href: '/terminos' },
]

const COLUMNS = [
  { title: 'Herramientas', links: COL_HERRAMIENTAS },
  { title: 'Guías', links: COL_GUIAS },
  { title: 'rateargy', links: COL_EMPRESA },
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
            <Link href="/terminos" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Términos y privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
