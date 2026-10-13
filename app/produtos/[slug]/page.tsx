import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchase } from "../../components/add-to-cart";
import { ProductCard } from "../../components/product-card";
import { ProductImage } from "../../components/product-image";
import { getAllProducts, getProductBySlug, getRelatedProducts } from "@/lib/products";
import { formatBRL, formatWeight } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import type { Product } from "@/lib/types";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

function describe(p: Product) {
  if (p.description) return p.description;
  const base = `${p.name}${p.brand ? ` ${p.brand}` : ""}`;
  if (p.saleType === "unit") return `${base} por ${formatBRL(p.priceCents)} a unidade. Peça pelo WhatsApp no ${site.name}, em ${site.city}.`;
  return `${base}: ${formatBRL(p.pricePerKgCents)}/kg, peça média de ${formatWeight(p.avgWeightGrams)}. Peça pelo WhatsApp no ${site.name}, em ${site.city}.`;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) return {};
  const url = `/produtos/${p.slug}`;
  return {
    title: p.name,
    description: describe(p),
    alternates: { canonical: url },
    openGraph: {
      url,
      title: `${p.name} | ${site.name}`,
      description: describe(p),
      ...(p.image ? { images: [{ url: p.image, alt: p.name }] } : {}),
    },
  };
}

function jsonLd(p: Product) {
  const offer =
    p.saleType === "unit"
      ? { price: (p.priceCents / 100).toFixed(2) }
      : {
          price: (p.pricePerKgCents / 100).toFixed(2),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: (p.pricePerKgCents / 100).toFixed(2),
            priceCurrency: "BRL",
            referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "KGM" },
          },
        };
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: describe(p),
    category: [p.category, p.subcategory].filter(Boolean).join(" > "),
    ...(p.image ? { image: `${site.url}${p.image}` } : {}),
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    sku: p.id,
    url: `${site.url}/produtos/${p.slug}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      availability: p.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: site.name },
      ...offer,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();

  const related = getRelatedProducts(p, 4);
  const catHref = `/produtos?categoria=${p.categorySlug}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p)).replace(/</g, "\\u003c") }}
      />

      <div className="wrap pb-20 pt-6 md:pt-10">
        <nav aria-label="Você está em" className="text-sm text-stone-dark">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link href="/produtos" className="hover:text-ink">Cortes</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={catHref} className="hover:text-ink">{p.category}</Link></li>
            {p.subcategory && p.subcategorySlug && (
              <>
                <li aria-hidden>/</li>
                <li><Link href={`${catHref}&tipo=${p.subcategorySlug}`} className="hover:text-ink">{p.subcategory}</Link></li>
              </>
            )}
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-12 md:gap-12">
          <ProductImage
            src={p.image}
            alt={p.name}
            priority
            muted={!p.available}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="-mx-5 aspect-[4/3] md:mx-0 md:col-span-7"
          />

          <div className="md:col-span-5 md:pt-2">
            {p.brand && <p className="text-stone-dark">{p.brand}</p>}
            <h1 className="mt-1 font-display text-[clamp(2.75rem,6vw,4.5rem)] leading-[0.95]">{p.name}</h1>

            <dl className="mt-8 border-t border-ink">
              {p.saleType === "weight" ? (
                <>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                    <dt className="text-stone-dark">Preço por kg</dt>
                    <dd className="tabular font-display text-[2rem] leading-none">{formatBRL(p.pricePerKgCents)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                    <dt className="text-stone-dark">Peso médio da peça</dt>
                    <dd className="tabular font-semibold">{formatWeight(p.avgWeightGrams)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                    <dt className="text-stone-dark">Valor estimado por peça</dt>
                    <dd className="tabular font-semibold">{formatBRL(p.priceCents)}</dd>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                    <dt className="text-stone-dark">Preço</dt>
                    <dd className="tabular font-display text-[2rem] leading-none">{formatBRL(p.priceCents)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line py-4">
                    <dt className="text-stone-dark">Embalagem</dt>
                    <dd className="tabular font-semibold">{formatWeight(p.avgWeightGrams)}</dd>
                  </div>
                </>
              )}
            </dl>

            {p.description && <p className="mt-6 leading-relaxed text-stone-dark">{p.description}</p>}

            <div className="mt-8">
              <ProductPurchase id={p.id} name={p.name} available={p.available} />
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-stone-dark">
              {p.saleType === "weight" && (
                <p>
                  Vendido por peso. Cada peça tem um peso diferente, então o valor final é calculado pelo peso real e
                  confirmado no WhatsApp antes do pagamento.
                </p>
              )}
              <p>
                Entrega em {site.city} por {formatBRL(site.deliveryFeeCents)} ou retirada a combinar.{" "}
                <a
                  href={whatsappLink(`Olá! Tenho uma dúvida sobre ${p.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-ink"
                >
                  Tirar dúvida no WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="border-t border-line bg-white py-16 md:py-20">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 id="relacionados" className="font-display text-[2rem] md:text-[2.5rem] leading-none">
                {p.subcategory ? `Mais de ${p.subcategory.toLowerCase()}` : `Mais em ${p.category.toLowerCase()}`}
              </h2>
              <Link href={catHref} className="link-underline shrink-0 text-sm md:text-base">
                Ver todos
              </Link>
            </div>
            <div className="mt-10 grid gap-y-7 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.id} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
