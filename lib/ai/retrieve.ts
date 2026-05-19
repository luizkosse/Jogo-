import "server-only";
import { createSearch, SearchResult } from "@/lib/search";
import macetesData from "@/data/seed/macetes.json";
import bugsData from "@/data/seed/bugs.json";
import missoesData from "@/data/seed/missoes.json";
import idsData from "@/data/seed/ids.json";
import npcsData from "@/data/seed/npcs.json";
import bundlesData from "@/data/seed/bundles.json";
import universalGifts from "@/data/seed/universal-gifts.json";
import marriageData from "@/data/seed/marriage.json";
import heartEvents from "@/data/seed/heart-events.json";
import type { Macete, Bug, Missao, ItemId, Npc } from "@/types/db";

const search = createSearch({
  macetes: macetesData as Macete[],
  bugs: bugsData as Bug[],
  missoes: missoesData as Missao[],
  ids: idsData as ItemId[],
});

const macetes = macetesData as Macete[];
const npcsList = npcsData as Partial<Npc>[];
const ids = idsData as ItemId[];

// ────────────────────────────────────────────────────────
// Triggers por keyword — expandem o contexto pra além do Fuse
// ────────────────────────────────────────────────────────

interface KeywordTrigger {
  keywords: string[];
  inject: (lines: string[]) => void;
}

const TRIGGERS: KeywordTrigger[] = [
  {
    keywords: ["dinheiro", "money", "lucro", "renda", "rico", "ganhar ouro", "ganhar gold", "gold rápido", "gold rapido"],
    inject(lines) {
      lines.push("\n[CATEGORIA: MACETES DE DINHEIRO — todos]");
      for (const m of macetes.filter((x) => x.categoria === "dinheiro")) {
        lines.push(`• "${m.titulo}" — ${m.descricao}${m.tutorial ? `\n  Como fazer: ${m.tutorial.slice(0, 400)}` : ""}`);
      }
    },
  },
  {
    keywords: ["energia", "stamina", "cansaço"],
    inject(lines) {
      lines.push("\n[CATEGORIA: MACETES DE ENERGIA — todos]");
      for (const m of macetes.filter((x) => x.categoria === "energia")) {
        lines.push(`• "${m.titulo}" — ${m.descricao}`);
      }
    },
  },
  {
    keywords: ["combate", "monstro", "luta", "batalha", "skull cavern", "caverna"],
    inject(lines) {
      lines.push("\n[CATEGORIA: MACETES DE COMBATE — todos]");
      for (const m of macetes.filter((x) => x.categoria === "combate")) {
        lines.push(`• "${m.titulo}" — ${m.descricao}`);
      }
    },
  },
  {
    keywords: ["fazenda", "farm", "plantio", "plantação", "irrigação", "sprinkler"],
    inject(lines) {
      lines.push("\n[CATEGORIA: MACETES DE FAZENDA — todos]");
      for (const m of macetes.filter((x) => x.categoria === "fazenda")) {
        lines.push(`• "${m.titulo}" — ${m.descricao}`);
      }
    },
  },
  {
    keywords: ["item spawn", "spawn de item", "truque do nome", "exploit"],
    inject(lines) {
      lines.push("\n[CATEGORIA: MACETES DE ITENS — todos]");
      for (const m of macetes.filter((x) => x.categoria === "itens")) {
        lines.push(`• "${m.titulo}" — ${m.descricao}`);
      }
    },
  },
  {
    keywords: ["presente universal", "universal gift", "regra de presente", "amizade geral"],
    inject(lines) {
      lines.push("\n[REGRAS DE PRESENTES UNIVERSAIS]");
      for (const n of universalGifts.niveis) {
        lines.push(`• ${n.label} (${n.amizade}): ${n.itens.slice(0, 6).join(", ")}${n.itens.length > 6 ? "..." : ""}`);
      }
    },
  },
  {
    keywords: ["casamento", "casar", "marry", "marriage", "noivado", "pendant"],
    inject(lines) {
      lines.push("\n[CASAMENTO — etapas]");
      for (const [, etapa] of Object.entries(marriageData.etapas)) {
        const e = etapa as { label: string; requisito?: string; efeito?: string; como_obter?: string };
        lines.push(`• ${e.label}: ${e.requisito ?? ""} ${e.efeito ?? ""} ${e.como_obter ?? ""}`.trim());
      }
    },
  },
  {
    keywords: ["bundle", "community center", "centro comunitário", "junimo"],
    inject(lines) {
      lines.push("\n[COMMUNITY CENTER — overview]");
      for (const r of bundlesData.rooms) {
        lines.push(`• ${r.nome} (${r.bundles.length} bundles): ${r.descricao}`);
        for (const b of r.bundles) {
          lines.push(`  - ${b.nome}: ${b.itens.join(", ")} → ${b.recompensa}`);
        }
      }
    },
  },
  {
    keywords: ["aniversário", "birthday", "presente do"],
    inject(lines) {
      lines.push("\n[ANIVERSÁRIOS DOS NPCs] (presente no aniversário = 8x amizade)");
      for (const n of npcsList) {
        if (n.aniversario && n.nome) lines.push(`• ${n.nome}: ${n.aniversario}`);
      }
    },
  },
];

