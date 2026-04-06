import { useEffect } from 'react';

export interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: (id: string) => void;
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'info':
        return 'ℹ';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(34, 197, 94, 0.15)',
          border: 'rgba(34, 197, 94, 0.3)',
          icon: '#22c55e',
          text: 'var(--color-text-primary)'
        };
      case 'error':
        return {
          bg: 'rgba(239, 68, 68, 0.15)',
          border: 'rgba(239, 68, 68, 0.3)',
          icon: '#ef4444',
          text: 'var(--color-text-primary)'
        };
      case 'info':
        return {
          bg: 'rgba(0, 217, 179, 0.15)',
          border: 'rgba(0, 217, 179, 0.3)',
          icon: 'var(--color-primary)',
          text: 'var(--color-text-primary)'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: 'var(--shadow-lg)',
        animation: 'slideInRight 0.3s ease-out',
        cursor: 'pointer'
      }}
      onClick={() => onClose(id)}
    >
      <div style={{
        fontSize: '20px',
        fontWeight: 700,
        color: colors.icon,
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {getIcon()}
      </div>

      <p style={{
        fontSize: '14px',
        color: colors.text,
        margin: 0,
        flex: 1
      }}>
        {message}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose(id);
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--color-text-tertiary)',
          cursor: 'pointer',
          fontSize: '18px',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        ×
      </button>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
