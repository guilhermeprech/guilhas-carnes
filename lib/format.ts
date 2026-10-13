// Formatação compartilhada (servidor e cliente). Valores monetários sempre em centavos inteiros.
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBRL(cents: number) {
  // Intl usa espaço não separável entre "R$" e o valor; normalizamos para espaço comum
  return brl.format(cents / 100).replace(/ /g, " ");
}

export function formatWeight(grams: number) {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg.toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kg`;
  }
  return `${grams} g`;
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}
