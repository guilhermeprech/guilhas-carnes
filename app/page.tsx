// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { products } from "./data/products";
import { ProductCard } from "./components/product-card";
import { Reveal } from "./components/reveal";

export default function Home() {
  return (
    <main className="bg-[#F6F2EA] text-neutral-900">

      {/* EVENTOS (hero invertido) */}
      <Reveal>
        <section className="px-5 md:px-10 pt-10 md:pt-16">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8 items-center">
            {/* Imagem */}
            <div className="relative w-full h-[320px] md:h-[460px] overflow-hidden rounded-3xl border border-neutral-200 shadow-sm order-2 md:order-1">
              <Image
                src="/images/eventos.jpg"
                alt="Eventos Guilhas"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Texto */}
            <div className="order-1 md:order-2">
              <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
                Eventos
              </p>

              <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
                Churrasco &amp; Burger
                <br className="hidden md:block" />
                no teu evento.
              </h1>

              <p className="mt-4 text-neutral-700 text-base md:text-lg">
                Pra aniversários, empresas e confraternizações.
                <br />
                A gente monta tudo sob medida, com padrão Guilhas.
              </p>

              <div className="mt-6">
                <Link
                  href="/eventos"
                  className="block rounded-2xl px-5 py-3 bg-neutral-900 text-white font-medium text-center"
                >
                  Ver eventos
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-neutral-600 justify-center md:justify-start">
                <span className="rounded-full border border-neutral-300 px-3 py-1 bg-white/60">
                  Churrasco completo
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 bg-white/60">
                  Burger na brasa
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 bg-white/60">
                  Sob medida
                </span>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

      {/* HERO (venda de carnes) */}
      <Reveal delayMs={120}>
        <section className="px-5 md:px-10 mt-12 md:mt-16">
          <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8 items-center">
            {/* Texto */}
            <div>
              <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
                Produtos
              </p>

              <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
                Carnes de qualidade
                <br className="hidden md:block" />
                pro teu churrasco.
              </h2>

              <p className="mt-4 text-neutral-700 text-base md:text-lg">
                Teu açougue de confiança na palma da mão.
                <br />
                Monta teu pedido e a gente entrega na porta da tua casa.
              </p>

              <div className="mt-6">
                <Link
                  href="/produtos"
                  className="block rounded-2xl px-5 py-3 bg-neutral-900 text-white font-medium text-center"
                >
                  Ver cortes disponíveis
                </Link>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm text-neutral-600 justify-center md:justify-start">
                <span className="rounded-full border border-neutral-300 px-3 py-1 bg-white/60">
                  Entrega taxa fixa R$ 15,00
                </span>
                <span className="rounded-full border border-neutral-300 px-3 py-1 bg-white/60">
                  Retirada a combinar
                </span>
              </div>
            </div>

            {/* Imagem */}
            <div className="relative w-full h-[320px] md:h-[460px] overflow-hidden rounded-3xl border border-neutral-200 shadow-sm">
              <Image
                src="/images/hero.jpg"
                alt="Churrasco Guilhas"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </section>
      </Reveal>

      {/* DESTAQUES */}
      <section className="px-5 md:px-10 mt-12 md:mt-16">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-4">
          {[
            { title: "Seleção premium", desc: "Cortes escolhidos no padrão Guilhas." },
            { title: "Pronta entrega", desc: "Opções disponíveis pra hoje." },
            { title: "Entrega na porta", desc: "Compra fácil e rápida, sem complicação." },
          ].map((item, idx) => (
            <Reveal key={item.title} delayMs={idx * 90}>
              <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-neutral-700">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VITRINE */}
      <section className="px-5 md:px-10 mt-12 md:mt-16 pb-16">
        <Reveal>
          <div className="mx-auto max-w-6xl flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold">
                Pronta entrega
              </h2>
              <p className="mt-2 text-neutral-700">
                Algumas opções pra garantir o churrasco.
              </p>
            </div>

            <Link
              href="/produtos"
              className="text-sm font-medium underline underline-offset-4"
            >
              Ver catálogo completo
            </Link>
          </div>
        </Reveal>

        <div className="mx-auto max-w-6xl mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product, idx) => (
            <Reveal key={product.id} delayMs={idx * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  );
}