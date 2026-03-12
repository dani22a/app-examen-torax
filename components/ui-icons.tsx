import React from "react";

type IconProps = {
  size?: number;
  className?: string;
};

const baseProps = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function ImageIcon({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="M21 16l-5-5-8 8" />
    </svg>
  );
}

export function Upload({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17,8 12,3 7,8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function Activity({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
    </svg>
  );
}

export function Layers({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <polygon points="12,3 22,8 12,13 2,8" />
      <polyline points="2,12 12,17 22,12" />
      <polyline points="2,16 12,21 22,16" />
    </svg>
  );
}

export function CheckCircle({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  );
}

export function AlertTriangle({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <path d="M12 3l10 18H2L12 3z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <circle cx="12" cy="17" r="1" />
    </svg>
  );
}

export function X({ size = 20, className }: IconProps) {
  return (
    <svg {...baseProps(size)} className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
