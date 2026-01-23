"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "../components/product-card";
import { Reveal } from "../components/reveal";
import { supabase } from "../../lib/supabase";
import type { Product, Category, BovinosSubcategory } from "../data/products";

type CategoryFilter = "Todos" | Category;
type BovinosSubFilter = "Todas" | BovinosSubcategory;

type DbProduct = {
  id: string;
  name: string;
  brand: string | null;
  description: string | null;
  category: Category;
  subcategory: BovinosSubcategory | null;
  price_unit: number | null;
  price_per_kg: number | null;
  avg_weight_g: number | null;
  image: string | null;
};

function mapDbToUi(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand ?? undefined,
    description: p.description ?? undefined,
    category: p.category,
    subcategory: p.subcategory ?? undefined,
    price: Number(p.price_unit ?? 0),
    pricePerKg: Number(p.price_per_kg ?? 0),
    avgWeightG: Number(p.avg_weight_g ?? 0),
    image: p.image ?? undefined,
  };
}

export default function ProdutosPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("Todos");
  const [selectedSub, setSelectedSub] = useState<BovinosSubFilter>("Todas");

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("products")
        .select(
          "id,name,brand,description,category,subcategory,price_unit,price_per_kg,avg_weight_g,image"
        )
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (!mounted) return;

      if (error) {
        setLoadError(error.message);
        setItems([]);
        setLoading(false);
        return;
      }

      const rows = (data as DbProduct[]) || [];

      // debug rápido pra conferir se brand veio
      const first = rows[0];
      if (first) {
        console.log("[SUPABASE products:first]", first);
        if (!("brand" in first)) {
          console.warn("[SUPABASE] Campo brand não veio no select()");
        }
      }

      setItems(rows.map(mapDbToUi));
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const okCategory =
        selectedCategory === "Todos" || p.category === selectedCategory;

      const okSub =
        selectedCategory !== "Bovinos" ||
        selectedSub === "Todas" ||
        p.subcategory === selectedSub;

      return okCategory && okSub;
    });
  }, [items, selectedCategory, selectedSub]);

  // ✅ Mobile: primeira fileira = 1 card
  const firstRowMobile = filtered.slice(0, 1);
  const restMobile = filtered.slice(1);

  // ✅ Desktop (lg+): primeira fileira = 3 cards
  const firstRowDesktop = filtered.slice(0, 3);
  const restDesktop = filtered.slice(3);

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal delayMs={0}>
          <header className="text-center mb-10">
            <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
              Guilhas Carnes &amp; Assados
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

        {loading ? (
          <div className="mb-8 text-center text-sm text-neutral-700">
            Carregando produtos…
          </div>
        ) : loadError ? (
          <div className="mb-8 text-center text-sm text-red-700">
            Erro ao carregar produtos: {loadError}
          </div>
        ) : null}

        {/* ✅ Filtros + contagem + primeira fileira no MESMO Reveal */}
        <Reveal delayMs={80}>
          <div className="space-y-6">
            {/* Filtros */}
            <section className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-600 mb-3">
                  Categoria
                </p>

                <div className="flex flex-wrap gap-2">
                  {(
                    ["Todos", "Bovinos", "Ovinos", "Outros"] as CategoryFilter[]
                  ).map((c) => (
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
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-4 shadow-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-600 mb-3">
                  Subcategoria
                </p>

                <div className="flex flex-wrap gap-2">
                  {(["Todas", "Dia a dia", "Churrasco"] as BovinosSubFilter[]).map(
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
            </section>

            {/* Contagem */}
            <div className="text-center text-sm text-neutral-700">
              Exibindo <span className="font-medium">{filtered.length}</span>{" "}
              produto(s)
            </div>

            {/* ✅ Primeira fileira (mobile: 1) */}
            {!loading && !loadError && firstRowMobile.length > 0 && (
              <section className="grid gap-6 lg:hidden">
                {firstRowMobile.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </section>
            )}

            {/* ✅ Primeira fileira (desktop lg+: 3) */}
            {!loading && !loadError && firstRowDesktop.length > 0 && (
              <section className="hidden lg:grid gap-6 lg:grid-cols-3">
                {firstRowDesktop.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </section>
            )}
          </div>
        </Reveal>

        {/* ✅ Restante (mobile: começa do 2º item) */}
        {!loading && !loadError && restMobile.length > 0 && (
          <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:hidden">
            {restMobile.map((product, idx) => (
              <Reveal key={product.id} delayMs={idx * 30}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </section>
        )}

        {/* ✅ Restante (desktop lg+: começa do 4º item) */}
        {!loading && !loadError && restDesktop.length > 0 && (
          <section className="mt-6 hidden lg:grid gap-6 lg:grid-cols-3">
            {restDesktop.map((product, idx) => (
              <Reveal key={product.id} delayMs={idx * 30}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}