// ────────────────────────────────────────────────────────
// Detecção de NPC mencionado por nome
// ────────────────────────────────────────────────────────

function findMentionedNpcs(query: string): Partial<Npc>[] {
  const q = query.toLowerCase();
  return npcsList.filter((n) => {
    if (!n.nome) return false;
    const nameLow = n.nome.toLowerCase();
    return q.includes(nameLow) || (n.slug != null && q.includes(n.slug));
  });
}

function npcContext(n: Partial<Npc>): string {
  const lines: string[] = [];
  lines.push(`[NPC: ${n.nome}] aniversário=${n.aniversario ?? "—"}, local=${n.localizacao ?? "—"}, romanceável=${n.romanceable ? "sim" : "não"}`);
  if (n.descricao) lines.push(`  ${n.descricao}`);
  if (n.presentes_amados?.length) lines.push(`  ❤ Amados: ${n.presentes_amados.join(", ")}`);
  if (n.presentes_apreciados?.length) lines.push(`  👍 Apreciados: ${n.presentes_apreciados.slice(0, 8).join(", ")}${n.presentes_apreciados.length > 8 ? "..." : ""}`);
  if (n.presentes_odiados?.length) lines.push(`  💔 Odiados: ${n.presentes_odiados.slice(0, 5).join(", ")}`);

  const eventos = (heartEvents.eventos as Record<string, { hearts: number; local: string; condicao: string; resumo: string }[]>)[n.slug ?? ""];
  if (eventos?.length) {
    lines.push("  📅 Eventos de coração:");
    for (const ev of eventos.slice(0, 5)) {
      lines.push(`    - ${ev.hearts}❤ em ${ev.local} (${ev.condicao}): ${ev.resumo}`);
    }
  }
  const spouse = (marriageData.conjuges as Record<string, { presentes_diarios?: string[]; beneficio_unico?: string }>)[n.slug ?? ""];
  if (n.romanceable && spouse) {
    lines.push(`  💍 Pós-casamento: ${spouse.beneficio_unico ?? ""}${spouse.presentes_diarios ? ` Presentes diários: ${spouse.presentes_diarios.join(", ")}.` : ""}`);
  }
  return lines.join("\n");
}

// ────────────────────────────────────────────────────────
// Detecção de item mencionado pelo código [N] ou nome
// ────────────────────────────────────────────────────────

