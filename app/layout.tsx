import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "./cart-context";
import { Header } from "./components/Header";
import { CartBottomBar } from "./components/cartBottomBar";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.guilhascarnes.com.br"),

  title: "Guilhas Carnes & Assados",
  description: "E-commerce de carnes - Guilhas Carnes & Assados",

  // ✅ FAVICON / ÍCONES
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // ✅ MANIFEST (PWA)
  manifest: "/favicon/site.webmanifest",

  // ✅ OG (WhatsApp / Facebook)
  openGraph: {
    title: "Guilhas Carnes & Assados",
    description: "E-commerce de carnes - Guilhas Carnes & Assados",
    url: "/",
    siteName: "Guilhas Carnes & Assados",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Guilhas Carnes & Assados",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  // ✅ Twitter/X (ajuda em previews também)
  twitter: {
    card: "summary_large_image",
    title: "Guilhas Carnes & Assados",
    description: "E-commerce de carnes - Guilhas Carnes & Assados",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#F6F2EA] text-neutral-900">
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#F6F2EA]">
            <Header />
  
            <main className="flex-1 bg-[#F6F2EA]">
              {children}
            </main>
  
            <Footer />
            <CartBottomBar />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}