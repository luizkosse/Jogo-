export function PixelDivider() {
  return (
    <div
      className="w-full overflow-hidden py-2 my-8"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1200 20"
        className="w-full text-accent-wood opacity-40"
        preserveAspectRatio="none"
      >
        <rect x="0" y="8" width="1200" height="4" fill="currentColor" />
        {Array.from({ length: 60 }).map((_, i) => (
          <rect
            key={i}
            x={i * 20}
            y={i % 2 === 0 ? 4 : 0}
            width="4"
            height={i % 2 === 0 ? 4 : 8}
            fill="currentColor"
          />
        ))}
      </svg>
    </div>
  );
}
