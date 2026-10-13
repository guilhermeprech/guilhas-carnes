"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "../cart-context";
import { Brand } from "./brand";
import { BagIcon, CloseIcon, MenuIcon, WhatsAppIcon } from "./icons";
import { site, whatsappLink } from "@/lib/site";

type NavCategory = { name: string; slug: string; count: number };

export function Header({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  const { totalItems, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const overHero = pathname === "/" && !scrolled && !open;
  const dark = pathname.startsWith("/produtos");
  const light = overHero || open || dark; // texto claro

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha o menu ao navegar
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reação à troca de rota
    setOpen(false);
  }, [pathname]);

  // trava o scroll do fundo com o menu aberto; Esc fecha
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const count = ready ? totalItems : 0;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,border-color,color] duration-300",
          overHero
            ? "bg-transparent border-b border-transparent text-paper"
            : open
              ? "bg-char border-b border-line-dark text-paper"
              : dark
                ? "bg-ink/95 backdrop-blur-md border-b border-line-dark text-paper"
                : "bg-paper/95 backdrop-blur-md border-b border-line text-ink",
        ].join(" ")}
      >
        <div className="wrap flex h-full items-center justify-between gap-6">
          <Brand tone={light ? "light" : "dark"} />

          <nav aria-label="Principal" className="hidden md:flex items-center gap-9 text-[0.95rem]">
            <Link
              href="/produtos"
              className={`py-2 transition-opacity hover:opacity-100 ${isActive("/produtos") ? "opacity-100" : "opacity-75"}`}
              aria-current={isActive("/produtos") ? "page" : undefined}
            >
              Cortes
            </Link>
            <Link href="/#como-pedir" className="py-2 opacity-75 transition-opacity hover:opacity-100">
              Como pedir
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 opacity-75 transition-opacity hover:opacity-100"
            >
              WhatsApp
            </a>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <Link
              href="/carrinho"
              className="relative inline-flex h-11 items-center gap-2 px-3 md:px-4 md:border md:border-current/30 hover:md:border-current transition-colors"
              aria-label={count ? `Carrinho, ${count} ${count === 1 ? "item" : "itens"}` : "Carrinho vazio"}
            >
              <BagIcon />
              <span className="hidden md:inline text-[0.95rem]">Carrinho</span>
              {count > 0 && (
                <span className="tabular absolute right-0.5 top-1 md:static inline-flex h-5 min-w-5 items-center justify-center bg-current px-1 text-[0.7rem] font-semibold">
                  <span className={light ? "text-ink" : "text-paper"}>{count}</span>
                </span>
              )}
            </Link>
            <button
              type="button"
              className="md:hidden inline-flex h-11 w-11 items-center justify-center"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile em tela cheia */}
      <div
        id="menu-mobile"
        className={[
          "fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 bg-char text-paper md:hidden",
          "transition-[opacity,visibility] duration-300",
          open ? "visible opacity-100" : "invisible opacity-0",
        ].join(" ")}
        aria-hidden={!open}
      >
        <nav aria-label="Menu" className="wrap flex h-full flex-col overflow-y-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-8">
          <ul className="space-y-1">
            {[
              { href: "/", label: "Início" },
              { href: "/produtos", label: "Todos os cortes" },
              { href: "/#como-pedir", label: "Como pedir" },
              { href: "/carrinho", label: count ? `Carrinho (${count})` : "Carrinho" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-display text-[2.5rem] leading-tight"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="mt-8 border-t border-line-dark pt-6 space-y-3 text-paper/80">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/produtos?categoria=${c.slug}`}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline justify-between py-1 text-lg"
                >
                  <span>{c.name}</span>
                  <span className="tabular text-sm text-paper/50">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-10 space-y-3">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={open ? 0 : -1}
              className="btn btn-light w-full"
            >
              <WhatsAppIcon /> Falar no WhatsApp
            </a>
            <p className="text-center text-sm text-paper/50">
              {site.city} – {site.state}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}
