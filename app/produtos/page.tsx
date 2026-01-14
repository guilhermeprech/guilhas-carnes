import { products } from "../data/products";
import { ProductCard } from "../components/product-card";

export default function ProdutosPage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl text-center font-bold">Produtos</h1>
        <p className="mt-6 text-center text-black">
          Entrega em Caxias do Sul (taxa fixa R$ 15,00) • Retirada a combinar
        </p>
      </div>
      <div className="mt-6 mb-6 rounded-md border border-red-600 bg-red-600 px-4 py-3 text-sm text-center text-white">
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