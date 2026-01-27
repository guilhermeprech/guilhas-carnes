import "./globals.css";
import { CartProvider } from "./cart-context";
import { Header } from "./components/Header";
import { CartBottomBar } from "./components/cartBottomBar";

export const metadata = {
  title: "Guilhas Carnes & Assados",
  description: "E-commerce de carnes - Guilhas Carnes & Assados",

  // ✅ FAVICON
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },

  // ✅ OG (WhatsApp / Facebook)
  openGraph: {
    title: "Guilhas Carnes & Assados",
    description: "E-commerce de carnes - Guilhas Carnes & Assados",
    url: "https://guilhascarnes.com.br",
    siteName: "Guilhas Carnes & Assados",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Guilhas Carnes & Assados",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },

  // ✅ Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "Guilhas Carnes & Assados",
    description: "E-commerce de carnes - Guilhas Carnes & Assados",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-black">
        <CartProvider>
          <Header />
          {children}
          <CartBottomBar />
        </CartProvider>
      </body>
    </html>
  );
}