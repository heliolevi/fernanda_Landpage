import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { DeviceMobileCamera, FilmReel } from "@phosphor-icons/react";
import { reels, services } from "@/lib/site";
import { useVideoSrc } from "@/hooks/useVideoSrc";

gsap.registerPlugin(ScrollTrigger);

const icons = { edicao: FilmReel, captacao: DeviceMobileCamera } as const;
const tones = ["bg-brand", "bg-surface"] as const;

/**
 * Sticky stack (GSAP ScrollTrigger): cada painel gruda no topo e o anterior recua (scale + opacity)
 * enquanto o próximo sobe. Motivo: três serviços lidos em sequência, um de cada vez, sem cards iguais lado a lado.
 */
export function Services() {
  const root = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        gsap.to(card.querySelector(".stack-inner"), {
          scale: 0.92,
          opacity: 0.45,
          ease: "none",
          scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
        });
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="servicos" ref={root} className="relative">
      <div className="mx-auto max-w-[1400px] px-5 pb-14 pt-8 md:px-10 md:pb-24">
        <h2 className="max-w-[12ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">O que eu faço</h2>
      </div>

      {services.map((s, i) => {
        const Icon = icons[s.id];
        const flip = i % 2 === 1;
        return (
          <div key={s.id} className="stack-card sticky top-0 flex min-h-[100dvh] items-center px-3 py-4 md:px-6">
            <div
              className={`stack-inner mx-auto grid min-h-[84dvh] w-full max-w-[1400px] origin-top items-center gap-8 overflow-hidden rounded-media p-6 will-change-transform md:grid-cols-2 md:gap-12 md:p-14 ${tones[i]}`}
            >
              <div className={flip ? "md:order-2" : ""}>
                <Icon size={44} weight="light" className="text-accent" aria-hidden="true" />
                <h3 className="mt-6 text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98]">{s.title}</h3>
                <p className="mt-5 max-w-[38ch] text-lg text-text/80 md:text-xl">{s.text}</p>
              </div>
              <div className={`flex justify-center ${flip ? "md:order-1 md:justify-start" : "md:justify-end"}`}>
                <ServiceMedia media={s.media} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ServiceMedia({ media }: { media: (typeof services)[number]["media"] }) {
  const cls =
    "aspect-[9/16] h-[40dvh] rounded-media object-cover shadow-[0_30px_70px_-25px_rgb(0_0_0/0.7)] md:h-[62dvh]";
  return <ReelClip index={media.reel} className={cls} />;
}

function ReelClip({ index, className }: { index: number; className: string }) {
  const reel = reels[index];
  const src = useVideoSrc(reel.loop);
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
      threshold: 0.2,
    });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);

  return <video ref={ref} src={src} poster={reel.poster} muted loop playsInline preload="none" className={className} />;
}
