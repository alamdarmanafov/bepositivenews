import { CategoryKey } from "@/content/types";

type IconProps = { className: string };

const commonProps = {
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function AzerbaycanIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M12 21s7-7.2 7-12a7 7 0 10-14 0c0 4.8 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.4" />
    </svg>
  );
}

function DunyaIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3.3 9h17.4M3.3 15h17.4" />
    </svg>
  );
}

function BiznesIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="M8.5 7.5V5.5A2 2 0 0110.5 3.5h3a2 2 0 012 2v2" />
      <path d="M3 13h18" />
    </svg>
  );
}

function TexnologiyaIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <rect x="8" y="8" width="8" height="8" rx="1.2" />
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" />
      <path d="M9 4.5V2.5M15 4.5V2.5M9 21.5v-2M15 21.5v-2M4.5 9h-2M4.5 15h-2M21.5 9h-2M21.5 15h-2" />
    </svg>
  );
}

function AiIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M12 3l1.7 4.8L18.5 9.5l-4.8 1.7L12 16l-1.7-4.8L5.5 9.5l4.8-1.7L12 3z" />
      <path d="M19 14.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7z" />
    </svg>
  );
}

function SosialMediaIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9.5" r="2.3" />
      <path d="M3.5 20c0-3.6 2.5-6.2 5.5-6.2s5.5 2.6 5.5 6.2" />
      <path d="M14.8 14.2c2.5.2 4.4 2.4 4.4 5.3" />
    </svg>
  );
}

function MarketinqIcon({ className }: IconProps) {
  return (
    <svg {...commonProps} className={className}>
      <path d="M3 10.5v3a1 1 0 001 1h2l7 3.8V5.7L6 9.5H4a1 1 0 00-1 1z" />
      <path d="M17 8.2a4.2 4.2 0 010 7.6" />
    </svg>
  );
}

const ICONS: Record<CategoryKey, (props: IconProps) => React.JSX.Element> = {
  azerbaycan: AzerbaycanIcon,
  dunya: DunyaIcon,
  biznes: BiznesIcon,
  texnologiya: TexnologiyaIcon,
  ai: AiIcon,
  "sosial-media": SosialMediaIcon,
  marketinq: MarketinqIcon,
};

export default function CategoryIcon({
  category,
  className = "h-5 w-5",
}: {
  category: CategoryKey;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon className={className} />;
}
