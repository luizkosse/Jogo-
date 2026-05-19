"use client";

import { useState, useMemo } from "react";
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Map size={24} className="text-accent-water" />
          <h1 className="font-display text-4xl text-text-parchment">MISSÕES</h1>
        </div>
        <p className="text-text-muted">
          Story quests, encomendas especiais e desafios do Mr. Qi com localização e recompensas.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-3 mb-8">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Buscar por missão, NPC, localização..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {TIPOS.map((t) => (
            <button
              key={t}
              onClick={() => setTipo(t)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                tipo === t
                  ? "border-accent-water bg-accent-water/15 text-accent-water"
                  : "border-white/10 text-text-muted hover:border-white/30 hover:text-text-parchment"
              )}
            >
              {tipoLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-dim mb-4">{filtered.length} missões encontradas</p>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-text-muted">Nenhuma missão encontrada.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <Card key={m.slug} id={m.slug} hover className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <Tag color={tipoColor[m.tipo] ?? "muted"}>{tipoLabel[m.tipo]}</Tag>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      className={cn(
                        i < m.dificuldade ? "text-accent-gold fill-accent-gold" : "text-white/20"
                      )}
                    />
                  ))}
                </div>
              </div>

              <h3 className="font-semibold text-text-parchment leading-snug">
                {m.titulo}
              </h3>

              <p className="text-sm text-text-muted line-clamp-2">{m.descricao}</p>

              <div className="mt-auto space-y-1.5 pt-1 border-t border-white/5">
                {m.npc && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-text-dim w-16 shrink-0">NPC:</span>
                    <span className="text-text-parchment">{m.npc}</span>
                  </div>
                )}
                {m.localizacao && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-text-dim w-16 shrink-0">Local:</span>
                    <span className="text-text-muted">
                      {getLocationIcon(m.localizacao)} {m.localizacao}
                    </span>
                  </div>
                )}
                {m.recompensa && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-text-dim w-16 shrink-0">Recomp.:</span>
                    <span className="text-accent-gold">{m.recompensa}</span>
                  </div>
                )}
                {m.requisitos && (
                  <div className="flex items-start gap-1.5 text-xs">
                    <span className="text-text-dim w-16 shrink-0">Req.:</span>
                    <span className="text-text-muted">{m.requisitos}</span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
