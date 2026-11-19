import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChatCircleDots, Check, Sparkle, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_PACKAGE,
  helpMessage,
  packageIncludes,
  packages,
  quoteMessage,
  reels,
  whatsappLink,
} from "@/lib/site";

type Pkg = (typeof packages)[number];

const EASE = [0.16, 1, 0.3, 1] as const;
const SPRING = { type: "spring", stiffness: 260, damping: 30, mass: 0.9 } as const;

/** Capas reais dos Reels, repetidas em ordem até completar o pacote. */
const covers = reels.map((r) => r.poster);

/**
 * Grade de quadros por pacote. Altura do palco fixa (sem pulo de layout ao trocar de plano);
 * só a largura máxima e o número de colunas mudam, e o Motion anima o resto.
 */
const grid: Record<number, string> = {
  2: "grid-cols-2 max-w-[15rem] md:max-w-[26rem]",
  4: "grid-cols-4 max-w-full",
  6: "grid-cols-3 max-w-[15rem] md:grid-cols-6 md:max-w-full",
};

/**
 * Pacotes: o visitante escolhe quantos Reels quer e vê o pacote na hora, em quadros 9:16 com
 * capas de trabalhos reais. Um único botão leva ao WhatsApp com a mensagem do plano escolhido.
 */
export function Pricing() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<Pkg["id"]>(DEFAULT_PACKAGE);
  const pkg = packages.find((p) => p.id === selected) ?? packages[1];
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (i + step + packages.length) % packages.length;
    setSelected(packages[next].id);
    optionRefs.current[next]?.focus();
  };

  const reveal = (d = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 28 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.8, ease: EASE, delay: d },
        };

  return (
    <section id="pacotes" aria-labelledby="pacotes-titulo" className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <motion.h2
          id="pacotes-titulo"
          {...reveal()}
          className="max-w-[16ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.98] lg:col-span-7"
        >
          Quantos Reels o seu negócio precisa?
        </motion.h2>
        <motion.p {...reveal(0.08)} className="max-w-[40ch] text-lg text-muted lg:col-span-5 lg:pb-3">
          Escolha o pacote e peça o orçamento. Os valores chegam no seu WhatsApp, junto com uma proposta pensada para o seu negócio.
        </motion.p>
      </div>

      <div className="mt-12 grid gap-4 md:mt-20 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-0">
        {/* escolha do plano */}
        <motion.div
          {...reveal(0.12)}
          role="radiogroup"
          aria-label="Pacotes de Reels"
          className="flex flex-col gap-2 rounded-media bg-surface p-3 md:p-4 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:rounded-b-none lg:p-6 lg:pb-3"
        >
          {packages.map((p, i) => {
            const active = p.id === selected;
            return (
              <button
                key={p.id}
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                role="radio"
                aria-checked={active}
                tabIndex={active ? 0 : -1}
                onClick={() => setSelected(p.id)}
                onKeyDown={(e) => onKey(e, i)}
                className={`group relative grid min-h-[4.5rem] w-full grid-cols-[1.375rem_1fr_auto] items-center gap-x-4 rounded-[14px] px-4 py-3.5 text-left transition-colors duration-300 [&:focus-visible]:rounded-[14px] md:px-5 ${
                  active ? "text-text" : "text-text/75 hover:bg-text/[0.04] hover:text-text"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="plan-active"
                    aria-hidden="true"
                    transition={reduce ? { duration: 0 } : SPRING}
                    className="absolute inset-0 rounded-[14px] bg-brand-soft/70 ring-1 ring-accent/70"
                  />
                )}
                <span
                  aria-hidden="true"
                  className={`relative flex h-[1.375rem] w-[1.375rem] items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                    active ? "border-accent" : "border-text/30 group-hover:border-text/60"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-300 ease-[var(--ease-out-expo)] ${
                      active ? "scale-100" : "scale-0"
                    }`}
                  />
                </span>
                <span className="relative min-w-0">
                  <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <span className="font-display text-xl font-semibold tracking-tight">{p.name}</span>
                    {"badge" in p && p.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2.5 py-0.5 text-[0.8125rem] font-medium text-accent">
                        <Sparkle size={12} weight="fill" aria-hidden="true" />
                        {p.badge}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {p.recording}, entrega em {p.deadline}
                  </span>
                </span>
                <span className="tabular relative font-display text-[1.75rem] font-semibold leading-none tracking-tight">
                  {p.count}
                  <span className="ml-1 font-body text-sm font-normal text-muted">Reels</span>
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* palco: o pacote em quadros 9:16 */}
        <motion.div
          {...reveal(0.05)}
          aria-hidden="true"
          className="relative flex flex-col overflow-hidden rounded-media bg-brand p-6 md:p-10 lg:col-span-7 lg:col-start-1 lg:row-span-2 lg:row-start-1"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-baseline gap-3">
              <span className="relative inline-flex h-[clamp(4.5rem,9vw,7.5rem)] min-w-[0.62em] overflow-hidden font-display text-[clamp(4.5rem,9vw,7.5rem)] font-semibold leading-none tracking-[-0.04em] text-accent">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={pkg.count}
                    initial={reduce ? false : { y: "70%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={reduce ? undefined : { y: "-70%", opacity: 0, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="tabular block"
                  >
                    {pkg.count}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold tracking-tight">Reels</span>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={pkg.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
                transition={{ duration: 0.35, ease: EASE }}
                className="hidden max-w-[22ch] pt-3 text-right text-lg text-text/80 sm:block"
              >
                {pkg.tagline}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="flex h-[19rem] items-center justify-center md:h-[25rem] lg:mt-auto lg:h-[27rem]">
            <motion.ul layout={!reduce} className={`grid w-full gap-2.5 md:gap-3.5 ${grid[pkg.count]}`} transition={SPRING}>
              <AnimatePresence initial={false} mode="popLayout">
                {Array.from({ length: pkg.count }, (_, i) => (
                  <motion.li
                    key={i}
                    layout={!reduce}
                    initial={reduce ? false : { opacity: 0, scale: 0.85, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, scale: 0.9, transition: { duration: 0.16 } }}
                    transition={{ ...SPRING, delay: reduce ? 0 : Math.max(0, i - 1) * 0.04 }}
                    className="relative aspect-[9/16] overflow-hidden rounded-[12px] bg-surface shadow-[0_18px_40px_-18px_rgb(0_0_0/0.7)]"
                  >
                    <img
                      src={covers[i % covers.length]}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                    <span className="tabular absolute bottom-1.5 left-2 text-xs font-medium text-white/90 [text-shadow:0_1px_6px_rgb(0_0_0/0.6)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          </div>

          <p className="text-lg text-text/80 sm:hidden">{pkg.tagline}</p>
        </motion.div>

        {/* o que vem junto e o pedido */}
        <motion.div
          {...reveal(0.18)}
          className="flex flex-col rounded-media bg-surface p-6 md:p-8 lg:col-span-5 lg:col-start-8 lg:row-start-2 lg:rounded-t-none lg:px-10 lg:pb-10 lg:pt-5"
        >
          <div className="lg:border-t lg:border-line lg:pt-6">
            <h3 className="font-body text-base font-medium tracking-normal text-muted">Em todos os pacotes</h3>
            <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {packageIncludes.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[1.0625rem]">
                  <Check size={18} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 lg:mt-auto lg:pt-10">
            <Button asChild size="lg" className="w-full">
              <a href={whatsappLink(quoteMessage(pkg))} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                <span>
                  Pedir orçamento: <span className="tabular">{pkg.reels}</span>
                </span>
              </a>
            </Button>
            <p className="mt-3 text-center text-sm text-muted" aria-live="polite">
              Abre o WhatsApp com o pacote {pkg.name} já escrito na mensagem.
            </p>
            <a
              href={whatsappLink(helpMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-full px-3 py-2.5 text-base text-text/85 underline decoration-line underline-offset-[6px] transition-colors duration-300 hover:text-text hover:decoration-accent"
            >
              <ChatCircleDots size={20} aria-hidden="true" />
              Não sabe qual escolher? Me conta do seu negócio
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
