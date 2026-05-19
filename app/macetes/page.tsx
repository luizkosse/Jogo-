"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { MaceteCard } from "@/components/features/MaceteCard";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import macetesData from "@/data/seed/macetes.json";
import type { Macete } from "@/types/db";
import { catLabel } from "@/lib/constants/macetes";

const CATEGORIES = ["todas", "dinheiro", "itens", "energia", "tempo", "combate", "fazenda"] as const;
const catLabelWithAll: Record<string, string> = { todas: "Todas", ...catLabel };

export default function MacetesPage() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todas");

  const filtered = useMemo(() => {
    return (macetesData as Macete[]).filter((m) => {
      if (categoria !== "todas" && m.categoria !== categoria) return false;
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
  }, [query, categoria]);

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
                  : "border-wood-dark/40 bg-paper-soft text-ink-soft [@media(hover:hover)]:hover:bg-paper-deep [@media(hover:hover)]:hover:border-wood-dark"
              )}
            >
              {catLabelWithAll[c]}
            </button>
          ))}
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
            <MaceteCard key={m.slug} macete={m as Macete} />
          ))}
        </div>
      )}
    </div>
  );
}
