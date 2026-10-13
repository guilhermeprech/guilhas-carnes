import Image from "next/image";
import Link from "next/link";
import hero from "@/public/images/hero.webp";
import { CutMap } from "./components/cut-map";
import { ShowcaseGrid } from "./produtos/catalog-browser";
import { CUTS } from "@/lib/cuts";
import { WhatsAppIcon } from "./components/icons";
import { getAllProducts, getCategories, getFeaturedProducts } from "@/lib/products";
import { formatBRL } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";

export const metadata = {
  alternates: { canonical: "/" },
};

const steps = [
  {
    title: "Monte o pedido",
    text: "Escolha os cortes e as quantidades, com preço por quilo e estimativa por peça.",
  },
  {
    title: "Envie pelo WhatsApp",
    text: "Informe nome e endereço. A mensagem sai pronta para o nosso WhatsApp.",
  },
  {
    title: "Confirme e pague",
    text: "Confirmamos o peso real e o valor final. Pagamento por Pix, depois da confirmação.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProducts(5);
  const cutCounts: Record<string, number> = {};
  for (const p of getAllProducts()) if (p.cut) cutCounts[p.cut] = (cutCounts[p.cut] ?? 0) + 1;
  // categorias com produtos fora do mapa do boi
  const others = getCategories().filter((c) => getAllProducts().some((p) => p.categorySlug === c.slug && !p.cut && c.slug !== "bovinos"));
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
      <section className="relative -mt-[var(--header-h)] overflow-hidden bg-ink text-paper">
        <div className="relative md:grid md:min-h-[min(100svh,58rem)] md:grid-cols-12">
          <div className="absolute inset-0 md:relative md:order-2 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
            <Image
              src={hero}
              alt="Tomahawk assado segurado por uma mão de luva preta, sobre tábua com sal grosso"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 768px) 55vw, 100vw"
              className="object-cover object-[50%_35%]"
            />
            {/* degradê: funde a foto no fundo preto e garante leitura do texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10 md:bg-gradient-to-r md:from-ink md:via-ink/20 md:to-transparent" />
          </div>

          <div className="relative flex min-h-[min(100svh,46rem)] flex-col justify-end px-5 pb-12 pt-[calc(var(--header-h)+4rem)] md:order-1 md:col-span-6 md:col-start-1 md:row-start-1 md:min-h-0 md:justify-center md:pb-20 md:pl-[max(2.5rem,calc((100vw-82rem)/2+2.5rem))] md:pr-0">
            <div className="max-w-[34rem]">
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

      {/* ── Guia de cortes + destaques ─────────────────────── */}
      <section aria-labelledby="guia" className="border-t border-line-dark bg-ink py-20 text-paper md:py-28">
        <div className="wrap">
          <div className="flex items-end justify-between gap-6">
            <h2 id="guia" className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-none">
              Escolha pelo corte
            </h2>
            <Link href="/produtos" className="link-underline shrink-0 text-sm text-paper/70 hover:text-paper md:text-base">
              Todos os {total} produtos
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-5xl md:mt-14">
            <CutMap mode="link" counts={cutCounts} hrefBase="/produtos?corte=" />
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

          {others.length > 0 && (
            <p className="mt-6 text-center text-sm text-paper/50">
              Fora do boi:{" "}
              {others.map((c, i) => (
                <span key={c.slug}>
                  {i > 0 && (i === others.length - 1 ? " e " : ", ")}
                  <Link href={`/produtos?categoria=${c.slug}`} className="link-underline text-paper/80 hover:text-paper">
                    {c.name.toLowerCase()}
                  </Link>
                </span>
              ))}
            </p>
          )}

          {featured.length > 0 && (
            <div className="mt-24 md:mt-32">
              <h2 className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">Em destaque</h2>
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
          <h2 id="como-pedir-titulo" className="font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-none">
            Como pedir
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t border-ink pt-5">
                <span className="tabular text-sm text-stone-dark">{i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em]">{s.title}</h3>
                <p className="mt-2 max-w-[20rem] leading-relaxed text-stone-dark">{s.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 flex flex-col gap-6 border-t border-line pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-stone-dark">
              Entrega em {site.city}: <span className="tabular font-semibold text-ink">{formatBRL(site.deliveryFeeCents)}</span> de taxa fixa.
              Retirada a combinar.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/produtos" className="btn btn-solid">
                Ver os cortes
              </Link>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <WhatsAppIcon /> Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