function findMentionedItems(query: string): ItemId[] {
  const codes = Array.from(query.matchAll(/\[(\d+)\]/g)).map((m) => m[1]);
  const byCode = ids.filter((i) => codes.includes(i.codigo));
  const q = query.toLowerCase();
  const byName = ids.filter((i) => {
    const enFromImg = i.imagem?.replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase();
    return (i.nome && q.includes(i.nome.toLowerCase())) || (enFromImg !== undefined && enFromImg.length > 3 && q.includes(enFromImg));
  });
  const seen = new Set<string>();
  return [...byCode, ...byName].filter((i) => {
    if (seen.has(i.codigo)) return false;
    seen.add(i.codigo);
    return true;
  });
}

function itemContext(i: ItemId): string {
  const npcLikes: string[] = [];
  const enName = i.imagem?.replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase();
  const matches = (list: string[] | undefined) => (list ?? []).some((g) => {
    const gl = g.toLowerCase();
    return gl === i.nome?.toLowerCase() || (enName && gl === enName);
  });
  for (const n of npcsList) {
    if (matches(n.presentes_amados)) npcLikes.push(`${n.nome}❤`);
    else if (matches(n.presentes_apreciados)) npcLikes.push(`${n.nome}👍`);
    else if (matches(n.presentes_odiados)) npcLikes.push(`${n.nome}💔`);
  }
  let line = `[ITEM ${i.nome}] código=[${i.codigo}], categoria=${i.categoria}${i.preco_venda != null ? `, venda=${i.preco_venda}g` : ""}`;
  if (npcLikes.length > 0) line += `\n  Reações de NPCs: ${npcLikes.slice(0, 12).join(", ")}${npcLikes.length > 12 ? "..." : ""}`;
  return line;
}

// ────────────────────────────────────────────────────────
// Retrieve principal
// ────────────────────────────────────────────────────────

export async function retrieveContext(query: string, limit = 10): Promise<{ results: SearchResult[]; contextText: string; mode: "fuse" }> {
  const lines: string[] = [];

  // 1. Fuse fuzzy
  const fuseResults = search(query).slice(0, limit);
  for (const r of fuseResults) {
    if (r.type === "macete") {
      const m = r.item;
      lines.push(`[MACETE: ${m.titulo}] categoria=${m.categoria}, funciona=${m.funciona}. ${m.descricao}${m.tutorial ? `\n  Como fazer: ${m.tutorial.slice(0, 500)}` : ""}`);
    } else if (r.type === "bug") {
      const b = r.item;
      lines.push(`[BUG v${b.versao}: ${b.titulo}] status=${b.status}, severidade=${b.severidade}. ${b.descricao}`);
    } else if (r.type === "missao") {
      const m = r.item;
      lines.push(`[MISSÃO ${m.tipo}: ${m.titulo}] NPC=${m.npc ?? "—"}, local=${m.localizacao ?? "—"}, recompensa=${m.recompensa ?? "—"}. ${m.descricao}`);
    } else {
      lines.push(itemContext(r.item));
    }
  }

  // 2. Triggers por keyword (categorias inteiras, regras globais)
  const lowerQuery = query.toLowerCase();
  for (const trig of TRIGGERS) {
    if (trig.keywords.some((k) => lowerQuery.includes(k))) {
      trig.inject(lines);
    }
  }

  // 3. NPCs mencionados por nome → contexto completo
  const mentionedNpcs = findMentionedNpcs(query);
  if (mentionedNpcs.length > 0) {
    lines.push("\n[NPCs MENCIONADOS — info completa]");
    for (const n of mentionedNpcs.slice(0, 3)) {
      lines.push(npcContext(n));
    }
  }

  // 4. Items mencionados por código [N] ou nome
  const mentionedItems = findMentionedItems(query);
  if (mentionedItems.length > 0) {
    lines.push("\n[ITENS MENCIONADOS]");
    for (const i of mentionedItems.slice(0, 5)) {
      lines.push(itemContext(i));
    }
  }

  return { results: fuseResults, contextText: lines.join("\n\n"), mode: "fuse" };
}
