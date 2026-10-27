import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { pickVideoExt } from "@/hooks/useVideoSrc";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cena 3D do hero (Three.js): três quadros verticais com os Reels reais como VideoTexture,
 * cantos arredondados via SDF no fragment shader, parallax do ponteiro e rotação guiada pelo scroll (GSAP).
 * Não usa React state para nada contínuo: ponteiro, scroll e tempo vivem no loop do renderer.
 */

type Item = {
  video?: string;
  image?: string;
  poster: string;
  pos: [number, number, number];
  ry: number;
  rz: number;
  scale: number;
  phase: number;
};

const ITEMS: Item[] = [
  { video: "/videos/acougue-loop", poster: "/videos/acougue-poster.jpg", pos: [-1.95, -0.3, -0.9], ry: 0.4, rz: -0.07, scale: 1, phase: 0 },
  { video: "/videos/prato-loop", poster: "/videos/prato-poster.jpg", pos: [0, 0.1, 0.6], ry: 0, rz: 0, scale: 1.18, phase: 1.9 },
  { video: "/videos/decoracao-loop", poster: "/videos/decoracao-poster.jpg", pos: [1.95, -0.4, -0.8], ry: -0.4, rz: 0.06, scale: 1, phase: 3.6 },
];

const H = 3;
/** Altura (px) da faixa reservada aos quadros no mobile; o Hero usa o mesmo valor como padding inferior. */
const STAGE_PX = 300;
const PLANE_ASPECT = 9 / 16;

const vert = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTexAspect;
  uniform float uPlaneAspect;
  uniform float uBright;
  uniform float uRadius;
  varying vec2 vUv;
  void main(){
    vec2 uv = vUv;
    float r = uTexAspect / uPlaneAspect;
    if (r > 1.0) { uv.x = (uv.x - 0.5) / r + 0.5; } else { uv.y = (uv.y - 0.5) * r + 0.5; }
    vec4 c = texture2D(uMap, uv);

    vec2 p = (vUv - 0.5) * vec2(uPlaneAspect, 1.0);
    vec2 b = vec2(uPlaneAspect, 1.0) * 0.5;
    vec2 q = abs(p) - b + uRadius;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uRadius;
    float a = 1.0 - smoothstep(-0.004, 0.004, d);
    float edge = smoothstep(-0.012, 0.0, d) * a;

    vec3 col = c.rgb * uBright;
    col = mix(col, vec3(1.0), edge * 0.2);
    float vig = smoothstep(1.15, 0.25, length(vUv - 0.5) * 1.5);
    col *= mix(0.8, 1.0, vig);
    gl_FragColor = vec4(col, a);
    #include <colorspace_fragment>
  }
`;

export default function HeroScene({ onReady, onFail }: { onReady: () => void; onFail: () => void }) {
  const reduce = useReducedMotion();
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onFail();
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    el.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
    camera.position.z = 11;
    const group = new THREE.Group();
    scene.add(group);

    const geo = new THREE.PlaneGeometry(H * PLANE_ASPECT, H);
    const ext = pickVideoExt();
    const loader = new THREE.TextureLoader();
    const disposables: { dispose: () => void }[] = [geo];
    const videos: HTMLVideoElement[] = [];
    const meshes: { mesh: THREE.Mesh; item: Item }[] = [];
    let firstFrame = false;
    let running = false;
    let visible = true;

    const markReady = () => {
      if (firstFrame) return;
      firstFrame = true;
      onReady();
    };

    ITEMS.forEach((item) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        transparent: true,
        uniforms: {
          uMap: { value: null },
          uTexAspect: { value: PLANE_ASPECT },
          uPlaneAspect: { value: PLANE_ASPECT },
          uBright: { value: 1 },
          uRadius: { value: 0.07 },
        },
      });
      disposables.push(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...item.pos);
      mesh.rotation.set(0, item.ry, item.rz);
      mesh.scale.setScalar(item.scale);
      group.add(mesh);
      meshes.push({ mesh, item });

      loader.load(item.poster, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.anisotropy = 4;
        const img = tex.image as HTMLImageElement;
        mat.uniforms.uTexAspect.value = img.width / img.height;
        if (!mat.uniforms.uMap.value) mat.uniforms.uMap.value = tex;
        disposables.push(tex);
        markReady();
        if (!running) renderer.render(scene, camera);
      });

      if (item.video && !reduce) {
        const v = document.createElement("video");
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.autoplay = true;
        v.preload = "auto";
        v.crossOrigin = "anonymous";
        v.src = `${item.video}.${ext}`;
        videos.push(v);
        v.addEventListener(
          "playing",
          () => {
            const vt = new THREE.VideoTexture(v);
            vt.colorSpace = THREE.SRGBColorSpace;
            vt.minFilter = THREE.LinearFilter;
            vt.generateMipmaps = false;
            mat.uniforms.uTexAspect.value = v.videoWidth / v.videoHeight;
            mat.uniforms.uMap.value = vt;
            disposables.push(vt);
          },
          { once: true },
        );
        v.play().catch(() => {
          /* autoplay bloqueado: o pôster continua na tela */
        });
      }
    });

    /* layout responsivo: aglomerado à direita no desktop, embaixo e recortado no mobile */
    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const vw = vh * camera.aspect;
      if (camera.aspect >= 0.95) {
        const s = Math.min((0.5 * vw) / 5.6, (0.7 * vh) / (H * 1.18));
        group.scale.setScalar(s);
        base.x = vw * 0.23;
        base.y = -vh * 0.07;
      } else {
        /* mobile: os quadros ocupam uma faixa reservada no fim do hero (STAGE_PX, igual ao padding do Hero),
           encaixados na largura e na altura da faixa, então nunca sobrepõem o texto nem são cortados */
        const pxToWorld = vh / h;
        const fitW = (0.94 * vw) / 5.6;
        const fitH = (STAGE_PX * 0.86 * pxToWorld) / (H * 1.18);
        group.scale.setScalar(Math.min(fitW, fitH));
        base.x = 0;
        base.y = (h / 2 - (h - STAGE_PX / 2)) * pxToWorld;
      }
      group.position.set(base.x, base.y, 0);
      if (!running) renderer.render(scene, camera);
    };
    const base = { x: 0, y: 0 };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    /* entradas contínuas, sem React state */
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const scroll = { p: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

    let ctx: gsap.Context | null = null;
    if (!reduce) {
      ctx = gsap.context(() => {
        gsap.to(scroll, {
          p: 1,
          ease: "none",
          scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: 0.6 },
        });
      });
    }

    const t0 = performance.now();
    const frame = () => {
      const t = (performance.now() - t0) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      group.rotation.y = pointer.x * 0.2 + scroll.p * 0.9;
      group.rotation.x = -pointer.y * 0.08;
      group.position.y = base.y + scroll.p * 1.4;
      meshes.forEach(({ mesh, item }) => {
        mesh.position.y = item.pos[1] + Math.sin(t * 0.8 + item.phase) * 0.09;
        mesh.position.x = item.pos[0] * (1 + scroll.p * 0.35);
      });
      renderer.render(scene, camera);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      renderer.setAnimationLoop(frame);
      videos.forEach((v) => v.play().catch(() => {}));
    };
    const stop = () => {
      if (!running) return;
      running = false;
      renderer.setAnimationLoop(null);
      videos.forEach((v) => v.pause());
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.02 },
    );
    io.observe(el);
    if (!reduce) start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      ctx?.revert();
      videos.forEach((v) => {
        v.pause();
        v.removeAttribute("src");
        v.load();
      });
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return <div ref={host} className="h-full w-full" />;
}
