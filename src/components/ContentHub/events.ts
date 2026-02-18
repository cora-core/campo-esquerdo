/** Calendar event interface - defines the structure of each event */
export interface CalendarEvent {
  day: number;
  month: number;  // 0-indexed (0 = January, 11 = December)
  year: number;
  title: string;
  /** Short text shown on calendar cells */
  description?: string;
  /** Subtitle shown in event detail header (independent from calendar cell text) */
  eventSubtitle?: string;
  /** Full description shown in event detail body */
  fullDescription?: string;
  local?: string;
  hora?: string;
  link?: string;
  linkText?: string;
  image?: string;
}

/** All calendar events – single source of truth */
export const calendarEvents: CalendarEvent[] = [
  { day: 6, month: 0, year: 2026, title: "CHAMADA ABERTA", description: "em breve", eventSubtitle: "Chamada aberta para participação", fullDescription: "Lorem ipsum dolor sit amet consectetur.", local: "Online", hora: "18:00" },
  { day: 26, month: 0, year: 2026, title: "FIM DA CHAMADA", description: "x", eventSubtitle: "Prazo final para inscrições" },
  { day: 7, month: 9, year: 2025, title: "EVENTO", description: "EVENTO EVENTO EVENTO", eventSubtitle: "0,4ML 30 X 7 NA BUNDINHA PFVR", fullDescription: "Lorem ipsum dolor sit amet consectetur. Odio velit in massa varius cursus aliquam." },
  { day: 2, month: 2, year: 2026, title: "SEMINÁRIOS", description: "14:00; Mari Herzer, J-P Caron", eventSubtitle: "Mari Herzer, J-P Caron", hora: "14:00", fullDescription: "14:00: Adentro do espaço sonoro com J-P Caron. \nApresentação focada na constituição de mundos sonoros a partir do espaço intrínseco à escuta e sua relação com a música de ruído. A partir do texto Into the Full(Rumo ao Pleno) e da obra Ícone, ambos do ministrante, serão investigados modelos de espaço acústico, do mundo puramente auditivo de Strawson à pansonoridade de Wyschnegradsky. \n\n16:00: Oficina: Ecosistemas Sonoros com Mari Herzer \nOficina teórico-prática sobre fundamentos físico-acústicos do som e percepção sonora. Investiga ritmo, harmonia e gesto e concluirá com exercícios de abstração coletiva, explorando o sound design como meio de constituir imaginários e universos sonoros.", local: "Bloco Escola (MAM-Rio)", image: "/campes-instapfp.png", link: "https://forms.gle/Rc78xQVxefAuqRTV8", linkText: "RSVP" },
  { day: 3, month: 2, year: 2026, title: "OFICINAS", description: "14:00; Escola de Mistérios, Capetini, Kaloan", eventSubtitle: "Seminários com Escola de Mistérios, Capetini, Kaloan", hora: "14:00", fullDescription: "Oficinas e Rodas de Conversa com Escola de Mistérios, Capetini e Kaloan. Mais informações em breve. RSVP", local: "Bloco Escola (MAM-Rio)", image: "/campes-instapfp.png", link: "https://forms.gle/Rc78xQVxefAuqRTV8", linkText: "RSVP" },
  { day: 6, month: 2, year: 2026, title: "EXPERIÊNCIA", description: "15:00; Anti Ribeiro, Nãovenhasemrosto, Pek0", eventSubtitle: "Anti Ribeiro, Nãovenhasemrosto, Pek0", hora: "15:00", fullDescription: "Experiência de escula com Anti Ribeiro, Nãovenhasemrosto e Pek0. Mediação sonora: numagama", local: "Vão Livre (MAM-Rio)", image: "/campes-instapfp.png", linkText: "SAIBA MAIS", link: "https://www.instagram.com/campo.esquerdo" },
];

/** Events sorted chronologically */
export const sortedCalendarEvents = [...calendarEvents].sort((a, b) => {
  const dateA = new Date(a.year, a.month, a.day);
  const dateB = new Date(b.year, b.month, b.day);
  return dateA.getTime() - dateB.getTime();
});
