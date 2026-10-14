// Cálculo do pedido e montagem da mensagem do WhatsApp. Funções puras (testáveis).
import { formatBRL, formatWeight } from "./format";
import { site } from "./site";
import type { Product } from "./types";

export type OrderLine = { product: Product; qty: number };

export type Fulfillment = "delivery" | "pickup";

export function lineTotalCents(line: OrderLine) {
  return line.product.priceCents * line.qty;
}

export function subtotalCents(lines: OrderLine[]) {
  return lines.reduce((acc, l) => acc + lineTotalCents(l), 0);
}

export function hasWeightItems(lines: OrderLine[]) {
  return lines.some((l) => l.product.saleType === "weight");
}

export function deliveryFeeCents(fulfillment: Fulfillment) {
  return fulfillment === "delivery" ? site.deliveryFeeCents : 0;
}

/** Descrição de preço de um produto, usada no site e na mensagem */
export function priceNote(product: Product) {
  if (product.saleType === "unit") return `${formatBRL(product.priceCents)} a unidade`;
  return `${formatBRL(product.pricePerKgCents)}/kg, peça média de ${formatWeight(product.avgWeightGrams)}`;
}

export type OrderMessageInput = {
  customerName: string;
  customerPhone: string;
  fulfillment: Fulfillment;
  address?: string;
  notes?: string;
  lines: OrderLine[];
};

export function buildOrderMessage(input: OrderMessageInput) {
  const subtotal = subtotalCents(input.lines);
  const fee = deliveryFeeCents(input.fulfillment);
  const weight = hasWeightItems(input.lines);

  const items = input.lines.map((l) => {
    const p = l.product;
    const total = formatBRL(lineTotalCents(l));
    if (p.saleType === "unit") {
      return `• ${l.qty}x ${p.name} — ${formatBRL(p.priceCents)} cada = ${total}`;
    }
    return `• ${l.qty}x ${p.name} (~${formatWeight(p.avgWeightGrams)} cada, ${formatBRL(p.pricePerKgCents)}/kg) ≈ ${total}`;
  });

  const lines = [
    `Olá! Quero fazer um pedido no ${site.name}.`,
    "",
    `Nome: ${input.customerName}`,
    `Telefone: ${input.customerPhone}`,
    "",
    "*Itens*",
    ...items,
    "",
    `Subtotal ${weight ? "estimado" : ""}: ${formatBRL(subtotal)}`.replace("  ", " "),
  ];

  if (input.fulfillment === "delivery") {
    lines.push(`Entrega: ${formatBRL(fee)}`);
    lines.push(`Endereço: ${input.address?.trim() || "(não informado)"}`);
  } else {
    lines.push(`Retirada: ${site.pickupText.toLowerCase()}`);
  }

  if (input.notes?.trim()) {
    lines.push("", `Observações: ${input.notes.trim()}`);
  }

  lines.push("", `*Total ${weight ? "estimado" : ""}: ${formatBRL(subtotal + fee)}*`.replace("  ", " "));

  if (weight) {
    lines.push(
      "",
      "Itens vendidos por peso: o valor final é calculado pelo peso real de cada peça e confirmado aqui antes do pagamento.",
    );
  }
  lines.push(`Pagamento: ${site.paymentText}.`);

  return lines.join("\n");
}
