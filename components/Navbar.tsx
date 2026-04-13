'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { href: '/tarjetas',  label: 'Tarjetas'  },
  { href: '/nafta',     label: 'Nafta'     },
  { href: '/articulos', label: 'Artículos' },
  { href: '/contacto',  label: 'Contacto'  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  function isActive(href: string) {
    // En home (/) Tarjetas aparece como activo
    if (href === '/tarjetas') return pathname === '/' || pathname.startsWith('/tarjetas')
    return pathname.startsWith(href)
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, height: 64,
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '0 24px',
        height: '100%', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: 16,
      }}>

        {/* Logo */}
        <Link href="/" style={{
          textDecoration: 'none', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.03em' }}>
            <span style={{ color: '#10b981' }}>r</span>
            <span style={{ color: '#111827' }}>ateargy</span>
          </span>
          <span style={{
            display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
            background: '#10b981', animation: 'navbar-pulse 2s ease-in-out infinite',
          }} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                className={active ? '' : 'navbar-link'}
                style={{
                  textDecoration: 'none', padding: '6px 13px', borderRadius: 8,
                  fontSize: 14, fontWeight: active ? 600 : 500,
                  color: active ? '#059669' : '#6b7280',
                  background: active ? 'rgba(16,185,129,0.08)' : 'transparent',
                  transition: 'color 0.15s, background 0.15s',
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Live badge — desktop */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: '#10b981',
            display: 'inline-block', animation: 'navbar-pulse 2s ease-in-out infinite',
          }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Actualizado lunes</span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{
            padding: 8, background: 'none', border: 'none',
            cursor: 'pointer', color: '#6b7280',
            display: 'flex', alignItems: 'center',
          }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          borderTop: '1px solid rgba(0,0,0,0.06)',
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          padding: '8px 24px 16px',
        }}>
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: 'block', padding: '12px 4px',
                  fontSize: 15, fontWeight: active ? 600 : 500,
                  color: active ? '#059669' : '#374151',
                  textDecoration: 'none',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
