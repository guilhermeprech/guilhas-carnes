"use client";

import Link from "next/link";
import { useCart } from "../cart-context";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        {/* Marca */}
        <Link href="/" className="block">
          <h1 className="text-lg sm:text-xl font-bold text-white">
            Guilhas Carnes & Assados
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Carnes selecionadas • Caxias do Sul
          </p>
        </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-5 text-sm text-zinc-300">
          <Link href="/" className="hover:text-white">
            Início
          </Link>

          <Link href="/produtos" className="hover:text-white">
            Produtos
          </Link>

          <Link
            href="/carrinho"
            className="relative hover:text-white flex items-center gap-2"
          >
            <span>Carrinho</span>

            {/* Badge contador */}
            {totalItems > 0 && (
              <span className="inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-red-600 px-2 text-xs font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}