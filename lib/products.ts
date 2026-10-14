// Camada de acesso ao catálogo. Executa somente no servidor (usa fs para checar imagens).
// Fonte única de verdade: data/products.json
import fs from "node:fs";
import path from "node:path";
import raw from "../data/products.json";
import { slugify } from "./format";
import { CUT_IDS } from "./cuts";
import type { Category, Product, ProductRecord } from "./types";

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

function fail(index: number, message: string): never {
  throw new Error(`[data/products.json] item ${index}: ${message}`);
}

function isCents(v: unknown) {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

/** Valida cada registro. Um erro aqui quebra o build — de propósito. */
function validate(records: unknown): ProductRecord[] {
  if (!Array.isArray(records)) throw new Error("[data/products.json] deve ser um array");
  const ids = new Set<string>();
  const slugs = new Set<string>();

  return records.map((r, i) => {
    if (!r || typeof r !== "object") fail(i, "registro inválido");
    const p = r as Record<string, unknown>;

    for (const key of ["id", "slug", "name", "category", "image"] as const) {
      if (typeof p[key] !== "string" || !(p[key] as string).trim()) fail(i, `"${key}" é obrigatório`);
    }
    if (!/^[a-z0-9-]+$/.test(p.slug as string)) fail(i, `slug "${p.slug}" deve ter só a-z, 0-9 e hífen`);
    if (p.saleType !== "weight" && p.saleType !== "unit") fail(i, `saleType deve ser "weight" ou "unit"`);
    for (const key of ["pricePerKgCents", "priceCents"] as const) {
      if (!isCents(p[key])) fail(i, `"${key}" deve ser inteiro em centavos`);
    }
    if (!isCents(p.avgWeightGrams)) fail(i, `"avgWeightGrams" deve ser inteiro em gramas`);
    if (p.saleType === "weight" && ((p.pricePerKgCents as number) <= 0 || (p.avgWeightGrams as number) <= 0)) {
      fail(i, "produto por peso precisa de pricePerKgCents e avgWeightGrams");
    }
    if ((p.priceCents as number) <= 0) fail(i, "priceCents deve ser maior que zero");
    for (const key of ["available", "featured"] as const) {
      if (typeof p[key] !== "boolean") fail(i, `"${key}" deve ser true/false`);
    }
    if (typeof p.sortOrder !== "number") fail(i, `"sortOrder" deve ser número`);
    if (p.cut !== null && !CUT_IDS.includes(p.cut as string)) {
      fail(i, `cut "${p.cut}" inválido — use null ou um de: ${CUT_IDS.join(", ")}`);
    }
    for (const key of ["brand", "subcategory", "description"] as const) {
      if (p[key] !== null && typeof p[key] !== "string") fail(i, `"${key}" deve ser texto ou null`);
    }

    if (ids.has(p.id as string)) fail(i, `id duplicado "${p.id}"`);
    if (slugs.has(p.slug as string)) fail(i, `slug duplicado "${p.slug}"`);
    ids.add(p.id as string);
    slugs.add(p.slug as string);

    return p as unknown as ProductRecord;
  });
}

function imageExists(publicPath: string) {
  if (/^https?:\/\//.test(publicPath)) return false; // sem imagens remotas
  return fs.existsSync(path.join(process.cwd(), "public", publicPath));
}

const PRODUCTS: Product[] = validate(raw)
  .map((p) => ({
    ...p,
    image: imageExists(p.image) ? p.image : null,
    categorySlug: slugify(p.category),
    subcategorySlug: p.subcategory ? slugify(p.subcategory) : null,
  }))
  .sort((a, b) => a.sortOrder - b.sortOrder || collator.compare(a.name, b.name));

export function isAvailable(product: Product) {
  return product.available;
}

/** Todos os produtos (inclusive indisponíveis), ordenados por sortOrder e nome */
export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getAvailableProducts(): Product[] {
  return PRODUCTS.filter(isAvailable);
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string, subcategorySlug?: string): Product[] {
  return PRODUCTS.filter(
    (p) =>
      p.categorySlug === categorySlug &&
      (!subcategorySlug || p.subcategorySlug === subcategorySlug),
  );
}

/** Destaques: produtos com featured=true; se nenhum estiver marcado,
 *  os primeiros disponíveis com foto (mesmo critério da vitrine antiga). */
export function getFeaturedProducts(limit = 6): Product[] {
  const available = getAvailableProducts();
  const featured = available.filter((p) => p.featured);
  const pool = featured.length ? featured : available.filter((p) => p.image);
  return pool.slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameSub = getAvailableProducts().filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug && p.subcategorySlug === product.subcategorySlug,
  );
  const sameCat = getAvailableProducts().filter(
    (p) => p.id !== product.id && p.categorySlug === product.categorySlug && !sameSub.includes(p),
  );
  return [...sameSub, ...sameCat].slice(0, limit);
}

/** Categorias derivadas dos produtos. "Outros" sempre por último. */
export function getCategories(): Category[] {
  const map = new Map<string, Category>();
  for (const p of PRODUCTS) {
    let cat = map.get(p.categorySlug);
    if (!cat) {
      cat = { name: p.category, slug: p.categorySlug, count: 0, subcategories: [], image: null };
      map.set(p.categorySlug, cat);
    }
    cat.count++;
    if (!cat.image && p.image) cat.image = p.image;
    if (p.subcategory && p.subcategorySlug) {
      const sub = cat.subcategories.find((s) => s.slug === p.subcategorySlug);
      if (sub) sub.count++;
      else cat.subcategories.push({ name: p.subcategory, slug: p.subcategorySlug, count: 1 });
    }
  }
  const cats = [...map.values()];
  cats.forEach((c) => c.subcategories.sort((a, b) => collator.compare(a.name, b.name)));
  return cats.sort((a, b) => {
    if (a.slug === "outros") return 1;
    if (b.slug === "outros") return -1;
    return collator.compare(a.name, b.name);
  });
}

export function getBrands(): string[] {
  return [...new Set(PRODUCTS.map((p) => p.brand).filter((b): b is string => !!b))].sort(collator.compare);
}
