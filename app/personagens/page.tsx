"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { NpcCard } from "@/components/features/NpcCard";
import { cn } from "@/lib/utils";
import npcsData from "@/data/seed/npcs.json";
import type { Npc } from "@/types/db";

type Filtro = "todos" | "romanceaveis" | "amigos";

export default function PersonagensPage() {
  const [query, setQuery] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const filtered = useMemo(() => {
    return (npcsData as Partial<Npc>[]).filter((n) => {
      if (filtro === "romanceaveis" && !n.romanceable) return false;
      if (filtro === "amigos" && n.romanceable) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          (n.nome ?? "").toLowerCase().includes(q) ||
          (n.localizacao ?? "").toLowerCase().includes(q) ||
          (n.aniversario ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, filtro]);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <span className="pixel-header">Personagens</span>
        <p className="mt-2 text-sm text-ink-soft">
          Aldeões de Pelican Town — descubra o que cada um gosta de ganhar para
          aumentar sua amizade. Toque em um personagem para ver os 5 níveis de presentes.
        </p>
      </header>

      <div className="pixel-divider mb-4" />

      <div className="flex flex-col gap-3 mb-6">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="filtre por nome, local ou aniversário..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5 items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(["todos", "romanceaveis", "amigos"] as Filtro[]).map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={cn(
                  "rounded-sm border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all",
                  filtro === f
                    ? "border-wood-dark bg-gold text-ink-shadow shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                    : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
                )}
              >
                {f === "todos" ? "Todos" : f === "romanceaveis" ? "💗 Romanceáveis" : "🤝 Amigos"}
              </button>
            ))}
          </div>
          <Link
            href="/personagens/presentes-universais"
            className="inline-flex items-center gap-1 text-xs font-semibold text-water [@media(hover:hover)]:hover:text-ink underline-offset-2 [@media(hover:hover)]:hover:underline"
          >
            <Heart size={12} /> Presentes universais
          </Link>
        </div>
      </div>

      <p className="text-xs text-ink-soft mb-4">{filtered.length} personagens</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Nenhum personagem encontrado.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((n) => (
            <NpcCard
              key={n.slug}
              npc={{
                slug: n.slug!,
                nome: n.nome!,
                descricao: n.descricao ?? null,
                localizacao: n.localizacao ?? null,
                aniversario: n.aniversario ?? null,
                romanceable: n.romanceable ?? false,
                retrato: n.retrato ?? null,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
