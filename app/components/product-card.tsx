"use client";

import type { Product } from "../data/products";
import { useCart } from "../cart-context";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-300/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-zinc-600">{product.category}</p>
          <h3 className="text-lg font-semibold text-black">{product.name}</h3>
          <p className="mt-1 text-sm text-zinc-600">{product.description}</p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-black">{formatBRL(product.price)}</p>
          <p className="text-xs text-zinc-600">por unidade</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="rounded-lg border border-red-600 bg-white px-4 py-2 text-sm font-semibold tracking-wide text-black hover:bg-red-600 hover:scale-105 transition-all hover:text-white"
          onClick={() => addItem(product)}
        >
          Adicionar
        </button>

        <span className="text-sm text-zinc-500">
        {formatBRL(product.pricePerKg)} / kg <br /> {product.avgWeightG}g (peso médio por unidade)
        </span>
        
      </div>
    </div>
  );
}