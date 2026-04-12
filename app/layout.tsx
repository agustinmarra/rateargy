import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/ClientShell'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'rateargy — Comparador de productos financieros de Argentina',
    template: '%s | rateargy',
  },
  description:
    'Comparamos tarjetas de crédito, cuentas bancarias, préstamos, seguros e inversiones para que tomés las mejores decisiones financieras en Argentina. 100% gratis.',
  keywords: [
    'tarjetas de crédito argentina',
    'comparar tarjetas',
    'préstamos personales',
    'cuentas bancarias',
    'inversiones argentina',
    'dólar blue',
    'finanzas personales',
  ],
  openGraph: {
    title: 'rateargy — Comparador de productos financieros',
    description: 'El comparador financiero #1 de Argentina',
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className="h-full antialiased">
      <body className={`min-h-full flex flex-col font-sans antialiased ${inter.variable}`}>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  )
}
