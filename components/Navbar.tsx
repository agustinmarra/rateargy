'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/tarjetas', label: 'Tarjetas' },
  { href: '/articulos', label: 'Guías' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#e5e7eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded bg-[#008000] flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-base text-[#1a1a1a] tracking-tight">
              rate<span className="text-[#008000]">argy</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/tarjetas"
              className="px-4 py-1.5 rounded-md text-sm font-semibold text-white bg-[#008000] hover:bg-[#1a5c38] transition-colors"
            >
              Comparar tarjetas
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-1.5 text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#e5e7eb] bg-white px-4 py-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-2 py-2.5 text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 pb-1">
            <Link
              href="/tarjetas"
              className="block w-full text-center px-4 py-2 rounded-md text-sm font-semibold bg-[#008000] text-white"
              onClick={() => setOpen(false)}
            >
              Comparar tarjetas
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
