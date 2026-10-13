"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { subtotalCents, type OrderLine } from "@/lib/order";

// O carrinho guarda apenas id + quantidade. Preço, nome e foto vêm sempre do catálogo atual,
// então uma mudança de preço no JSON aparece imediatamente para quem já tem itens salvos.
type StoredItem = { id: string; qty: number };

const STORAGE_KEY = "guilhas_cart_v2";
const LEGACY_KEY = "guilhas_cart"; // formato antigo: [{ product: {...}, qty }]
const MAX_QTY = 99;

type CartContextValue = {
  ready: boolean;
  lines: OrderLine[];
  totalItems: number;
  subtotalCents: number;
  qtyOf: (id: string) => number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function clampQty(n: number) {
  return Math.max(0, Math.min(MAX_QTY, Math.floor(Number.isFinite(n) ? n : 0)));
}

function parseItems(raw: string | null, legacy = false): StoredItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => (legacy ? { id: x?.product?.id, qty: x?.qty } : { id: x?.id, qty: x?.qty }))
      .filter((x) => typeof x.id === "string" && x.id)
      .map((x) => ({ id: String(x.id), qty: clampQty(Number(x.qty)) }))
      .filter((x) => x.qty > 0);
  } catch {
    return [];
  }
}

function readStorage(): StoredItem[] {
  try {
    const items = parseItems(localStorage.getItem(STORAGE_KEY));
    // migração do carrinho salvo pela versão anterior do site
    const legacyRaw = localStorage.getItem(LEGACY_KEY);
    if (legacyRaw !== null) {
      localStorage.removeItem(LEGACY_KEY);
      for (const l of parseItems(legacyRaw, true)) {
        if (!items.some((i) => i.id === l.id)) items.push(l);
      }
    }
    return items;
  } catch {
    // storage indisponível (modo privado etc.) — segue com carrinho vazio
    return [];
  }
}

export function CartProvider({ catalog, children }: { catalog: Product[]; children: React.ReactNode }) {
  const [items, setItems] = useState<StoredItem[]>([]);
  const [ready, setReady] = useState(false);

  const byId = useMemo(() => new Map(catalog.map((p) => [p.id, p])), [catalog]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- leitura única do localStorage após a hidratação
    setItems(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignora */
    }
  }, [items, ready]);

  // Itens que saíram do catálogo ou ficaram indisponíveis não entram no pedido
  const lines = useMemo<OrderLine[]>(
    () =>
      items
        .map((i) => ({ product: byId.get(i.id), qty: i.qty }))
        .filter((l): l is OrderLine => !!l.product && l.product.available),
    [items, byId],
  );

  const qtyOf = useCallback((id: string) => items.find((i) => i.id === id)?.qty ?? 0, [items]);

  const add = useCallback(
    (id: string, qty = 1) => {
      const product = byId.get(id);
      if (!product?.available) return;
      setItems((prev) => {
        const found = prev.find((i) => i.id === id);
        if (found) return prev.map((i) => (i.id === id ? { ...i, qty: clampQty(i.qty + qty) } : i));
        return [...prev, { id, qty: clampQty(qty) }];
      });
    },
    [byId],
  );

  const setQty = useCallback((id: string, qty: number) => {
    const q = clampQty(qty);
    setItems((prev) => {
      if (q === 0) return prev.filter((i) => i.id !== id);
      if (!prev.some((i) => i.id === id)) return [...prev, { id, qty: q }];
      return prev.map((i) => (i.id === id ? { ...i, qty: q } : i));
    });
  }, []);

  const remove = useCallback((id: string) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      ready,
      lines,
      totalItems: lines.reduce((acc, l) => acc + l.qty, 0),
      subtotalCents: subtotalCents(lines),
      qtyOf,
      add,
      setQty,
      remove,
      clear,
    }),
    [ready, lines, qtyOf, add, setQty, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
