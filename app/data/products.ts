export type Category = "Bovinos" | "Ovinos" | "Outros";
export type BovinosSubcategory = "Dia a dia" | "Churrasco";

export type Product = {
  id: string;
  name: string;

  // NOVO
  brand?: string;

  // preço usado no carrinho e no card (aprox. unidade)
  price: number;

  // infos novas (pra futuro e pra transparência)
  pricePerKg: number;
  avgWeightG: number;

  category: Category;

  // subcategoria apenas para Bovinos (Dia a dia / Churrasco)
  subcategory?: BovinosSubcategory;

  // preparado pra futuro
  image?: string;
  description?: string;
};

function brlToNumber(v: string) {
  // "R$ 76,57" -> 76.57
  const n = v
    .replace("R$", "")
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");
  return Number(n);
}

function approxUnitPrice(pricePerKg: number, avgWeightG: number) {
  return Number(((pricePerKg * avgWeightG) / 1000).toFixed(2));
}

/**
 * Helpers para evitar repetir strings e reduzir erro de digitação
 */
const C = {
  bovinos: "Bovinos" as const,
  ovinos: "Ovinos" as const,
  outros: "Outros" as const,
};

const S = {
  diaADia: "Dia a dia" as const,
  churrasco: "Churrasco" as const,
};

// marca padrão (todos esses produtos)
const BRAND = "Apebrun";

export const products: Product[] = [
  // =========================
  // BOVINOS — CHURRASCO
  // =========================
  {
    id: "alcatra",
    name: "Alcatra",
    brand: BRAND,
    avgWeightG: 900,
    pricePerKg: brlToNumber("R$ 76,57"),
    price: approxUnitPrice(brlToNumber("R$ 76,57"), 900),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "assado-de-tira",
    name: "Assado de tira",
    brand: BRAND,
    avgWeightG: 800,
    pricePerKg: brlToNumber("R$ 93,47"),
    price: approxUnitPrice(brlToNumber("R$ 93,47"), 800),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "bananinha",
    name: "Bananinha",
    brand: BRAND,
    avgWeightG: 400,
    pricePerKg: brlToNumber("R$ 77,87"),
    price: approxUnitPrice(brlToNumber("R$ 77,87"), 400),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "contrafile",
    name: "Contrafilé",
    brand: BRAND,
    avgWeightG: 1000,
    pricePerKg: brlToNumber("R$ 89,57"),
    price: approxUnitPrice(brlToNumber("R$ 89,57"), 1000),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "costela",
    name: "Costela",
    brand: BRAND,
    avgWeightG: 1200,
    pricePerKg: brlToNumber("R$ 64,87"),
    price: approxUnitPrice(brlToNumber("R$ 64,87"), 1200),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "denver",
    name: "Denver",
    brand: BRAND,
    avgWeightG: 1000,
    pricePerKg: brlToNumber("R$ 110,37"),
    price: approxUnitPrice(brlToNumber("R$ 110,37"), 1000),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "entranha",
    name: "Entranha",
    brand: BRAND,
    avgWeightG: 400,
    pricePerKg: brlToNumber("R$ 77,87"),
    price: approxUnitPrice(brlToNumber("R$ 77,87"), 400),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "entrecot",
    name: "Entrecot",
    brand: BRAND,
    avgWeightG: 1000,
    pricePerKg: brlToNumber("R$ 100,10"),
    price: approxUnitPrice(brlToNumber("R$ 100,10"), 1000),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "file-mignon",
    name: "Filé Mignon",
    brand: BRAND,
    avgWeightG: 1500,
    pricePerKg: brlToNumber("R$ 118,30"),
    price: approxUnitPrice(brlToNumber("R$ 118,30"), 1500),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "flat-iron",
    name: "Flat Iron",
    brand: BRAND,
    avgWeightG: 500,
    pricePerKg: brlToNumber("R$ 118,30"),
    price: approxUnitPrice(brlToNumber("R$ 118,30"), 500),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "maminha",
    name: "Maminha",
    brand: BRAND,
    avgWeightG: 1100,
    pricePerKg: brlToNumber("R$ 67,47"),
    price: approxUnitPrice(brlToNumber("R$ 67,47"), 1100),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "picanha",
    name: "Picanha",
    brand: BRAND,
    avgWeightG: 900,
    pricePerKg: brlToNumber("R$ 118,30"),
    price: approxUnitPrice(brlToNumber("R$ 118,30"), 900),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "prime-rib",
    name: "Prime Rib",
    brand: BRAND,
    avgWeightG: 700,
    pricePerKg: brlToNumber("R$ 98,80"),
    price: approxUnitPrice(brlToNumber("R$ 98,80"), 700),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "short-rib",
    name: "Short Rib",
    brand: BRAND,
    avgWeightG: 700,
    pricePerKg: brlToNumber("R$ 64,87"),
    price: approxUnitPrice(brlToNumber("R$ 64,87"), 700),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "shoulder",
    name: "Shoulder",
    brand: BRAND,
    avgWeightG: 1000,
    pricePerKg: brlToNumber("R$ 60,97"),
    price: approxUnitPrice(brlToNumber("R$ 60,97"), 1000),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "tomahawk",
    name: "Tomahawk",
    brand: BRAND,
    avgWeightG: 1600,
    pricePerKg: brlToNumber("R$ 100,10"),
    price: approxUnitPrice(brlToNumber("R$ 100,10"), 1600),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
  {
    id: "vazio",
    name: "Vazio",
    brand: BRAND,
    avgWeightG: 1100,
    pricePerKg: brlToNumber("R$ 83,07"),
    price: approxUnitPrice(brlToNumber("R$ 83,07"), 1100),
    category: C.bovinos,
    subcategory: S.churrasco,
  },
];