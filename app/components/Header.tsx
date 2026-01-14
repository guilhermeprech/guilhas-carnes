"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../cart-context";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="border-b border-black-800 bg-white-950">
      <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
        {/* Marca */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Guilhas Carnes & Assados"
              width={48}
              height={48}
              priority
            />

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-black">
                Guilhas Carnes & Assados
              </h1>
              <p className="text-xs sm:text-sm text-black-400">
                Carnes selecionadas • Eventos de churrasco e burger • Caxias do Sul
              </p>
            </div>
          </Link>

        {/* Navegação */}
        <nav className="flex items-center gap-5 text-sm text-black-800">
          <Link href="/" className="hover:text-red-600">
            Início
          </Link>

          <Link href="/produtos" className="hover:text-red-600">
            Produtos
          </Link>

          <Link
            href="/carrinho"
            className="relative hover:text-red-600 flex items-center gap-2"
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