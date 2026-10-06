export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#09090b]"
      style={{ contain: "strict" }}
    >
      {/* Subtle top spotlight - monochrome and clean */}
      <div
        className="absolute -top-[150px] left-1/2 h-[500px] w-[800px] -translate-x-1/2 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(255, 255, 255, 0.15), transparent 75%)",
          filter: "blur(60px)",
        }}
      />

      {/* Clean subtle grid */}
      <div className="grid-bg absolute inset-0" />
    </div>
  );
}
