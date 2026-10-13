import Image from "next/image";
import Link from "next/link";
import logo from "@/public/brand/logo.png";

/** Marca: símbolo original + "Guilhas / Carnes & Assados" no mesmo arranjo do logo oficial */
export function Brand({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const light = tone === "light";
  return (
    <Link
      href="/"
      aria-label="Guilhas Carnes & Assados — início"
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <Image
        src={logo}
        alt=""
        width={44}
        height={26}
        priority
        className={`h-[22px] w-auto md:h-[26px] transition-[filter] duration-300 ${light ? "invert" : ""}`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-[1.35rem] md:text-[1.55rem] font-semibold tracking-[0.08em] transition-colors duration-300 ${light ? "text-paper" : "text-ink"}`}
        >
          GUILHAS
        </span>
        <span
          className={`mt-[3px] text-[0.55rem] md:text-[0.6rem] font-medium tracking-[0.32em] transition-colors duration-300 ${light ? "text-paper/75" : "text-stone-dark"}`}
        >
          CARNES &amp; ASSADOS
        </span>
      </span>
    </Link>
  );
}
