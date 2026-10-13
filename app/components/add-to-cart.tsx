"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart-context";
import { CheckIcon, MinusIcon, PlusIcon } from "./icons";

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 0,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
  min?: number;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-11" : "h-13";
  return (
    <div className={`inline-flex ${h} items-stretch border border-ink/80 bg-white`} role="group" aria-label={`Quantidade de ${label}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-11 inline-flex items-center justify-center hover:bg-paper disabled:opacity-30 transition-colors"
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
        className="w-11 inline-flex items-center justify-center hover:bg-paper disabled:opacity-30 transition-colors"
        aria-label={`Aumentar quantidade de ${label}`}
      >
        <PlusIcon />
      </button>
    </div>
  );
}

/** Botão compacto do card: vira contador depois do primeiro clique */
export function CardCartControl({ id, name, available }: { id: string; name: string; available: boolean }) {
  const { ready, qtyOf, add, setQty } = useCart();
  const qty = ready ? qtyOf(id) : 0;
  const [added, setAdded] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  if (!available) {
    return (
      <button type="button" disabled className="btn btn-outline min-h-11 w-full text-sm">
        Indisponível
      </button>
    );
  }

  if (qty > 0) {
    return (
      <div className="flex items-center justify-between gap-2">
        <QuantityStepper size="sm" value={qty} label={name} onChange={(n) => setQty(id, n)} />
        <span className={`inline-flex items-center gap-1 whitespace-nowrap text-sm text-stone-dark transition-opacity ${added ? "opacity-100" : "opacity-0"}`} aria-live="polite">
          {added && (<><CheckIcon /> Adicionado</>)}
        </span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        add(id);
        setAdded(true);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setAdded(false), 1800);
      }}
      className="btn btn-solid min-h-11 w-full text-sm"
    >
      Adicionar
    </button>
  );
}

/** Bloco da página do produto: escolhe a quantidade e adiciona de uma vez */
export function ProductPurchase({ id, name, available }: { id: string; name: string; available: boolean }) {
  const { ready, qtyOf, add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const inCart = ready ? qtyOf(id) : 0;

  if (!available) {
    return (
      <p className="border border-line bg-white/60 px-5 py-4 text-stone-dark">
        Indisponível no momento. Fale com a gente no WhatsApp para saber quando volta.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-stretch gap-3">
        <QuantityStepper value={qty} min={1} label={name} onChange={(n) => { setQty(n); setAdded(false); }} />
        <button
          type="button"
          className="btn btn-solid min-h-13 flex-1 min-w-[12rem]"
          onClick={() => {
            add(id, qty);
            setAdded(true);
          }}
        >
          {added ? (<><CheckIcon /> Adicionado</>) : "Adicionar ao carrinho"}
        </button>
      </div>
      <p className="mt-3 min-h-6 text-sm text-stone-dark" aria-live="polite">
        {inCart > 0 && (
          <>
            {inCart} {inCart === 1 ? "unidade" : "unidades"} no carrinho.{" "}
            <a href="/carrinho" className="link-underline text-ink">Ver carrinho</a>
          </>
        )}
      </p>
    </div>
  );
}
