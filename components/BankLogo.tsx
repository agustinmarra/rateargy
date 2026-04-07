'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BankConfig {
  imgUrl?: string
  color: string
  textColor: string
  displayName: string
}

// Mapa de configuración por banco.
// imgUrl: logo de alta calidad del sitio oficial.
// color/textColor: branding de la marca para el fallback.
const BANK_CONFIGS: Record<string, BankConfig> = {
  'Mercado Pago': {
    imgUrl: 'https://http2.mlstatic.com/frontend-assets/mp-web-navigation/ui-navigation/5.21.22/mercadopago/logo__large@2x.png',
    color: '#009ee3', textColor: 'white', displayName: 'Mercado Pago',
  },
  'Banco Galicia': {
    imgUrl: 'https://www.galicia.ar/images/logo-galicia.svg',
    color: '#0072BC', textColor: 'white', displayName: 'Galicia',
  },
  'BBVA Argentina': {
    imgUrl: 'https://www.bbva.com.ar/content/dam/public-web/argentina/images/logos/logo-bbva.svg',
    color: '#004481', textColor: 'white', displayName: 'BBVA',
  },
  'Naranja X': {
    color: '#FF6200', textColor: 'white', displayName: 'Naranja X',
  },
  'Ualá': {
    color: '#7B2D8B', textColor: 'white', displayName: 'Ualá',
  },
  'American Express': {
    color: '#006FCF', textColor: 'white', displayName: 'Amex',
  },
  'ICBC Argentina': {
    color: '#C8102E', textColor: 'white', displayName: 'ICBC',
  },
  'HSBC Argentina': {
    color: '#DB0011', textColor: 'white', displayName: 'HSBC',
  },
  'Banco Macro': {
    color: '#FFB81C', textColor: '#1a1a1a', displayName: 'Macro',
  },
  'Santander Argentina': {
    color: '#EC0000', textColor: 'white', displayName: 'Santander',
  },
  'Banco Provincia': {
    color: '#006837', textColor: 'white', displayName: 'Bco. Provincia',
  },
  'Lemon Cash': {
    color: '#F7B733', textColor: '#1a1a1a', displayName: 'Lemon',
  },
  'Brubank': {
    color: '#00A3E0', textColor: 'white', displayName: 'Brubank',
  },
  'Personal Pay': {
    color: '#00B4E1', textColor: 'white', displayName: 'Personal Pay',
  },
  'Banco Nación': {
    color: '#003F80', textColor: 'white', displayName: 'BNA',
  },
  'MODO': {
    color: '#FF4B4B', textColor: 'white', displayName: 'MODO',
  },
  'Sancor Seguros': {
    color: '#0066CC', textColor: 'white', displayName: 'Sancor',
  },
  'Galicia Seguros': {
    color: '#0072BC', textColor: 'white', displayName: 'Galicia Seg.',
  },
  'Mercado Seguros': {
    color: '#009ee3', textColor: 'white', displayName: 'MP Seguros',
  },
  'Zurich Argentina': {
    color: '#003DA5', textColor: 'white', displayName: 'Zurich',
  },
  'La Caja': {
    color: '#CC0000', textColor: 'white', displayName: 'La Caja',
  },
  'MAPFRE Argentina': {
    color: '#EE2429', textColor: 'white', displayName: 'MAPFRE',
  },
  'Federación Patronal': {
    color: '#006633', textColor: 'white', displayName: 'Fed. Patronal',
  },
}

const DEFAULT_CONFIG: BankConfig = {
  color: '#6b7280', textColor: 'white', displayName: '',
}

interface BankLogoProps {
  name: string
  size?: number
  className?: string
}

export default function BankLogo({ name, size = 48, className = '' }: BankLogoProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const config = BANK_CONFIGS[name] ?? { ...DEFAULT_CONFIG, displayName: name }

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    minWidth: size,
    flexShrink: 0,
  }

  // ── Logo con imagen real ──
  if (config.imgUrl && !imgFailed) {
    return (
      <div
        className={`rounded-lg overflow-hidden bg-white border border-[#e5e7eb] flex items-center justify-center p-1.5 ${className}`}
        style={containerStyle}
        title={name}
      >
        <Image
          src={config.imgUrl}
          alt={name}
          width={size - 12}
          height={size - 12}
          className="object-contain w-full h-full"
          onError={() => setImgFailed(true)}
          unoptimized
        />
      </div>
    )
  }

  // ── Fallback: nombre del banco con color de marca ──
  // Texto bold con el color del banco sobre fondo blanco — se ve más profesional.
  const fontSize = size <= 32 ? 9 : size <= 48 ? 11 : 13

  return (
    <div
      className={`rounded-lg border flex items-center justify-center px-1 ${className}`}
      style={{
        ...containerStyle,
        background: '#fff',
        borderColor: config.color + '40',
      }}
      title={name}
    >
      <span
        className="font-extrabold leading-tight text-center"
        style={{
          color: config.color,
          fontSize,
          lineHeight: 1.2,
          wordBreak: 'break-word',
          textAlign: 'center',
          maxWidth: size - 8,
        }}
      >
        {config.displayName}
      </span>
    </div>
  )
}
