import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowClockwise,
  CircleNotch,
  CornersOut,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  WhatsappLogo,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { featuredCase, whatsappLink } from "@/lib/site";
import { getLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

const chapters = featuredCase.chapters;
const EASE = [0.16, 1, 0.3, 1] as const;
/** Ponto do scroll (0 a 1) em que o quadro termina de crescer e o player assume. */
const CINEMA_AT = 0.58;

type FullscreenVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void };

function fmt(t: number) {
  const s = Math.max(0, Math.floor(t));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function chapterAt(t: number) {
  let i = 0;
  for (let k = 0; k < chapters.length; k++) if (t >= chapters[k].start) i = k;
  return i;
}

/** 1080p por padrão; 720p só com economia de dados ou rede 2G/3G. */
function pickSrc() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  const slow = c?.saveData || /(^|-)(2g|3g)$/.test(c?.effectiveType ?? "");
  return slow ? featuredCase.srcLite : featuredCase.src;
}

/**
 * Case em destaque: o Reel do Botox Day.
 * Momento único da página: o quadro 9:16 cresce com o scroll (GSAP scrub) até ocupar a tela inteira,
 * a luz do próprio vídeo vaza para o palco (canvas ambiente) e o player assume com capítulos
 * que mostram a estrutura da edição. Motion cuida da entrada dos controles; Lenis conduz o scroll.
 */
