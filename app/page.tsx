import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="mt-8 flex justify-center">
        <h1 className="text-3xl text-black">
          Seu açougue de confiança na palma da sua mão!
        </h1>
        <p className="text-black">
          
        </p>
      </header>

      <section className="mt-15 text-center flex justify-center">
        

      <div className="text-center">
  <p className="text-xl text-black">
    Compre produtos de qualidade para o seu churrasco e receba na porta da sua casa!
  </p>

  <div className="mt-15 flex justify-center">
    <a
      href="/produtos"
      className="
        rounded-xl
        bg-red-600
        px-10 py-4
        text-lg
        font-bold
        tracking-wide
        text-white
        shadow-lg
        hover:bg-red-700
        hover:scale-105
        transition-all
      "
    >
      Conheça nossos produtos!
    </a>
  </div>
</div>
      </section>
    </main>
  );
}