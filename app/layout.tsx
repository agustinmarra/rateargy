import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientShell from '@/components/ClientShell'
import { TARJETAS_PUBLICAS } from '@/components/tarjetas-data'

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
    `Comparamos tarjetas de crédito en Argentina para que tomés la mejor decisión financiera. ${TARJETAS_PUBLICAS.length} tarjetas. 100% gratis.`,
  keywords: [
    'tarjetas de crédito argentina',
    'comparar tarjetas',
    'mejor tarjeta de crédito',
    'ahorro tarjetas',
    'finanzas personales argentina',
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
