"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

/**
 * Wrapper global: Navbar en todas las páginas.
 * Footer solo en páginas internas (home tiene su propio footer oscuro).
 */
export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === "/"

  return (
    <>
      <Navbar />
      {children}
      {!isHome && <Footer />}
    </>
  )
}
