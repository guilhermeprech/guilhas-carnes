"use client";

import type { Product } from "../data/products";
import { useCart } from "../cart-context";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-400">{product.category}</p>
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <p className="mt-1 text-sm text-zinc-300">{product.description}</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-white">{formatBRL(product.price)}</p>
          <p className="text-xs text-zinc-400">por unidade</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
          onClick={() => addItem(product)}
        >
          Adicionar
        </button>

        <button className="text-sm text-zinc-300 hover:text-white" type="button">
          Ver detalhes
        </button>
      </div>
    </div>
  );
}