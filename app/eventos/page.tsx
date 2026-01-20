"use client";

import Link from "next/link";
import { Reveal } from "../components/reveal";

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-[#F6F2EA] px-5 md:px-10 py-10 text-neutral-900">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <Reveal>
          <header className="text-center mb-10">
            <p className="uppercase tracking-[0.18em] text-xs text-neutral-600">
              Guilhas Carnes & Assados
            </p>

            <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-neutral-900">
              Eventos
            </h1>

            <p className="mt-4 text-neutral-700 text-base md:text-lg">
              Churrasco &amp; Burger para eventos em Caxias do Sul e região.
            </p>
          </header>
        </Reveal>

        {/* Cards principais */}
        <section className="grid gap-4 md:grid-cols-3">
          <Reveal delayMs={60}>
            <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Churrasco completo</h2>
              <p className="mt-2 text-neutral-700">
                Equipe, preparo e serviço. Ideal para aniversários, empresas e
                confraternizações.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={120}>
            <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Burger na brasa</h2>
              <p className="mt-2 text-neutral-700">
                Hambúrguer artesanal no evento, com montagem e atendimento.
              </p>
            </div>
          </Reveal>

          <Reveal delayMs={180}>
            <div className="rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
              <h2 className="text-lg font-semibold">Evento personalizado</h2>
              <p className="mt-2 text-neutral-700">
                Montamos a proposta conforme data, número de pessoas e estilo do
                evento.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Como funciona */}
        <Reveal delayMs={140}>
          <section className="mt-10 rounded-3xl border border-neutral-200 bg-white/60 backdrop-blur p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Como funciona</h2>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "1) Chama no WhatsApp",
                  desc: "Me diz a data, cidade e quantidade de pessoas.",
                },
                {
                  title: "2) Proposta rápida",
                  desc: "Retornamos com opções e valores conforme o perfil do evento.",
                },
                {
                  title: "3) Confirmou, tá fechado",
                  desc: "A gente cuida do resto: compra dos ingredientes, preparo, execução e qualidade Guilhas.",
                },
              ].map((step, idx) => (
                <div
                  key={step.title}
                  className="rounded-3xl border border-neutral-200 bg-white/60 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.14em] text-neutral-600">
                    Passo {idx + 1}
                  </p>
                  <h3 className="mt-2 font-semibold text-neutral-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-700">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5554999320907"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl px-5 py-3 bg-neutral-900 text-white font-medium text-center hover:opacity-95 transition"
              >
                Solicitar orçamento no WhatsApp
              </a>

            
            </div>
          </section>
        </Reveal>

        {/* Aviso final */}
        <Reveal delayMs={180}>
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