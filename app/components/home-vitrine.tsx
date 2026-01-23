"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";
import type { Product, Category, BovinosSubcategory } from "../data/products";

type DbProduct = {
  id: string;
  name: string;
  description: string | null;
  category: Category;
  subcategory: BovinosSubcategory | null;
  price_unit: number | null;
  price_per_kg: number | null;
  avg_weight_g: number | null;
  image: string | null;
  brand: string | null;
};

function mapDbToUi(p: DbProduct): Product {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    category: p.category,
    subcategory: p.subcategory ?? undefined,
    price: Number(p.price_unit ?? 0),
    pricePerKg: Number(p.price_per_kg ?? 0),
    avgWeightG: Number(p.avg_weight_g ?? 0),
    image: p.image ?? undefined,
    brand: p.brand ?? undefined,
  };
}

export function HomeVitrine() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("id,name,description,category,subcategory,price_unit,price_per_kg,avg_weight_g,image,brand")
        .eq("is_available", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true })
        .limit(6);

      if (!mounted) return;

      if (error) {
        console.error("[HOME VITRINE] erro:", error.message);
        setItems([]);
      } else {
        setItems(((data as DbProduct[]) ?? []).map(mapDbToUi));
      }

      setLoading(false);
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl mt-6 text-center text-sm text-neutral-700">
        Carregando vitrine…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((product, idx) => (
        <Reveal key={product.id} delayMs={idx * 70}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}