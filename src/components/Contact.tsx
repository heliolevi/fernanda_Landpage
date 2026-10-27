import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/MagneticButton";
import { SplineSlot } from "@/components/SplineSlot";
import { CTA_LABEL, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const lines = ["Vamos criar o seu", "próximo Reels?"];

export function Contact() {
  const reduce = useReducedMotion();
  const photo = useRef<HTMLDivElement>(null);
  const hasSpline = Boolean(import.meta.env.VITE_SPLINE_SCENE);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // observa o h2 (que não é recortado); observar o span deslocado dentro do overflow-hidden nunca dispara
  const titleIn = useInView(titleRef, { once: true, amount: 0.5 });

  useEffect(() => {
    if (reduce || !photo.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-photo",
        { clipPath: "inset(18% 12% 18% 12% round 20px)", scale: 1.15 },
        {
          clipPath: "inset(0% 0% 0% 0% round 20px)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: photo.current, start: "top 95%", end: "top 35%", scrub: true },
        },
      );
    }, photo);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="contato" className="relative bg-brand">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-40">
        <div className="md:col-span-7">
          <h2 ref={titleRef} className="text-[clamp(2.6rem,5.6vw,5.4rem)] leading-[0.98] tracking-[-0.045em]">
            {lines.map((line, li) => (
              <span key={line} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "110%" }}
                  animate={titleIn || reduce ? { y: 0 } : undefined}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: li * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>
          <p className="mt-8 max-w-[36ch] text-lg text-text/80 md:text-xl">
            Me chame no WhatsApp para conversar sobre o seu projeto e receber um orçamento sem compromisso.
          </p>
          <div className="mt-10">
            <MagneticButton strength={0.25}>
              <Button asChild size="lg">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                  {CTA_LABEL}
                </a>
              </Button>
            </MagneticButton>
          </div>
        </div>

        <div ref={photo} className="md:col-span-4 md:col-start-9 md:self-end">
          {hasSpline ? (
            <SplineSlot className="aspect-[3/4] w-full overflow-hidden rounded-media" />
          ) : (
            <img
              src="/img/portrait-light.webp"
              alt="Fernanda Oliveira sorrindo, de blusa branca"
              loading="lazy"
              decoding="async"
              width={1200}
              height={1800}
              className="contact-photo aspect-[3/4] w-full rounded-media object-cover"
            />
          )}
        </div>
      </div>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-5 py-8 text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <p className="font-display text-lg font-semibold tracking-tight text-text">
            Fernanda Oliveira <span className="font-normal text-muted">Editora de vídeo</span>
          </p>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center tabular transition-colors hover:text-text"
          >
            {WHATSAPP_DISPLAY}
          </a>
          <p className="text-sm">© 2026 Fernanda Oliveira</p>
        </div>
      </footer>
    </section>
  );
}
