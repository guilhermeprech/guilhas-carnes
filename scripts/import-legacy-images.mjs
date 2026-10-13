// Importação única das fotos que só existiam no Supabase Storage.
// Uso (na pasta do projeto):  node scripts/import-legacy-images.mjs
// Baixa cada imagem, converte para WebP e salva em public/images/products/<id>.webp.
// Depois de rodar com sucesso, este script pode ser apagado.
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const BASE =
  "https://ikitatsdcblvsiivazbk.supabase.co/storage/v1/object/public/products";

const LEGACY = {
  "bife-coxao-mole": `${BASE}/dia-a-dia/bife-coxao-mole.jpg`,
  "bife-patinho": `${BASE}/dia-a-dia/bife-patinho.jpg`,
  "bisteca-fatiada": `${BASE}/dia-a-dia/bisteca-fatiada.jpg`,
  "carne-moida-primeira": `${BASE}/dia-a-dia/carne-moida-primeira.jpg`,
  "cubos-patinho": `${BASE}/dia-a-dia/cubos-patinho.jpg`,
  "iscas-patinho": `${BASE}/dia-a-dia/iscas-patinho.jpg`,
  carvao5kg: `${BASE}/outros/carvao5kg.jpg`,
  carvao8kg: `${BASE}/outros/carvao8kg.jpg`,
};

const outDir = path.resolve("public/images/products");
await fs.mkdir(outDir, { recursive: true });

let ok = 0;
for (const [id, url] of Object.entries(LEGACY)) {
  const dest = path.join(outDir, `${id}.webp`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await sharp(buf)
      .rotate()
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest);
    console.log(`✓ ${id}`);
    ok++;
  } catch (err) {
    console.error(`✗ ${id}: ${err.message}`);
  }
}

console.log(`\n${ok}/${Object.keys(LEGACY).length} imagens importadas para ${outDir}`);
