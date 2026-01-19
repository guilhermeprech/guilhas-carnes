"use client";

import { useMemo, useState } from "react";
import { products } from "../data/products";
import { ProductCard } from "../components/product-card";
import { Reveal } from "../components/reveal";

type Category = "Todos" | "Bovinos" | "Ovinos" | "Outros";
type BovinosSub = "Todas" | "Dia a dia" | "Churrasco";

export default function ProdutosPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("Todos");
  const [selectedSub, setSelectedSub] = useState<BovinosSub>("Todas");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const okCategory =
        selectedCategory === "Todos" || p.category === selectedCategory;

      const okSub =
        selectedCategory !== "Bovinos" ||
        selectedSub === "Todas" ||
        p.subcategory === selectedSub;

      return okCategory && okSub;
    });
  }, [selectedCategory, selectedSub]);

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal delayMs={0}>
          <header className="text-center mb-10">
            <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
              Guilhas Carnes & Assados
            </p>

            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-neutral-900">
              Cortes disponíveis
            </h1>

            <p className="mt-4 text-neutral-700 text-base md:text-lg">
              Entrega em Caxias do Sul (taxa fixa R$ 15,00) • Retirada a combinar
            </p>
          </header>
        </Reveal>

        {/* Aviso */}
        <Reveal delayMs={60}>
          <div className="mb-6 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur px-6 py-5 text-sm text-neutral-700 text-center shadow-sm">
            <strong className="font-medium">Valor médio:</strong> o preço por
            unidade é aproximado e pode variar conforme o peso real do produto.
            O valor final é confirmado no WhatsApp.
          </div>
        </Reveal>

        {/* Filtros */}
        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <Reveal delayMs={80}>
            <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-600 mb-3">
                Categoria
              </p>

              <div className="flex flex-wrap gap-2">
                {(["Todos", "Bovinos", "Ovinos", "Outros"] as Category[]).map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(c);
                        setSelectedSub("Todas");
                      }}
                      className={`rounded-2xl px-4 py-2 text-sm border transition ${
                        selectedCategory === c
                          ? "bg-neutral-900 text-white border-neutral-900"
                          : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
                      }`}
                    >
                      {c}
                    </button>
                  )
                )}
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={100}>
            <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-600 mb-3">
                Subcategoria
              </p>

              <div className="flex flex-wrap gap-2">
                {(["Todas", "Dia a dia", "Churrasco"] as BovinosSub[]).map(
                  (s) => {
                    const disabled = selectedCategory !== "Bovinos";
                    const active = selectedSub === s && !disabled;

                    return (
                      <button
                        key={s}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedSub(s)}
                        className={`rounded-2xl px-4 py-2 text-sm border transition ${
                          disabled
                            ? "bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed"
                            : active
                            ? "bg-neutral-900 text-white border-neutral-900"
                            : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  }
                )}
              </div>

              {selectedCategory !== "Bovinos" && (
                <p className="mt-3 text-xs text-neutral-600">
                  Subcategoria disponível somente para Bovinos.
                </p>
              )}
            </div>
          </Reveal>
        </section>

        {/* Contagem */}
        <Reveal delayMs={80}>
          <div className="mb-6 text-center text-sm text-neutral-700">
            Exibindo <span className="font-medium">{filtered.length}</span>{" "}
            produto(s)
          </div>
        </Reveal>

        {/* Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, idx) => (
            <Reveal key={product.id} delayMs={idx * 30}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </section>
      </div>
    </main>
  );
}