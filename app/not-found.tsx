import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap py-28 text-center">
      <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-none">Página não encontrada</h1>
      <p className="mx-auto mt-5 max-w-md text-stone-dark">
        Esse endereço não existe mais ou o produto saiu do catálogo.
      </p>
      <Link href="/produtos" className="btn btn-solid mt-8">
        Ver os cortes
      </Link>
    </div>
  );
}
