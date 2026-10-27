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
    id: "decoracao",
    title: "Decoração",
    client: "Reel de evento",
    meta: "Edição, 40 s",
    loop: "/videos/decoracao-loop",
    full: "/videos/decoracao-full",
    poster: "/videos/decoracao-poster.jpg",
  },
  {
    id: "prato",
    title: "Prato",
    client: "Reel de gastronomia",
    meta: "Captação e edição",
    loop: "/videos/prato-loop",
    full: "/videos/prato-full",
    poster: "/videos/prato-poster.jpg",
  },
] as const;

export const services = [
  {
    id: "edicao",
    title: "Edição de vídeo",
    text: "Cortes, ritmo, legendas e trilha pensados para o Reels segurar a atenção até o último segundo.",
    media: { type: "video", reel: 1 },
  },
  {
    id: "captacao",
    title: "Captação mobile",
    text: "Gravação com o celular e direção de filmagem. Imagem limpa e natural, sem precisar de estúdio.",
    media: { type: "video", reel: 0 },
  },
] as const;

export const packages = [
  {
    id: "1",
    label: "1 Reels",
    price: 150,
    items: ["Reunião online", "Briefing personalizado", "1 hora de gravação", "Direção de filmagem", "Edição profissional"],
    deadline: "2 dias úteis",
  },
  {
    id: "2",
    label: "2 Reels",
    price: 300,
    items: ["Reunião online", "Briefing personalizado", "2 horas de gravação", "Direção de filmagem", "Edição profissional"],
    deadline: "4 dias úteis",
  },
  {
    id: "3",
    label: "3 Reels",
    price: 400,
    items: ["Reunião online", "Briefing personalizado", "Até 3 horas de gravação", "Direção de filmagem", "Edição profissional"],
    deadline: "6 dias úteis",
  },
] as const;

export const aboutText =
  "Sou Fernanda, editora de vídeo e graduanda em Design, com 2 anos de experiência criando Reels para negócios que querem se destacar. Do briefing à edição final, cuido de cada detalhe para o seu conteúdo ter identidade e resultado.";
