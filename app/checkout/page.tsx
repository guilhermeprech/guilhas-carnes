"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";
import { siteConfig, formatBRL } from "../config/site";

type Fulfillment = "DELIVERY" | "PICKUP";

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "");
}

function buildWhatsAppMessage(input: {
  customerName: string;
  customerPhone: string;
  fulfillment: Fulfillment;
  addressText?: string;
  notes?: string;
  items: { name: string; qty: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number;
  totalEstimated: number;
}) {
  const lines = input.items.map(
    (i) => `- ${i.qty}x ${i.name} (${formatBRL(i.unitPrice)})`
  );

  const fulfillmentLine =
    input.fulfillment === "DELIVERY"
      ? `🚚 ${siteConfig.deliveryText}: ${formatBRL(input.deliveryFee)}`
      : `🏪 ${siteConfig.pickupText}`;

  const addressBlock =
    input.fulfillment === "DELIVERY"
      ? [`📍 Endereço: ${input.addressText?.trim() || "(não informado)"}`]
      : [];

  const notesBlock = input.notes?.trim()
    ? [`📝 Observações: ${input.notes.trim()}`]
    : [];

  return [
    `Olá! Quero fazer um pedido no ${siteConfig.brandName} 👋`,
    "",
    `👤 Nome: ${input.customerName}`,
    `📞 Telefone: ${input.customerPhone}`,
    "",
    "🛒 Itens:",
    ...lines,
    "",
    `Subtotal: ${formatBRL(input.subtotal)}`,
    fulfillmentLine,
    ...(addressBlock.length ? ["", ...addressBlock] : []),
    ...((notesBlock.length ? ["", ...notesBlock] : []) as string[]),
    "",
    `💰 Total estimado: ${formatBRL(input.totalEstimated)}`,
    "⚠️ Valor final sujeito à confirmação (peso/estoque).",
    "💳 Pagamento: Pix (após confirmação no WhatsApp).",
  ].join("\n");
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice } = useCart(); // totalPrice = subtotal
  const [fulfillment, setFulfillment] = useState<Fulfillment>("DELIVERY");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Endereço
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");

  const [notes, setNotes] = useState("");

  const subtotal = totalPrice;
  const deliveryFee = fulfillment === "DELIVERY" ? siteConfig.deliveryFee : 0;
  const totalEstimated = subtotal + deliveryFee;

  const storeWhatsApp = siteConfig.whatsappPhone;

  const addressText = useMemo(() => {
    const parts = [
      street.trim() ? `Rua/Av: ${street.trim()}` : "",
      number.trim() ? `Número: ${number.trim()}` : "",
      neighborhood.trim() ? `Bairro: ${neighborhood.trim()}` : "",
      complement.trim() ? `Compl.: ${complement.trim()}` : "",
      reference.trim() ? `Ref.: ${reference.trim()}` : "",
      siteConfig.city ? `Cidade: ${siteConfig.city}` : "",
    ].filter(Boolean);

    return parts.join(" • ");
  }, [street, number, neighborhood, complement, reference]);

  const canSubmit = useMemo(() => {
    const hasItems = items.length > 0;
    const okName = customerName.trim().length >= 2;
    const okPhone = onlyDigits(customerPhone).length >= 10; // DDD + número
    const okAddress =
      fulfillment === "PICKUP" ||
      (street.trim().length > 0 && neighborhood.trim().length > 0);

    return hasItems && okName && okPhone && okAddress;
  }, [
    items.length,
    customerName,
    customerPhone,
    fulfillment,
    street,
    neighborhood,
  ]);

  function handleFinish() {
    if (!canSubmit) return;

    const payload = {
      customerName: customerName.trim(),
      customerPhone: onlyDigits(customerPhone).trim(),
      fulfillment,
      addressText: fulfillment === "DELIVERY" ? addressText : undefined,
      notes: notes.trim() || undefined,
      items: items.map((i) => ({
        name: i.product.name,
        qty: i.qty,
        unitPrice: i.product.price,
      })),
      subtotal,
      deliveryFee,
      totalEstimated,
    };

    const message = buildWhatsAppMessage(payload);
    const url = `https://wa.me/${storeWhatsApp}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noreferrer");
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 text-center">
            <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
              Guilhas Carnes & Assados
            </p>
            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-neutral-900">
              Checkout
            </h1>
          </header>

          <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-8 text-center shadow-sm">
            <p className="text-neutral-700">Seu carrinho está vazio.</p>
            <Link
              href="/produtos"
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white hover:opacity-95 transition"
            >
              Ver cortes disponíveis
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
            Guilhas Carnes & Assados
          </p>
          <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-neutral-900">
            Checkout
          </h1>
          <p className="mt-4 text-neutral-700 text-base md:text-lg">
            Preencha seus dados e finalize pelo WhatsApp.
          </p>
        </header>

        {/* Aviso importante */}
        <div className="mb-6 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur px-6 py-5 text-sm text-neutral-700 text-center shadow-sm">
          <strong className="font-medium">Importante:</strong> o valor final pode
          variar conforme peso e disponibilidade. Confirmamos tudo no WhatsApp
          antes do pagamento.
        </div>

        {/* Dados do cliente */}
        <section className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Seus dados</h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-neutral-700">Nome</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ex: Guilherme"
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-neutral-700">Telefone (WhatsApp)</label>
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Ex: 54999999999"
                className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
              />
              <p className="mt-2 text-xs text-neutral-600">
                Dica: informe com DDD (ex: 54...).
              </p>
            </div>
          </div>
        </section>

        {/* Entrega/Retirada */}
        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">
            Entrega ou retirada
          </h2>

          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setFulfillment("DELIVERY")}
              className={`rounded-2xl px-5 py-3 text-sm font-medium border transition ${
                fulfillment === "DELIVERY"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
              }`}
            >
              Entrega ({formatBRL(siteConfig.deliveryFee)})
            </button>

            <button
              type="button"
              onClick={() => setFulfillment("PICKUP")}
              className={`rounded-2xl px-5 py-3 text-sm font-medium border transition ${
                fulfillment === "PICKUP"
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
              }`}
            >
              Retirada a combinar
            </button>
          </div>

          {fulfillment === "DELIVERY" && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-700">Rua / Avenida *</label>
                <input
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Ex: Rua X"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-700">Número</label>
                <input
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ex: 123"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-700">Bairro *</label>
                <input
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Ex: Centro"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-700">Complemento</label>
                <input
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto, bloco, etc. (opcional)"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-neutral-700">Referência</label>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Ponto de referência (opcional)"
                  className="mt-1 w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
                />
              </div>
            </div>
          )}
        </section>

        {/* Observações */}
        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Observações</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ex: horário para entrega/retirada, ponto de referência, etc."
            className="mt-3 min-h-[110px] w-full rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 text-sm text-neutral-900 outline-none focus:border-neutral-400 transition"
          />
        </section>

        {/* Resumo */}
        <section className="mt-4 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Resumo</h2>

          <div className="mt-4 space-y-2 text-sm text-neutral-800">
            <div className="flex justify-between">
              <span>Itens</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal estimado</span>
              <span className="font-medium">{formatBRL(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de entrega</span>
              <span className="font-medium">{formatBRL(deliveryFee)}</span>
            </div>

            <div className="pt-3 mt-3 border-t border-neutral-200 flex justify-between text-base font-semibold text-neutral-900">
              <span>Total estimado</span>
              <span>{formatBRL(totalEstimated)}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/carrinho"
              className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white/60 px-5 py-3 text-sm font-medium text-neutral-900 hover:bg-white/80 transition"
            >
              Voltar ao carrinho
            </Link>

            <button
              type="button"
              onClick={handleFinish}
              disabled={!canSubmit}
              className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-medium transition ${
                canSubmit
                  ? "bg-neutral-900 text-white hover:opacity-95"
                  : "bg-neutral-300 text-neutral-600 cursor-not-allowed"
              }`}
            >
              Finalizar no WhatsApp
            </button>
          </div>

          {!canSubmit && (
            <p className="mt-3 text-xs text-neutral-600">
              Preencha nome, telefone e (se entrega) rua e bairro.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}