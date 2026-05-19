"use client";

import { useState, useMemo, useEffect } from "react";
import { Heart, Search } from "lucide-react";
import { MaceteCard } from "@/components/features/MaceteCard";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import macetesData from "@/data/seed/macetes.json";
import type { Macete } from "@/types/db";
import { catLabel } from "@/lib/constants/macetes";

const CATEGORIES = ["todas", "dinheiro", "itens", "energia", "tempo", "combate", "fazenda"] as const;
const catLabelWithAll: Record<string, string> = { todas: "Todas", ...catLabel };

const FAVORITES_KEY = "sds:favoritos";

function loadFavorites(): Set<string> {
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => { setFavorites(loadFavorites()); }, []);

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
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <span className="pixel-header">Macetes</span>
        <p className="mt-2 text-sm text-ink-soft">
          Exploits, truques e estratégias verificados para Stardew Valley 1.6+
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col gap-3 mb-6">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="filtre por texto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                "rounded-sm border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all",
                categoria === c
                  ? "border-wood-dark bg-gold text-ink-shadow shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                  : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
              )}
            >
              {catLabelWithAll[c]}
            </button>
          ))}
          <button
            onClick={() => setShowFavOnly(!showFavOnly)}
            className={cn(
              "inline-flex items-center gap-1 rounded-sm border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all",
              showFavOnly
                ? "border-wood-dark bg-berry/30 text-berry shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
            )}
          >
            <Heart size={11} className={showFavOnly ? "fill-berry" : ""} /> Favoritos
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-soft mb-4">{filtered.length} macetes encontrados</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">
          Nenhum macete encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
