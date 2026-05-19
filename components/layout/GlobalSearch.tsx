"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, Zap, Bug, Map, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/lib/search";
import type { Macete, Bug as BugItem, Missao, ItemId } from "@/types/db";
import { useSearchModal } from "@/lib/use-search-modal";

type SearchData = { macetes: Macete[]; bugs: BugItem[]; missoes: Missao[]; ids: ItemId[] };

// Cache de dados — carregados uma única vez por sessão de navegação
let dataCache: SearchData | null = null;

async function loadData(): Promise<SearchData> {
  if (dataCache) return dataCache;
  const [macetes, bugs, missoes, ids] = await Promise.all([
    fetch("/api/search?type=macetes").then((r) => r.json()).catch(() => []),
    fetch("/api/search?type=bugs").then((r) => r.json()).catch(() => []),
    fetch("/api/search?type=missoes").then((r) => r.json()).catch(() => []),
    fetch("/api/search?type=ids").then((r) => r.json()).catch(() => []),
  ]);
  dataCache = { macetes, bugs, missoes, ids };
  return dataCache;
}

const typeIcon = {
  macete: <Zap size={14} className="text-accent-gold" />,
  bug: <Bug size={14} className="text-accent-danger" />,
  missao: <Map size={14} className="text-accent-water" />,
  id: <Hash size={14} className="text-accent-grass" />,
};

const typeLabel = {
  macete: "Macete",
  bug: "Bug",
  missao: "Missão",
  id: "ID",
};

function getTitle(r: SearchResult): string {
  if (r.type === "id") return (r.item as { nome: string }).nome;
  return (r.item as { titulo: string }).titulo ?? "";
}

function getHref(r: SearchResult): string {
  switch (r.type) {
    case "macete": return `/macetes/${r.item.slug}`;
    case "bug": return `/bugs#${r.item.slug}`;
    case "missao": return `/missoes/${r.item.slug}`;
    case "id": return `/ids?q=${encodeURIComponent((r.item as { nome: string }).nome)}`;
  }
}

export function GlobalSearch() {
  const { open, setOpen } = useSearchModal();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      const { createSearch } = await import("@/lib/search");
      const data = await loadData();
      const search = createSearch(data);
      setResults(search(q));
    }, 250);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[8vh] sm:pt-[10vh] px-3"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="absolute inset-0 bg-ink-shadow/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl wood-frame rounded-sm bg-paper-soft">
        <div className="flex items-center gap-2 border-b-2 border-wood-dark px-3 py-2 bg-paper-deep">
          <Search size={16} className="text-ink-soft shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="buscar macetes, bugs, missões, IDs..."
            className="flex-1 bg-transparent text-ink placeholder:text-ink-soft/60 text-sm focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-ink-soft hover:text-ink p-1" aria-label="Fechar">
            <X size={16} />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-[60vh] sm:max-h-80 overflow-y-auto py-1">
            {results.map((r) => (
              <li key={`${r.type}-${r.type === "id" ? r.item.codigo : r.item.slug}`}>
                <a
                  href={getHref(r)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 hover:bg-paper-deep transition-colors border-b border-wood-dark/10 last:border-0"
                >
                  {typeIcon[r.type]}
                  <span className="flex-1 text-sm text-ink font-medium truncate">{getTitle(r)}</span>
                  <span className="text-[10px] uppercase font-bold text-ink-soft">{typeLabel[r.type]}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-ink-soft">
            Nenhum resultado para &ldquo;{query}&rdquo;
          </p>
        )}

        {!query && (
          <p className="px-4 py-4 text-center text-xs text-ink-soft italic">
            Digite para buscar em toda a base de dados
          </p>
        )}
      </div>
    </div>
  );
}
