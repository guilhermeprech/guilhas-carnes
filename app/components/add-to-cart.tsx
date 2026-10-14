"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "../cart-context";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  size = "md",
  tone = "light",
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}) {
  const h = size === "sm" ? "h-11" : "h-13";
  const box = tone === "dark" ? "border-paper/25 text-paper" : "border-ink/80 bg-white text-ink";
  const hover = tone === "dark" ? "hover:bg-white/10" : "hover:bg-paper";
  return (
    <div className={`inline-flex ${h} items-stretch border ${box}`} role="group" aria-label={`Quantidade de ${label}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`w-11 inline-flex items-center justify-center ${hover} disabled:opacity-30 transition-colors`}
        aria-label={value === 1 && min === 0 ? `Remover ${label}` : `Diminuir quantidade de ${label}`}
      >
        <MinusIcon />
      </button>
      <input
        value={value}
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={`Quantidade de ${label}`}
        onChange={(e) => {
          const n = Number(e.target.value.replace(/\D/g, ""));
          onChange(Math.max(min, Math.min(99, n || 0)));
        }}
        className="tabular w-10 bg-transparent text-center font-semibold outline-none"
      />
      <button
        type="button"
        onClick={() => onChange(Math.min(99, value + 1))}
        disabled={value >= 99}
        className={`w-11 inline-flex items-center justify-center ${hover} disabled:opacity-30 transition-colors`}
        aria-label={`Aumentar quantidade de ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

/** Página do produto (fundo escuro): escolhe a quantidade e adiciona de uma vez */
export function ProductPurchase({ id, name, available }: { id: string; name: string; available: boolean }) {
  const { ready, qtyOf, add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = ready ? qtyOf(id) : 0;

  if (!available) {
    return (
      <p className="border border-line-dark px-5 py-4 text-paper/70">
        Indisponível no momento. Fale com a gente no WhatsApp para saber quando volta.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-stretch gap-2">
        <QuantityStepper tone="dark" value={qty} min={1} label={name} onChange={(n) => { setQty(n); setAdded(false); }} />
        <button
          type="button"
          className="btn btn-light min-h-13 flex-1 min-w-[12rem]"
          onClick={() => {
            add(id, qty);
            setAdded(true);
          }}
        >
          {added ? (<><CheckIcon /> Adicionado</>) : "Adicionar ao carrinho"}
        </button>
      </div>
      <p className="mt-3 min-h-6 text-sm text-paper/60" aria-live="polite">
        {inCart > 0 && (
          <>
            {inCart} {inCart === 1 ? "unidade" : "unidades"} no carrinho.{" "}
            <Link href="/carrinho" className="link-underline text-paper">Ver carrinho</Link>
          </>
        )}
      </p>
    </div>
  );
}
