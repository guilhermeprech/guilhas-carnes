"use client";
import Link from "next/link";
import { useCart } from "../cart-context";

function formatBRL(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function buildWhatsAppMessage(
  items: { product: { name: string; price: number }; qty: number }[],
  total: number
) {
  const lines = items.map(
    (i) => `- ${i.qty}x ${i.product.name} (${formatBRL(i.product.price)})`
  );

  return [
    "Olá! Quero fazer um pedido no Guilhas Carnes & Assados 👋",
    "",
    "🛒 Itens:",
    ...lines,
    "",
    `💰 Total dos produtos: ${formatBRL(total)}`,
    "🚚 Entrega: R$ 15,00 (Caxias do Sul) / Retirada a combinar",
    "",
    "📍 Endereço ou forma de retirada:",
    "💳 Forma de pagamento: Pix",
  ].join("\n");
}

export default function CarrinhoPage() {
  const { items, removeItem, clear, totalItems, totalPrice } = useCart();

  const phone = "554999320907";
  const text = buildWhatsAppMessage(items as any, totalPrice);
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Carrinho</h1>

      {items.length === 0 ? (
        <p className="text-zinc-400">Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
              >
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-sm text-zinc-400">
                    {item.qty}x {formatBRL(item.product.price)}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-red-500 hover:text-red-400"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            <p>Total de itens: {totalItems}</p>
            <p className="text-lg font-bold">
              Total: {formatBRL(totalPrice)}
            </p>
          </div>

          <div className="mt-6 flex gap-4">
          <Link
  href="/checkout"
  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-700"
>
  Ir para Checkout
</Link>

            <button
              onClick={clear}
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800"
            >
              Limpar carrinho
            </button>
          </div>
        </>
      )}
    </main>
  );
}