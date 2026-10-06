"use client";

export function Scroll3DSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`w-full ${className ?? ""}`}>
      {children}
    </section>
  );
}
