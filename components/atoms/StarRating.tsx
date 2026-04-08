import { Star } from 'lucide-react'
import { clamp } from '@/lib/utils'

interface StarRatingProps {
  /** Puntuación sobre 10 (ej: 9.4) */
  score: number
  showLabel?: boolean
  size?: number
}

export default function StarRating({ score, showLabel = true, size = 13 }: StarRatingProps) {
  const clamped = clamp(score, 0, 10)
  const filled = Math.round((clamped / 10) * 5)

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < filled
              ? 'fill-[#008000] text-[#008000]'
              : 'fill-[#e5e7eb] text-[#e5e7eb]'
          }
        />
      ))}
      {showLabel && (
        <span className="text-[#6b7280] ml-1.5 font-medium" style={{ fontSize: size }}>
          {clamped.toFixed(1)} rateargy rating
        </span>
      )}
    </div>
  )
}
