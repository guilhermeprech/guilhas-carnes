"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CUTS, cutLabel } from "@/lib/cuts";
import { normalizeSearch } from "@/lib/format";
import type { Category, Product } from "@/lib/types";
import { CloseIcon, SearchIcon } from "../components/icons";
import { CutMap } from "../components/cut-map";
import { ShowcaseCard } from "../components/showcase-card";

type Props = { categories: Category[]; products: Product[] };

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={[
        "shrink-0 h-10 px-4 text-[0.95rem] transition-colors",
        active ? "bg-paper text-ink" : "bg-white/[0.06] text-paper/80 hover:bg-white/[0.12] hover:text-paper",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function ShowcaseGrid({ items, featureFirst = true }: { items: Product[]; featureFirst?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3 md:gap-2 lg:grid-flow-dense xl:grid-cols-4">
      {items.map((p, i) => (
        <ShowcaseCard key={p.id} product={p} priority={i < 4} large={featureFirst && items.length >= 5 && i % 9 === 0 && !!p.image} />
      ))}
    </div>
  );
}

export function CatalogBrowser({ categories, products }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [category, setCategory] = useState(params.get("categoria") ?? "");
  const [sub, setSub] = useState(params.get("tipo") ?? "");
  const [cut, setCut] = useState<string | null>(params.get("corte"));
  const [query, setQuery] = useState(params.get("busca") ?? "");

  useEffect(() => {
    const next = new URLSearchParams();
    if (category) next.set("categoria", category);
    if (category && sub) next.set("tipo", sub);
    if (cut) next.set("corte", cut);
    if (query.trim()) next.set("busca", query.trim());
    const qs = next.toString();
    const t = window.setTimeout(() => router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }), 250);
    return () => window.clearTimeout(t);
  }, [category, sub, cut, query, pathname, router]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of products) if (p.cut) c[p.cut] = (c[p.cut] ?? 0) + 1;
    return c;
  }, [products]);

  const activeCategory = categories.find((c) => c.slug === category);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    const list = products.filter((p) => {
      if (category && p.categorySlug !== category) return false;
      if (category && sub && p.subcategorySlug !== sub) return false;
      if (cut && p.cut !== cut) return false;
      if (!q) return true;
      return [p.name, p.brand ?? "", p.category, p.subcategory ?? "", cutLabel(p.cut) ?? "", p.description ?? ""].some((v) =>
        normalizeSearch(v).includes(q),
      );
    });
    // com foto e disponíveis primeiro
    const rank = (p: Product) => (p.available ? 0 : 2) + (p.image ? 0 : 1);
    return list.map((p, i) => ({ p, i })).sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i).map((x) => x.p);
  }, [products, category, sub, cut, query]);

  const filtering = !!(category || cut || query.trim());

  const chooseCut = (id: string | null) => {
    setCut(id);
    if (id) {
      setCategory("");
      setSub("");
    }
  };

  const reset = () => {
    setCategory("");
    setSub("");
    setCut(null);
    setQuery("");
  };

  return (
    <>
      {/* Guia de cortes */}
      <section aria-labelledby="guia" className="grid gap-6 pb-10 md:grid-cols-12 md:items-center md:gap-10 md:pb-14">
        <div className="md:col-span-4">
          <h2 id="guia" className="text-xl font-semibold tracking-[-0.01em]">Escolha pela parte do boi</h2>
          <p className="mt-2 max-w-sm text-paper/60 leading-relaxed">
            Toque numa região para ver os cortes que saem dela.
          </p>
          <div className={`mt-5 md:min-h-12 ${cut ? "" : "hidden md:block"}`} aria-live="polite">
            {cut ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[1.75rem] font-semibold leading-none tracking-[-0.02em]">{cutLabel(cut)}</span>
                <button type="button" onClick={() => setCut(null)} className="inline-flex items-center gap-1.5 text-sm text-paper/60 hover:text-paper">
                  <CloseIcon className="h-4 w-4" /> Limpar
                </button>
              </div>
            ) : null}
          </div>
        </div>
        <div className="-mx-2 md:col-span-8 md:mx-0">
          <CutMap mode="select" counts={counts} selected={cut} onSelect={chooseCut} />
        </div>
        {/* No celular, as regiões também viram botões (o desenho fica pequeno) */}
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:hidden" role="group" aria-label="Parte do boi">
          {CUTS.filter((c) => counts[c.id]).map((c) => (
            <Chip key={c.id} active={cut === c.id} onClick={() => chooseCut(cut === c.id ? null : c.id)}>
              {c.label} <span className="tabular opacity-50">{counts[c.id]}</span>
            </Chip>
          ))}
        </div>
      </section>

      {/* Barra de filtros */}
      <div className="sticky top-[var(--header-h)] z-30 mx-[calc(50%-50vw)] border-y border-line-dark bg-ink/95 py-3 backdrop-blur-md">
        <div className="wrap">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block lg:w-80">
            <span className="sr-only">Buscar produto</span>
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-paper/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar picanha, costela, carvão"
              enterKeyHint="search"
              className="h-11 w-full bg-white/[0.06] pl-11 pr-10 text-base text-paper placeholder:text-paper/40 outline-none transition-colors focus:bg-white/[0.1]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-1 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center text-paper/60 hover:text-paper"
                aria-label="Limpar busca"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </label>

          <div className="no-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 md:mx-0 md:px-0" role="group" aria-label="Categoria">
            <Chip active={!category && !cut} onClick={() => { setCategory(""); setSub(""); setCut(null); }}>
              Tudo
            </Chip>
            {categories.map((c) => (
              <Chip key={c.slug} active={category === c.slug} onClick={() => { setCategory(c.slug); setSub(""); setCut(null); }}>
                {c.name} <span className="tabular opacity-50">{c.count}</span>
              </Chip>
            ))}
          </div>
        </div>

        {activeCategory && activeCategory.subcategories.length > 0 && (
          <div className="no-scrollbar -mx-5 mt-3 flex gap-6 overflow-x-auto px-5 text-[0.95rem] md:mx-0 md:px-0" role="group" aria-label="Tipo">
            {[{ name: "Todos", slug: "", count: activeCategory.count }, ...activeCategory.subcategories].map((s) => (
              <button
                key={s.slug || "todos"}
                type="button"
                aria-pressed={sub === s.slug}
                onClick={() => setSub(s.slug)}
                className={`shrink-0 border-b-2 py-1 transition-colors ${sub === s.slug ? "border-paper text-paper" : "border-transparent text-paper/50 hover:text-paper"}`}
              >
                {s.name} <span className="tabular opacity-50">{s.count}</span>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 text-sm text-paper/50">
        <p aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
          {query.trim() ? ` para “${query.trim()}”` : ""}
        </p>
        {filtering && (
          <button type="button" onClick={reset} className="hover:text-paper">
            Limpar filtros
          </button>
        )}
      </div>

      <div className="mt-4">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-2xl font-semibold tracking-[-0.02em]">Nenhum produto com esse nome.</p>
            <p className="mt-2 text-paper/60">Confira a grafia ou veja o catálogo inteiro.</p>
            <button type="button" onClick={reset} className="btn btn-light mt-6">
              Mostrar tudo
            </button>
          </div>
        ) : (
          <ShowcaseGrid items={filtered} featureFirst={!filtering} />
        )}
      </div>
    </>
  );
}
