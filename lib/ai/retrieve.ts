import "server-only";
import { createSearch, SearchResult } from "@/lib/search";
import macetesData from "@/data/seed/macetes.json";
import bugsData from "@/data/seed/bugs.json";
import missoesData from "@/data/seed/missoes.json";
import idsData from "@/data/seed/ids.json";
import type { Macete, Bug, Missao, ItemId } from "@/types/db";
import { createClient } from "@supabase/supabase-js";
import { embed } from "./embeddings";

const search = createSearch({
  macetes: macetesData as Macete[],
  bugs: bugsData as Bug[],
  missoes: missoesData as Missao[],
  ids: idsData as ItemId[],
});

const macetesBySlug = new Map((macetesData as Macete[]).map((m) => [m.slug, m]));
const bugsBySlug = new Map((bugsData as Bug[]).map((b) => [b.slug, b]));
const missoesBySlug = new Map((missoesData as Missao[]).map((m) => [m.slug, m]));

interface MatchRow { type: string; slug: string; similarity: number }

async function semanticSearch(query: string, limit: number): Promise<SearchResult[] | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  try {
    const vector = await embed(query);
    const supabase = createClient(url, key);
    const { data, error } = await supabase.rpc("match_content", { query_embedding: vector, match_count: Math.ceil(limit / 3) });
    if (error || !data) return null;

    const out: SearchResult[] = [];
    for (const row of data as MatchRow[]) {
      if (row.similarity < 0.25) continue; // threshold mínimo
      if (row.type === "macete") {
        const m = macetesBySlug.get(row.slug);
        if (m) out.push({ type: "macete", item: m });
      } else if (row.type === "bug") {
        const b = bugsBySlug.get(row.slug);
        if (b) out.push({ type: "bug", item: b });
      } else if (row.type === "missao") {
        const ms = missoesBySlug.get(row.slug);
        if (ms) out.push({ type: "missao", item: ms });
      }
    }
    return out.length > 0 ? out.slice(0, limit) : null;
  } catch {
    return null;
  }
}

export async function retrieveContext(query: string, limit = 6): Promise<{ results: SearchResult[]; contextText: string; mode: "semantic" | "fuse" }> {
  // 1. Tenta busca semântica (pgvector) — só funciona se Supabase + embeddings populados
  const semantic = await semanticSearch(query, limit);
  // 2. Fallback: Fuse.js (sempre disponível)
  const results = semantic ?? search(query).slice(0, limit);
  const mode: "semantic" | "fuse" = semantic ? "semantic" : "fuse";
  if (results.length === 0) return { results, contextText: "", mode };

  const lines: string[] = [];
  for (const r of results) {
    if (r.type === "macete") {
      const m = r.item;
      lines.push(`[MACETE: ${m.titulo}] categoria=${m.categoria}, funciona=${m.funciona}. ${m.descricao}${m.tutorial ? `\nTutorial: ${m.tutorial.slice(0, 400)}` : ""}`);
    } else if (r.type === "bug") {
      const b = r.item;
      lines.push(`[BUG v${b.versao}: ${b.titulo}] status=${b.status}, severidade=${b.severidade}. ${b.descricao}`);
    } else if (r.type === "missao") {
      const m = r.item;
      lines.push(`[MISSÃO ${m.tipo}: ${m.titulo}] NPC=${m.npc ?? "—"}, local=${m.localizacao ?? "—"}, recompensa=${m.recompensa ?? "—"}. ${m.descricao}`);
    } else {
      const i = r.item;
      lines.push(`[ITEM: ${i.nome}] código=[${i.codigo}], categoria=${i.categoria}${i.preco_venda != null ? `, preço=${i.preco_venda}g` : ""}`);
    }
  }
  return { results, contextText: lines.join("\n\n"), mode };
}
