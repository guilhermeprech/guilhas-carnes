"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

export function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Se o usuário prefere reduzir animações, mostra direto
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (reduced) {
      setVisible(true);
      return;
    }

    // Fallback caso o browser não suporte IntersectionObserver
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    // ✅ MUITO IMPORTANTE:
    // threshold baixo porque o Reveal pode envolver um container alto (página inteira)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0, // dispara assim que encostar na viewport
        // dispara um pouco antes (top +80px), e não “segura” demais no bottom
        rootMargin: "80px 0px 0px 0px",
      }
    );

    // garante que layout já calculou antes de observar (ajuda em alguns casos)
    const raf = requestAnimationFrame(() => observer.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={[
        "transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}