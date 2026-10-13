import type { Metadata } from "next";
import { CartView } from "./cart-view";

export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false, follow: true },
  alternates: { canonical: "/carrinho" },
};

export default function CarrinhoPage() {
  return <CartView />;
}
