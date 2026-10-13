import Image from "next/image";
import Link from "next/link";
import hero from "@/public/images/hero.webp";
import { CutMap } from "./components/cut-map";
import { ShowcaseGrid } from "./produtos/catalog-browser";
import { CUTS } from "@/lib/cuts";
import { WhatsAppIcon } from "./components/icons";
import { getAllProducts, getBrands, getCategories, getFeaturedProducts } from "@/lib/products";
import { formatBRL } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

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
  const featured = getFeaturedProducts(5);
  const cutCounts: Record<string, number> = {};
  for (const p of getAllProducts()) if (p.cut) cutCounts[p.cut] = (cutCounts[p.cut] ?? 0) + 1;
  // categorias com produtos fora do mapa do boi
  const others = getCategories().filter((c) => getAllProducts().some((p) => p.categorySlug === c.slug && !p.cut && c.slug !== "bovinos"));
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

      {/* ── Guia de cortes + destaques (vitrine escura) ─────── */}
      <section aria-labelledby="balcao" className="bg-ink text-paper py-20 md:py-28">
        <div className="wrap">
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-10">
            <div className="md:col-span-4">
              <h2 id="balcao" className="font-display text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[0.95]">
                Escolha pelo corte
              </h2>
              <p className="mt-4 max-w-sm text-paper/60 leading-relaxed">
                Cada parte do boi leva aos cortes que saem dela, com preço por quilo.
              </p>
              {others.length > 0 && (
                <p className="mt-6 text-paper/60">
                  Também no catálogo:{" "}
                  {others.map((c, i) => (
                    <span key={c.slug}>
                      {i > 0 && (i === others.length - 1 ? " e " : ", ")}
                      <Link href={`/produtos?categoria=${c.slug}`} className="link-underline text-paper">
                        {c.name.toLowerCase()}
                      </Link>
                    </span>
                  ))}
                  .
                </p>
              )}
              <Link href="/produtos" className="btn btn-light mt-8">
                Ver os {total} produtos
              </Link>
            </div>
            <div className="-mx-2 md:col-span-8 md:mx-0">
              <CutMap mode="link" counts={cutCounts} hrefBase="/produtos?corte=" />
            </div>
          </div>
          <ul className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5 md:hidden" aria-label="Partes do boi">
            {CUTS.filter((c) => cutCounts[c.id]).map((c) => (
              <li key={c.id} className="shrink-0">
                <Link href={`/produtos?corte=${c.id}`} className="inline-flex h-10 items-center bg-white/[0.06] px-4 text-paper/85">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>

          {featured.length > 0 && (
            <div className="mt-20 md:mt-28">
              <div className="flex items-end justify-between gap-6">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Em destaque</h2>
                <Link href="/produtos" className="link-underline shrink-0 text-sm text-paper/70 hover:text-paper md:text-base">
                  Catálogo completo
                </Link>
              </div>
              <div className="mt-8">
                <ShowcaseGrid items={featured} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Como pedir ─────────────────────────────────────── */}
      <section id="como-pedir" aria-labelledby="como-pedir-titulo" className="scroll-mt-[var(--header-h)] py-20 md:py-28">
        <div className="wrap">
          <h2 id="como-pedir-titulo" className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none">
            Como pedir
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-ink pt-6">
                <span className="tabular text-sm font-semibold text-stone-dark">Passo {i + 1}</span>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 max-w-[22rem] leading-relaxed text-stone-dark">{s.text}</p>
              </li>
            ))}
          </ol>

          <dl className="mt-16 grid gap-px bg-line sm:grid-cols-2">
            <div className="bg-white p-6 md:p-8">
              <dt className="text-stone-dark">Entrega em {site.city}</dt>
              <dd className="tabular mt-1 text-[2rem] font-semibold tracking-[-0.02em]">
                {formatBRL(site.deliveryFeeCents)} <span className="text-base font-normal text-stone-dark">taxa fixa</span>
              </dd>
            </div>
            <div className="bg-white p-6 md:p-8">
              <dt className="text-stone-dark">Retirada</dt>
              <dd className="mt-1 text-[2rem] font-semibold tracking-[-0.02em]">A combinar</dd>
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
