import Fuse from "fuse.js";
import type { Macete, Bug, Missao, ItemId } from "@/types/db";

export type SearchResult =
  | { type: "macete"; item: Macete }
  | { type: "bug"; item: Bug }
  | { type: "missao"; item: Missao }
  | { type: "id"; item: ItemId };

export function createSearch(data: {
  macetes: Macete[];
  bugs: Bug[];
  missoes: Missao[];
  ids: ItemId[];
}) {
  const fuseOptions = { threshold: 0.4, includeScore: true };

  const fuseMacetes = new Fuse(data.macetes, {
    ...fuseOptions,
    keys: ["titulo", "descricao", "tags", "categoria"],
  });
  const fuseBugs = new Fuse(data.bugs, {
    ...fuseOptions,
    keys: ["titulo", "descricao", "versao"],
  });
  const fuseMissoes = new Fuse(data.missoes, {
    ...fuseOptions,
    keys: ["titulo", "descricao", "npc", "localizacao"],
  });
  const fuseIds = new Fuse(data.ids, {
    ...fuseOptions,
    keys: ["nome", "codigo", "categoria"],
  });

  return function search(query: string): SearchResult[] {
    if (!query.trim()) return [];
    const results: SearchResult[] = [];
    fuseMacetes.search(query).forEach((r) => results.push({ type: "macete", item: r.item }));
    fuseBugs.search(query).forEach((r) => results.push({ type: "bug", item: r.item }));
    fuseMissoes.search(query).forEach((r) => results.push({ type: "missao", item: r.item }));
    fuseIds.search(query).forEach((r) => results.push({ type: "id", item: r.item }));
    return results.slice(0, 20);
  };
}
