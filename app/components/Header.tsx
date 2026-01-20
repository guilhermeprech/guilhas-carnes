"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "../cart-context";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Header() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [compact, setCompact] = useState(false);

  // menu mobile
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // fecha menu ao trocar rota
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // fecha menu ao clicar fora
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const nav = [
    { href: "/", label: "Início" },
    { href: "/eventos", label: "Eventos" },
    { href: "/produtos", label: "Produtos" },
    { href: "/carrinho", label: "Carrinho" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-[#F6F2EA]/80 backdrop-blur transition-all">
      <div
        className={cx(
          "mx-auto max-w-6xl px-5 md:px-10 transition-all",
          compact ? "py-3" : "py-4"
        )}
      >
        {/* ================= MOBILE ================= */}
        <div className="md:hidden flex items-center justify-between">
          {/* Marca à esquerda */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Guilhas Carnes & Assados"
              width={compact ? 48 : 56}
              height={compact ? 48 : 56}
              priority
              className="rounded-2xl transition-all"
            />

            <div className="flex flex-col leading-tight">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-800">
                Guilhas
              </p>
              <p className="text-xs text-neutral-600">
                Carnes & Assados
              </p>
            </div>
          </Link>

          {/* Botão menu */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menu"
              className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white/60 px-3 py-2 hover:bg-white/80 transition"
            >
              <span className="flex flex-col gap-[4px]">
                <span className="h-[2px] w-5 bg-neutral-900 rounded" />
                <span className="h-[2px] w-5 bg-neutral-900 rounded" />
                <span className="h-[2px] w-5 bg-neutral-900 rounded" />
              </span>

              {totalItems > 0 && (
                <span className="ml-2 inline-flex min-w-[20px] h-[20px] items-center justify-center rounded-full bg-neutral-900 px-1.5 text-[11px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Dropdown mobile */}
            <div
              className={cx(
                "absolute right-0 mt-2 w-48 overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 backdrop-blur shadow-lg transition-all",
                open
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 -translate-y-1 pointer-events-none"
              )}
            >
              <div className="p-2">
                {nav.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cx(
                        "flex items-center justify-between rounded-2xl px-3 py-2 text-sm transition",
                        active
                          ? "bg-neutral-900 text-white"
                          : "text-neutral-900 hover:bg-white/80"
                      )}
                    >
                      <span>{item.label}</span>

                      {item.href === "/carrinho" && totalItems > 0 && (
                        <span
                          className={cx(
                            "inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full px-2 text-xs font-semibold",
                            active
                              ? "bg-white text-neutral-900"
                              : "bg-neutral-900 text-white"
                          )}
                        >
                          {totalItems}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP (INALTERADO) ================= */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Marca */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/logo.png"
              alt="Guilhas Carnes & Assados"
              width={compact ? 48 : 56}
              height={compact ? 48 : 56}
              priority
              className="rounded-2xl transition-all"
            />

            <div className="flex flex-col items-center leading-tight">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-neutral-800 text-center">
                Guilhas
              </p>
              <p className="text-xs text-neutral-600 text-center">
                Carnes & Assados
              </p>
            </div>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center gap-2">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "relative rounded-2xl px-4 py-2 text-sm border transition",
                    active
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.label}

                    {item.href === "/carrinho" && totalItems > 0 && (
                      <span className="inline-flex min-w-[22px] h-[22px] items-center justify-center rounded-full bg-neutral-900 px-2 text-xs font-semibold text-white">
                        {totalItems}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}