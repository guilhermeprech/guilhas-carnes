import "./globals.css";
import type { Metadata, Viewport } from "next";
import { cormorant, interTight } from "./fonts";
import { CartProvider } from "./cart-context";
import { Header } from "./components/header";
import { Footer } from "./components/footer";
import { CartBar } from "./components/cart-bar";
import { getAllProducts, getCategories } from "@/lib/products";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — açougue online em ${site.city}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    url: "/",
    title: site.name,
    description: site.description,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const catalog = getAllProducts();
  const categories = getCategories();

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${interTight.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Pular para o conteúdo
        </a>
        <CartProvider catalog={catalog}>
          <Header categories={categories.map(({ name, slug, count }) => ({ name, slug, count }))} />
          <main id="conteudo" className="flex-1 pt-[var(--header-h)]">
            {children}
          </main>
          <Footer categories={categories} />
          <CartBar />
        </CartProvider>
      </body>
    </html>
  );
}
