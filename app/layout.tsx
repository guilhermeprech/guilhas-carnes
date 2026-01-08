import "./globals.css";
import { CartProvider } from "./cart-context";
import { Header } from "./components/Header";

export const metadata = {
  title: "Guilhas Carnes & Assados",
  description: "E-commerce de carnes - Guilhas Carnes & Assados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-zinc-950 text-white">
        <CartProvider>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}