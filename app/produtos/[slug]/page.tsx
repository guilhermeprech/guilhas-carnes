import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import logo from "@/public/brand/logo.png";
import { ProductPurchase } from "../../components/add-to-cart";
import { CutMap } from "../../components/cut-map";
import { PriceTag } from "../../components/showcase-card";
import { ShowcaseGrid } from "../catalog-browser";
import { cutLabel } from "@/lib/cuts";
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

function Row({ label, children, big = false }: { label: string; children: React.ReactNode; big?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line-dark py-4">
      <dt className="text-paper/60">{label}</dt>
      <dd className={`tabular ${big ? "text-[1.9rem] font-semibold leading-none tracking-[-0.02em]" : "font-semibold"}`}>{children}</dd>
    </div>
  );
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProductBySlug(slug);
  if (!p) notFound();

  const related = getRelatedProducts(p, 4);
  const catHref = `/produtos?categoria=${p.categorySlug}`;
  const cut = cutLabel(p.cut);
  const counts = Object.fromEntries(getAllProducts().filter((x) => x.cut).map((x) => [x.cut as string, 1]));

  return (
    <div className="bg-ink text-paper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p)).replace(/</g, "\\u003c") }}
      />

      <div className="wrap pb-16 pt-6 md:pb-24 md:pt-10">
        <nav aria-label="Você está em" className="text-sm text-paper/50">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><Link href="/produtos" className="hover:text-paper">Cortes</Link></li>
            <li aria-hidden>/</li>
            <li><Link href={catHref} className="hover:text-paper">{p.category}</Link></li>
            {p.subcategory && p.subcategorySlug && (
              <>
                <li aria-hidden>/</li>
                <li><Link href={`${catHref}&tipo=${p.subcategorySlug}`} className="hover:text-paper">{p.subcategory}</Link></li>
              </>
            )}
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 md:mt-8 md:grid-cols-12 md:gap-12">
          <div className="relative -mx-5 aspect-square overflow-hidden bg-char md:col-span-7 md:mx-0 md:aspect-[5/4]">
            {p.image ? (
              <Image
                src={p.image}
                alt={p.name}
                fill
                priority
                sizes="(min-width: 768px) 58vw, 100vw"
                className={`object-cover ${p.available ? "" : "grayscale opacity-50"}`}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image src={logo} alt="" className="w-1/4 max-w-32 invert opacity-[0.07]" />
                <span className="sr-only">{p.name}, foto em breve</span>
              </div>
            )}
            <div className="absolute left-4 top-4">
              <PriceTag product={p} size="lg" />
            </div>
          </div>

          <div className="md:col-span-5 md:pt-1">
            <p className="text-paper/50">{[p.subcategory ?? p.category, p.brand].filter(Boolean).join(", ")}</p>
            <h1 className="mt-2 text-[clamp(2.75rem,6.5vw,5rem)] font-semibold leading-[0.92] tracking-[-0.04em]">{p.name}</h1>

            <dl className="mt-8 border-t border-paper/80">
              {p.saleType === "weight" ? (
                <>
                  <Row label="Preço por kg" big>{formatBRL(p.pricePerKgCents)}</Row>
                  <Row label="Peso médio da peça">{formatWeight(p.avgWeightGrams)}</Row>
                  <Row label="Valor estimado por peça">{formatBRL(p.priceCents)}</Row>
                </>
              ) : (
                <>
                  <Row label="Preço" big>{formatBRL(p.priceCents)}</Row>
                  <Row label="Embalagem">{formatWeight(p.avgWeightGrams)}</Row>
                </>
              )}
            </dl>

            {p.description && <p className="mt-6 leading-relaxed text-paper/70">{p.description}</p>}

            <div className="mt-8">
              <ProductPurchase id={p.id} name={p.name} available={p.available} />
            </div>

            <div className="mt-2 space-y-3 text-sm leading-relaxed text-paper/55">
              {p.saleType === "weight" && (
                <p>
                  Vendido por peso: cada peça pesa diferente, então o valor final é calculado pelo peso real e confirmado no
                  WhatsApp antes do pagamento.
                </p>
              )}
              <p>
                Entrega em {site.city} por {formatBRL(site.deliveryFeeCents)} ou retirada a combinar.{" "}
                <a
                  href={whatsappLink(`Olá! Tenho uma dúvida sobre ${p.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline text-paper"
                >
                  Tirar dúvida no WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {cut && (
        <section aria-labelledby="origem" className="border-t border-line-dark">
          <div className="wrap grid items-center gap-6 py-14 md:grid-cols-12 md:gap-10 md:py-20">
            <div className="md:col-span-4">
              <h2 id="origem" className="text-paper/50">De onde vem</h2>
              <p className="mt-2 text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-[-0.03em]">{cut}</p>
              <Link href={`/produtos?corte=${p.cut}`} className="link-underline mt-5 inline-block text-paper/80 hover:text-paper">
                Outros cortes desta parte
              </Link>
            </div>
            <div className="md:col-span-8">
              <CutMap mode="static" counts={counts} highlight={p.cut} />
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="border-t border-line-dark py-14 md:py-20">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 id="relacionados" className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">
                {p.subcategory ? `Mais de ${p.subcategory.toLowerCase()}` : `Mais em ${p.category.toLowerCase()}`}
              </h2>
              <Link href={catHref} className="link-underline shrink-0 text-sm text-paper/70 hover:text-paper md:text-base">
                Ver todos
              </Link>
            </div>
            <div className="mt-8">
              <ShowcaseGrid items={related} featureFirst={false} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
