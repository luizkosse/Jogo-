"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Map, Search, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import missoesData from "@/data/seed/missoes.json";
import type { Missao } from "@/types/db";

const TIPOS = ["todos", "story", "help_wanted", "special_order", "mr_qi"] as const;

const tipoLabel: Record<string, string> = {
  todos: "Todas",
  story: "Story Quest",
  help_wanted: "Help Wanted",
  special_order: "Special Order",
  mr_qi: "Mr. Qi",
};

const tipoColor: Record<string, "gold" | "grass" | "water" | "danger" | "wood" | "muted"> = {
  story: "gold",
  help_wanted: "water",
  special_order: "grass",
  mr_qi: "danger",
};

const locationEmoji: Record<string, string> = {
  "The Mines": "⛏️",
  "Cindersap Forest": "🌲",
  "Pelican Town": "🏘️",
  "Skull Cavern": "💀",
  "Secret Woods": "🌳",
  "Witch's Swamp": "🧙",
  "Calico Desert": "🏜️",
  "Ginger Island": "🌴",
};

function getLocationIcon(loc: string | null): string {
  if (!loc) return "📍";
  for (const [key, emoji] of Object.entries(locationEmoji)) {
    if (loc.includes(key)) return emoji;
  }
  return "📍";
}

export default function MissoesPage() {
  const [query, setQuery] = useState("");
  const [tipo, setTipo] = useState("todos");

  const filtered = useMemo(() => {
    return (missoesData as Missao[]).filter((m) => {
      if (tipo !== "todos" && m.tipo !== tipo) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          m.titulo.toLowerCase().includes(q) ||
          m.descricao.toLowerCase().includes(q) ||
          (m.npc ?? "").toLowerCase().includes(q) ||
          (m.localizacao ?? "").toLowerCase().includes(q) ||
          (m.recompensa ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, tipo]);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <span className="pixel-header">Missões</span>
        <p className="mt-2 text-sm text-ink-soft">
          Story quests, encomendas especiais e desafios do Mr. Qi com localização e recompensas.
        </p>
      </header>

      {/* Filtros */}
      <div className="flex flex-col gap-3 mb-6">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="filtre por missão, NPC, localização..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {TIPOS.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={cn(
                "rounded-sm border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all",
                tipo === t
                  ? "border-wood-dark bg-water/30 text-water shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                  : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
              )}
            >
              {tipoLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-soft mb-4">{filtered.length} missões encontradas</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-ink-soft">Nenhuma missão encontrada.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Link key={m.slug} href={`/missoes/${m.slug}`} className="block">
              <Card id={m.slug} hover className="flex flex-col gap-2 h-full">
                <div className="flex items-start justify-between gap-2">
                  <Tag color={tipoColor[m.tipo] ?? "muted"}>{tipoLabel[m.tipo]}</Tag>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={cn(i < m.dificuldade ? "text-gold fill-gold" : "text-ink-soft/30")}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-display text-xl text-ink leading-tight">{m.titulo}</h3>
                <p className="text-sm text-ink-soft line-clamp-2">{m.descricao}</p>

                <div className="mt-auto space-y-1 pt-2 border-t border-wood-dark/20 text-xs">
                  {m.npc && (
                    <div className="flex gap-1.5">
                      <span className="text-ink-soft w-14 shrink-0 font-semibold uppercase">NPC:</span>
                      <span className="text-ink">{m.npc}</span>
                    </div>
                  )}
                  {m.localizacao && (
                    <div className="flex gap-1.5">
                      <span className="text-ink-soft w-14 shrink-0 font-semibold uppercase">Local:</span>
                      <span className="text-ink-soft">{getLocationIcon(m.localizacao)} {m.localizacao}</span>
                    </div>
                  )}
                  {m.recompensa && (
                    <div className="flex gap-1.5">
                      <span className="text-ink-soft w-14 shrink-0 font-semibold uppercase">Recomp.:</span>
                      <span className="text-wood-dark font-semibold">{m.recompensa}</span>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
