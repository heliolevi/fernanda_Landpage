import { lazy, Suspense, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, WhatsappLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/MagneticButton";
import { CTA_LABEL, whatsappLink } from "@/lib/site";
import { scrollToId } from "@/lib/lenis";

const HeroScene = lazy(() => import("@/components/HeroScene"));

const words = ["Reels", "que", "dão", "identidade", "e", "atraem", "clientes"];

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const show = ready || !!reduce;

  return (
    <section id="top" className="relative isolate min-h-[100dvh] overflow-hidden">
      {/* fundo: luz quente atrás dos vídeos */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(60% 70% at 72% 52%, rgb(90 56 37 / 0.85), transparent 70%), radial-gradient(40% 50% at 10% 100%, rgb(69 41 26 / 0.7), transparent 70%)",
        }}
      />

      {/* fallback estático: aparece antes do 3D e se o WebGL falhar */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-opacity duration-700 ${sceneReady && !failed ? "opacity-0" : "opacity-100"}`}
      >
        <StaticStage />
      </div>

      {!failed && (
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${sceneReady ? "opacity-100" : "opacity-0"}`}
        >
          <Suspense fallback={null}>
            <HeroScene onReady={() => setSceneReady(true)} onFail={() => setFailed(true)} />
          </Suspense>
        </div>
      )}

      <div className="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-5 pb-[300px] pt-28 md:px-10 md:pb-14 md:pt-24">
        <h1 className="font-display text-[clamp(2.5rem,5.1vw,4.7rem)] font-semibold leading-[1.02] tracking-[-0.04em] md:max-w-[24ch]">
          {words.map((w, i) => (
            <span key={w + i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
              <motion.span
                className={`inline-block ${w === "identidade" ? "text-accent" : ""}`}
                initial={reduce ? false : { y: "115%" }}
                animate={show ? { y: 0 } : undefined}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              >
                {w}
              </motion.span>
            </span>
          ))}
        </h1>

        <div className="mt-6 md:mt-auto">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="max-w-[34ch] text-lg text-muted md:text-xl"
        >
          Edição de vídeo, captação mobile e storymaker para negócios que querem ser vistos e lembrados.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={show ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <MagneticButton strength={0.2}>
            <Button asChild size="lg">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
                {CTA_LABEL}
              </a>
            </Button>
          </MagneticButton>
          <Button
            variant="outline"
            size="lg"
            onClick={() => scrollToId("trabalhos")}
          >
            Ver trabalhos
            <ArrowDown size={18} aria-hidden="true" />
          </Button>
        </motion.div>
        </div>
      </div>
    </section>
  );
}

/** Três quadros 9:16 em CSS: o que o visitante vê antes do WebGL e se ele não existir. */
function StaticStage() {
  const frames = [
    { src: "/videos/acougue-poster.jpg", cls: "left-[52%] top-[26%] -rotate-6 h-[34%] md:left-[50%] md:top-[22%] md:h-[52%]" },
    { src: "/videos/prato-poster.jpg", cls: "left-[66%] top-[20%] h-[40%] md:left-[64%] md:top-[16%] md:h-[62%]" },
    { src: "/videos/decoracao-poster.jpg", cls: "left-[82%] top-[28%] rotate-6 h-[34%] md:left-[79%] md:top-[24%] md:h-[52%]" },
  ];
  return (
    <>
      <div className="absolute inset-0 hidden md:block">
        {frames.map((f) => (
          <img
            key={f.src}
            src={f.src}
            alt=""
            decoding="async"
            className={`absolute aspect-[9/16] rounded-media object-cover shadow-[0_30px_80px_-20px_rgb(0_0_0/0.6)] ${f.cls}`}
          />
        ))}
      </div>
      {/* mobile: mesma faixa de 300px que a cena 3D usa */}
      <div className="absolute inset-x-0 bottom-0 flex h-[300px] items-center justify-center gap-3 px-5 md:hidden">
        {[frames[0], frames[1], frames[2]].map((f, i) => (
          <img
            key={f.src}
            src={f.src}
            alt=""
            decoding="async"
            className={`aspect-[9/16] rounded-media object-cover shadow-[0_20px_50px_-15px_rgb(0_0_0/0.6)] ${i === 1 ? "h-[236px]" : "h-[196px]"}`}
          />
        ))}
      </div>
    </>
  );
}
