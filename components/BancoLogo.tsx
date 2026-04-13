"use client"
import Image from "next/image"

// MAPA DE LOGOS — editá acá si agregás o renombrás archivos en public/logos/
// Formato: "bancoId": "nombre-exacto-del-archivo-con-extension"
const LOGOS: Record<string, string> = {
  "galicia":         "banco-galicia.png",
  "galicia-eminent": "banco-galicia.png",
  "bbva":            "bbva-argentina.png",
  "bbva-platinum":   "bbva-argentina.png",
  "santander":       "santander-argentina.png",
  "santander-gold":  "santander-argentina.png",
  "macro":           "banco-macro.png",
  "macro-visa":      "banco-macro.png",
  "naranja-x":       "naranja-x.png",
  "bna":             "banco-nacion.png",
  "bna-gold":        "banco-nacion.png",
  "supervielle":     "supervielle.png",
  "icbc":            "icbc-argentina.png",
  "icbc-platinum":   "icbc-argentina.png",
  "uala":            "uala.png",
  "personal-pay":    "personal-pay.png",
  "credicoop":       "credicoop.jpg",
  "patagonia":       "patagonia.png",
  "provincia":       "banco-provincia.png",
  "cuenta-dni":      "banco-provincia.png",
  "mercado-pago":    "mercado-pago.png",
  "brubank":         "brubank.png",
  "ciudad":          "banco-ciudad.png",
  "hipotecario":     "hipotecario.png",
}

// CÓMO AGREGAR UN LOGO NUEVO:
// 1. Guardá el archivo en public/logos/nombre-banco.png
// 2. Agregá una línea acá: "bancoId": "nombre-banco.png"
// 3. Listo — no hay que tocar nada más

interface BancoLogoProps {
  banco: string
  size?: number
  className?: string
}

export function BancoLogo({ banco, size = 32, className }: BancoLogoProps) {
  const archivo = LOGOS[banco]
  const initials = banco.replace(/-/g, " ").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)

  if (!archivo) {
    return (
      <div
        className={className}
        style={{
          width: size, height: size,
          borderRadius: Math.round(size * 0.25),
          background: "#f1f5f9",
          border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: Math.round(size * 0.35), fontWeight: 700, color: "#64748b",
          flexShrink: 0, userSelect: "none",
        }}
      >
        {initials}
      </div>
    )
  }

  return (
    <div
      className={className}
      style={{
        width: size, height: size,
        borderRadius: Math.round(size * 0.25),
        background: "white",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Image
        src={`/logos/${archivo}`}
        alt={banco}
        width={size}
        height={size}
        style={{ objectFit: "contain", padding: Math.round(size * 0.08) }}
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement
          el.style.display = "none"
          const parent = el.parentElement
          if (parent) {
            parent.style.background = "#f1f5f9"
            parent.innerHTML = `<span style="font-size:${Math.round(size*0.35)}px;font-weight:700;color:#64748b">${initials}</span>`
          }
        }}
      />
    </div>
  )
}
