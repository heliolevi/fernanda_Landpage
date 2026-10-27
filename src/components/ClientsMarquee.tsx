import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { useReducedMotion } from "motion/react";
import { Asterisk } from "@phosphor-icons/react";
import { clients } from "@/lib/site";

/**
 * Único marquee da página, movido por Anime.js (loop linear contínuo).
 * Motivo: dar ritmo entre o hero e os trabalhos e mostrar a lista de clientes sem ocupar uma seção.
 */
export function ClientsMarquee() {
  const reduce = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduce || !track.current) return;
    const anim = animate(track.current, { x: ["0%", "-50%"], duration: 38000, ease: "linear", loop: true });
    const el = track.current;
    const slow = () => (anim.speed = 0.25);
    const fast = () => (anim.speed = 1);
    el.addEventListener("pointerenter", slow);
    el.addEventListener("pointerleave", fast);
    return () => {
      el.removeEventListener("pointerenter", slow);
      el.removeEventListener("pointerleave", fast);
      anim.revert();
    };
  }, [reduce]);

  const row = clients.map((c) => (
    <span key={c} className="flex items-center gap-8 pr-8 md:gap-14 md:pr-14">
      <span className="whitespace-nowrap font-display text-[clamp(2rem,5vw,4rem)] font-medium tracking-tight text-text">{c}</span>
      <Asterisk size={28} weight="bold" className="shrink-0 text-accent" aria-hidden="true" />
    </span>
  ));

  return (
    <section aria-label="Clientes atendidos" className="border-y border-line bg-surface/60 py-10 md:py-14">
      <p className="mx-auto mb-6 max-w-[1400px] px-5 text-lg text-muted md:px-10 md:text-xl">Já criei Reels para</p>
      <div
        className="overflow-hidden"
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)" }}
      >
        <div ref={track} className="flex w-max will-change-transform">
          <div className="flex" aria-hidden={false}>{row}</div>
          <div className="flex" aria-hidden="true">{row}</div>
        </div>
      </div>
    </section>
  );
}
