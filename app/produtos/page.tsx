import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "./catalog-browser";
import { ProductCard } from "../components/product-card";
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
  const products = getAllProducts();
  const categories = getCategories();
  const cards = Object.fromEntries(
    products.map((p, i) => [p.id, <ProductCard key={p.id} product={p} priority={i < 2} />]),
  );

  return (
    <div className="wrap pb-24">
      <header className="grid gap-4 pb-8 pt-10 md:grid-cols-12 md:items-end md:pb-10 md:pt-16">
        <h1 className="font-display text-[clamp(3rem,9vw,6rem)] leading-[0.9] md:col-span-7">Cortes</h1>
        <p className="max-w-md text-stone-dark leading-relaxed md:col-span-5 md:justify-self-end">
          Preço por quilo e estimativa por peça. O valor final é calculado pelo peso real e confirmado no WhatsApp.
          Entrega em {site.city} por {formatBRL(site.deliveryFeeCents)}.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mt-6 grid gap-y-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <div key={p.id}>{cards[p.id]}</div>
            ))}
          </div>
        }
      >
        <CatalogBrowser categories={categories} products={products} cards={cards} />
      </Suspense>
    </div>
  );
}
