// Configuração comercial central. Altere aqui — nada disso deve ficar espalhado pelo código.
export const site = {
  name: "Guilhas Carnes & Assados",
  shortName: "Guilhas",
  url: "https://guilhascarnes.com.br",
  description:
    "Açougue online em Caxias do Sul. Cortes bovinos, suínos e itens para churrasco, com pedido finalizado pelo WhatsApp.",

  // WhatsApp do estabelecimento (somente números, com DDI + DDD)
  whatsappPhone: "5554999320907",
  instagram: "https://instagram.com/guilhascarnes",
  instagramHandle: "@guilhascarnes",

  city: "Caxias do Sul",
  state: "RS",

  // Regras do pedido (valores em centavos)
  deliveryFeeCents: 1500,
  pickupText: "Retirada a combinar",
  paymentText: "Pix, após a confirmação no WhatsApp",

  credit: { label: "G9 CODE", url: "https://g9code.com.br" },
} as const;

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${site.whatsappPhone}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
