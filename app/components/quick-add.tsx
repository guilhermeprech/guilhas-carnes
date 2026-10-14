"use client";

import { useCart } from "../cart-context";
import { MinusIcon, PlusIcon } from "./icons";

/** "+" sobre a foto; depois do primeiro toque vira um contador compacto */
export function QuickAdd({ id, name, available }: { id: string; name: string; available: boolean }) {
  const { ready, qtyOf, add, setQty } = useCart();
  const qty = ready ? qtyOf(id) : 0;
  if (!available) return null;

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => add(id)}
        aria-label={`Adicionar ${name} ao carrinho`}
        className="inline-flex h-10 w-10 items-center justify-center bg-paper text-ink transition-transform hover:scale-105 active:scale-95 md:h-11 md:w-11"
      >
        <PlusIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="flex h-10 items-stretch bg-paper text-ink md:h-11" role="group" aria-label={`Quantidade de ${name}`}>
      <button
        type="button"
        onClick={() => setQty(id, qty - 1)}
        aria-label={qty === 1 ? `Remover ${name}` : `Diminuir quantidade de ${name}`}
        className="w-9 inline-flex items-center justify-center hover:bg-white md:w-10"
      >
        <MinusIcon />
      </button>
      <span className="tabular inline-flex min-w-6 items-center justify-center text-sm font-semibold" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => add(id)}
        aria-label={`Aumentar quantidade de ${name}`}
        className="w-9 inline-flex items-center justify-center hover:bg-white md:w-10"
      >
        <PlusIcon />
      </button>
    </div>
  );
}
