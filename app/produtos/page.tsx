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

function normalizeText(v: string) {
  return (v || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function useIsDesktopLg() {
  const [isLg, setIsLg] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)"); // lg
    const update = () => setIsLg(mq.matches);

    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return isLg;
}

export default function ProdutosPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("Todos");
  const [selectedSub, setSelectedSub] = useState<BovinosSubFilter>("Todas");

  // Busca
  const [query, setQuery] = useState("");

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const isDesktopLg = useIsDesktopLg();
  const firstBatchCount = isDesktopLg ? 3 : 1;

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
      setItems(rows.map(mapDbToUi));
      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = normalizeText(query);

    return items.filter((p) => {
      const okCategory =
        selectedCategory === "Todos" || p.category === selectedCategory;

      const okSub =
        selectedCategory !== "Bovinos" ||
        selectedSub === "Todas" ||
        p.subcategory === selectedSub;

      const okQuery =
        q.length === 0 ||
        normalizeText(p.name).includes(q) ||
        normalizeText(p.brand ?? "").includes(q) ||
        normalizeText(p.description ?? "").includes(q);

      return okCategory && okSub && okQuery;
    });
  }, [items, selectedCategory, selectedSub, query]);

  const qTrim = query.trim();
  const isSearching = qTrim.length > 0;

  // ✅ Primeiro “bloco” de cards que vai junto com filtros/busca
  const firstBatch = useMemo(
    () => filtered.slice(0, firstBatchCount),
    [filtered, firstBatchCount]
  );

  // ✅ Resto dos cards (com ou sem reveal)
  const rest = useMemo(
    () => filtered.slice(firstBatchCount),
    [filtered, firstBatchCount]
  );

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

            <div className="mt-6 flex justify-center">
              <a
                href="#filtros"
                className="inline-flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-900 transition"
              >
                Role para ver os cortes
                <span className="animate-bounce">↓</span>
              </a>
            </div>
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

        {/* ✅ TUDO JUNTO NO MESMO REVEAL: busca + filtros + contagem + 1ª “fileira” */}
        <Reveal delayMs={70}>
          <div id="filtros">
            {/* Busca */}
            <div className="mb-6 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-600 mb-3">
                Pesquisar
              </p>

              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Digite o nome do corte (ex: picanha, maminha...)"
                  className="w-full rounded-2xl border border-neutral-300 bg-white/70 px-4 py-3 pr-14 text-sm outline-none focus:border-neutral-500"
                />

                {qTrim.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-900 transition"
                    aria-label="Limpar busca"
                  >
                    limpar
                  </button>
                )}
              </div>
            </div>

            {/* Filtros */}
            <section className="mb-8 grid gap-4 md:grid-cols-2">
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
            <div className="mb-6 text-center text-sm text-neutral-700">
              Exibindo <span className="font-medium">{filtered.length}</span>{" "}
              produto(s)
              {qTrim.length > 0 && (
                <>
                  {" "}
                  para <span className="font-medium">“{qTrim}”</span>
                </>
              )}
            </div>

            {/* ✅ Primeiros cards junto com o Reveal (sem Reveal individual) */}
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {firstBatch.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </section>
          </div>
        </Reveal>

        {/* ✅ Resto: com Reveal só quando NÃO estiver pesquisando */}
        {rest.length > 0 && (
          <section className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((product, i) => {
              if (isSearching) {
                return <ProductCard key={product.id} product={product} />;
              }

              return (
                <Reveal key={product.id} delayMs={i * 30}>
                  <ProductCard product={product} />
                </Reveal>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}