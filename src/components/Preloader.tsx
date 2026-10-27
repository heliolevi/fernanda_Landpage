import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { gsap } from "gsap";
import { useReducedMotion } from "motion/react";

/**
 * Anime.js conta de 0 a 100 e preenche a barra; GSAP levanta a cortina.
 * Motivo: cobrir o carregamento do vídeo e dar o primeiro movimento de marca.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setGone(true);
      onDone();
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      document.documentElement.style.overflow = "";
      gsap.to(root.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "expo.inOut",
        onStart: onDone,
        onComplete: () => setGone(true),
      });
    };
    const a1 = animate(counter, {
      v: 100,
      duration: 1500,
      ease: "inOutQuad",
      onUpdate: () => {
        if (num.current) num.current.textContent = String(Math.round(counter.v));
      },
      onComplete: finish,
    });
    const a2 = bar.current
      ? animate(bar.current, { scaleX: [0, 1], duration: 1500, ease: "inOutQuad" })
      : null;
    const safety = window.setTimeout(finish, 3500);
    return () => {
      a1.revert();
      a2?.revert();
      window.clearTimeout(safety);
      document.documentElement.style.overflow = "";
    };
  }, [reduce, onDone]);

  if (gone) return null;
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-brand p-6 text-text md:p-10"
    >
      <p className="font-display text-lg font-medium tracking-tight">
        Fernanda Oliveira
        <span className="block text-sm font-normal text-muted">Editora de vídeo</span>
      </p>
      <div>
        <div className="mb-4 flex items-end justify-between">
          <span className="font-display text-[clamp(4rem,16vw,11rem)] font-semibold leading-[0.85] tracking-tighter tabular">
            <span ref={num}>0</span>
          </span>
        </div>
        <div className="h-px w-full bg-text/20">
          <div ref={bar} className="h-px origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </div>
  );
}
