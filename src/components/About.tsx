import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { aboutText } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

/**
 * Texto revelado palavra por palavra pelo scroll (GSAP scrub) e foto com parallax leve.
 * Motivo: leitura guiada do texto de apresentação, que é o que cria confiança antes do preço.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const words = aboutText.split(" ");

  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-word",
        { opacity: 0.18 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 55%", scrub: 0.5 },
        },
      );
      gsap.fromTo(
        ".about-photo",
        { yPercent: 6 },
        {
          yPercent: -6,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="sobre" ref={root} className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-44">
      <h2 className="text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">Sobre mim</h2>

      <div className="mt-14 grid gap-12 md:mt-24 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4 md:self-start">
          <div className="overflow-hidden rounded-media">
            <img
              src="/img/portrait-seated.webp"
              alt="Retrato de Fernanda Oliveira, editora de vídeo, em fundo escuro"
              loading="lazy"
              decoding="async"
              width={1200}
              height={1800}
              className="about-photo aspect-[2/3] w-full scale-110 object-cover"
            />
          </div>
        </div>
        <p className="about-text md:col-span-7 md:col-start-6 md:pt-16 font-display text-[clamp(1.6rem,3.4vw,3rem)] font-medium leading-[1.18] tracking-[-0.025em]">
          {words.map((w, i) => (
            <span key={i} className="about-word inline-block pr-[0.28em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
