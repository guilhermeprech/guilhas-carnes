import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo.png";
import { QuickAdd } from "./quick-add";
import { formatBRL, formatWeight } from "@/lib/format";
import type { Product } from "@/lib/types";

/** Etiqueta de preço, como as de balcão de açougue */
export function PriceTag({ product, size = "sm" }: { product: Product; size?: "sm" | "lg" | "xl" }) {
  // "xl": pequena no celular, grande a partir de telas largas (card destacado)
  const sizeClass = size === "lg" ? "text-[1.05rem]" : size === "xl" ? "text-[0.82rem] xl:text-[1.05rem]" : "text-[0.82rem]";
  if (!product.available) {
    return <span className="price-tag text-[0.8rem] font-semibold">Indisponível</span>;
  }
  const value = product.saleType === "unit" ? product.priceCents : product.pricePerKgCents;
  return (
    <span className={`price-tag tabular ${sizeClass} font-semibold`}>
      {formatBRL(value)}
      <span className="font-medium opacity-60">{product.saleType === "unit" ? " un." : "/kg"}</span>
    </span>
  );
}

/** Card da vitrine: foto quadrada, etiqueta de preço, nome sobreposto e "+" para adicionar */
export function ShowcaseCard({
  product,
  large = false,
  priority = false,
}: {
  product: Product;
  large?: boolean;
  priority?: boolean;
}) {
  const p = product;
  const detail =
    p.saleType === "weight"
      ? `Peça de ~${formatWeight(p.avgWeightGrams)}, cerca de ${formatBRL(p.priceCents)}`
      : `${formatWeight(p.avgWeightGrams)}`;

  return (
    <article className={`group relative isolate aspect-square overflow-hidden bg-char ${large ? "col-span-2 md:col-span-1 xl:col-span-2 xl:row-span-2" : ""}`}>
      {p.image ? (
        <Image
          src={p.image}
          alt=""
          fill
          priority={priority}
          sizes={large ? "(min-width: 1280px) 50vw, (min-width: 768px) 33vw, 100vw" : "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"}
          className={`-z-10 object-cover transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.04] ${p.available ? "" : "grayscale opacity-50"}`}
        />
      ) : (
        <div className="absolute inset-0 -z-10 flex items-center justify-center">
          <Image src={logo} alt="" className="w-1/3 max-w-28 invert opacity-[0.07]" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      <Link href={`/produtos/${p.slug}`} className="absolute inset-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-paper" aria-label={p.name} />

      <div className="pointer-events-none absolute left-2.5 top-2.5 md:left-3.5 md:top-3.5">
        <PriceTag product={p} size={large ? "xl" : "sm"} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3 md:p-4">
        <div className="min-w-0 text-paper">
          <h3 className={`font-semibold leading-[1.05] tracking-[-0.02em] ${large ? "text-[1.6rem] md:text-[1.2rem] xl:text-[2.4rem]" : "text-[1.02rem] md:text-[1.2rem]"}`}>
            {p.name}
          </h3>
          <p className={`mt-1 text-paper/60 ${large ? "hidden text-[0.8rem] sm:block xl:text-base" : "hidden text-[0.8rem] sm:block"}`}>{detail}</p>
        </div>
        <div className="pointer-events-auto relative z-10 shrink-0">
          <QuickAdd id={p.id} name={p.name} available={p.available} />
        </div>
      </div>
    </article>
  );
}
