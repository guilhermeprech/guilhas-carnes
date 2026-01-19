"use client";

import Link from "next/link";
import { useCart } from "../cart-context";
import { formatBRL } from "../config/site";

export default function CarrinhoPage() {
  const { items, removeItem, clear, totalItems, totalPrice } = useCart();

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
            Guilhas Carnes & Assados
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-neutral-900">
            Carrinho
          </h1>
          <p className="mt-4 text-neutral-700 text-base md:text-lg">
            Revise seus itens antes de finalizar o pedido.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-8 text-center shadow-sm">
            <p className="text-neutral-700">Seu carrinho está vazio.</p>

            <Link
              href="/produtos"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Ver cortes disponíveis
            </Link>
          </div>
        ) : (
          <>
            {/* Lista */}
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-neutral-900">
                        {item.product.name}
                      </p>

                      <p className="mt-1 text-sm text-neutral-600">
                        {item.qty}x {formatBRL(item.product.price)}{" "}
                        <span className="text-neutral-500">
                          (valor médio por unidade)
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-4 transition"
                    >
                      Remover
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Resumo */}
            <div className="mt-6 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
              <div className="flex items-center justify-between text-sm text-neutral-700">
                <span>Total de itens</span>
                <span className="font-medium">{totalItems}</span>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-neutral-900 font-semibold">
                  Total aproximado
                </span>
                <span className="text-lg font-semibold text-neutral-900">
                  {formatBRL(totalPrice)}
                </span>
              </div>

              <p className="mt-3 text-xs text-neutral-600">
                * O total é aproximado e pode variar conforme o peso real do
                produto. Confirmamos o valor final no WhatsApp.
              </p>
            </div>

            {/* Ações */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:opacity-95 transition"
              >
                Ir para checkout
              </Link>

              <button
                onClick={clear}
                className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white/60 px-5 py-3 text-sm font-medium text-neutral-800 hover:bg-white/80 transition"
              >
                Limpar carrinho
              </button>
            </div>

            {/* Link de volta */}
            <div className="mt-6 text-center">
              <Link
                href="/produtos"
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-4"
              >
                Voltar para produtos
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}