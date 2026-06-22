// Thin-stroke auto-parts silhouettes for the ambient background.
// All use currentColor so the parent sets tint + opacity. Pure SVG, no fill.

type P = { className?: string };

export function GearRing({ className }: P) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 4.5" />
      <circle cx="50" cy="50" r="36" stroke="currentColor" strokeWidth="0.6" />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

export function BrakeDisc({ className }: P) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="50" cy="50" r="31" stroke="currentColor" strokeWidth="0.7" strokeDasharray="1 3.5" />
      <circle cx="50" cy="50" r="13" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="50" cy="50" r="3.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function SpringCoil({ className }: P) {
  return (
    <svg viewBox="0 0 60 120" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 8 C52 16 52 24 12 24 C52 32 52 40 12 40 C52 48 52 56 12 56 C52 64 52 72 12 72 C52 80 52 88 12 88 C52 96 52 104 12 104"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EngineContour({ className }: P) {
  return (
    <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
      <rect x="6" y="6" width="108" height="108" rx="26" stroke="currentColor" strokeWidth="0.6" />
      <rect x="22" y="22" width="76" height="76" rx="20" stroke="currentColor" strokeWidth="0.6" />
      <rect x="38" y="38" width="44" height="44" rx="14" stroke="currentColor" strokeWidth="0.6" />
      <rect x="52" y="52" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="0.6" />
    </svg>
  );
}

export function HexNut({ className }: P) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <path
        d="M50 5 L89 27 V73 L50 95 L11 73 V27 Z"
        stroke="currentColor"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />
      <circle cx="50" cy="50" r="21" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}
