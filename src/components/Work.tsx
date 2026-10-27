import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight, SpeakerHigh } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { reels } from "@/lib/site";
import { getLenis } from "@/lib/lenis";
import { useVideoSrc } from "@/hooks/useVideoSrc";

type Reel = (typeof reels)[number];

export function Work() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { margin: "300px 0px" });
  const reel = reels[active];

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    const l = getLenis();
    if (v) l?.stop();
    else l?.start();
  };

  return (
    <section id="trabalhos" ref={sectionRef} className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-40">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[14ch] text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]"
      >
        Reels que seguram o olhar
      </motion.h2>

      <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        {/* lista: a escolha troca o palco */}
        <div className="order-2 lg:order-1 lg:col-span-5 lg:self-center">
          <ul role="tablist" aria-label="Reels em destaque" className="flex flex-col">
            {reels.map((r, i) => {
              const isActive = i === active;
              return (
                <li key={r.id} role="presentation" className="relative">
                  <button
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
                    className="group flex w-full items-start justify-between gap-6 py-7 text-left md:py-9"
                  >
                    <span>
                      <span
                        className={`block font-display text-[clamp(1.7rem,3.2vw,2.8rem)] font-semibold leading-[1.05] tracking-tight transition-colors duration-500 ${
                          isActive ? "text-text" : "text-muted/60 group-hover:text-muted"
                        }`}
                      >
                        {r.title}
                      </span>
                      <span className="mt-2 block text-base text-muted">
                        {r.client}, {r.meta}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={28}
                      aria-hidden="true"
                      className={`mt-1 shrink-0 transition-all duration-500 ${isActive ? "translate-x-0 text-accent opacity-100" : "-translate-x-2 opacity-0"}`}
                    />
                  </button>
                  <span className="absolute inset-x-0 bottom-0 block h-px bg-line" />
                  {isActive && (
                    <motion.span
                      layoutId="work-underline"
                      className="absolute inset-x-0 bottom-0 block h-px bg-accent"
                      transition={{ type: "spring", stiffness: 200, damping: 28 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>
          <Button className="mt-10" variant="outline" size="lg" onClick={() => onOpenChange(true)}>
            <SpeakerHigh size={20} aria-hidden="true" />
            Assistir com som
          </Button>
        </div>

        {/* palco */}
        <div className="order-1 flex justify-center lg:order-2 lg:col-span-7 lg:justify-end">
          <Stage reel={reel} playing={inView} onOpen={() => onOpenChange(true)} />
        </div>
      </div>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[min(92vw,calc(88dvh*9/16))]">
          <DialogTitle className="sr-only">{reel.title}</DialogTitle>
          <DialogDescription className="sr-only">Reel de {reel.client}, {reel.meta}.</DialogDescription>
          {open && <FullPlayer reel={reel} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function Stage({ reel, playing, onOpen }: { reel: Reel; playing: boolean; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ perspective: 1200 }}
      className="w-[min(78vw,calc(70dvh*9/16))] lg:w-[min(32vw,calc(74dvh*9/16))]"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`Abrir ${reel.title} em tela cheia com som`}
        style={{ rotateX: reduce ? 0 : rx, rotateY: reduce ? 0 : ry, transformStyle: "preserve-3d" }}
        className="relative block aspect-[9/16] w-full overflow-hidden rounded-media bg-surface shadow-[0_40px_90px_-30px_rgb(0_0_0/0.75)]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={reel.id}
            initial={reduce ? false : { opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <LoopVideo reel={reel} playing={playing && !reduce} />
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

function LoopVideo({ reel, playing }: { reel: Reel; playing: boolean }) {
  const src = useVideoSrc(reel.loop);
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing, src]);
  return (
    <video
      ref={ref}
      src={src}
      poster={reel.poster}
      muted
      loop
      playsInline
      preload="metadata"
      className="h-full w-full object-cover"
    />
  );
}

function FullPlayer({ reel }: { reel: Reel }) {
  const src = useVideoSrc(reel.full);
  return (
    <video
      src={src}
      poster={reel.poster}
      controls
      autoPlay
      playsInline
      className="aspect-[9/16] w-full rounded-media bg-black object-cover"
    />
  );
}
