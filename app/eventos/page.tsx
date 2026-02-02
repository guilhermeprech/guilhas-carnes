"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Reveal } from "../components/reveal";
import { siteConfig } from "../config/site";

type EventType = "CHURRASCO" | "BURGER";
type Period = "MEIO_DIA" | "NOITE";
type ChurrasMenu = "TRADICIONAL" | "PREMIUM" | "PERSONALIZADO";

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function onlyDigits(value: string) {
  return (value || "").replace(/\D/g, "");
}

function toInt(value: string) {
  const n = Number(onlyDigits(value));
  return Number.isFinite(n) ? n : 0;
}

function formatDateBR(iso: string) {
  if (!iso) return "(não informada)";
  return new Date(iso + "T00:00:00").toLocaleDateString("pt-BR");
}

function labelPeriod(p: Period) {
  return p === "MEIO_DIA" ? "Meio-dia" : "Noite";
}

function labelChurrasMenu(m: ChurrasMenu) {
  if (m === "TRADICIONAL") return "Tradicional";
  if (m === "PREMIUM") return "Premium";
  return "Personalizado";
}

const churrasTradicional = {
  pricePerPerson: 135,
  entradas: [
    "Choripan com vinagrete",
    "Matambrito com geleia de pimenta",
    "Queijo coalho com melaço e doce de leite",
  ],
  acompanhamentos: ["Farofa especial", "Chimichurri"],
  carnes: ["Alcatra", "Bananinha", "Entranha", "Maminha"],
  sobremesa: ["Banana Brûlée com doce de leite"],
};

const churrasPremium = {
  pricePerPerson: 170,
  entradas: [
    "Choripan com vinagrete",
    "Matambrito com geleia de pimenta",
    "Queijo coalho com melaço e doce de leite",
    "Linguicinha parrillera",
  ],
  acompanhamentos: ["Mix de legumes", "Farofa especial", "Chimichurri"],
  carnes: ["Picanha", "Chorizo", "Short Rib", "Entrecot"],
  sobremesa: ["Banana Brûlée com doce de leite e sorvete"],
};

const customOptions = {
  entradasEAcomp: [
    "Choripan",
    "Matambrito",
    "Queijo coalho",
    "Linguicinha Parrillera",
    "Pimentão recheado",
    "Mix de legumes",
    "Pão com alho",
    "Maionese de batata",
  ],
  carnesGado: [
    "Alcatra",
    "Assado de tira",
    "Bananinha",
    "Chorizo",
    "Costela",
    "Denver Steak",
    "Entranha",
    "Vazio",
    "Entrecot",
    "Filé Mignon",
    "Flat Iron",
    "Maminha",
    "Picanha",
    "Prime Rib",
    "Shoulder",
    "Short Rib",
    "Tomahawk",
  ],
  carnesCordeiro: ["Picanha", "Costela", "Carré", "Paleta", "Pernil"],
  sobremesas: [
    "Banana Brûlée com doce de leite",
    "Abacaxi com canela",
    "Panqueca de doce de leite",
    "Adicional de sorvete",
  ],
};

const burgerMenu = [
  {
    id: "classic",
    name: "Clássico",
    price: 45,
    desc: "Pão de Brioche, 180g de carne, duas fatias de queijo cheddar, bacon e cebola caramelizada.",
  },
  {
    id: "salada",
    name: "Salada",
    price: 45,
    desc: "Pão de brioche, 180g de carne, duas fatias de queijo cheddar, bacon, alface americana, tomate, cebola roxa e maionese do chef.",
  },
  {
    id: "argentino",
    name: "Argentino",
    price: 47,
    desc: "Pão de Brioche, 180g de carne, provoleta e chimichurri.",
  },
  {
    id: "supremo",
    name: "Supremo",
    price: 55,
    desc: "Pão de Brioche, 180g de carne, queijo minas empanado na farinha panko, tomate cereja, manjericão e maionese verde.",
  },
  {
    id: "cheeseburger",
    name: "Cheeseburger",
    price: 40,
    desc: "Pão de Brioche, 180g de carne e duas fatias de queijo cheddar.",
  },
] as const;

type CustomSelections = {
  entradasEAcomp: string[];
  carnesGado: string[];
  carnesCordeiro: string[];
  sobremesas: string[];
};

