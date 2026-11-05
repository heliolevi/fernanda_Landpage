import { motion, useReducedMotion } from "motion/react";
import { Check, Sparkle, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { packages, quoteMessage, whatsappLink } from "@/lib/site";

/**
 * Planos de orçamento: cada card abre o WhatsApp com a mensagem do plano já pronta.
 */
export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section id="pacotes" className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <p className="text-base text-muted">Orçamento sem compromisso</p>
      <h2 className="mt-2 max-w-[18ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">Escolha um plano e peça seu orçamento</h2>
      <p className="mt-6 max-w-xl text-lg text-muted">
        Clique no plano que mais combina com o seu momento. Eu recebo a mensagem pronta no WhatsApp e te respondo com uma proposta sob medida.
      </p>

      <div className="mt-14 grid gap-6 md:mt-20 lg:grid-cols-3 lg:items-stretch lg:gap-8">
        {packages.map((p, i) => (
          <motion.article
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className={`relative flex flex-col rounded-media p-7 md:p-10 ${
              p.highlight ? "bg-accent text-accent-ink lg:-my-4 lg:py-14" : "bg-brand"
            }`}
          >
            {"badge" in p && p.badge && (
              <span className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-accent-ink px-3 py-1 text-sm font-medium text-accent">
                <Sparkle size={14} weight="fill" aria-hidden="true" />
                {p.badge}
              </span>
            )}

            <p className={`text-base ${p.highlight ? "opacity-70" : "text-muted"}`}>{p.name}</p>
            <h3 className="mt-1 font-display text-[clamp(2.6rem,5vw,4rem)] font-semibold leading-none tracking-[-0.04em]">{p.reels}</h3>
            <p className={`mt-4 text-lg ${p.highlight ? "opacity-80" : "text-muted"}`}>{p.tagline}</p>

            <ul className="mt-8 grid gap-3">
              {p.items.map((item) => (
                <li key={item} className="flex items-center gap-3 text-lg">
                  <Check size={20} weight="bold" className={`shrink-0 ${p.highlight ? "" : "text-accent"}`} aria-hidden="true" />
                  {item}
                </li>
              ))}
              <li className="flex items-center gap-3 text-lg">
                <Check size={20} weight="bold" className={`shrink-0 ${p.highlight ? "" : "text-accent"}`} aria-hidden="true" />
                Entrega em {p.deadline}
              </li>
            </ul>

            <Button
              asChild
              size="lg"
              className={`mt-10 w-full lg:mt-auto ${p.highlight ? "bg-accent-ink text-accent hover:bg-accent-ink/90" : ""}`}
            >
              <a href={whatsappLink(quoteMessage(p))} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                Pedir orçamento
              </a>
            </Button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
