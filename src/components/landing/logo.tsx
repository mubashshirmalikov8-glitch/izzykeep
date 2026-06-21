// Hex-nut mark — mechanical world of the subject. Lime dot = profit signal.
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      className={className ?? "size-7"}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 2.5 23.5 8v12L14 25.5 4.5 20V8L14 2.5Z"
        stroke="var(--color-izzy-brand)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="14" cy="14" r="4.25" stroke="var(--color-izzy-steel)" strokeWidth="1.75" />
      <circle cx="14" cy="14" r="1.4" fill="var(--color-izzy-profit)" />
    </svg>
  );
}
