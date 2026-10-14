// Mapa do boi (vista lateral, cabeça à esquerda). Geometria em viewBox 0 0 1000 520.
// Regiões com `id` são cortes vendáveis; o resto é silhueta.

export type CutRegion = {
  id: string;
  label: string;
  /** pontos do polígono "x,y x,y ..." */
  points: string;
  /** posição do rótulo */
  lx: number;
  ly: number;
};

export const CUTS: CutRegion[] = [
  { id: "dianteiro", label: "Acém e paleta", points: "250,150 268,134 370,136 382,112 440,114 430,222 350,236 322,300 232,290 222,240", lx: 345, ly: 180 },
  { id: "contrafile", label: "Contrafilé", points: "440,114 660,112 650,214 430,222", lx: 544, ly: 166 },
  { id: "costela", label: "Costela", points: "350,236 430,222 590,219 588,256 596,378 560,380 430,374 360,362 322,300", lx: 465, ly: 300 },
  { id: "file-mignon", label: "Filé mignon", points: "590,219 650,214 700,216 698,252 588,256", lx: 644, ly: 238 },
  { id: "vazio", label: "Vazio e entranha", points: "588,256 698,252 756,262 800,356 700,372 596,378", lx: 690, ly: 315 },
  { id: "alcatra", label: "Alcatra e maminha", points: "660,112 760,108 800,114 792,212 760,214 756,262 698,252 700,216 650,214", lx: 724, ly: 165 },
  { id: "picanha", label: "Picanha", points: "800,114 840,118 880,140 896,170 860,212 792,212", lx: 842, ly: 168 },
  { id: "traseiro", label: "Coxão e patinho", points: "792,212 860,212 896,170 905,240 892,300 870,340 800,356 756,262 760,214", lx: 838, ly: 272 },
];

/** Partes sem corte à venda — só desenho */
export const SILHOUETTE = {
  cupim: "268,134 288,110 338,102 382,112 370,136",
  peito: "232,290 322,300 360,362 300,370 250,340",
  cabeca: "252,150 212,140 176,138 150,146 128,170 112,200 100,232 104,250 122,256 146,248 170,246 196,256 222,240 234,196",
  chifre: "192,146 184,120 192,96 212,78 204,100 202,124 208,144",
  orelha: "214,156 244,150 254,166 220,170",
  pernaDianteira: "250,340 300,370 306,486 284,494 266,486 258,400",
  pernaTraseira: "800,356 870,340 862,410 856,484 832,494 818,486 806,410",
  pernaDianteira2: "310,368 352,366 350,478 332,488 318,478",
  pernaTraseira2: "752,368 796,360 788,470 770,480 758,470",
  rabo: "896,170 918,210 926,290 938,322 922,326 914,292 904,220",
};

export const CUT_IDS = CUTS.map((c) => c.id);

export function cutLabel(id: string | null | undefined) {
  return CUTS.find((c) => c.id === id)?.label ?? null;
}