export function FeaturedCase() {
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const wordLRef = useRef<HTMLSpanElement>(null);
  const wordRRef = useRef<HTMLSpanElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<FullscreenVideo>(null);

  const [cinema, setCinema] = useState(false);
  const [near, setNear] = useState(false);
  const [src, setSrc] = useState<string>(featuredCase.src);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [failed, setFailed] = useState(false);
  const [chapter, setChapter] = useState(0);

  const cinemaRef = useRef(false);
  const chapterRef = useRef(0);
  const userPaused = useRef(false);
  const frameInView = useInView(frameRef, { amount: 0.3 });
  const showPlayer = cinema || !!reduce;

  /* Só baixa o vídeo quando a seção está a uma tela de distância. */
  useEffect(() => {
    setSrc(pickSrc());
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Scroll: o quadro cresce até a tela cheia. */
  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const frame = frameRef.current;
    if (reduce || !section || !sticky || !frame) return;

    const setCinemaState = (p: number) => {
      const c = p > CINEMA_AT;
      if (c !== cinemaRef.current) {
        cinemaRef.current = c;
        setCinema(c);
      }
      // a navegação sai de cena enquanto o vídeo ocupa a tela
      const hideNav = c && p < 0.995;
      if (hideNav) document.documentElement.dataset.cinema = "";
      else delete document.documentElement.dataset.cinema;
    };

    const mm = gsap.matchMedia();
    mm.add({ lg: "(min-width: 1024px)", sm: "(max-width: 1023px)" }, (ctx) => {
      const lg = Boolean(ctx.conditions?.lg);

      const geo = () => {
        const H = sticky.clientHeight;
        const fh = frame.offsetHeight || H;
        if (lg) return { s: Math.min((H * 0.64) / fh, 0.9), y: 0 };
        const top = topRef.current!;
        const cta = ctaRef.current!;
        const a = top.offsetTop + top.offsetHeight + 20;
        const b = cta.offsetTop - 16;
        return { s: gsap.utils.clamp(0.2, 0.86, (b - a) / fh), y: (a + b) / 2 - H / 2 };
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => setCinemaState(self.progress),
        },
      });

      tl.fromTo(
        frame,
        { scale: () => geo().s, y: () => geo().y, borderRadius: () => 20 / geo().s },
        { scale: 1, y: 0, borderRadius: 0, duration: 0.6, ease: "power2.inOut" },
        0,
      );
      tl.fromTo(ambientRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.1);
      tl.to([summaryRef.current, ctaRef.current], { opacity: 0, y: 16, duration: 0.18 }, 0);
      if (lg) {
        tl.to(wordLRef.current, { xPercent: -55, opacity: 0, duration: 0.36, ease: "power1.in" }, 0.02);
        tl.to(wordRRef.current, { xPercent: 70, opacity: 0, duration: 0.36, ease: "power1.in" }, 0.02);
      } else {
        tl.to(topRef.current, { y: -48, opacity: 0, duration: 0.3 }, 0.02);
      }
      tl.to({}, { duration: 0.4 }); // pausa com o vídeo em tela cheia
    });

    return () => {
      mm.revert();
      delete document.documentElement.dataset.cinema;
    };
  }, [reduce]);

  /* Progresso dos capítulos, tempo e luz ambiente: escrito direto no DOM, sem re-render por quadro. */
  const paint = useCallback(() => {
    const v = videoRef.current;
    const root = sectionRef.current;
    if (!v || !root) return;
    const t = v.currentTime;
    const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : featuredCase.duration;
    root.querySelectorAll<HTMLElement>("[data-seg-fill]").forEach((el) => {
      const i = Number(el.dataset.segFill);
      const s = chapters[i].start;
      const e = chapters[i + 1]?.start ?? d;
      el.style.transform = `scaleX(${gsap.utils.clamp(0, 1, (t - s) / (e - s))})`;
    });
    root.querySelectorAll<HTMLElement>("[data-time]").forEach((el) => {
      el.textContent = fmt(t);
    });
    const idx = chapterAt(t);
    if (idx !== chapterRef.current) {
      chapterRef.current = idx;
      setChapter(idx);
    }
    const c = canvasRef.current;
    if (c && v.readyState >= 2) c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
  }, []);

  /* Eventos do vídeo e laço de pintura enquanto toca. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf = 0;
    let vfc = 0;
    const hasVfc = "requestVideoFrameCallback" in v;
    const loop = () => {
      paint();
      if (hasVfc) vfc = v.requestVideoFrameCallback(loop);
      else raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (hasVfc && vfc) v.cancelVideoFrameCallback(vfc);
      cancelAnimationFrame(raf);
    };
    const onPlay = () => {
      setPaused(false);
      stop();
      loop();
    };
    const onPause = () => {
      setPaused(true);
      stop();
      paint();
    };
    const onVolume = () => setMuted(v.muted);
    const onWaiting = () => setBuffering(true);
    const onReady = () => setBuffering(false);
    const onError = () => setFailed(true);
    const onFs = () => {
      v.controls = document.fullscreenElement === v;
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("seeked", paint);
    v.addEventListener("loadeddata", paint);
    v.addEventListener("volumechange", onVolume);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onReady);
    v.addEventListener("canplay", onReady);
    v.addEventListener("error", onError);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      stop();
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("seeked", paint);
      v.removeEventListener("loadeddata", paint);
      v.removeEventListener("volumechange", onVolume);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onReady);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("error", onError);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, [paint]);

  /* Luz ambiente antes do play: pinta o pôster no canvas. */
  useEffect(() => {
    const img = new Image();
    img.src = featuredCase.poster;
    img.onload = () => {
      const c = canvasRef.current;
      const v = videoRef.current;
      if (c && (!v || v.readyState < 2)) c.getContext("2d")?.drawImage(img, 0, 0, c.width, c.height);
    };
  }, []);

  /* Toca sem som quando o quadro está na tela (política de autoplay); pausa ao sair. */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !near) return;
    if (frameInView && !userPaused.current && !reduce) v.play().catch(() => {});
    if (!frameInView) v.pause();
  }, [frameInView, near, reduce]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    userPaused.current = false;
    v.play().catch(() => {});
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) play();
    else {
      userPaused.current = true;
      v.pause();
    }
  };

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) {
      v.volume = 1;
      if (v.paused) play();
    }
  };

  /** Botão da abertura: liga o som no gesto do clique, volta ao início e rola até a tela cheia. */
  const watchWithSound = () => {
    const v = videoRef.current;
    const section = sectionRef.current;
    if (!v || !section) return;
    if (!v.src) setNear(true);
    v.muted = false;
    v.volume = 1;
    v.currentTime = 0;
    play();
    const target = section.offsetTop + (section.offsetHeight - window.innerHeight) * (CINEMA_AT + 0.08);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else window.scrollTo({ top: target, behavior: "smooth" });
  };

  const seek = (i: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = chapters[i].start + 0.01;
    chapterRef.current = i;
    setChapter(i);
    if (!userPaused.current || v.paused) play();
  };

  const fullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    if (v.paused) play();
    if (v.requestFullscreen) v.requestFullscreen().catch(() => v.webkitEnterFullscreen?.());
    else v.webkitEnterFullscreen?.();
  };

  const retry = () => {
    const v = videoRef.current;
    if (!v) return;
    setFailed(false);
    v.load();
    play();
  };

  const controls = { paused, muted, buffering, chapter, togglePlay, toggleSound, seek, fullscreen };

  return (
    <section
      id="destaque"
      ref={sectionRef}
      aria-labelledby="destaque-titulo"
      className={`relative ${reduce ? "" : "h-[260dvh]"}`}
    >
      {reduce && (
        <div className="mx-auto max-w-[1400px] px-5 pb-12 pt-24 md:px-10">
          <h2 id="destaque-titulo" className="text-[clamp(2.6rem,7vw,6rem)] leading-[0.98]">
            {featuredCase.title}
          </h2>
          <p className="mt-5 max-w-[40ch] text-lg text-muted md:text-xl">{featuredCase.summary}</p>
        </div>
      )}

      <div
        ref={stickyRef}
        className={`${reduce ? "relative" : "sticky top-0"} flex h-[100dvh] flex-col justify-between overflow-hidden`}
      >
        {/* luz ambiente: o próprio vídeo, em 16x28 px, ampliado e desfocado */}
        <div
          ref={ambientRef}
          aria-hidden="true"
          style={reduce ? undefined : { opacity: 0 }}
          className="pointer-events-none absolute inset-0"
        >
          <canvas ref={canvasRef} width={16} height={28} className="h-full w-full scale-125 opacity-70 blur-[70px]" />
          <div className="absolute inset-0 bg-[radial-gradient(40%_60%_at_50%_50%,transparent,rgb(28_17_11/0.85))]" />
        </div>

        {/* abertura: título, resumo e chamada (some quando o quadro cresce) */}
        {!reduce && (
          <>
            <div ref={topRef} className="relative z-10 px-5 pt-24 md:px-10 lg:static lg:p-0">
              <h2
                id="destaque-titulo"
                className="text-[clamp(2.6rem,7vw,6rem)] leading-[0.98] lg:pointer-events-none lg:absolute lg:inset-x-0 lg:top-1/2 lg:grid lg:-translate-y-1/2 lg:grid-cols-[1fr_calc(36dvh+4.5rem)_1fr] lg:text-[clamp(3rem,7.4vw,6rem)]"
              >
                <span ref={wordLRef} className="inline-block pr-[0.22em] lg:col-start-1 lg:justify-self-end lg:pr-0">
                  Botox
                </span>
                <span ref={wordRRef} className="inline-block text-accent lg:col-start-3 lg:justify-self-start">
                  Day
                </span>
              </h2>
              <p
                ref={summaryRef}
                className="mt-4 max-w-[34ch] text-lg text-muted lg:absolute lg:bottom-10 lg:left-10 lg:mt-0 lg:max-w-[30ch] lg:text-xl"
              >
                {featuredCase.summary}
              </p>
            </div>
            <div
              ref={ctaRef}
              className="relative z-30 flex justify-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] lg:absolute lg:bottom-10 lg:right-10 lg:p-0"
            >
              <Button variant="outline" size="lg" onClick={watchWithSound}>
                <SpeakerHigh size={20} aria-hidden="true" />
                Assistir com som
              </Button>
            </div>
          </>
        )}

        {/* o quadro: tamanho final = maior 9:16 que cabe na tela, centrado por inset/margin (sem translate); o scroll anima só scale e y */}
        <div
          ref={frameRef}
          className={`absolute inset-0 z-20 m-auto h-[min(100dvh,calc(100vw*16/9))] w-[calc(min(100dvh,calc(100vw*16/9))*9/16)] overflow-hidden bg-black shadow-[0_40px_90px_-30px_rgb(0_0_0/0.75)] will-change-transform ${
            reduce ? "lg:h-[min(92dvh,calc(100vw*16/9))] lg:w-[calc(min(92dvh,calc(100vw*16/9))*9/16)] lg:rounded-media" : ""
          }`}
        >
          <video
            ref={videoRef}
            src={near ? src : undefined}
            poster={featuredCase.poster}
            muted
            loop
            playsInline
            preload={near ? "auto" : "none"}
            aria-label={`Reel ${featuredCase.title}, ${featuredCase.client}`}
            className="h-full w-full object-cover"
          />

          <AnimatePresence>
            {buffering && !paused && (
              <motion.div
                key="buffer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
              >
                <CircleNotch size={44} className="animate-spin text-white/90 [animation-duration:900ms]" aria-hidden="true" />
                <span className="sr-only">Carregando o vídeo</span>
              </motion.div>
            )}
          </AnimatePresence>

          {failed && (
            <div role="alert" className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-bg/85 p-6 text-center">
              <p className="max-w-[24ch] text-lg">Não foi possível carregar o vídeo.</p>
              <Button variant="outline" onClick={retry}>
                <ArrowClockwise size={18} aria-hidden="true" />
                Tentar de novo
              </Button>
            </div>
          )}

          {/* celular e tablet: controles por cima do vídeo, no formato de stories */}
          <AnimatePresence>
            {showPlayer && !failed && (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                className="lg:hidden"
              >
                <MobileOverlay {...controls} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* desktop: capítulos à esquerda, controles e chamada à direita */}
        <AnimatePresence>
          {showPlayer && (
            <motion.div
              key="side"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              className="hidden lg:block"
            >
              <DesktopSides {...controls} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

type Controls = {
  paused: boolean;
  muted: boolean;
  buffering: boolean;
  chapter: number;
  togglePlay: () => void;
  toggleSound: () => void;
  seek: (i: number) => void;
  fullscreen: () => void;
};

const sideWidth = "w-[min(22rem,calc(50vw-28.125dvh-5rem))]";

function DesktopSides({ paused, muted, chapter, togglePlay, toggleSound, seek, fullscreen }: Controls) {
  const rise = (d: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: d } },
  });

  return (
    <>
      <div className={`absolute left-10 top-1/2 z-20 -translate-y-1/2 ${sideWidth}`}>
        <motion.div {...rise(0.05)}>
          <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-[1.05]">{featuredCase.client}</h3>
          <p className="mt-1 text-muted">{featuredCase.meta}</p>
        </motion.div>
        <motion.ol {...rise(0.15)} aria-label="Capítulos do vídeo" className="mt-8 flex flex-col">
          {chapters.map((c, i) => {
            const active = i === chapter;
            return (
              <li key={c.title}>
                <button
                  type="button"
                  onClick={() => seek(i)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${c.title}, a partir de ${fmt(c.start)}`}
                  className="group grid w-full grid-cols-[2.75rem_1fr] gap-x-3 rounded-[12px] py-2.5 text-left [@media(min-height:860px)]:py-3"
                >
                  <span className="tabular pt-[0.3rem] text-sm text-muted">{fmt(c.start)}</span>
                  <span className="block">
                    <span
                      className={`block font-display text-xl font-semibold tracking-tight transition-colors duration-300 ${
                        active ? "text-text" : "text-muted/70 group-hover:text-text/90"
                      }`}
                    >
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-muted">{c.text}</span>
                    <span className="mt-2.5 block h-[2px] overflow-hidden rounded-full bg-line">
                      <span data-seg-fill={i} className="block h-full origin-left scale-x-0 bg-accent" />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </motion.ol>
      </div>

      <div className={`absolute right-10 top-1/2 z-20 flex -translate-y-1/2 flex-col items-end text-right ${sideWidth}`}>
        <motion.div {...rise(0.1)} className="flex flex-col items-end gap-4">
          <Button
            size="lg"
            variant={muted ? "default" : "outline"}
            onClick={toggleSound}
            aria-pressed={!muted}
          >
            {muted ? <SpeakerSlash size={22} aria-hidden="true" /> : <SpeakerHigh size={22} aria-hidden="true" />}
            {muted ? "Ativar som" : "Som ativado"}
          </Button>
          <div className="flex items-center gap-3">
            <span className="tabular mr-1 text-muted">
              <span data-time>0:00</span> / {fmt(featuredCase.duration)}
            </span>
            <Button
              variant="outline"
              size="lg"
              className="w-14 px-0"
              onClick={togglePlay}
              aria-label={paused ? "Reproduzir" : "Pausar"}
            >
              {paused ? <Play size={22} weight="fill" aria-hidden="true" /> : <Pause size={22} weight="fill" aria-hidden="true" />}
            </Button>
            <Button variant="outline" size="lg" className="w-14 px-0" onClick={fullscreen} aria-label="Assistir em tela cheia">
              <CornersOut size={22} aria-hidden="true" />
            </Button>
          </div>
        </motion.div>

        <motion.div {...rise(0.25)} className="mt-14 border-t border-line pt-8">
          <p className="ml-auto max-w-[22ch] font-display text-[1.6rem] font-semibold leading-[1.1] tracking-tight">
            Quer um Reel assim para o seu negócio?
          </p>
          <Button asChild variant="outline" className="mt-5">
            <a
              href={whatsappLink(
                "Olá, Fernanda! Vi o Reel do Botox Day no seu portfólio e quero um vídeo assim para o meu negócio.",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
              Pedir orçamento
            </a>
          </Button>
        </motion.div>
      </div>
    </>
  );
}

function MobileOverlay({ paused, muted, chapter, togglePlay, toggleSound, seek, fullscreen }: Controls) {
  const iconBtn =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0f0804]/70 text-white transition-transform duration-200 active:scale-[0.94]";
  return (
    <>
      {/* segmentos = capítulos, como nos stories */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-black/45 to-transparent" />
      <ol aria-label="Capítulos do vídeo" className="absolute inset-x-2 top-1 flex gap-1">
        {chapters.map((c, i) => (
          <li key={c.title} className="flex-1">
            <button
              type="button"
              onClick={() => seek(i)}
              aria-current={i === chapter ? "step" : undefined}
              aria-label={`${c.title}, a partir de ${fmt(c.start)}`}
              className="flex h-11 w-full items-center rounded-none"
            >
              <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/35">
                <span data-seg-fill={i} className="block h-full origin-left scale-x-0 bg-white" />
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-black/75 via-black/35 to-transparent px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-20">
        <div className="min-w-0 pl-1 text-white">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={chapter}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="truncate font-display text-lg font-semibold leading-tight"
            >
              {chapters[chapter].title}
            </motion.p>
          </AnimatePresence>
          <p className="tabular text-sm text-white/80">
            <span data-time>0:00</span> / {fmt(featuredCase.duration)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={togglePlay} aria-label={paused ? "Reproduzir" : "Pausar"} className={iconBtn}>
            {paused ? <Play size={20} weight="fill" aria-hidden="true" /> : <Pause size={20} weight="fill" aria-hidden="true" />}
          </button>
          <button type="button" onClick={fullscreen} aria-label="Assistir em tela cheia" className={iconBtn}>
            <CornersOut size={20} aria-hidden="true" />
          </button>
          {muted ? (
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={false}
              className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent pl-4 pr-5 text-sm font-medium text-accent-ink transition-transform duration-200 active:scale-[0.96]"
            >
              <SpeakerSlash size={18} aria-hidden="true" />
              Ativar som
            </button>
          ) : (
            <button type="button" onClick={toggleSound} aria-pressed={true} aria-label="Desativar som" className={iconBtn}>
              <SpeakerHigh size={20} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </>
  );
}
