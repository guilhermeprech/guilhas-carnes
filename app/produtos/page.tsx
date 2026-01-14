import { products } from "../data/products";
import { ProductCard } from "../components/product-card";

export default function ProdutosPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Produtos</h1>
        <p className="mt-1 text-zinc-400">
          Entrega em Caxias do Sul (taxa fixa R$ 15,00) • Retirada a combinar
        </p>
      </div>
      <div className="mt-4 mb-6 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
  <strong>⚠ Valor médio:</strong> o preço por unidade é aproximado e pode variar
  conforme o peso real do produto.  
  O valor final é confirmado no WhatsApp.
</div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}