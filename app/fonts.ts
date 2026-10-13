import localFont from "next/font/local";

// Fontes auto-hospedadas (licença OFL, arquivos em app/fonts) — sem requisição a terceiros.
export const cormorant = localFont({
  src: "./fonts/cormorant.woff2",
  weight: "300 700",
  variable: "--font-cormorant",
  display: "swap",
  fallback: ["Georgia", "serif"],
});

export const interTight = localFont({
  src: "./fonts/inter-tight.woff2",
  weight: "100 900",
  variable: "--font-inter-tight",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});
