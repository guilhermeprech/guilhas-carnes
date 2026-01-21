import fs from "fs";
import path from "path";

// Ajusta o caminho se teu arquivo estiver em outro lugar
import { products } from "../app/data/products";

// Tipando a linha do CSV (as colunas que tu quer exportar)
type Row = {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price_per_kg: number;
  avg_weight_g: number;
  price_unit: number;
  image: string;
  is_available: boolean;
};

function escapeCSV(v: Row[keyof Row]) {
  if (v === null || v === undefined) return "";
  const s = String(v);
  // se tiver vírgula/aspas/quebra de linha, precisa escapar
  if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const headers: Array<keyof Row> = [
  "id",
  "name",
  "description",
  "category",
  "subcategory",
  "price_per_kg",
  "avg_weight_g",
  "price_unit",
  "image",
  "is_available",
];

const rows: Row[] = products.map((p) => ({
  id: p.id,
  name: p.name,
  description: p.description ?? "",
  category: p.category,
  subcategory: p.subcategory ?? "",
  price_per_kg: Number(p.pricePerKg ?? 0),
  avg_weight_g: Number(p.avgWeightG ?? 0),
  price_unit: Number(p.price ?? 0),
  image: p.image ?? "",
  is_available: true,
}));

const csv =
  headers.join(",") +
  "\n" +
  rows.map((r) => headers.map((h) => escapeCSV(r[h])).join(",")).join("\n");

const outPath = path.resolve(process.cwd(), "products-import.csv");
fs.writeFileSync(outPath, csv, "utf8");

console.log("✅ Gerado:", outPath);