"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "../data/products";
import { useCart } from "../cart-context";
import { formatBRL } from "../config/site";
import { supabase } from "../../lib/supabase";

function getPublicImageUrl(image?: string) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const { data } = supabase.storage.from("products").getPublicUrl(image);
  return data.publicUrl || null;
}

export function ProductCard({ product }: { product: Product }) {
  const { items, addItem, decrement, setQty } = useCart();

  const imageUrl = useMemo(() => getPublicImageUrl(product.image), [product.image]);

  // quantidade atual no carrinho
  const qty = useMemo(() => {
    const found = items.find((i) => i.product.id === product.id);
    return found?.qty ?? 0;
  }, [items, product.id]);

  // ✅ feedback quando adiciona (0 -> 1)
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  function pulseAdded() {
    setJustAdded(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setJustAdded(false), 650);
  }

  function handleAddFirst() {
    addItem(product);
    pulseAdded();
  }

  function handlePlus() {
    addItem(product);
  }

  function handleMinus() {
    decrement(product.id);
  }

  const hasKgInfo = typeof product.pricePerKg === "number" && product.pricePerKg > 0;
  const hasWeightInfo = typeof product.avgWeightG === "number" && product.avgWeightG > 0;

  return (
    <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur shadow-sm transition-shadow hover:shadow-md">
      {/* Imagem */}
      <div className="relative h-44 w-full bg-neutral-200/60">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="relative h-full w-full">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-60%] group-hover:translate-x-[60%] transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]" />
            <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-neutral-700">
              Imagem em breve
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
              {product.category}
              {product.subcategory && (
                <span className="text-neutral-500"> • {product.subcategory}</span>
              )}
              {product.brand && <span className="text-neutral-500"> • {product.brand}</span>}
            </p>

            <h3 className="mt-2 text-lg font-semibold text-neutral-900 truncate">
              {product.name}
            </h3>

            {product.description ? (
              <p className="mt-2 text-sm text-neutral-700 line-clamp-2">
                {product.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-700/0 select-none">.</p>
            )}
          </div>

          <div className="shrink-0 text-right">
            <p suppressHydrationWarning className="text-lg font-semibold text-neutral-900">
              {formatBRL(product.price)}
            </p>
            <p className="text-xs text-neutral-600">
              aproximado <br /> por unidade
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          {/* ✅ Botão vira contador quando qty > 0 */}
          {qty === 0 ? (
            <button
              onClick={handleAddFirst}
              className={[
                "inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-white",
                "transition active:scale-[0.99]",
                justAdded ? "bg-emerald-600 scale-[1.01]" : "bg-neutral-900 hover:opacity-95",
              ].join(" ")}
              aria-label={justAdded ? "Produto adicionado ao carrinho" : "Adicionar ao carrinho"}
            >
              {justAdded ? "Adicionado ✓" : "Adicionar"}
            </button>
          ) : (
            <div
              className="inline-flex items-center rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur px-2 py-2"
              aria-label="Controle de quantidade"
            >
              <button
                onClick={handleMinus}
                className="h-10 w-10 rounded-xl bg-white/70 text-neutral-900 border border-neutral-200 hover:bg-white transition"
                aria-label="Diminuir quantidade"
              >
                −
              </button>

              <input
                value={qty}
                onChange={(e) => {
                  const next = Number(String(e.target.value).replace(/\D/g, ""));
                  setQty(product.id, next);
                }}
                className="mx-2 w-10 text-center text-sm font-semibold text-neutral-900 bg-transparent outline-none"
                inputMode="numeric"
                aria-label="Quantidade"
              />

              <button
                onClick={handlePlus}
                className="h-10 w-10 rounded-xl bg-neutral-900 text-white hover:opacity-95 transition"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          )}

          <span suppressHydrationWarning className="text-right text-xs text-neutral-600">
            {hasKgInfo ? (
              <>
                {formatBRL(product.pricePerKg)} / kg
                <br />
              </>
            ) : null}

            {hasWeightInfo ? (
              <>
                {product.avgWeightG}g{" "}
                <span className="text-neutral-500">(peso médio por unidade)</span>
              </>
            ) : (
              <span className="text-neutral-500">info em breve</span>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}