// Tipos do catálogo. Compartilhados entre servidor e cliente (sem dependências de Node).

/** "weight": vendido por peso — o valor final depende do peso real da peça.
 *  "unit": preço fixo por unidade (ex.: saco de carvão). */
export type SaleType = "weight" | "unit";

/** Formato exato de cada item em data/products.json */
export type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
  subcategory: string | null;
  description: string | null;
  saleType: SaleType;
  /** Preço por kg, em centavos */
  pricePerKgCents: number;
  /** Peso médio da peça (weight) ou peso líquido da embalagem (unit), em gramas */
  avgWeightGrams: number;
  /** Valor por unidade em centavos: estimado (weight) ou fixo (unit) */
  priceCents: number;
  /** Caminho em /public */
  image: string;
  available: boolean;
  featured: boolean;
  sortOrder: number;
};

/** Produto pronto para uso na interface */
export type Product = Omit<ProductRecord, "image"> & {
  /** null quando o arquivo de imagem ainda não existe em /public */
  image: string | null;
  categorySlug: string;
  subcategorySlug: string | null;
};

export type Subcategory = { name: string; slug: string; count: number };

export type Category = {
  name: string;
  slug: string;
  count: number;
  subcategories: Subcategory[];
  /** Imagem representativa (primeiro produto com foto) */
  image: string | null;
};