function buildWhatsAppMessage(input: {
  type: EventType;

  date: string;
  period: Period;
  people: number;
  address?: string;

  churrasMenu?: ChurrasMenu;
  customSelections?: CustomSelections;

  burgerQuantities?: { id: string; name: string; qty: number; price: number }[];

  extraNotes?: string;
}) {
  const lines: string[] = [];

  lines.push(`Olá! Quero orçar um evento com o ${siteConfig.brandName} 👋`);
  lines.push("");
  lines.push(
    input.type === "CHURRASCO"
      ? "🔥 Orçamento — Churrasco"
      : "🍔 Orçamento — Hambúrguer"
  );
  lines.push("");
  lines.push(`📅 Data: ${formatDateBR(input.date)}`);
  lines.push(`🕒 Período: ${labelPeriod(input.period)}`);
  lines.push(`👥 Pessoas (estimativa): ${input.people}`);

  if (input.address?.trim()) {
    lines.push(`📍 Endereço (opcional): ${input.address.trim()}`);
  }

  // CHURRASCO
  if (input.type === "CHURRASCO") {
    const menu = input.churrasMenu || "TRADICIONAL";
    lines.push("");
    lines.push(`🥩 Cardápio: ${labelChurrasMenu(menu)}`);

    // ✅ Tradicional/Premium: não enviar itens
    if (menu === "TRADICIONAL") {
      lines.push(`💰 Valor: R$ ${churrasTradicional.pricePerPerson} por pessoa`);
    }

    if (menu === "PREMIUM") {
      lines.push(`💰 Valor: R$ ${churrasPremium.pricePerPerson} por pessoa`);
    }

    // ✅ Personalizado: enviar seleção completa
    if (menu === "PERSONALIZADO") {
      const s = input.customSelections;

      lines.push("");
      lines.push("🧩 Personalizado — seleção escolhida:");

      lines.push("• Entradas e acompanhamentos:");
      lines.push(
        ...(s?.entradasEAcomp?.length
          ? s.entradasEAcomp.map((x) => ` - ${x}`)
          : [" - (não selecionado)"])
      );

      lines.push("• Carnes (gado):");
      lines.push(
        ...(s?.carnesGado?.length
          ? s.carnesGado.map((x) => ` - ${x}`)
          : [" - (não selecionado)"])
      );

      lines.push("• Carnes (cordeiro):");
      lines.push(
        ...(s?.carnesCordeiro?.length
          ? s.carnesCordeiro.map((x) => ` - ${x}`)
          : [" - (não selecionado)"])
      );

      lines.push("• Sobremesas:");
      lines.push(
        ...(s?.sobremesas?.length
          ? s.sobremesas.map((x) => ` - ${x}`)
          : [" - (não selecionado)"])
      );
    }
  }

  // BURGER
  if (input.type === "BURGER") {
    lines.push("");
    lines.push("🍔 Seleção de hambúrgueres:");

    const chosen = (input.burgerQuantities || []).filter((x) => x.qty > 0);
    if (!chosen.length) {
      lines.push(" - (não selecionado)");
    } else {
      chosen.forEach((x) => {
        lines.push(` - ${x.qty}x ${x.name} (R$ ${x.price})`);
      });
      lines.push("");
    }
  }

  if (input.extraNotes?.trim()) {
    lines.push("");
    lines.push(`📝 Observações: ${input.extraNotes.trim()}`);
  }

  lines.push("");
  lines.push("Pode me passar valores finais e disponibilidade?");

  return lines.join("\n");
}

