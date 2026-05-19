import type { Season, SeasonalEvent, CalendarDay } from "@/types/calendar";

/**
 * Estrutura raw do eventos-sazonais.json.
 * `estacao` e `tipo` permanecem como `string` porque o TypeScript infere
 * valores de JSON como string genérica, não como literais. A validação
 * de domínio ocorre implicitamente no `buildCalendar` via comparação com Season.
 */
interface RawFestival {
  slug: string;
  nome: string;
  estacao: string;
  dia: number;
  descricao: string;
  localizacao?: string;
  tipo: string;
}

/** Estrutura mínima do npcs.json necessária para o calendário */
interface RawNpc {
  slug: string;
  nome: string;
  aniversario: string | null;
  presentes_amados: string[];
  retrato?: string | null;
}

/**
 * Parseia "Outono 13" → { estacao: "Outono", dia: 13 }
 * Retorna null se o formato for inválido.
 */
export function parseBirthday(
  aniversario: string | null
): { estacao: Season; dia: number } | null {
  if (!aniversario) return null;

  const partes = aniversario.trim().split(" ");
  if (partes.length !== 2) return null;

  const [estacaoRaw, diaRaw] = partes;
  const dia = parseInt(diaRaw, 10);

  if (isNaN(dia) || dia < 1 || dia > 28) return null;

  const estacoesValidas: Season[] = ["Primavera", "Verão", "Outono", "Inverno"];
  const estacao = estacoesValidas.find((e) => e === estacaoRaw);

  if (!estacao) return null;

  return { estacao, dia };
}

/**
 * Monta o array de 28 CalendarDay para uma estação,
 * cruzando NPCs (aniversários) e festivais.
 */
export function buildCalendar(
  season: Season,
  npcs: RawNpc[],
  festivais: RawFestival[]
): CalendarDay[] {
  // Inicializar 28 dias vazios
  const dias: CalendarDay[] = Array.from({ length: 28 }, (_, i) => ({
    dia: i + 1,
    eventos: [] as SeasonalEvent[],
  }));

  // Adicionar aniversários dos NPCs
  for (const npc of npcs) {
    const parsed = parseBirthday(npc.aniversario);
    if (!parsed) continue;
    if (parsed.estacao !== season) continue;

    const idx = parsed.dia - 1;
    if (idx < 0 || idx >= 28) continue;

    dias[idx].eventos.push({
      slug: `aniversario-${npc.slug}`,
      nome: npc.nome,
      estacao: season,
      dia: parsed.dia,
      descricao: `Aniversário de ${npc.nome}`,
      tipo: "aniversario",
      npc_slug: npc.slug,
      retrato: npc.retrato ?? undefined,
      presentes_amados: npc.presentes_amados,
    });
  }

  // Adicionar festivais
  for (const festival of festivais) {
    if (festival.estacao !== season) continue;

    const idx = festival.dia - 1;
    if (idx < 0 || idx >= 28) continue;

    dias[idx].eventos.push({
      slug: festival.slug,
      nome: festival.nome,
      estacao: season,
      dia: festival.dia,
      descricao: festival.descricao,
      localizacao: festival.localizacao,
      tipo: "festival",
    });
  }

  return dias;
}

/** Estações em ordem canônica do jogo */
export const SEASONS: Season[] = ["Primavera", "Verão", "Outono", "Inverno"];
