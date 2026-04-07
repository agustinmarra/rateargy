export interface Producto {
  id: string
  categoria: string
  nombre: string
  banco: string
  descripcion: string
  puntuacion: number
  beneficios: string[]
  costo_mensual: number
  url_afiliado: string
  activo: boolean
  imagen_url?: string
  red?: string
  tag?: string
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  descripcion: string
  icono: string
  color: string
  cantidad_productos: number
}

export interface Articulo {
  id: string
  titulo: string
  slug: string
  resumen: string
  contenido: string
  categoria: string
  imagen_url: string
  publicado: boolean
  created_at: string
  updated_at: string
}

export interface DolarData {
  nombre: string
  compra: number
  venta: number
  fechaActualizacion: string
}

export interface TickerData {
  dolares: DolarData[]
  inflacion?: number
  riesgoPais?: number
  lastUpdate: string
}

export type PerfilUso = 'viajes' | 'dia-a-dia' | 'sin-costo' | 'cuotas' | 'todos'
