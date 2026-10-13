import Link from "next/link";
import { CardCartControl } from "./add-to-cart";
import { ProductImage } from "./product-image";
import { formatBRL, formatWeight } from "@/lib/format";
import type { Product } from "@/lib/types";

export function PriceLines({ product }: { product: Product }) {
  if (product.saleType === "unit") {
    return (
      <>
        <p className="tabular text-[1.05rem] font-semibold">{formatBRL(product.priceCents)}</p>
        <p className="text-sm text-stone-dark">a unidade</p>
      </>
    );
  }
  return (
    <>
      <p className="tabular text-[1.05rem] font-semibold">
        {formatBRL(product.pricePerKgCents)}
        <span className="font-normal text-stone-dark">/kg</span>
      </p>
      <p className="tabular text-sm text-stone-dark">
        peça de ~{formatWeight(product.avgWeightGrams)}, cerca de {formatBRL(product.priceCents)}
      </p>
    </>
  );
}

/** Card do catálogo. No celular vira linha (foto à esquerda), como uma tabela de açougue. */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const href = `/produtos/${product.slug}`;
  const muted = !product.available;
  return (
    <article className="group grid grid-cols-[6.75rem_1fr] gap-x-4 sm:grid-cols-1 sm:gap-x-0">
      <Link href={href} tabIndex={-1} aria-hidden className="block">
        <ProductImage
          src={product.image}
          alt={product.name}
          muted={muted}
          priority={priority}
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 108px"
          className="aspect-square sm:aspect-[4/3]"
        />
      </Link>

      <div className="flex min-w-0 flex-col sm:pt-4">
        <p className="text-sm text-stone-dark truncate">
          {product.subcategory ?? product.category}
          {product.brand ? `, ${product.brand}` : ""}
        </p>
        <h3 className="mt-0.5 font-display text-[1.45rem] leading-[1.1] sm:text-[1.6rem]">
          <Link href={href} className="hover:underline decoration-1 underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5 sm:mt-2">
          {muted ? <p className="text-sm text-stone-dark">Indisponível no momento</p> : <PriceLines product={product} />}
        </div>
        <div className="mt-3 sm:mt-4">
          <CardCartControl id={product.id} name={product.name} available={product.available} />
        </div>
      </div>
    </article>
  );
}
