interface SpinnerProps {
  size?: number;
  color?: string;
}

export default function Spinner({ size = 16, color = 'currentColor' }: SpinnerProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        animation: 'spin 1s linear infinite',
        display: 'inline-block'
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="15"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="60"
        strokeDashoffset="15"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="1.5s"
          repeatCount="indefinite"
          from="0"
          to="120"
        />
      </circle>
    </svg>
  );
}
