"use client";

export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background">
      <div
        className="absolute h-full w-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(var(--border) / 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(var(--border) / 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(at center, white, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(at center, white, transparent 80%)',
        }}
      />
      <div
        className="absolute h-full w-full transition-opacity duration-500"
        style={{
          backgroundImage: `radial-gradient(
            circle at center,
            rgba(var(--primary) / 0.05),
            transparent 50%
          )`,
          filter: 'blur(5rem)',
        }}
      />
    </div>
  );
}