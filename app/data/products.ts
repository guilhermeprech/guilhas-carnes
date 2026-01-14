export type Product = {
  id: string;
  name: string;
  // preço usado no carrinho e no card (aprox. unidade)
  price: number;

  // infos novas (pra futuro e pra transparência)
  pricePerKg: number;
  avgWeightG: number;

  category: string;
  subcategory?: string;

  // preparado pra futuro (não usado agora)
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

const category = "Bovinos";
const subcategory = "Churrasco";

export const products: Product[] = [
  { id: "alcatra", name: "Alcatra", avgWeightG: 900, pricePerKg: brlToNumber("R$ 76,57"), price: approxUnitPrice(brlToNumber("R$ 76,57"), 900), category, subcategory },
  { id: "assado-de-tira", name: "Assado de tira", avgWeightG: 800, pricePerKg: brlToNumber("R$ 93,47"), price: approxUnitPrice(brlToNumber("R$ 93,47"), 800), category, subcategory },
  { id: "bananinha", name: "Bananinha", avgWeightG: 400, pricePerKg: brlToNumber("R$ 77,87"), price: approxUnitPrice(brlToNumber("R$ 77,87"), 400), category, subcategory },
  { id: "contrafile", name: "Contrafilé", avgWeightG: 1000, pricePerKg: brlToNumber("R$ 89,57"), price: approxUnitPrice(brlToNumber("R$ 89,57"), 1000), category, subcategory },
  { id: "costela", name: "Costela", avgWeightG: 1200, pricePerKg: brlToNumber("R$ 64,87"), price: approxUnitPrice(brlToNumber("R$ 64,87"), 1200), category, subcategory },
  { id: "denver", name: "Denver", avgWeightG: 1000, pricePerKg: brlToNumber("R$ 110,37"), price: approxUnitPrice(brlToNumber("R$ 110,37"), 1000), category, subcategory },
  { id: "entranha", name: "Entranha", avgWeightG: 400, pricePerKg: brlToNumber("R$ 77,87"), price: approxUnitPrice(brlToNumber("R$ 77,87"), 400), category, subcategory },
  { id: "entrecot", name: "Entrecot", avgWeightG: 1000, pricePerKg: brlToNumber("R$ 100,10"), price: approxUnitPrice(brlToNumber("R$ 100,10"), 1000), category, subcategory },
  { id: "file-mignon", name: "Filé Mignon", avgWeightG: 1500, pricePerKg: brlToNumber("R$ 118,30"), price: approxUnitPrice(brlToNumber("R$ 118,30"), 1500), category, subcategory },
  { id: "flat-iron", name: "Flat Iron", avgWeightG: 500, pricePerKg: brlToNumber("R$ 118,30"), price: approxUnitPrice(brlToNumber("R$ 118,30"), 500), category, subcategory },
  { id: "maminha", name: "Maminha", avgWeightG: 1100, pricePerKg: brlToNumber("R$ 67,47"), price: approxUnitPrice(brlToNumber("R$ 67,47"), 1100), category, subcategory },
  { id: "picanha", name: "Picanha", avgWeightG: 900, pricePerKg: brlToNumber("R$ 118,30"), price: approxUnitPrice(brlToNumber("R$ 118,30"), 900), category, subcategory },
  { id: "prime-rib", name: "Prime Rib", avgWeightG: 700, pricePerKg: brlToNumber("R$ 98,80"), price: approxUnitPrice(brlToNumber("R$ 98,80"), 700), category, subcategory },
  { id: "short-rib", name: "Short Rib", avgWeightG: 700, pricePerKg: brlToNumber("R$ 64,87"), price: approxUnitPrice(brlToNumber("R$ 64,87"), 700), category, subcategory },
  { id: "shoulder", name: "Shoulder", avgWeightG: 1000, pricePerKg: brlToNumber("R$ 60,97"), price: approxUnitPrice(brlToNumber("R$ 60,97"), 1000), category, subcategory },
  { id: "tomahawk", name: "Tomahawk", avgWeightG: 1600, pricePerKg: brlToNumber("R$ 100,10"), price: approxUnitPrice(brlToNumber("R$ 100,10"), 1600), category, subcategory },
  { id: "vazio", name: "Vazio", avgWeightG: 1100, pricePerKg: brlToNumber("R$ 83,07"), price: approxUnitPrice(brlToNumber("R$ 83,07"), 1100), category, subcategory },
];