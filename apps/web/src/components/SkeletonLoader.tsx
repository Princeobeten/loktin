interface SkeletonLoaderProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export default function SkeletonLoader({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = ''
}: SkeletonLoaderProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, var(--color-surface-secondary) 0%, var(--color-surface-tertiary) 50%, var(--color-surface-secondary) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite'
      }}
    />
  );
}

export function CycleCardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <SkeletonLoader width="180px" height="28px" borderRadius="6px" />
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <SkeletonLoader width="80px" height="14px" style={{ marginBottom: '6px' }} />
            <SkeletonLoader width="120px" height="24px" />
          </div>
        ))}
      </div>

      {/* Bills List */}
      <div style={{ marginTop: '20px' }}>
        <SkeletonLoader width="100px" height="18px" style={{ marginBottom: '12px' }} />

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'var(--color-surface-secondary)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              marginBottom: '8px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <SkeletonLoader width="140px" height="16px" style={{ marginBottom: '6px' }} />
                <SkeletonLoader width="100px" height="14px" />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <SkeletonLoader width="80px" height="32px" borderRadius="6px" />
                <SkeletonLoader width="80px" height="32px" borderRadius="6px" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <SkeletonLoader width="120px" height="40px" borderRadius="8px" />
        <SkeletonLoader width="100px" height="40px" borderRadius="8px" />
      </div>
    </div>
  );
}

export function CycleFormSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <SkeletonLoader width="200px" height="28px" style={{ marginBottom: '20px' }} />

      {/* Form Fields */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ marginBottom: '16px' }}>
          <SkeletonLoader width="120px" height="16px" style={{ marginBottom: '8px' }} />
          <SkeletonLoader width="100%" height="44px" borderRadius="8px" />
        </div>
      ))}

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <SkeletonLoader width="140px" height="44px" borderRadius="8px" />
        <SkeletonLoader width="100px" height="44px" borderRadius="8px" />
      </div>
    </div>
  );
}
