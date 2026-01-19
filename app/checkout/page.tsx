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
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="mt-3 text-zinc-400">Seu carrinho está vazio.</p>
        <Link
          href="/produtos"
          className="mt-6 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-700"
        >
          Ver produtos
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-2 text-black">
        Preencha seus dados e finalize pelo WhatsApp.
      </p>

      <div className="mt-6 mb-6 rounded-md border border-red-600 bg-red-600 px-4 py-3 text-sm text-center text-white">
        ⚠️ <b>Importante:</b> o <b>valor final pode variar</b> conforme peso e
        disponibilidade. Confirmamos tudo no WhatsApp antes do pagamento.
      </div>

      {/* Dados do cliente */}
      <section className="mt-6 rounded-xl border border-zinc-800 bg-zinc-300/40 p-5">
        <h2 className="text-lg font-semibold">Seus dados</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm text-zinc-800">Nome</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Ex: Guilherme"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-800">Telefone (WhatsApp)</label>
            <input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="Ex: 54999999999"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Dica: informe com DDD (ex: 54...).
            </p>
          </div>
        </div>
      </section>

      {/* Entrega/Retirada */}
      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-300/40 p-5">
        <h2 className="text-lg font-semibold">Entrega ou Retirada</h2>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={() => setFulfillment("DELIVERY")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              fulfillment === "DELIVERY"
                ? "bg-white border-black hover:scale-105"
                : "bg-zinc-400 border-black hover:bg-white hover:scale-105"
            }`}
          >
            Entrega ({formatBRL(siteConfig.deliveryFee)})
          </button>

          <button
            type="button"
            onClick={() => setFulfillment("PICKUP")}
            className={`rounded-lg px-4 py-2 text-sm font-semibold border ${
              fulfillment === "PICKUP"
                ? "bg-white border-black hover:scale-105"
                : "bg-zinc-400 border-black hover:bg-white hover:scale-105"
            }`}
          >
            Retirada a combinar
          </button>
        </div>

        {fulfillment === "DELIVERY" && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm text-black">Rua / Avenida *</label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Ex: Rua X"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="text-sm text-black">Número</label>
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Ex: 123"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="text-sm text-black">Bairro *</label>
              <input
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ex: Centro"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-black">Complemento</label>
              <input
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                placeholder="Apto, bloco, etc. (opcional)"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-black">Referência</label>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Ponto de referência (opcional)"
                className="mt-1 w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        )}
      </section>

      {/* Observações */}
      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-300/40 p-5">
        <h2 className="text-lg font-semibold">Observações</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: horário para entrega/retirada, ponto de referência, etc."
          className="mt-3 min-h-[90px] w-full rounded-lg border border-zinc-700 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />
      </section>

      {/* Resumo */}
      <section className="mt-4 rounded-xl border border-zinc-800 bg-zinc-300/40 p-5">
        <h2 className="text-lg font-semibold">Resumo</h2>

        <div className="mt-3 space-y-2 text-sm text-black">
          <div className="flex justify-between">
            <span>Itens</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal estimado</span>
            <span>{formatBRL(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de entrega</span>
            <span>{formatBRL(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-zinc-800">
            <span>Total estimado</span>
            <span>{formatBRL(totalEstimated)}</span>
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <Link
            href="/carrinho"
            className="rounded-lg border border-zinc-700 bg-zinc-400 px-4 py-2 text-sm hover:bg-white hover:scale-105"
          >
            Voltar ao carrinho
          </Link>

          <button
            type="button"
            onClick={handleFinish}
            disabled={!canSubmit}
            className={`rounded-lg border border-zinc-700 rounded-lg px-4 py-2 text-sm font-semibold ${
              canSubmit
                ? "bg-white hover:bg-green-700 hover:text-white hover:scale-105"
                : "bg-zinc-400 cursor-not-allowed hover:scale-105"
            }`}
          >
            Finalizar no WhatsApp
          </button>
        </div>

        {!canSubmit && (
          <p className="mt-3 text-xs text-zinc-400">
            Preencha nome, telefone e (se entrega) rua e bairro.
          </p>
        )}
      </section>
    </main>
  );
}