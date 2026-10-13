import Link from "next/link";
import { Brand } from "./brand";
import { formatBRL } from "@/lib/format";
import { site, whatsappLink } from "@/lib/site";
import type { Category } from "@/lib/types";

export function Footer({ categories }: { categories: Category[] }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Brand tone="light" />
          <p className="mt-6 max-w-sm text-paper/65 leading-relaxed">
            Teu açougue de confiança na palma da mão. Carnes selecionadas e atendimento direto no WhatsApp.
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-sm text-paper/45">Cortes</h2>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/produtos?categoria=${c.slug}`} className="hover:text-paper text-paper/85 transition-colors">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/produtos" className="hover:text-paper text-paper/85 transition-colors">
                Catálogo completo
              </Link>
            </li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-sm text-paper/45">Pedidos</h2>
          <ul className="mt-4 space-y-2.5 text-paper/85">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-paper transition-colors">
                Instagram {site.instagramHandle}
              </a>
            </li>
            <li className="text-paper/60">
              Entrega em {site.city}: {formatBRL(site.deliveryFeeCents)}
            </li>
            <li className="text-paper/60">{site.pickupText}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="wrap flex flex-col gap-3 py-6 text-sm text-paper/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.name}. {site.city} – {site.state}.
          </p>
          <p>
            Desenvolvido por{" "}
            <a href={site.credit.url} target="_blank" rel="noopener" className="link-underline text-paper/70 hover:text-paper">
              {site.credit.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
