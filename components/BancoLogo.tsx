"use client"

import { useState } from "react"

// Brandfetch CDN domains para cada bancoId
const DOMINIOS: Record<string, string> = {
  "galicia-eminent":  "galicia.com.ar",
  "bbva-platinum":    "bbva.com.ar",
  "santander-gold":   "santander.com.ar",
  "macro-visa":       "macro.com.ar",
  "naranja-x":        "naranja.com",
  "bna-gold":         "bna.com.ar",
  "supervielle":      "supervielle.com.ar",
  "icbc-platinum":    "icbc.com.ar",
  "uala":             "uala.com.ar",
  "personal-pay":     "personal.com.ar",
  "credicoop":        "credicoop.coop",
  "patagonia":        "bancopatagonia.com.ar",
  "cuenta-dni":       "bancoprovincia.com.ar",
}

// Color de avatar fallback por banco
const AVATAR_COLORS: Record<string, string> = {
  "galicia-eminent":  "#1a7f4f",
  "bbva-platinum":    "#004481",
  "santander-gold":   "#cc0000",
  "macro-visa":       "#b8860b",
  "naranja-x":        "#e05a00",
  "bna-gold":         "#003580",
  "supervielle":      "#e85d04",
  "icbc-platinum":    "#c41230",
  "uala":             "#5b2d8e",
  "personal-pay":     "#6d28d9",
  "credicoop":        "#005a9e",
  "patagonia":        "#2d6a4f",
  "cuenta-dni":       "#0f766e",
}

interface BancoLogoProps {
  bancoId: string
  nombre: string
  size?: number
  className?: string
}

export default function BancoLogo({ bancoId, nombre, size = 32, className = "" }: BancoLogoProps) {
  const [error, setError] = useState(false)
  const domain = DOMINIOS[bancoId]
  const apiKey = process.env.NEXT_PUBLIC_BRANDFETCH_KEY ?? ""
  const color  = AVATAR_COLORS[bancoId] ?? "#64748b"

  // Iniciales para el fallback
  const initials = nombre
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  if (!domain || error) {
    return (
      <div
        className={className}
        style={{
          width: size, height: size, borderRadius: "50%",
          background: color, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.35, fontWeight: 700, letterSpacing: "-0.02em",
          flexShrink: 0, userSelect: "none",
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.brandfetch.io/${domain}/w/${size * 2}/h/${size * 2}/symbol${apiKey ? `?c=${apiKey}` : ""}`}
      alt={nombre}
      width={size}
      height={size}
      onError={() => setError(true)}
      className={className}
      style={{
        width: size, height: size, objectFit: "contain",
        borderRadius: 6, flexShrink: 0,
      }}
    />
  )
}