function ToggleList(props: {
  title: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const { title, options, selected, onChange } = props;

  function toggle(value: string) {
    const has = selected.includes(value);
    if (has) onChange(selected.filter((x) => x !== value));
    else onChange([...selected, value]);
  }

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white/50 p-5">
      <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
        {title}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={cx(
                "rounded-2xl px-4 py-2 text-sm border transition",
                active
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
              )}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function EventosPage() {
  const [type, setType] = useState<EventType>("CHURRASCO");

  const [date, setDate] = useState("");
  const [period, setPeriod] = useState<Period>("MEIO_DIA");
  const [people, setPeople] = useState("");

  const [address, setAddress] = useState("");
  const [extraNotes, setExtraNotes] = useState("");

  // churrasco
  const [churrasMenu, setChurrasMenu] = useState<ChurrasMenu>("TRADICIONAL");
  const [custom, setCustom] = useState<CustomSelections>({
    entradasEAcomp: [],
    carnesGado: [],
    carnesCordeiro: [],
    sobremesas: [],
  });

  // burger quantities
  const [qty, setQty] = useState<Record<string, string>>({
    classic: "",
    salada: "",
    argentino: "",
    supremo: "",
    cheeseburger: "",
  });

  const formRef = useRef<HTMLDivElement | null>(null);
  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const burgerQuantities = useMemo(() => {
    return burgerMenu.map((b) => ({
      id: b.id,
      name: b.name,
      price: b.price,
      qty: toInt(qty[b.id] || ""),
    }));
  }, [qty]);

  const minBurgerOk = useMemo(() => {
    // mínimo 10 unidades de cada sabor escolhido (qty > 0)
    const chosen = burgerQuantities.filter((x) => x.qty > 0);
    return chosen.length > 0 && chosen.every((x) => x.qty >= 10);
  }, [burgerQuantities]);

  const canSubmit = useMemo(() => {
    const okDate = date.trim().length > 0;
    const ppl = toInt(people);
    const okPeople = ppl > 0;

    if (!okDate || !okPeople) return false;

    if (type === "CHURRASCO") {
      if (churrasMenu === "PERSONALIZADO") {
        // pelo menos 1 item escolhido em qualquer grupo
        const any =
          custom.entradasEAcomp.length +
            custom.carnesGado.length +
            custom.carnesCordeiro.length +
            custom.sobremesas.length >
          0;
        return any;
      }
      return true;
    }

    // burger precisa de ao menos 1 item e respeitar mínimo 10 por sabor
    return minBurgerOk;
  }, [type, date, people, churrasMenu, custom, minBurgerOk]);

  function handleSubmit() {
    if (!canSubmit) return;

    const message = buildWhatsAppMessage({
      type,
      date,
      period,
      people: toInt(people),
      address: address.trim() || undefined,
      churrasMenu: type === "CHURRASCO" ? churrasMenu : undefined,
      customSelections:
        type === "CHURRASCO" && churrasMenu === "PERSONALIZADO"
          ? custom
          : undefined,
      burgerQuantities: type === "BURGER" ? burgerQuantities : undefined,
      extraNotes: extraNotes.trim() || undefined,
    });

    const url = `https://wa.me/${siteConfig.whatsappPhone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank", "noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10 text-neutral-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <header className="text-center mb-6 md:mb-10">
            <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
              Guilhas Carnes &amp; Assados
            </p>

            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-neutral-900">
              Eventos
            </h1>

            <p className="mt-4 text-neutral-700 text-base md:text-lg">
              Escolha o tipo de evento e envie o orçamento direto no WhatsApp.
            </p>
          </header>

        {/* ✅ Seletor + Detalhes juntos no MESMO Reveal */}
          <div className="space-y-6">
            {/* Seletor */}
            <section className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.14em] text-neutral-600 mb-3">
                Tipo de evento
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setType("CHURRASCO")}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-sm border transition",
                    type === "CHURRASCO"
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
                  )}
                >
                  Churrasco
                </button>

                <button
                  type="button"
                  onClick={() => setType("BURGER")}
                  className={cx(
                    "rounded-2xl px-4 py-2 text-sm border transition",
                    type === "BURGER"
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80"
                  )}
                >
                  Hambúrguer
                </button>

                <div className="flex-1" />

                <Link
                  href="/"
                  className="rounded-2xl px-4 py-2 text-sm border bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80 transition"
                >
                  Voltar ao início
                </Link>
              </div>
            </section>

            {/* Detalhes do tipo (SEM Reveal separado) */}
            {type === "CHURRASCO" ? (
              <section className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Churrasco</h2>
                <p className="mt-2 text-neutral-700">
                  Equipe, preparo e serviço. Ideal para aniversários, empresas e
                  confraternizações.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {([
                    {
                      key: "TRADICIONAL",
                      title: "Tradicional",
                      price: "R$ 135 por pessoa",
                      desc: "Cardápio completo com cortes selecionados.",
                    },
                    {
                      key: "PREMIUM",
                      title: "Premium",
                      price: "R$ 170 por pessoa",
                      desc: "Seleção mais nobre e experiência ainda mais completa.",
                    },
                    {
                      key: "PERSONALIZADO",
                      title: "Personalizado",
                      price: "Sob consulta",
                      desc: "Monte seu cardápio escolhendo itens.",
                    },
                  ] as const).map((m) => {
                    const active = churrasMenu === (m.key as ChurrasMenu);
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setChurrasMenu(m.key as ChurrasMenu)}
                        className={cx(
                          "text-left rounded-3xl border p-5 transition",
                          active
                            ? "border-neutral-900 bg-white/70"
                            : "border-neutral-200 bg-white/50 hover:bg-white/70"
                        )}
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                          Cardápio
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">{m.title}</h3>
                        <p className="mt-1 text-sm text-neutral-700">
                          {m.price}
                        </p>
                        <p className="mt-2 text-sm text-neutral-700">{m.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Resumo tradicional/premium */}
                {churrasMenu !== "PERSONALIZADO" && (
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-3xl border border-neutral-200 bg-white/50 p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                        Itens
                      </p>
                      <h3 className="mt-2 font-semibold text-neutral-900">
                        {churrasMenu === "TRADICIONAL" ? "Tradicional" : "Premium"}
                      </h3>

                      <div className="mt-3 text-sm text-neutral-700 space-y-3">
                        <div>
                          <p className="font-medium">Entradas</p>
                          <ul className="mt-1 list-disc pl-5">
                            {(churrasMenu === "TRADICIONAL"
                              ? churrasTradicional.entradas
                              : churrasPremium.entradas
                            ).map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-medium">Acompanhamentos</p>
                          <ul className="mt-1 list-disc pl-5">
                            {(churrasMenu === "TRADICIONAL"
                              ? churrasTradicional.acompanhamentos
                              : churrasPremium.acompanhamentos
                            ).map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-medium">Carnes</p>
                          <ul className="mt-1 list-disc pl-5">
                            {(churrasMenu === "TRADICIONAL"
                              ? churrasTradicional.carnes
                              : churrasPremium.carnes
                            ).map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-medium">Sobremesa</p>
                          <ul className="mt-1 list-disc pl-5">
                            {(churrasMenu === "TRADICIONAL"
                              ? churrasTradicional.sobremesa
                              : churrasPremium.sobremesa
                            ).map((x) => (
                              <li key={x}>{x}</li>
                            ))}
                          </ul>
                        </div>

                        <p className="text-xs text-neutral-600">
                          Obs.: Crianças de 6 a 12 anos pagam 60% do valor.
                        </p>
                      </div>
                    </div>

                    <div className="rounded-3xl border border-neutral-200 bg-white/50 p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                        Próximo passo
                      </p>
                      <h3 className="mt-2 font-semibold text-neutral-900">
                        Faça o orçamento
                      </h3>
                      <p className="mt-2 text-sm text-neutral-700">
                        Preencha o formulário com data, período e quantidade de
                        pessoas para enviarmos a proposta.
                      </p>

                      <button
                        type="button"
                        onClick={scrollToForm}
                        className="mt-4 w-full rounded-2xl px-5 py-3 bg-neutral-900 text-white font-medium text-center hover:opacity-95 transition"
                      >
                        Orçar evento
                      </button>
                    </div>
                  </div>
                )}

                {/* Personalizado */}
                {churrasMenu === "PERSONALIZADO" && (
                  <div className="mt-6 grid gap-4">
                    <ToggleList
                      title="Entradas e acompanhamentos"
                      options={customOptions.entradasEAcomp}
                      selected={custom.entradasEAcomp}
                      onChange={(next) =>
                        setCustom((prev) => ({ ...prev, entradasEAcomp: next }))
                      }
                    />

                    <ToggleList
                      title="Carnes (gado)"
                      options={customOptions.carnesGado}
                      selected={custom.carnesGado}
                      onChange={(next) =>
                        setCustom((prev) => ({ ...prev, carnesGado: next }))
                      }
                    />

                    <ToggleList
                      title="Carnes (cordeiro)"
                      options={customOptions.carnesCordeiro}
                      selected={custom.carnesCordeiro}
                      onChange={(next) =>
                        setCustom((prev) => ({ ...prev, carnesCordeiro: next }))
                      }
                    />

                    <ToggleList
                      title="Sobremesas"
                      options={customOptions.sobremesas}
                      selected={custom.sobremesas}
                      onChange={(next) =>
                        setCustom((prev) => ({ ...prev, sobremesas: next }))
                      }
                    />

                    <div className="rounded-3xl border border-neutral-200 bg-white/50 p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                        Próximo passo
                      </p>
                      <h3 className="mt-2 font-semibold text-neutral-900">
                        Faça o orçamento
                      </h3>
                      <p className="mt-2 text-sm text-neutral-700">
                        Depois de selecionar os itens, preencha o formulário e
                        envie o orçamento no WhatsApp.
                      </p>

                      <button
                        type="button"
                        onClick={scrollToForm}
                        className="mt-4 w-full rounded-2xl px-5 py-3 bg-neutral-900 text-white font-medium text-center hover:opacity-95 transition"
                      >
                        Orçar evento
                      </button>

                      <p className="mt-3 text-xs text-neutral-600">
                        Dica: selecione ao menos 1 item para conseguir enviar.
                      </p>
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <section className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
                <h2 className="text-2xl font-semibold">Hambúrguer</h2>
                <p className="mt-2 text-neutral-700">
                  O evento é cobrado pelo número de unidades contratadas.
                  Recomendação: <b>1,5</b> hambúrguer por pessoa.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {burgerMenu.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-3xl border border-neutral-200 bg-white/50 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold">{b.name}</h3>
                          <p className="mt-2 text-sm text-neutral-700">{b.desc}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-lg font-semibold">R${b.price}</p>
                          <p className="text-xs text-neutral-600">por unidade</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="text-sm text-neutral-800">
                          Quantidade (mín. 10 se escolher)
                        </label>
                        <input
                          inputMode="numeric"
                          value={qty[b.id]}
                          onChange={(e) =>
                            setQty((prev) => ({ ...prev, [b.id]: e.target.value }))
                          }
                          placeholder="0"
                          className="mt-1 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-3xl border border-neutral-200 bg-white/50 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                    Importante
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">
                    Mínimo <b>10 unidades</b> de cada sabor escolhido.
                  </p>

                  {!minBurgerOk && (
                    <p className="mt-2 text-xs text-neutral-600">
                      Para enviar, escolha ao menos 1 sabor e coloque no mínimo 10
                      unidades nele.
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="mt-4 w-full rounded-2xl px-5 py-3 bg-neutral-900 text-white font-medium text-center hover:opacity-95 transition"
                  >
                    Orçar evento
                  </button>
                </div>
              </section>
            )}
          </div>

        {/* FORM */}
        <div ref={formRef} className="mt-10" />

          <section className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                  Formulário
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Orçar {type === "CHURRASCO" ? "Churrasco" : "Hambúrguer"}
                </h2>
                <p className="mt-2 text-neutral-700">
                  Preencha os dados do evento e envie no WhatsApp com a mensagem
                  pronta.
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="rounded-2xl px-4 py-2 text-sm border bg-white/60 text-neutral-900 border-neutral-300 hover:bg-white/80 transition"
              >
                Voltar ao topo
              </button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm text-neutral-800">Data *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full max-w-full md:max-w-[220px] rounded-2xl border border-neutral-300 bg-white px-3 py-3 text-sm outline-none focus:border-neutral-500"                />
              </div>

              <div>
                <label className="text-sm text-neutral-800">Período *</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as Period)}
                  className="mt-1 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
                >
                  <option value="MEIO_DIA">Meio-dia</option>
                  <option value="NOITE">Noite</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-neutral-800">
                  Nº de pessoas (estimativa) *
                </label>
                <input
                  inputMode="numeric"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="Ex: 30"
                  className="mt-1 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />
              </div>

              <div>
                <label className="text-sm text-neutral-800">
                  Endereço (opcional)
                </label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, bairro, cidade..."
                  className="mt-1 w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm text-neutral-800">
                Observações (opcional)
              </label>
              <textarea
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Ex: horário, restrições, necessidades, etc."
                className="mt-1 min-h-[90px] w-full rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-500"
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={cx(
                  "rounded-2xl px-5 py-3 font-medium text-center transition",
                  canSubmit
                    ? "bg-neutral-900 text-white hover:opacity-95"
                    : "bg-neutral-300 text-neutral-600 cursor-not-allowed"
                )}
              >
                Enviar orçamento no WhatsApp
              </button>

              {!canSubmit && (
                <p className="text-xs text-neutral-600 self-center">
                  Preencha data, período e pessoas.{" "}
                  {type === "CHURRASCO"
                    ? churrasMenu === "PERSONALIZADO"
                      ? "Selecione ao menos 1 item no personalizado."
                      : "Escolha o cardápio."
                    : "Escolha ao menos 1 sabor com mínimo 10 unidades."}
                </p>
              )}
            </div>
          </section>

        {/* Aviso final */}
          <div className="mt-10 text-center text-sm text-neutral-700">
            <span className="inline-block rounded-full border border-neutral-300 bg-white/60 px-4 py-2">
              Atendimento e disponibilidade variam conforme agenda da semana.
            </span>
          </div>
        </Reveal>
      </div>
    </main>
  );
}