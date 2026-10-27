import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { Check, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CTA_LABEL, packages, whatsappLink } from "@/lib/site";

const brl = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

/**
 * Seletor de pacotes (shadcn Tabs + Motion + Anime.js):
 * trocar de pacote reanima o preço com contagem (Anime.js) e a lista com Motion, e a mensagem do WhatsApp já vai com o pacote.
 */
export function Pricing() {
  const [value, setValue] = useState<string>(packages[0].id);
  const pkg = packages.find((p) => p.id === value) ?? packages[0];

  return (
    <section id="pacotes" className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <h2 className="max-w-[16ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">Escolha o pacote ideal para o seu conteúdo</h2>

      <Tabs value={value} onValueChange={setValue} className="mt-14 grid gap-8 md:mt-20 lg:grid-cols-12 lg:gap-8">
        <TabsList aria-label="Pacotes" className="flex-row gap-3 lg:col-span-4 lg:flex-col lg:gap-4">
          {packages.map((p) => {
            const active = p.id === value;
            return (
              <TabsTrigger
                key={p.id}
                value={p.id}
                className={`flex-1 rounded-full border px-5 py-4 text-center transition-colors duration-300 lg:flex-none lg:px-8 lg:py-6 lg:text-left ${
                  active ? "border-transparent text-accent-ink" : "border-line text-muted hover:border-text/50 hover:text-text"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="pkg-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  />
                )}
                <span className="relative font-display text-xl font-semibold tracking-tight lg:text-3xl">{p.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="lg:col-span-8">
          {packages.map((p) => (
            <TabsContent key={p.id} value={p.id} forceMount hidden={p.id !== value}>
              {p.id === value && <Panel pkg={pkg} />}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </section>
  );
}

function Panel({ pkg }: { pkg: (typeof packages)[number] }) {
  const reduce = useReducedMotion();
  const priceEl = useRef<HTMLSpanElement>(null);
  const last = useRef(0);

  useEffect(() => {
    const el = priceEl.current;
    if (!el) return;
    if (reduce) {
      el.textContent = brl(pkg.price);
      last.current = pkg.price;
      return;
    }
    const obj = { v: last.current };
    const a = animate(obj, {
      v: pkg.price,
      duration: 900,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = brl(obj.v);
      },
      onComplete: () => {
        last.current = pkg.price;
      },
    });
    return () => {
      a.pause();
      last.current = obj.v;
    };
  }, [pkg.price, reduce]);

  const message = `Olá, Fernanda! Quero o pacote de ${pkg.label} (${brl(pkg.price)}). Podemos conversar?`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pkg.id}
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-media bg-brand p-7 md:p-12"
      >
        <p className="text-base text-muted">Investimento</p>
        <p className="mt-1 font-display text-[clamp(3.6rem,10vw,8rem)] font-semibold leading-none tracking-[-0.05em] tabular">
          <span ref={priceEl}>{brl(pkg.price)}</span>
        </p>

        <ul className="mt-10 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {pkg.items.map((item, i) => (
            <motion.li
              key={item}
              initial={reduce ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 text-lg"
            >
              <Check size={20} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
              {item}
            </motion.li>
          ))}
          <motion.li
            initial={reduce ? false : { opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + pkg.items.length * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 text-lg"
          >
            <Check size={20} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
            Entrega em {pkg.deadline}
          </motion.li>
        </ul>

        <Button asChild size="lg" className="mt-12 w-full sm:w-auto">
          <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer">
            <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
            {CTA_LABEL}
          </a>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
