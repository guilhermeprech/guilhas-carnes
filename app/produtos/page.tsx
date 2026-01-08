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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}