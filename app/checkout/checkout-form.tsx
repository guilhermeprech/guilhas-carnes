"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "../cart-context";
import { WhatsAppIcon } from "../components/icons";
import { formatBRL } from "@/lib/format";
import {
  buildOrderMessage,
  deliveryFeeCents,
  hasWeightItems,
  lineTotalCents,
  type Fulfillment,
} from "@/lib/order";
import { site, whatsappLink } from "@/lib/site";

const onlyDigits = (v: string) => v.replace(/\D/g, "");

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.95rem]">
        {label}
        {required ? "" : <span className="text-stone-dark"> (opcional)</span>}
      </span>
      {children}
      {hint && <span className="mt-1.5 block text-sm text-stone-dark">{hint}</span>}
    </label>
  );
}

export function CheckoutForm() {
  const { ready, lines, subtotalCents, clear } = useCart();

  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [tried, setTried] = useState(false);
  const [sentUrl, setSentUrl] = useState<string | null>(null);

  const fee = deliveryFeeCents(fulfillment);
  const weight = hasWeightItems(lines);

  const address = useMemo(
    () =>
      [
        street.trim() && `${street.trim()}${number.trim() ? `, ${number.trim()}` : ""}`,
        neighborhood.trim() && `Bairro ${neighborhood.trim()}`,
        complement.trim(),
        reference.trim() && `Ref.: ${reference.trim()}`,
        `${site.city}`,
      ]
        .filter(Boolean)
        .join(" — "),
    [street, number, neighborhood, complement, reference],
  );

  const errors = {
    name: name.trim().length < 2 ? "Informe teu nome." : "",
    phone: onlyDigits(phone).length < 10 ? "Informe o telefone com DDD." : "",
    street: fulfillment === "delivery" && !street.trim() ? "Informe a rua." : "",
    neighborhood: fulfillment === "delivery" && !neighborhood.trim() ? "Informe o bairro." : "",
  };
  const valid = !Object.values(errors).some(Boolean);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (!valid || !lines.length) return;
    const message = buildOrderMessage({
      customerName: name.trim(),
      customerPhone: onlyDigits(phone),
      fulfillment,
      address: fulfillment === "delivery" ? address : undefined,
      notes,
      lines,
    });
    const url = whatsappLink(message);
    setSentUrl(url);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
  }

  const err = (k: keyof typeof errors) =>
    tried && errors[k] ? <span className="mt-1.5 block text-sm font-medium text-[#9b1c1c]">{errors[k]}</span> : null;

  if (!ready) return <div className="wrap h-80" aria-busy="true" />;

  if (sentUrl) {
    return (
      <div className="wrap py-20 md:py-28">
        <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.95]">Pedido pronto no WhatsApp.</h1>
        <p className="mt-5 max-w-lg text-[1.05rem] leading-relaxed text-stone-dark">
          Envie a mensagem na conversa que abriu. A gente responde confirmando o peso, o valor final e a entrega.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
            <WhatsAppIcon /> Abrir o WhatsApp de novo
          </a>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              clear();
              setSentUrl(null);
            }}
          >
            Esvaziar carrinho
          </button>
        </div>
        <button type="button" onClick={() => setSentUrl(null)} className="mt-6 text-sm link-underline text-stone-dark">
          Voltar e editar o pedido
        </button>
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="wrap py-20">
        <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.95]">Finalizar pedido</h1>
        <p className="mt-5 text-stone-dark">Teu carrinho está vazio.</p>
        <Link href="/produtos" className="btn btn-solid mt-8">Ver os cortes</Link>
      </div>
    );
  }

  return (
    <div className="wrap pb-24">
      <header className="pb-8 pt-10 md:pt-16">
        <Link href="/carrinho" className="text-sm link-underline text-stone-dark">Voltar ao carrinho</Link>
        <h1 className="mt-4 font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.9]">Finalizar pedido</h1>
      </header>

      <form onSubmit={submit} noValidate className="grid gap-12 lg:grid-cols-12">
        <div className="space-y-12 lg:col-span-7">
          <fieldset>
            <legend className="font-display text-[2rem] leading-none">Teus dados</legend>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <Field label="Nome" required>
                  <input className="field" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </Field>
                {err("name")}
              </div>
              <div>
                <Field label="WhatsApp com DDD" required>
                  <input
                    className="field tabular"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="54 9 9999-9999"
                  />
                </Field>
                {err("phone")}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-[2rem] leading-none">Entrega ou retirada</legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2" role="radiogroup">
              {(
                [
                  { value: "delivery", title: "Entrega", detail: `${site.city}, taxa fixa de ${formatBRL(site.deliveryFeeCents)}` },
                  { value: "pickup", title: "Retirada", detail: "Local e horário a combinar" },
                ] as const
              ).map((o) => (
                <label
                  key={o.value}
                  className={`flex cursor-pointer gap-3 border p-4 transition-colors ${fulfillment === o.value ? "border-ink bg-white" : "border-line hover:border-stone"}`}
                >
                  <input
                    type="radio"
                    name="fulfillment"
                    value={o.value}
                    checked={fulfillment === o.value}
                    onChange={() => setFulfillment(o.value)}
                    className="mt-1 accent-ink"
                  />
                  <span>
                    <span className="block font-semibold">{o.title}</span>
                    <span className="block text-sm text-stone-dark">{o.detail}</span>
                  </span>
                </label>
              ))}
            </div>

            {fulfillment === "delivery" && (
              <div className="mt-6 grid gap-5 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <Field label="Rua ou avenida" required>
                    <input className="field" value={street} onChange={(e) => setStreet(e.target.value)} autoComplete="address-line1" />
                  </Field>
                  {err("street")}
                </div>
                <div className="sm:col-span-2">
                  <Field label="Número">
                    <input className="field" value={number} onChange={(e) => setNumber(e.target.value)} inputMode="numeric" />
                  </Field>
                </div>
                <div className="sm:col-span-3">
                  <Field label="Bairro" required>
                    <input className="field" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                  </Field>
                  {err("neighborhood")}
                </div>
                <div className="sm:col-span-3">
                  <Field label="Complemento">
                    <input className="field" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto, bloco" autoComplete="address-line2" />
                  </Field>
                </div>
                <div className="sm:col-span-6">
                  <Field label="Ponto de referência">
                    <input className="field" value={reference} onChange={(e) => setReference(e.target.value)} />
                  </Field>
                </div>
              </div>
            )}
          </fieldset>

          <fieldset>
            <legend className="font-display text-[2rem] leading-none">Observações</legend>
            <div className="mt-6">
              <Field label="Algo que a gente precisa saber?">
                <textarea
                  className="field min-h-28 resize-y"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Horário para entrega ou retirada, corte mais fino…"
                />
              </Field>
            </div>
          </fieldset>
        </div>

        <aside aria-label="Resumo do pedido" className="lg:col-span-5">
          <div className="bg-white p-6 md:p-8 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <h2 className="font-display text-[2rem] leading-none">Teu pedido</h2>
            <ul className="mt-6 space-y-3 border-t border-line pt-4">
              {lines.map((l) => (
                <li key={l.product.id} className="flex justify-between gap-4">
                  <span>
                    <span className="tabular">{l.qty}×</span> {l.product.name}
                  </span>
                  <span className="tabular shrink-0">{formatBRL(lineTotalCents(l))}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t border-line pt-4">
              <div className="flex justify-between gap-4">
                <dt className="text-stone-dark">Subtotal {weight ? "estimado" : ""}</dt>
                <dd className="tabular">{formatBRL(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-stone-dark">{fulfillment === "delivery" ? "Entrega" : "Retirada"}</dt>
                <dd className="tabular">{fulfillment === "delivery" ? formatBRL(fee) : "a combinar"}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
                <dt className="font-semibold">Total {weight ? "estimado" : ""}</dt>
                <dd className="tabular font-display text-[2.25rem] leading-none">{formatBRL(subtotalCents + fee)}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-stone-dark">
              {weight && "Itens vendidos por peso têm o valor final confirmado no WhatsApp, pelo peso real. "}
              Pagamento: {site.paymentText}.
            </p>
            <button type="submit" className="btn btn-solid mt-6 w-full">
              <WhatsAppIcon /> Enviar pedido pelo WhatsApp
            </button>
            {tried && !valid && (
              <p className="mt-3 text-sm font-medium text-[#9b1c1c]" role="alert">
                Faltam alguns dados. Confira os campos marcados.
              </p>
            )}
          </div>
        </aside>
      </form>
    </div>
  );
}
