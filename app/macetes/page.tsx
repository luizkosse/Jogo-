"use client";

import { useState, useMemo } from "react";
import { Zap, Search } from "lucide-react";
import { MaceteCard } from "@/components/features/MaceteCard";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import macetesData from "@/data/seed/macetes.json";
import type { Macete } from "@/types/db";

const CATEGORIES = ["todas", "dinheiro", "itens", "energia", "tempo", "combate", "fazenda"] as const;

const catLabel: Record<string, string> = {
  todas: "Todas",
  dinheiro: "💰 Dinheiro",
  itens: "📦 Itens",
  energia: "⚡ Energia",
  tempo: "⏰ Tempo",
  combate: "⚔️ Combate",
  fazenda: "🌾 Fazenda",
};

const FAVORITES_KEY = "sds:favoritos";

function getFavorites(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveFavorites(favs: Set<string>) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favs)));
}

export default function MacetesPage() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [favorites, setFavorites] = useState<Set<string>>(getFavorites);
  const [showFavOnly, setShowFavOnly] = useState(false);

  const filtered = useMemo(() => {
    return (macetesData as Macete[]).filter((m) => {
      if (categoria !== "todas" && m.categoria !== categoria) return false;
      if (showFavOnly && !favorites.has(m.slug)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          m.titulo.toLowerCase().includes(q) ||
          m.descricao.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [query, categoria, favorites, showFavOnly]);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      saveFavorites(next);
      return next;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Zap size={24} className="text-accent-gold" />
          <h1 className="font-display text-4xl text-text-parchment">MACETES</h1>
        </div>
        <p className="text-text-muted">
          Exploits, truques e estratégias verificados para Stardew Valley 1.6+
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 mb-8">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Buscar macetes, tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5 items-center">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                categoria === c
                  ? "border-accent-gold bg-accent-gold/15 text-accent-gold"
                  : "border-white/10 text-text-muted hover:border-white/30 hover:text-text-parchment"
              )}
            >
              {catLabel[c]}
            </button>
          ))}
          <button
            onClick={() => setShowFavOnly(!showFavOnly)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition-colors",
              showFavOnly
                ? "border-accent-gold bg-accent-gold/15 text-accent-gold"
                : "border-white/10 text-text-muted hover:border-white/30 hover:text-text-parchment"
            )}
          >
            ♥ Favoritos
          </button>
        </div>
      </div>

      <p className="text-xs text-text-dim mb-4">{filtered.length} macetes encontrados</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-text-muted">
          Nenhum macete encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MaceteCard
              key={m.slug}
              macete={m as Macete}
              favorited={favorites.has(m.slug)}
              onFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
