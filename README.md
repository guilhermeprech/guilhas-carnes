# Guilhas Carnes & Assados

Loja online de carnes — Next.js 16 (App Router) + Tailwind 4, hospedada na Vercel.
Sem banco de dados: o catálogo é um arquivo JSON versionado no repositório.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de produção (valida o catálogo)
```

## Onde fica cada coisa

| O quê | Onde |
| --- | --- |
| Produtos | `data/products.json` |
| Fotos dos produtos | `public/images/products/<id>.webp` |
| WhatsApp, taxa de entrega, cidade, textos comerciais | `lib/site.ts` |
| Leitura e validação do catálogo | `lib/products.ts` |
| Mapa de cortes do boi (regiões e desenho) | `lib/cuts.ts`, `app/components/cut-map.tsx` |
| Cálculo do pedido e mensagem do WhatsApp | `lib/order.ts` |
| Carrinho (localStorage, só id + quantidade) | `app/cart-context.tsx` |

## Editar o catálogo

Cada produto em `data/products.json`:

```json
{
  "id": "picanha",
  "slug": "picanha",
  "name": "Picanha",
  "brand": "Apebrun",
  "category": "Bovinos",
  "subcategory": "Churrasco",
  "cut": "picanha",
  "description": null,
  "saleType": "weight",
  "pricePerKgCents": 11830,
  "avgWeightGrams": 900,
  "priceCents": 10647,
  "image": "/images/products/picanha.webp",
  "available": true,
  "featured": false,
  "sortOrder": 0
}
```

- **Valores em centavos inteiros** (R$ 118,30 → `11830`). Nada de casas decimais.
- `saleType`: `"weight"` para produtos vendidos por peso (o site mostra preço/kg e um valor *estimado*); `"unit"` para preço fixo (ex.: carvão).
- `priceCents`: valor por unidade — estimado para `weight` (preço/kg × peso médio), fixo para `unit`.
- `slug` vira a URL: `/produtos/picanha`. Use só letras minúsculas, números e hífen.
- `category` e `subcategory` geram os filtros automaticamente — basta escrever igual nos produtos.
- `cut`: parte do boi no mapa de cortes (`dianteiro`, `contrafile`, `costela`, `file-mignon`, `vazio`, `alcatra`, `picanha`, `traseiro`) ou `null` para produtos fora do mapa (suínos, carvão, carne moída). As regiões e o desenho ficam em `lib/cuts.ts`.
- `available: false` mantém o produto visível como "Indisponível", sem botão de compra.
- `featured: true` coloca o produto em "Em destaque" na home (sem nenhum marcado, aparecem os primeiros com foto).
- Foto: salve um `.webp` (ou converta) em `public/images/products/` com o mesmo `id`. Sem foto, o site mostra o símbolo da marca.

O build falha com uma mensagem clara se algum campo estiver errado.

## Migração do Supabase

O catálogo e as fotos foram exportados do Supabase (tabela `products` e bucket `products`)
e agora vivem no repositório. O site não depende mais do Supabase: as variáveis
`NEXT_PUBLIC_SUPABASE_*` podem ser removidas da Vercel e o projeto Supabase pode ser desativado.
