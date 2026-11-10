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
| GSAP + ScrollTrigger | `FeaturedCase`, `Services`, `About`, `Contact`, scroll do hero | Pilha de painéis, texto revelado palavra a palavra, parallax, cortina do preloader |
| Lenis | `SmoothScroll.tsx`, `FeaturedCase` | Scroll suave, sincronizado ao ticker do GSAP |
| Motion (ex Framer Motion) | `FeaturedCase`, `Hero`, `Work`, `Pricing`, `Nav`, `MagneticButton` | Entradas, troca de reel, tilt 3D do palco, botão magnético, transição entre pacotes |
| Anime.js | `Preloader`, `ClientsMarquee`, `Pricing` | Contador do preloader, marquee de clientes, contagem do preço |
| shadcn/ui (Radix) | `components/ui` | Button, Dialog (player em tela cheia) e Tabs (pacotes), customizados |
| Spline | `SplineSlot.tsx` | Slot pronto: veja abaixo |

Observação: "Motion" e "Framer Motion" são o mesmo pacote (`motion/react`).

## Case em destaque (Botox Day)

`FeaturedCase.tsx`, logo depois de "Reels que seguram o olhar". O quadro 9:16 cresce com o scroll até ocupar a tela inteira (GSAP scrub), a luz do próprio vídeo vaza para o fundo (canvas ambiente) e o player assume:

- **Som:** o navegador só deixa tocar sozinho sem som. "Assistir com som" (abertura) e "Ativar som" (player) ligam o áudio no clique.
- **Capítulos:** a barra de progresso é dividida nos cortes reais do vídeo (Gancho, Convite, Bastidores, Oferta, Chamada, Assinatura). No celular vira a barra de stories no topo do vídeo; no desktop, a lista à esquerda. Clicar pula para o trecho.
- **Tela cheia:** botão de tela cheia nativa (no iPhone usa o player do sistema).
- **Qualidade:** `botox-full.mp4` em 1080x1920 (H.264, ~4,8 Mb/s, áudio AAC 192k). `botox-720.mp4` só entra com economia de dados ou rede 2G/3G. O vídeo só começa a baixar quando a seção está a uma tela de distância.
- **Editar:** textos, cliente e tempos dos capítulos ficam em `featuredCase`, em `src/lib/site.ts`.
- Com `prefers-reduced-motion`, a seção vira um bloco estático sem scrub e sem autoplay.

## Ativar o Spline

O slot fica na seção de contato. Publique uma cena no Spline (Export > Code > React), copie a URL `.splinecode` e crie um arquivo `.env`:

```
VITE_SPLINE_SCENE=https://prod.spline.design/SEU-ID/scene.splinecode
```

Com a variável definida, a cena substitui a foto do contato. Sem ela, o runtime do Spline nem é baixado.
# fernanda_Landpage
