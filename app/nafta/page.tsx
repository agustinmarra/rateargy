import type { Metadata } from "next"
import NaftaCalculadora from "./NaftaCalculadora"

export const metadata: Metadata = {
  title: "Calculadora de Nafta — Ahorrá en combustible con tu tarjeta",
  description: "Calculá cuánto te cuesta llenar el tanque en YPF, Shell, Axion y Puma, y descubrí cuánto ahorrás con tu tarjeta de crédito.",
}

export default function NaftaPage() {
  return <NaftaCalculadora />
}
