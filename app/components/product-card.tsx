"use client";

import type { Product } from "../data/products";
import { useCart } from "../cart-context";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  // Se futuramente tu adicionar `image` no Product, isso já vai funcionar.
  // Enquanto não tiver, o card mostra um placeholder elegante.
  const imageSrc = (product as any)?.image as string | undefined;

  return (
    <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur shadow-sm transition hover:shadow-md">
      {/* Imagem (opcional) */}
      <div className="relative h-44 w-full bg-neutral-200/60">
        {imageSrc ? (
          // usando <img> por compatibilidade imediata; depois a gente troca por next/image
          <img
            src={imageSrc}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-neutral-600">
            Imagem em breve
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
              {product.category}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-neutral-900 truncate">
              {product.name}
            </h3>

            {product.description ? (
              <p className="mt-2 text-sm text-neutral-700 line-clamp-2">
                {product.description}
              </p>
            ) : null}
          </div>

          <div className="shrink-0 text-right">
            <p className="text-lg font-semibold text-neutral-900">
              {formatBRL(product.price)}
            </p>
            <p className="text-xs text-neutral-600">por unidade</p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <button
            onClick={() => addItem(product)}
            className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white transition hover:opacity-95"
          >
            Adicionar
          </button>

          <span className="text-right text-xs text-neutral-600">
            {formatBRL(product.pricePerKg)} / kg
            <br />
            {product.avgWeightG}g <span className="text-neutral-500">(peso médio)</span>
          </span>
        </div>
      </div>
    </article>
  );
}