"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "../cart-context";

function formatBRL(v: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(v || 0);
}

export function CartBottomBar() {
  const { totalItems, totalPrice } = useCart();
  const pathname = usePathname();

  // ✅ não mostrar no carrinho nem no checkout
  const hideOnRoutes = pathname === "/carrinho" || pathname === "/checkout";

  // Mostra só quando tiver algo no carrinho
  const shouldShow = totalItems > 0 && !hideOnRoutes;

  // animação de entrada/saída simples
  const [mounted, setMounted] = useState(shouldShow);

  // ✅ micro-animação quando adiciona item (efeito “added”)
  const prevItemsRef = useRef<number>(totalItems);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (shouldShow) setMounted(true);
    else {
      // deixa animar pra baixo antes de desmontar
      const t = setTimeout(() => setMounted(false), 220);
      return () => clearTimeout(t);
    }
  }, [shouldShow]);

  useEffect(() => {
    const prev = prevItemsRef.current;
    if (totalItems > prev) {
      setPulse(true);
      const t = setTimeout(() => setPulse(false), 260);
      return () => clearTimeout(t);
    }
    prevItemsRef.current = totalItems;
  }, [totalItems]);

  const prettyTotal = useMemo(() => formatBRL(totalPrice), [totalPrice]);

  if (!mounted) return null;

  return (
    <div
      className={[
        "fixed left-0 right-0 z-50 px-4 pb-4",
        "bottom-[calc(env(safe-area-inset-bottom)+0px)]",
        "md:hidden", // só mobile
        "transition-transform duration-200 ease-out",
        shouldShow ? "translate-y-0" : "translate-y-[110%]",
      ].join(" ")}
    >
      <div
        className={[
          "mx-auto max-w-6xl rounded-2xl border border-neutral-200 bg-white/90 backdrop-blur shadow-lg",
          "transition-transform duration-200 ease-out",
          pulse ? "scale-[1.02]" : "scale-100",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.12em] text-neutral-600">
              Carrinho
            </p>
            <p className="text-sm text-neutral-900">
              <span className="font-medium">{totalItems}</span>{" "}
              {totalItems === 1 ? "item" : "itens"} •{" "}
              <span className="font-semibold">{prettyTotal}</span>
            </p>
          </div>

          <a
            href="/carrinho"
            className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white active:scale-[0.99] transition"
          >
            Finalizar
          </a>
        </div>
      </div>
    </div>
  );
}