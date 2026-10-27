# Portfólio Fernanda Oliveira

Landing page de portfólio (editora de vídeo). React 19 + Vite + Tailwind v4 + TypeScript.

## Rodar

```bash
npm install
npm run dev        # desenvolvimento
npm run build      # gera a pasta dist/ (pronta para hospedar)
npm run preview    # testa o build local
```

## Onde editar

- `src/lib/site.ts`: textos, clientes, pacotes, preços e o número do WhatsApp (`WHATSAPP_NUMBER`).
- `public/videos` e `public/img`: vídeos e fotos. Cada Reel tem versão curta em loop (`-loop`), completa (`-full`) e pôster.
- `src/index.css`: cores, fontes e raios (tokens no topo).

## Bibliotecas e papel de cada uma

| Biblioteca | Onde | Para quê |
|---|---|---|
| Three.js | `HeroScene.tsx` | Hero 3D: quadros 9:16 com os Reels como textura de vídeo, cantos arredondados por shader |
| GSAP + ScrollTrigger | `Services`, `About`, `Contact`, scroll do hero | Pilha de painéis, texto revelado palavra a palavra, parallax, cortina do preloader |
| Lenis | `SmoothScroll.tsx` | Scroll suave, sincronizado ao ticker do GSAP |
| Motion (ex Framer Motion) | `Hero`, `Work`, `Pricing`, `Nav`, `MagneticButton` | Entradas, troca de reel, tilt 3D do palco, botão magnético, transição entre pacotes |
| Anime.js | `Preloader`, `ClientsMarquee`, `Pricing` | Contador do preloader, marquee de clientes, contagem do preço |
| shadcn/ui (Radix) | `components/ui` | Button, Dialog (player em tela cheia) e Tabs (pacotes), customizados |
| Spline | `SplineSlot.tsx` | Slot pronto: veja abaixo |

Observação: "Motion" e "Framer Motion" são o mesmo pacote (`motion/react`).

## Ativar o Spline

O slot fica na seção de contato. Publique uma cena no Spline (Export > Code > React), copie a URL `.splinecode` e crie um arquivo `.env`:

```
VITE_SPLINE_SCENE=https://prod.spline.design/SEU-ID/scene.splinecode
```

Com a variável definida, a cena substitui a foto do contato. Sem ela, o runtime do Spline nem é baixado.
# fernanda_Landpage
