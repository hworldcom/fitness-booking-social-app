/** Decorative club marks: never convey state or intercept input. */
export function ShoeDoodle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 125 95"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M37 38c5-8 7-22 13-23 6-1 4 13 11 15l7-11c3-4 8-2 8 3l-1 15 15 22c7 8 18 12 18 20-10 10-28 5-40-2L35 57c-7-5-4-12 2-19Z"
          fill="#f8f7f3"
        />
        <path d="M34 47c12 6 22 16 36 22 13 7 26 9 36 6M43 30c1 10 6 13 13 15l17-10M57 35l12-5M62 43l14-5M67 50l14-5M72 58l14-5M42 48l-2 12M84 57c-8 2-12 6-12 13M8 43l14-5M13 65l12-9M26 82l7-11" />
      </g>
    </svg>
  );
}

export function StarDoodle({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 60 60"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="m31 3-3 15m23-7-11 12m17 9-15-1m5 20L36 40M23 57l3-14M4 40l14-6M8 12l12 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
