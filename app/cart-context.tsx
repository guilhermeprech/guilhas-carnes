"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "./data/products";

export type CartItem = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];

  // ações
  addItem: (product: Product) => void;          // +1 (se não existir, cria)
  decrement: (productId: string) => void;       // -1 (se chegar em 0, remove)
  setQty: (productId: string, qty: number) => void; // seta quantidade (0 remove)
  removeItem: (productId: string) => void;      // remove item do carrinho
  clear: () => void;

  // totais
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function calcTotals(items: CartItem[]) {
  const totalItems = items.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = items.reduce((acc, i) => acc + i.qty * i.product.price, 0);
  return { totalItems, totalPrice };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Carrega do LocalStorage quando abre o site
  useEffect(() => {
    const raw = localStorage.getItem("guilhas_cart");
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {
        // se der ruim, ignora
      }
    }
  }, []);

  // Salva sempre que mudar
  useEffect(() => {
    localStorage.setItem("guilhas_cart", JSON.stringify(items));
  }, [items]);

  const { totalItems, totalPrice } = useMemo(() => calcTotals(items), [items]);

  function addItem(product: Product) {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.product.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function decrement(productId: string) {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.product.id === productId);
      if (idx < 0) return prev;

      const copy = [...prev];
      const nextQty = copy[idx].qty - 1;

      if (nextQty <= 0) {
        copy.splice(idx, 1);
        return copy;
      }

      copy[idx] = { ...copy[idx], qty: nextQty };
      return copy;
    });
  }

  function setQty(productId: string, qty: number) {
    const q = Math.max(0, Math.floor(qty || 0));

    setItems((prev) => {
      const idx = prev.findIndex((x) => x.product.id === productId);
      if (idx < 0) {
        // Não cria item aqui porque não temos o "product" completo nesse método.
        // (o addItem continua sendo o caminho pra inserir novo)
        return prev;
      }

      if (q === 0) return prev.filter((x) => x.product.id !== productId);

      const copy = [...prev];
      copy[idx] = { ...copy[idx], qty: q };
      return copy;
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((x) => x.product.id !== productId));
  }

  function clear() {
    setItems([]);
  }

  const value: CartContextValue = {
    items,
    addItem,
    decrement,
    setQty,
    removeItem,
    clear,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}