interface SkeletonProps {
  width?: string | number
  height?: string | number
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  className?: string
}

const ROUNDED = {
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  full: '9999px',
}

export function Skeleton({ width = '100%', height = 16, rounded = 'md', className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#e5e7eb] ${className}`}
      style={{
        width,
        height,
        borderRadius: ROUNDED[rounded],
      }}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#e5e7eb] p-5" style={{ minHeight: 200 }}>
      <div className="flex gap-5">
        <Skeleton width={200} height={130} rounded="lg" />
        <div className="flex-1 space-y-3 pt-1">
          <Skeleton width={120} height={12} rounded="full" />
          <Skeleton width="60%" height={22} />
          <Skeleton width="40%" height={14} />
          <Skeleton width="80%" height={13} />
          <Skeleton width="70%" height={13} />
        </div>
        <div className="flex flex-col gap-3" style={{ minWidth: 160 }}>
          <Skeleton width={160} height={48} rounded="lg" />
          <Skeleton width={120} height={12} rounded="full" className="mx-auto" />
        </div>
      </div>
      <div className="flex mt-4 rounded-lg overflow-hidden border border-[#f3f4f6]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex-1 p-3 space-y-2" style={{ borderLeft: i > 0 ? '1px solid #f3f4f6' : 'none' }}>
            <Skeleton width="60%" height={10} rounded="full" />
            <Skeleton width="80%" height={14} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonTableRow() {
  return (
    <div className="grid px-5 py-4 border-b border-[#f9fafb] items-center gap-4"
      style={{ gridTemplateColumns: '1.5fr 120px 100px 120px 100px 100px' }}>
      <div className="flex items-center gap-3">
        <Skeleton width={40} height={40} rounded="md" />
        <div className="space-y-2">
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={12} />
        </div>
      </div>
      <Skeleton width={90} height={14} />
      <Skeleton width={60} height={14} />
      <Skeleton width={80} height={14} />
      <Skeleton width={70} height={14} />
      <Skeleton width={90} height={36} rounded="lg" />
    </div>
  )
}
