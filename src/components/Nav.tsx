import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CTA_LABEL, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/lenis";

const links = [
  { id: "trabalhos", label: "Trabalhos" },
  { id: "servicos", label: "Serviços" },
  { id: "sobre", label: "Sobre" },
  { id: "pacotes", label: "Pacotes" },
];

export function Nav() {
  const reduce = useReducedMotion();
  return (
    <motion.header
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-3 z-40 px-3 md:top-4 md:px-6"
    >
      <nav
        aria-label="Principal"
        className="mx-auto flex h-14 max-w-[1400px] items-center justify-between rounded-full border border-line bg-bg/80 pl-6 pr-2 backdrop-blur-md"
      >
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            scrollToId("top");
          }}
          className="flex items-baseline gap-3 font-display text-base font-semibold tracking-tight"
        >
          Fernanda Oliveira
          <span className="hidden text-sm font-normal text-muted lg:inline">Editora de vídeo</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(l.id);
                }}
                className="inline-flex h-11 items-center rounded-full px-4 text-sm text-muted transition-colors hover:text-text"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <Button asChild size="sm">
          <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
            {CTA_LABEL}
          </a>
        </Button>
      </nav>
    </motion.header>
  );
}
