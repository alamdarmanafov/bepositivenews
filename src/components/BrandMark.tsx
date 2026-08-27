export default function BrandMark({ size = 24, color = "#0f172a" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="8.5" cy="10" r="1.6" fill={color} />
      <circle cx="15.5" cy="10" r="1.6" fill={color} />
      <path
        d="M6 14c1.5 3 4 4.5 6 4.5s4.5-1.5 6-4.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
