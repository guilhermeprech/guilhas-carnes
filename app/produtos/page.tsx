import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser, ShowcaseGrid } from "./catalog-browser";
import { getAllProducts, getCategories } from "@/lib/products";
import { formatBRL } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cortes e produtos",
  description: `Catálogo completo de carnes do ${site.name}: cortes bovinos para churrasco e dia a dia, suínos e carvão, com preço por quilo. Entrega em ${site.city}.`,
  alternates: { canonical: "/produtos" },
  openGraph: { url: "/produtos", title: `Cortes e produtos | ${site.name}` },
};

export default function ProdutosPage() {
  // mesma ordem que o catálogo usa no cliente: com foto e disponíveis primeiro
  const rank = (p: { available: boolean; image: string | null }) => (p.available ? 0 : 2) + (p.image ? 0 : 1);
  const products = getAllProducts()
    .map((p, i) => ({ p, i }))
    .sort((a, b) => rank(a.p) - rank(b.p) || a.i - b.i)
    .map((x) => x.p);
  const categories = getCategories();

  return (
    <div className="overflow-x-clip bg-ink text-paper">
      <div className="wrap pb-24">
        <header className="flex flex-col gap-4 pb-10 pt-10 md:flex-row md:items-end md:justify-between md:pb-12 md:pt-16">
          <h1 className="font-display text-[clamp(3.25rem,10vw,7rem)] leading-[0.85]">Cortes</h1>
          <p className="max-w-sm text-paper/60 leading-relaxed">
            Preço por quilo e estimativa por peça. O valor final sai pelo peso real e é confirmado no WhatsApp. Entrega em{" "}
            {site.city} por {formatBRL(site.deliveryFeeCents)}.
          </p>
        </header>

        <Suspense fallback={<ShowcaseGrid items={products} />}>
          <CatalogBrowser categories={categories} products={products} />
        </Suspense>
      </div>
    </div>
  );
}
