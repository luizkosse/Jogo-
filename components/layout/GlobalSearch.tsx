"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search, X, Zap, Bug, Map, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/lib/search";

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
    case "macete": return `/macetes#${r.item.slug}`;
    case "bug": return `/bugs#${r.item.slug}`;
    case "missao": return `/missoes#${r.item.slug}`;
    case "id": return `/ids?q=${encodeURIComponent((r.item as { nome: string }).nome)}`;
  }
}

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    const { createSearch } = await import("@/lib/search");
    const [macetes, bugs, missoes, ids] = await Promise.all([
      fetch("/api/search?type=macetes").then((r) => r.json()).catch(() => []),
      fetch("/api/search?type=bugs").then((r) => r.json()).catch(() => []),
      fetch("/api/search?type=missoes").then((r) => r.json()).catch(() => []),
      fetch("/api/search?type=ids").then((r) => r.json()).catch(() => []),
    ]);
    const search = createSearch({ macetes, bugs, missoes, ids });
    setResults(search(q));
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl rounded-xl border border-white/10 bg-bg-twilight shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search size={16} className="text-text-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder='Buscar macetes, bugs, missões, IDs...'
            className="flex-1 bg-transparent text-text-parchment placeholder:text-text-dim text-sm focus:outline-none"
          />
          <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-parchment">
            <X size={16} />
          </button>
        </div>

        {results.length > 0 && (
          <ul className="max-h-80 overflow-y-auto py-2">
            {results.map((r, i) => (
              <li key={i}>
                <a
                  href={getHref(r)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                >
                  {typeIcon[r.type]}
                  <span className="flex-1 text-sm text-text-parchment truncate">
                    {getTitle(r)}
                  </span>
                  <span className="text-xs text-text-dim">{typeLabel[r.type]}</span>
                </a>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-text-muted">
            Nenhum resultado para "{query}"
          </p>
        )}

        {!query && (
          <p className="px-4 py-4 text-center text-xs text-text-dim">
            Digite para buscar em toda a base de dados
          </p>
        )}
      </div>
    </div>
  );
}
