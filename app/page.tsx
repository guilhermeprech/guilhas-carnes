import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 p-6">
        <h1 className="text-2xl font-bold">
          Guilhas Carnes & Assados
        </h1>
        <p className="text-zinc-400">
          Carnes selecionadas • Caxias do Sul
        </p>
      </header>

      <section className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Bem-vindo 👋
        </h2>

        <p className="text-zinc-300 max-w-xl">
          Em breve você poderá comprar nossos cortes especiais diretamente
          pelo site, com entrega em Caxias do Sul ou retirada a combinar.
        </p>

        <div className="mt-6">
        <Link
  href="/produtos"
  className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded font-semibold"
>
  Ver produtos
</Link>
        </div>
      </section>
    </main>
  );
}