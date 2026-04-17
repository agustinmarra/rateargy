import fs from "fs"
import path from "path"
import matter from "gray-matter"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ArticuloCategory =
  | "Tarjetas"
  | "Dólares"
  | "Cuentas"
  | "Inversiones"
  | "Ahorro"
  | "Cuotas"
  | "General"

export interface ArticuloFrontmatter {
  title: string
  slug: string
  description: string
  category: ArticuloCategory
  readTime: number
  publishedAt: string        // YYYY-MM-DD
  updatedAt?: string         // YYYY-MM-DD
  coverEmoji?: string
  featured?: boolean
}

export interface ArticuloWithContent {
  frontmatter: ArticuloFrontmatter
  content: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ARTICULOS_DIR = path.join(process.cwd(), "content/articulos")

function readFrontmatter(file: string): ArticuloFrontmatter {
  const raw = fs.readFileSync(path.join(ARTICULOS_DIR, file), "utf8")
  const { data } = matter(raw)
  return data as ArticuloFrontmatter
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllArticulos(): ArticuloFrontmatter[] {
  if (!fs.existsSync(ARTICULOS_DIR)) return []

  const files = fs.readdirSync(ARTICULOS_DIR).filter((f) => f.endsWith(".mdx"))

  return files
    .map(readFrontmatter)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

export function getArticuloBySlug(slug: string): ArticuloWithContent | null {
  const filePath = path.join(ARTICULOS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, "utf8")
  const { data, content } = matter(raw)
  return { frontmatter: data as ArticuloFrontmatter, content }
}
