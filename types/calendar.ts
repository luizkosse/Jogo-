export type Season = "Primavera" | "Verão" | "Outono" | "Inverno";

export type EventType = "festival" | "aniversario";

export interface SeasonalEvent {
  slug: string;
  nome: string;
  estacao: Season;
  dia: number;
  descricao: string;
  localizacao?: string;
  tipo: EventType;
  /** Apenas para eventos de aniversário */
  npc_slug?: string;
  retrato?: string;
  presentes_amados?: string[];
}

export interface CalendarDay {
  dia: number;
  eventos: SeasonalEvent[];
}
