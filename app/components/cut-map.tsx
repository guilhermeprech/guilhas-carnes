"use client";

import Link from "next/link";
import { CUTS, SILHOUETTE } from "@/lib/cuts";

type Common = {
  /** produtos por região; regiões sem produto ficam apagadas */
  counts: Record<string, number>;
  className?: string;
};

type Props =
  | (Common & { mode: "select"; selected: string | null; onSelect: (id: string | null) => void })
  | (Common & { mode: "link"; /** prefixo do link; o id da região é anexado */ hrefBase: string })
  | (Common & { mode: "static"; highlight: string | null });

const BODY = "#1d1b19";
const BODY_BACK = "#141312";
const CUT_IDLE = "#2e2b27";
const CUT_HOVER = "#45403a";
const PAPER = "#f6f2ea";
const INK = "#0a0a0a";

/** Boi em blocos — cada corte vendido é uma região clicável */
export function CutMap(props: Props) {
  const { counts, className = "" } = props;
  const isActive = (id: string) => (props.mode === "select" ? props.selected === id : props.mode === "static" ? props.highlight === id : false);

  return (
    <svg
      viewBox="60 60 900 450"
      className={`cut-map block h-auto w-full select-none ${className}`}
      role={props.mode === "static" ? "img" : "group"}
      aria-label={props.mode === "static" ? "Localização do corte no boi" : "Mapa de cortes do boi"}
    >
      <style>{`
        .cut-map .cut { transition: fill .25s ease; }
        .cut-map .cut-hit:hover .cut:not(.is-on), .cut-map .cut-hit:focus-visible .cut:not(.is-on) { fill: ${CUT_HOVER}; }
        .cut-map .cut-hit { outline: none; cursor: pointer; }
        .cut-map .cut-hit:focus-visible .cut { stroke: ${PAPER}; stroke-width: 3; }
        .cut-map .lbl { font: 600 15px var(--font-inter-tight), system-ui, sans-serif; letter-spacing: -0.01em; pointer-events: none; }
        .cut-map .cnt { font: 500 12.5px var(--font-inter-tight), system-ui, sans-serif; pointer-events: none; }
        @media (max-width: 767px) { .cut-map .lbl, .cut-map .cnt { display: none; } }
      `}</style>

      {/* silhueta (fundo) */}
      {[SILHOUETTE.pernaDianteira2, SILHOUETTE.pernaTraseira2].map((pts) => (
        <polygon key={pts} points={pts} fill={BODY_BACK} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ))}
      {[SILHOUETTE.rabo, SILHOUETTE.pernaDianteira, SILHOUETTE.pernaTraseira, SILHOUETTE.cabeca, SILHOUETTE.chifre, SILHOUETTE.orelha, SILHOUETTE.cupim, SILHOUETTE.peito].map((pts) => (
        <polygon key={pts} points={pts} fill={BODY} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      ))}
      <circle cx={158} cy={180} r={4} fill={INK} />

      {CUTS.map((c) => {
        const n = counts[c.id] ?? 0;
        const on = isActive(c.id);
        const has = n > 0;
        const fill = on ? PAPER : has ? CUT_IDLE : BODY;
        const text = on ? INK : PAPER;

        const shape = (
          <>
            <polygon className={`cut ${on ? "is-on" : ""}`} points={c.points} fill={fill} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
            {props.mode !== "static" || on ? (
              <>
                <text className="lbl" x={c.lx} y={c.ly} textAnchor="middle" fill={has || on ? text : "#6b665e"}>
                  {c.label}
                </text>
                {props.mode !== "static" && has && c.id !== "file-mignon" && (
                  <text className="cnt" x={c.lx} y={c.ly + 19} textAnchor="middle" fill={on ? INK : PAPER} fillOpacity={0.6}>
                    {n} {n === 1 ? "produto" : "produtos"}
                  </text>
                )}
              </>
            ) : null}
          </>
        );

        if (props.mode === "static" || !has) return <g key={c.id}>{shape}</g>;

        const label = `${c.label}, ${n} ${n === 1 ? "produto" : "produtos"}`;

        if (props.mode === "link") {
          return (
            <Link key={c.id} href={`${props.hrefBase}${c.id}`} className="cut-hit" aria-label={label}>
              {shape}
            </Link>
          );
        }

        return (
          <g
            key={c.id}
            className="cut-hit"
            role="button"
            tabIndex={0}
            aria-pressed={on}
            aria-label={label}
            onClick={() => props.onSelect(on ? null : c.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                props.onSelect(on ? null : c.id);
              }
            }}
          >
            {shape}
          </g>
        );
      })}
    </svg>
  );
}
