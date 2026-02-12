"use client";

import Link from "next/link";
import { siteConfig } from "../config/site";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-[#F6F2EA] text-neutral-800">
      <div className="mx-auto max-w-6xl px-5 md:px-10 py-12 grid gap-10 md:grid-cols-3">
        
        {/* Marca */}
        <div>
          <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
            Guilhas Carnes & Assados
          </p>

          <p className="mt-4 text-sm text-neutral-700 leading-relaxed">
            Seu açougue de confiança na palma da sua mão.
            Carnes selecionadas, qualidade garantida e atendimento direto no WhatsApp.
          </p>
        </div>

        {/* Navegação */}
        <div>
          <p className="text-sm font-semibold mb-4">Navegação</p>

          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:underline underline-offset-4">
                Início
              </Link>
            </li>
            <li>
              <Link href="/produtos" className="hover:underline underline-offset-4">
                Produtos
              </Link>
            </li>
            <li>
              <Link href="/eventos" className="hover:underline underline-offset-4">
                Eventos
              </Link>
            </li>
          </ul>
        </div>

        {/* Contato */}
        <div>
          <p className="text-sm font-semibold mb-4">Contato</p>

          <div className="space-y-2 text-sm">
            <a
              href={`https://wa.me/${siteConfig.whatsappPhone}`}
              target="_blank"
              className="block hover:underline underline-offset-4"
            >
              WhatsApp
            </a>

            <a
              href="https://instagram.com/guilhascarnes"
              target="_blank"
              className="block hover:underline underline-offset-4"
            >
              Instagram
            </a>

            <p className="text-neutral-600 mt-2">
              Caxias do Sul – RS
            </p>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div className="border-t border-neutral-200 mt-12 pt-6 pb-8">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-600">
            
            <span>
            © {new Date().getFullYear()} Guilhas Carnes & Assados. Todos os direitos reservados.
            </span>

            <span>
            Desenvolvimento por{" "}
            <a
                href="https://guilhermerech.com"
                target="_blank"
                className="hover:underline underline-offset-4 font-medium"
            >
                Guilherme Rech - Desenvolvimento de soluções digitais sob medida.
            </a>
            </span>

        </div>
      </div>
    </footer>
  );
}