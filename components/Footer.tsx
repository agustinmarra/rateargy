import Link from 'next/link'

const LINKS = {
  Productos: [
    { label: 'Tarjetas de Crédito', href: '/tarjetas' },
    { label: 'Cuentas Bancarias', href: '/cuentas' },
    { label: 'Préstamos', href: '/prestamos' },
    { label: 'Seguros', href: '/seguros' },
    { label: 'Inversiones', href: '/inversiones' },
  ],
  Empresa: [
    { label: 'Sobre rateargy', href: '/nosotros' },
    { label: 'Blog', href: '/blog' },
    { label: 'Cómo funcionamos', href: '/como-funcionamos' },
    { label: 'Contacto', href: '/contacto' },
  ],
  Legal: [
    { label: 'Términos y condiciones', href: '/terminos' },
    { label: 'Política de privacidad', href: '/privacidad' },
    { label: 'Política de afiliados', href: '/afiliados' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#f7f8fa] border-t border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-[#1DB954] flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="font-bold text-base text-[#1a1a1a]">
                rate<span className="text-[#1DB954]">argy</span>
              </span>
            </div>
            <p className="text-[#6b7280] text-sm leading-relaxed max-w-xs">
              Comparador de productos financieros para Argentina. Gratis,
              independiente y siempre actualizado.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-[#1a1a1a] text-xs uppercase tracking-wide mb-3">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
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

        {/* Disclaimer + copyright */}
        <div className="border-t border-[#e5e7eb] pt-6 space-y-3">
          <p className="text-xs text-[#9ca3af] leading-relaxed max-w-3xl">
            <strong className="text-[#6b7280]">Aviso de afiliados:</strong> rateargy puede recibir
            una comisión cuando accedés a un producto a través de nuestros links. Esto no afecta
            nuestras evaluaciones ni rankings, elaborados de forma independiente. Los datos son
            referenciales — verificá las condiciones con la entidad financiera antes de decidir.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p className="text-xs text-[#9ca3af]">
              © {new Date().getFullYear()} rateargy. Todos los derechos reservados.
            </p>
            <p className="text-xs text-[#9ca3af]">
              No somos una entidad financiera. Información de carácter informativo.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
