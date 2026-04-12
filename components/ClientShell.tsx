"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

/**
 * Wrapper que oculta Navbar / Footer en la landing (/).
 * El resto de las páginas internas los siguen recibiendo normalmente.
 */
export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <>
      {!isHome && <Navbar />}
      {children}
      {!isHome && <Footer />}
    </>
  )
}
