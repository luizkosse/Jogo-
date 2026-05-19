export type Season = "Primavera" | "Verão" | "Outono" | "Inverno";
export type EventType = "festival" | "aniversario";

/** Campos compartilhados por todos os eventos do calendário */
interface BaseEvent {
  slug: string;
  nome: string;
  estacao: Season;
  dia: number;
  descricao: string;
}

/** Evento de aniversário de NPC */
export interface BirthdayEvent extends BaseEvent {
  tipo: "aniversario";
  npc_slug: string;
  retrato?: string;
  presentes_amados: string[];
}

/** Evento de festival oficial */
export interface FestivalEvent extends BaseEvent {
  tipo: "festival";
  localizacao?: string;
}

/**
 * Union discriminada por `tipo`.
 * TypeScript estreita automaticamente para o tipo correto
 * dentro de blocos `if (event.tipo === "aniversario")`.
 */
export type SeasonalEvent = BirthdayEvent | FestivalEvent;

export interface CalendarDay {
  dia: number;
  eventos: SeasonalEvent[];
}
