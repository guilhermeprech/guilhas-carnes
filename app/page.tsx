import Image from "next/image";
import Link from "next/link";
import hero from "@/public/images/hero.webp";
import { ProductCard } from "./components/product-card";
import { ProductImage } from "./components/product-image";
import { WhatsAppIcon } from "./components/icons";
import { getAllProducts, getBrands, getCategories, getFeaturedProducts } from "@/lib/products";
import { formatBRL } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

/** Prateleiras da home: subcategorias quando existem, senão a categoria inteira */
function getShelves() {
  return getCategories().flatMap((c) =>
    c.subcategories.length
      ? c.subcategories.map((s) => {
          const items = getAllProducts().filter((p) => p.categorySlug === c.slug && p.subcategorySlug === s.slug);
          return {
            key: `${c.slug}-${s.slug}`,
            title: s.name,
            meta: `${c.name}, ${s.count} ${s.count === 1 ? "produto" : "produtos"}`,
            href: `/produtos?categoria=${c.slug}&tipo=${s.slug}`,
            image: items.find((p) => p.image)?.image ?? null,
            sample: items.slice(0, 4).map((p) => p.name),
          };
        })
      : [
          {
            key: c.slug,
            title: c.name,
            meta: `${c.count} ${c.count === 1 ? "produto" : "produtos"}`,
            href: `/produtos?categoria=${c.slug}`,
            image: c.image,
            sample: getAllProducts().filter((p) => p.categorySlug === c.slug).slice(0, 4).map((p) => p.name),
          },
        ],
  );
}

