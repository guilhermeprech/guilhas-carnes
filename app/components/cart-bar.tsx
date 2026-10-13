"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../cart-context";
import { formatBRL } from "@/lib/format";

/** Barra fixa do carrinho no mobile — aparece quando há itens */
export function CartBar() {
  const pathname = usePathname();
  const { ready, totalItems, subtotalCents } = useCart();
  const hidden = pathname === "/carrinho" || pathname === "/checkout";
  const show = ready && totalItems > 0 && !hidden;

  return (
    <>
    {/* espaço para a barra não cobrir o fim da página */}
    {show && <div className="h-[calc(4.5rem+env(safe-area-inset-bottom))] md:hidden" aria-hidden />}
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-[35] md:hidden transition-[transform,visibility] duration-300 ease-out-soft",
        show ? "visible translate-y-0" : "invisible translate-y-full",
      ].join(" ")}
      aria-hidden={!show}
    >
      <div className="bg-ink text-paper pb-[env(safe-area-inset-bottom)]">
        <div className="wrap flex items-center justify-between gap-4 py-3">
          <div className="min-w-0 leading-tight">
            <p className="text-sm text-paper/60">
              {totalItems} {totalItems === 1 ? "item" : "itens"}
            </p>
            <p className="tabular font-semibold">{formatBRL(subtotalCents)} <span className="text-sm font-normal text-paper/60">estimado</span></p>
          </div>
          <Link href="/carrinho" tabIndex={show ? 0 : -1} className="btn btn-light min-h-11 px-5">
            Ver carrinho
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
