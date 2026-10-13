"use client";

import Link from "next/link";
import { useCart } from "../cart-context";
import { QuantityStepper } from "../components/add-to-cart";
import { ProductImage } from "../components/product-image";
import { formatBRL, formatWeight } from "@/lib/format";
import { hasWeightItems, lineTotalCents } from "@/lib/order";
import { site } from "@/lib/site";

export function CartView() {
  const { ready, lines, totalItems, subtotalCents, setQty, remove, clear } = useCart();
  const weight = hasWeightItems(lines);

  return (
    <div className="wrap pb-24">
      <header className="pb-8 pt-10 md:pt-16">
        <h1 className="font-display text-[clamp(3rem,9vw,5.5rem)] leading-[0.9]">Carrinho</h1>
      </header>

      {!ready ? (
        <div className="h-40" aria-busy="true" />
      ) : lines.length === 0 ? (
        <div className="border-t border-ink py-16">
          <p className="font-display text-3xl">Teu carrinho está vazio.</p>
          <p className="mt-3 text-stone-dark">Escolha os cortes e volte aqui para enviar o pedido pelo WhatsApp.</p>
          <Link href="/produtos" className="btn btn-solid mt-8">
            Ver os cortes
          </Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-12">
          <section aria-label="Itens" className="lg:col-span-8">
            <ul className="border-t border-ink">
              {lines.map(({ product: p, qty }) => (
                <li key={p.id} className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
                  <Link href={`/produtos/${p.slug}`} tabIndex={-1} aria-hidden>
                    <ProductImage src={p.image} alt={p.name} sizes="112px" className="aspect-square" />
                  </Link>
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="font-display text-[1.6rem] leading-tight">
                        <Link href={`/produtos/${p.slug}`} className="hover:underline decoration-1 underline-offset-4">
                          {p.name}
                        </Link>
                      </h2>
                      <p className="tabular mt-1 text-sm text-stone-dark">
                        {p.saleType === "weight"
                          ? `${formatBRL(p.pricePerKgCents)}/kg, peça de ~${formatWeight(p.avgWeightGrams)}`
                          : `${formatBRL(p.priceCents)} a unidade`}
                      </p>
                      <div className="mt-3 flex items-center gap-4">
                        <QuantityStepper size="sm" value={qty} label={p.name} onChange={(n) => setQty(p.id, n)} />
                        <button type="button" onClick={() => remove(p.id)} className="text-sm link-underline text-stone-dark hover:text-ink">
                          Remover
                        </button>
                      </div>
                    </div>
                    <p className="tabular text-right font-semibold sm:pt-1.5">
                      {p.saleType === "weight" && <span className="mr-1 font-normal text-stone-dark">≈</span>}
                      {formatBRL(lineTotalCents({ product: p, qty }))}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between gap-4 text-sm">
              <Link href="/produtos" className="link-underline">Continuar escolhendo</Link>
              <button type="button" onClick={clear} className="link-underline text-stone-dark hover:text-ink">
                Esvaziar carrinho
              </button>
            </div>
          </section>

          <aside aria-label="Resumo" className="lg:col-span-4">
            <div className="bg-white p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
              <dl className="space-y-3">
                <div className="flex justify-between gap-4">
                  <dt className="text-stone-dark">Itens</dt>
                  <dd className="tabular">{totalItems}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                  <dt className="font-semibold">Subtotal {weight ? "estimado" : ""}</dt>
                  <dd className="tabular font-display text-[2rem] leading-none">{formatBRL(subtotalCents)}</dd>
                </div>
              </dl>
              <p className="mt-4 text-sm leading-relaxed text-stone-dark">
                {weight && "O valor final depende do peso real de cada peça e é confirmado no WhatsApp. "}
                Entrega em {site.city}: {formatBRL(site.deliveryFeeCents)}. Retirada a combinar.
              </p>
              <Link href="/checkout" className="btn btn-solid mt-6 w-full">
                Continuar
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