const steps = [
  {
    title: "Monte o pedido",
    text: "Escolha os cortes e as quantidades. Cada produto mostra o preço por quilo e uma estimativa por peça.",
  },
  {
    title: "Envie pelo WhatsApp",
    text: "Informe nome e endereço. A mensagem com o pedido completo sai pronta para o nosso WhatsApp.",
  },
  {
    title: "Confirme e pague",
    text: "Confirmamos o peso real e o valor final. O pagamento é por Pix, depois da confirmação.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts(6);
  const shelves = getShelves();
  const brands = getBrands();
  const total = getAllProducts().length;

  const storeLd = {
    "@context": "https://schema.org",
    "@type": "ButcherShop",
    name: site.name,
    url: site.url,
    image: `${site.url}/images/og-image.jpg`,
    telephone: `+${site.whatsappPhone}`,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressRegion: site.state, addressCountry: "BR" },
    sameAs: [site.instagram],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(storeLd) }} />
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative -mt-[var(--header-h)] bg-ink text-paper overflow-hidden">
        <div className="relative md:grid md:grid-cols-12 md:min-h-[min(100svh,58rem)]">
          <div className="absolute inset-0 md:relative md:order-2 md:col-span-7 lg:col-span-6 md:col-start-6 lg:col-start-7">
            <Image
              src={hero}
              alt="Tomahawk assado segurado por uma mão de luva preta, sobre tábua com sal grosso"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 55vw, 100vw"
              className="hero-settle object-cover object-[50%_35%]"
            />
            {/* legibilidade do texto sobre a foto */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/20 md:to-transparent" />
          </div>

          <div className="relative px-5 md:order-1 md:col-span-6 md:col-start-1 md:row-start-1 md:pr-0 md:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] flex min-h-[min(100svh,46rem)] flex-col justify-end pb-12 pt-[calc(var(--header-h)+4rem)] md:min-h-0 md:justify-center md:pb-20">
            <div className="hero-rise max-w-[34rem]">
              <h1 className="font-display text-[clamp(3rem,11vw,6.25rem)] leading-[0.92] tracking-[-0.02em]">
                Carnes de qualidade pro teu churrasco.
              </h1>
              <p className="mt-6 max-w-[26rem] text-[1.075rem] leading-relaxed text-paper/80">
                Teu açougue de confiança na palma da mão. Monta teu pedido e a gente entrega na porta da tua casa.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/produtos" className="btn btn-light">
                  Ver os cortes
                </Link>
                <Link href="#como-pedir" className="btn btn-outline text-paper">
                  Como pedir
                </Link>
              </div>
              <p className="mt-7 text-sm text-paper/60">
                Entrega em {site.city} por {formatBRL(site.deliveryFeeCents)} ou retirada a combinar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Apresentação ───────────────────────────────────── */}
      <section className="wrap grid gap-10 py-20 md:grid-cols-12 md:py-28">
        <h2 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] md:col-span-7">
          Cortes escolhidos no padrão Guilhas, do churrasco de domingo ao bife da semana.
        </h2>
        <div className="md:col-span-4 md:col-start-9 md:pt-3 space-y-5 text-[1.05rem] leading-relaxed text-stone-dark">
          <p>
            Cada produto tem preço por quilo e peso médio da peça, para você saber quanto vai gastar antes de pedir. O valor
            final é confirmado no WhatsApp, pelo peso real.
          </p>
          {brands.length > 0 && (
            <p>
              No catálogo: <span className="text-ink">{brands.join(", ").replace(/, ([^,]*)$/, " e $1")}</span>.
            </p>
          )}
        </div>
      </section>

      {/* ── Categorias (balcão) ────────────────────────────── */}
      <section aria-labelledby="balcao" className="wrap pb-20 md:pb-28">
        <div className="flex items-end justify-between gap-6 border-b border-ink pb-4">
          <h2 id="balcao" className="font-display text-[2rem] md:text-[2.5rem] leading-none">
            Escolha pelo corte
          </h2>
          <Link href="/produtos" className="link-underline text-sm md:text-base shrink-0">
            Todos os {total} produtos
          </Link>
        </div>
        <ul>
          {shelves.map((s) => (
            <li key={s.key} className="border-b border-line">
              <Link href={s.href} className="group grid grid-cols-[1fr_auto] items-center gap-5 py-6 md:grid-cols-[5rem_1fr_1.2fr_auto] md:gap-8 md:py-7">
                <ProductImage
                  src={s.image}
                  alt=""
                  sizes="80px"
                  className="hidden md:block aspect-square w-20"
                />
                <div>
                  <h3 className="font-display text-[2.25rem] md:text-[3rem] leading-none transition-transform duration-500 ease-out-soft group-hover:translate-x-1">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-stone-dark">{s.meta}</p>
                </div>
                <p className="hidden md:block text-stone-dark leading-relaxed">{s.sample.join(", ")}</p>
                <span className="text-sm underline decoration-1 underline-offset-4 decoration-ink/30 group-hover:decoration-ink">
                  Ver
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Destaques ──────────────────────────────────────── */}
      {featured.length > 0 && (
        <section aria-labelledby="destaques" className="bg-white py-20 md:py-28">
          <div className="wrap">
            <div className="flex items-end justify-between gap-6">
              <h2 id="destaques" className="font-display text-[2rem] md:text-[2.5rem] leading-none">
                Em destaque
              </h2>
              <Link href="/produtos" className="link-underline text-sm md:text-base shrink-0">
                Ver catálogo
              </Link>
            </div>
            <div className="mt-10 grid gap-y-8 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Como pedir ─────────────────────────────────────── */}
      <section id="como-pedir" aria-labelledby="como-pedir-titulo" className="scroll-mt-[var(--header-h)] bg-ink text-paper py-20 md:py-28">
        <div className="wrap">
          <h2 id="como-pedir-titulo" className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
            Como pedir
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-line-dark pt-6">
                <span className="font-display text-[3.5rem] leading-none text-paper/35 tabular">{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-[22rem] leading-relaxed text-paper/65">{s.text}</p>
              </li>
            ))}
          </ol>

          <dl className="mt-16 grid gap-px bg-line-dark sm:grid-cols-2">
            <div className="bg-ink py-6 sm:pr-8">
              <dt className="text-paper/60">Entrega em {site.city}</dt>
              <dd className="mt-1 font-display text-[2.25rem] leading-tight tabular">
                {formatBRL(site.deliveryFeeCents)} <span className="font-sans text-base text-paper/60">taxa fixa</span>
              </dd>
            </div>
            <div className="bg-ink py-6 sm:pl-8">
              <dt className="text-paper/60">Retirada</dt>
              <dd className="mt-1 font-display text-[2.25rem] leading-tight">A combinar</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* ── Chamada final ──────────────────────────────────── */}
      <section className="wrap py-24 md:py-32 text-center">
        <h2 className="mx-auto max-w-3xl font-display text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95]">
          Monta teu pedido.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[1.05rem] text-stone-dark">
          {total} produtos com preço por quilo. Dúvida sobre algum corte? Chama no WhatsApp.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/produtos" className="btn btn-solid">
            Ver os cortes
          </Link>
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            <WhatsAppIcon /> Falar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
