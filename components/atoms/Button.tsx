import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const VARIANTS = {
  primary:   { background: '#1a5c38', color: 'white', border: 'none' },
  secondary: { background: '#f0fdf4', color: '#166534', border: '1px solid #86efac' },
  ghost:     { background: 'transparent', color: '#6b7280', border: 'none' },
  outline:   { background: 'white', color: '#6b7280', border: '1px solid #e5e7eb' },
}

const SIZES = {
  sm: { fontSize: 13, padding: '6px 14px', height: 34, borderRadius: 8 },
  md: { fontSize: 14, padding: '10px 18px', height: 42, borderRadius: 10 },
  lg: { fontSize: 15, padding: '12px 24px', height: 48, borderRadius: 10 },
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'opacity 0.15s, background 0.15s',
        width: fullWidth ? '100%' : undefined,
        ...VARIANTS[variant],
        ...SIZES[size],
        ...style,
      }}
    >
      {children}
    </button>
  )
}
