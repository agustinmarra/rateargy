'use client'

import { useState } from 'react'

interface BankConfig {
  imgUrl?: string
  imgFilter?: string   // CSS filter to colorize the SVG
  color: string
  textColor: string
  displayName: string
}

const BANK_CONFIGS: Record<string, BankConfig> = {
  // ── Con logo via SimpleIcons ──
  'Mercado Pago': {
    imgUrl: 'https://simpleicons.org/icons/mercadopago.svg',
    // Converts black SVG to #009EE3
    imgFilter: 'brightness(0) saturate(100%) invert(47%) sepia(92%) saturate(644%) hue-rotate(173deg) brightness(100%) contrast(102%)',
    color: '#009EE3', textColor: 'white', displayName: 'Mercado Pago',
  },

  // ── Texto bold con color de marca (más profesional que cuadrado) ──
  'Banco Galicia':       { color: '#E30613', textColor: 'white', displayName: 'Galicia' },
  'BBVA Argentina':      { color: '#004481', textColor: 'white', displayName: 'BBVA' },
  'Santander Argentina': { color: '#EC0000', textColor: 'white', displayName: 'Santander' },
  'Naranja X':           { color: '#FF6200', textColor: 'white', displayName: 'Naranja X' },
  'American Express':    { color: '#006FCF', textColor: 'white', displayName: 'Amex' },
  'ICBC Argentina':      { color: '#C8102E', textColor: 'white', displayName: 'ICBC' },
  'HSBC Argentina':      { color: '#DB0011', textColor: 'white', displayName: 'HSBC' },
  'Banco Macro':         { color: '#FFB81C', textColor: '#1a1a1a', displayName: 'Macro' },
  'Banco Provincia':     { color: '#006837', textColor: 'white', displayName: 'Bco. Pcia.' },
  'Ualá':               { color: '#7B2D8B', textColor: 'white', displayName: 'Ualá' },
  'Lemon Cash':          { color: '#F7B733', textColor: '#1a1a1a', displayName: 'Lemon' },
  'Brubank':             { color: '#00A3E0', textColor: 'white', displayName: 'Brubank' },
  'Personal Pay':        { color: '#00B4E1', textColor: 'white', displayName: 'Personal Pay' },
  'Banco Nación':        { color: '#003F80', textColor: 'white', displayName: 'BNA' },
  'MODO':                { color: '#FF4B4B', textColor: 'white', displayName: 'MODO' },
  'Sancor Seguros':      { color: '#0066CC', textColor: 'white', displayName: 'Sancor' },
  'Galicia Seguros':     { color: '#E30613', textColor: 'white', displayName: 'Galicia Seg.' },
  'Mercado Seguros':     { color: '#009EE3', textColor: 'white', displayName: 'MP Seguros' },
  'Zurich Argentina':    { color: '#003DA5', textColor: 'white', displayName: 'Zurich' },
  'La Caja':             { color: '#CC0000', textColor: 'white', displayName: 'La Caja' },
  'MAPFRE Argentina':    { color: '#EE2429', textColor: 'white', displayName: 'MAPFRE' },
  'Federación Patronal': { color: '#006633', textColor: 'white', displayName: 'Fed. Patronal' },
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

  // ── Logo con imagen (SimpleIcons o similar) ──
  if (config.imgUrl && !imgFailed) {
    return (
      <div
        className={`rounded-lg overflow-hidden bg-white border border-[#e5e7eb] flex items-center justify-center p-1.5 ${className}`}
        style={containerStyle}
        title={name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.imgUrl}
          alt={name}
          width={size - 12}
          height={size - 12}
          style={{
            objectFit: 'contain',
            width: '100%',
            height: '100%',
            filter: config.imgFilter,
          }}
          onError={() => setImgFailed(true)}
        />
      </div>
    )
  }

  // ── Fallback: nombre del banco con color de marca sobre fondo blanco ──
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
