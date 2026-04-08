interface BadgeProps {
  children: React.ReactNode
  variant?: 'green' | 'amber' | 'blue' | 'gray'
  size?: 'sm' | 'md'
}

const VARIANTS = {
  green: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' },
  amber: { background: '#fffbeb', color: '#92400e', border: '1px solid #fcd34d' },
  blue:  { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
  gray:  { background: '#f9fafb', color: '#6b7280', border: '1px solid #e5e7eb' },
}

const SIZES = {
  sm: { fontSize: 11, padding: '1px 6px', borderRadius: 4 },
  md: { fontSize: 12, padding: '2px 8px', borderRadius: 6 },
}

export default function Badge({ children, variant = 'green', size = 'sm' }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: 700,
        ...VARIANTS[variant],
        ...SIZES[size],
      }}
    >
      {children}
    </span>
  )
}
