// web/app/config/site.ts
export const siteConfig = {
  brandName: "Guilhas Carnes & Assados",

  // WhatsApp do estabelecimento (somente números, com DDI + DDD)
  whatsappPhone: "5554999320907",

  // Regras do pedido
  deliveryFee: 15,
  city: "Caxias do Sul",

  // Textos padrão
  deliveryText: "Entrega",
  pickupText: "Retirada a combinar",
  paymentText: "Pix (após confirmação)",
  disclaimerText:
    "⚠️ Importante: o valor final pode variar conforme peso e disponibilidade. Confirmamos tudo no WhatsApp antes do pagamento.",

  minimumDeliverySubtotal: 0,
} as const;

// Formatter fixo (evita hydration mismatch)
const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBRL(value: number) {
  return brlFormatter.format(value);
}