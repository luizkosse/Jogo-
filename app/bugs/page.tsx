"use client";

import { useState, useMemo } from "react";
import { Bug, Filter } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import bugsData from "@/data/seed/bugs.json";

const STATUS_OPTIONS = ["todos", "ativo", "corrigido", "parcial"] as const;
const PLATFORM_OPTIONS = ["todas", "pc", "mac", "mobile", "console"] as const;

const statusVariant: Record<string, "ativo" | "corrigido" | "parcial" | "default"> = {
  ativo: "ativo",
  corrigido: "corrigido",
  parcial: "parcial",
};

const statusLabel: Record<string, string> = {
  ativo: "Ativo",
  corrigido: "Corrigido",
  parcial: "Parcial",
};

const sevColor: Record<string, string> = {
  alta: "text-accent-danger",
  media: "text-accent-gold",
  baixa: "text-accent-grass",
};

export default function BugsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("todos");
  const [platform, setPlatform] = useState<string>("todas");

  const filtered = useMemo(() => {
    return bugsData.filter((b) => {
      if (status !== "todos" && b.status !== status) return false;
      if (platform !== "todas" && !b.plataformas.includes(platform)) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          b.titulo.toLowerCase().includes(q) ||
          b.descricao.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, status, platform]);

  const byVersion = useMemo(() => {
    const map = new Map<string, typeof bugsData>();
    for (const b of filtered) {
      const v = b.versao_fix ? `Corrigido em ${b.versao_fix}` : `Versão ${b.versao}`;
      if (!map.has(v)) map.set(v, []);
      map.get(v)!.push(b);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Bug size={24} className="text-accent-danger" />
          <h1 className="font-display text-4xl text-text-parchment">BUGS</h1>
        </div>
        <p className="text-text-muted">
          Glitches ativos e histórico de correções da versão 1.6+
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Input
          leftIcon={<Filter size={14} />}
          placeholder="Filtrar bugs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <div className="flex gap-1 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs capitalize transition-colors",
                status === s
                  ? "border-accent-gold bg-accent-gold/15 text-accent-gold"
                  : "border-white/10 text-text-muted hover:border-white/30 hover:text-text-parchment"
              )}
            >
              {s === "todos" ? "Todos" : statusLabel[s]}
            </button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {PLATFORM_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs capitalize transition-colors",
                platform === p
                  ? "border-accent-water bg-accent-water/15 text-accent-water"
                  : "border-white/10 text-text-muted hover:border-white/30 hover:text-text-parchment"
              )}
            >
              {p === "todas" ? "Todas" : p.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {byVersion.length === 0 ? (
        <p className="text-center text-text-muted py-12">Nenhum bug encontrado.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-8 pl-10">
            {byVersion.map(([version, bugs]) => (
              <div key={version}>
                <div className="absolute -left-0 flex items-center">
                  <div className="w-8 h-px bg-white/20" />
                  <div className="w-2 h-2 rounded-full bg-accent-gold -ml-1" />
                </div>
                <p className="font-display text-xl text-accent-gold mb-4">{version}</p>
                <div className="space-y-4">
                  {bugs.map((b) => (
                    <Card key={b.slug} id={b.slug} className="border-l-2 border-l-accent-danger/40">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant={statusVariant[b.status] ?? "default"}>
                            {statusLabel[b.status] ?? b.status}
                          </Badge>
                          <span className={cn("text-xs font-medium", sevColor[b.severidade])}>
                            ● {b.severidade}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {b.plataformas.map((p) => (
                            <Tag key={p} color="muted" className="text-xs">
                              {p}
                            </Tag>
                          ))}
                        </div>
                      </div>
                      <h3 className="font-semibold text-text-parchment mb-1">{b.titulo}</h3>
                      <p className="text-sm text-text-muted">{b.descricao}</p>
                      {b.fonte_url && (
                        <a
                          href={b.fonte_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs text-accent-water hover:underline"
                        >
                          Fonte →
                        </a>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
