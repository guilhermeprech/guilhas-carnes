"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { normalizeSearch } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { SearchIcon, CloseIcon } from "../components/icons";

type Props = {
  categories: Category[];
  products: Product[];
  /** cards renderizados no servidor, indexados pelo id do produto */
  cards: Record<string, React.ReactNode>;
};

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "shrink-0 h-10 px-4 text-[0.95rem] border transition-colors",
        active ? "bg-ink text-paper border-ink" : "border-line bg-white/70 hover:border-ink",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function CatalogBrowser({ categories, products, cards }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [category, setCategory] = useState(params.get("categoria") ?? "");
  const [sub, setSub] = useState(params.get("tipo") ?? "");
  const [query, setQuery] = useState(params.get("busca") ?? "");

  // mantém filtros na URL (compartilhável e preservado no "voltar")
  useEffect(() => {
    const next = new URLSearchParams();
    if (category) next.set("categoria", category);
    if (category && sub) next.set("tipo", sub);
    if (query.trim()) next.set("busca", query.trim());
    const qs = next.toString();
    const t = window.setTimeout(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 250);
    return () => window.clearTimeout(t);
  }, [category, sub, query, pathname, router]);

  const activeCategory = categories.find((c) => c.slug === category);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    return products.filter((p) => {
      if (category && p.categorySlug !== category) return false;
      if (category && sub && p.subcategorySlug !== sub) return false;
      if (!q) return true;
      return [p.name, p.brand ?? "", p.category, p.subcategory ?? "", p.description ?? ""].some((v) =>
        normalizeSearch(v).includes(q),
      );
    });
  }, [products, category, sub, query]);

  // disponíveis primeiro
  const ordered = useMemo(
    () => [...filtered.filter((p) => p.available), ...filtered.filter((p) => !p.available)],
    [filtered],
  );

  const reset = () => {
    setCategory("");
    setSub("");
    setQuery("");
  };

  return (
    <>
      <div className="sticky top-[var(--header-h)] z-30 -mx-5 border-b border-line bg-paper/95 px-5 py-3 backdrop-blur-md md:-mx-10 md:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block lg:w-80">
            <span className="sr-only">Buscar produto</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-stone" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar: picanha, costela, carvão…"
              className="field min-h-11 pl-11 pr-10"
              enterKeyHint="search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-stone-dark hover:text-ink"
                aria-label="Limpar busca"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Categoria">
            <Chip active={!category} onClick={() => { setCategory(""); setSub(""); }}>
              Todos
            </Chip>
            {categories.map((c) => (
              <Chip key={c.slug} active={category === c.slug} onClick={() => { setCategory(c.slug); setSub(""); }}>
                {c.name} <span className="tabular opacity-60">{c.count}</span>
              </Chip>
            ))}
          </div>
        </div>

        {activeCategory && activeCategory.subcategories.length > 0 && (
          <div className="no-scrollbar -mx-5 mt-3 flex gap-5 overflow-x-auto px-5 text-[0.95rem] md:mx-0 md:px-0" role="group" aria-label="Tipo">
            {[{ name: "Todos", slug: "", count: activeCategory.count }, ...activeCategory.subcategories].map((s) => (
              <button
                key={s.slug || "todos"}
                type="button"
                aria-pressed={sub === s.slug}
                onClick={() => setSub(s.slug)}
                className={`shrink-0 py-1 border-b-2 transition-colors ${sub === s.slug ? "border-ink text-ink" : "border-transparent text-stone-dark hover:text-ink"}`}
              >
                {s.name} <span className="tabular opacity-60">{s.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="mt-6 text-sm text-stone-dark" aria-live="polite">
        {ordered.length === 0
          ? "Nenhum produto encontrado."
          : `${ordered.length} ${ordered.length === 1 ? "produto" : "produtos"}${query.trim() ? ` para “${query.trim()}”` : ""}`}
      </p>

      {ordered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-display text-3xl">Nada com esse nome por aqui.</p>
          <p className="mt-3 text-stone-dark">Confira a grafia ou veja todos os produtos.</p>
          <button type="button" onClick={reset} className="btn btn-solid mt-6">
            Mostrar todos
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-y-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {ordered.map((p) => (
            <div key={p.id}>{cards[p.id]}</div>
          ))}
        </div>
      )}
    </>
  );
}
