/** Conteúdo e contato do site. Edite aqui para trocar textos, preços e WhatsApp. */
export const WHATSAPP_NUMBER = "5598981431511"; // +55 98 98143-1511
export const WHATSAPP_DISPLAY = "+55 98 98143-1511";

export function whatsappLink(message = "Olá, Fernanda! Vi o seu portfólio e quero um orçamento para Reels.") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const CTA_LABEL = "Falar no WhatsApp";

export const clients = [
  "Emporio Saladeria",
  "Villa Reale",
  "Dra. Sara Alves",
  "Squadron",
  "Sady Boutique",
  "Casa Faria",
];

/**
 * Reels da galeria "Reels que seguram o olhar".
 * `loop` e `full` são caminhos sem extensão: o site escolhe .mp4 (ou .webm se o navegador não tocar H.264).
 * `loop` = trecho curto sem som (432x768); `full` = vídeo completo com som (720x1280).
 */
export const reels = [
  {
    id: "acougue",
    title: "5 equipamentos para açougue",
    client: "Casa Faria",
    meta: "Captação e edição, 34 s",
    loop: "/videos/acougue-loop",
    full: "/videos/acougue-full",
    poster: "/videos/acougue-poster.jpg",
  },
  {
    id: "prato",
    title: "Prato",
    client: "Emporio Saladeria",
    meta: "Captação e edição, 17 s",
    loop: "/videos/prato-loop",
    full: "/videos/prato-full",
    poster: "/videos/prato-poster.jpg",
  },
  {
    id: "botox",
    title: "Botox Day",
    client: "Dra. Sara Alves",
    meta: "Reel de campanha, 52 s",
    loop: "/videos/botox-loop",
    full: "/videos/botox-720",
    poster: "/videos/botox-poster.jpg",
  },
  {
    id: "sara",
    title: "Bioestimulador e Botox",
    client: "Dra. Sara Alves",
    meta: "Bastidores do procedimento, 49 s",
    loop: "/videos/sara-loop",
    full: "/videos/sara-full",
    poster: "/videos/sara-poster.jpg",
  },
] as const;

/**
 * Case em destaque (seção "Botox Day"). Vídeo vertical 1080x1920 com som.
 * `src` é a versão 1080p; `srcLite` (720p) entra só em conexão lenta ou com economia de dados.
 * Os capítulos marcam os cortes reais do vídeo (em segundos) e viram a barra de progresso.
 */
export const featuredCase = {
  id: "botox-day",
  title: "Botox Day",
  client: "Dra. Sara Alves",
  summary: "Reel de campanha para a clínica da Dra. Sara Alves: do convite à chamada para agendar, em 52 segundos.",
  meta: "Reel de campanha, 52 s",
  src: "/videos/botox-full.mp4",
  srcLite: "/videos/botox-720.mp4",
  poster: "/videos/botox-poster.jpg",
  duration: 52.2,
  chapters: [
    { start: 0, title: "Gancho", text: "Fala direto com quem sempre quis fazer o botox." },
    { start: 5.8, title: "Convite", text: "A data e o evento: Botox Day na clínica." },
    { start: 10.7, title: "Bastidores", text: "O procedimento de verdade, com a doutora em cena." },
    { start: 19.7, title: "Oferta", text: "Brindes, sorteios e até 50% de desconto." },
    { start: 33.9, title: "Chamada", text: "Clique no botão e agende a sua avaliação." },
    { start: 48.2, title: "Assinatura", text: "A marca da clínica fecha o vídeo." },
  ],
} as const;

/** `reel` é o `id` de um item de `reels`. */
export const services = [
  {
    id: "edicao",
    title: "Edição de vídeo",
    text: "Cortes, ritmo, legendas e trilha pensados para o Reels segurar a atenção até o último segundo.",
    media: { type: "video", reel: "sara" },
  },
  {
    id: "captacao",
    title: "Captação mobile",
    text: "Gravação com o celular e direção de filmagem. Imagem limpa e natural, sem precisar de estúdio.",
    media: { type: "video", reel: "acougue" },
  },
] as const;

/** O que vem em todos os planos. O que muda de um plano para outro fica em cada pacote. */
export const packageIncludes = ["Reunião online", "Briefing personalizado", "Direção de filmagem", "Edição profissional"];

export const packages = [
  {
    id: "essencial",
    name: "Essencial",
    count: 2,
    reels: "2 Reels",
    tagline: "Para testar e sair do zero com vídeos de alto impacto.",
    recording: "1 hora de gravação",
    deadline: "2 dias úteis",
  },
  {
    id: "impulso",
    name: "Impulso",
    count: 4,
    reels: "4 Reels",
    tagline: "Para manter o perfil ativo e ganhar consistência no mês.",
    recording: "2 horas de gravação",
    deadline: "4 dias úteis",
    badge: "Mais escolhido",
  },
  {
    id: "presenca",
    name: "Presença",
    count: 6,
    reels: "6 Reels",
    tagline: "Para ocupar o feed com uma sequência de conteúdos com identidade.",
    recording: "Até 3 horas de gravação",
    deadline: "6 dias úteis",
  },
] as const;

/** Plano que já vem selecionado na seção de pacotes. */
export const DEFAULT_PACKAGE = "impulso";

export function quoteMessage(pkg: (typeof packages)[number]) {
  return `Olá, Fernanda! Vi o seu portfólio e quero um orçamento do plano ${pkg.name} (${pkg.reels}). Pode me passar os valores e os próximos passos?`;
}

export const helpMessage =
  "Olá, Fernanda! Vi o seu portfólio e quero Reels para o meu negócio, mas não sei qual plano escolher. Pode me ajudar?";

export const aboutText =
  "Sou Fernanda, editora de vídeo e graduanda em Design, com 2 anos de experiência criando Reels para negócios que querem se destacar. Do briefing à edição final, cuido de cada detalhe para o seu conteúdo ter identidade e resultado.";
