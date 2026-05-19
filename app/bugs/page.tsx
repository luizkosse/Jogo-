"use client";

import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
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
  alta: "text-berry",
  media: "text-gold",
  baixa: "text-grass-dark",
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
    <div className="mx-auto max-w-4xl px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <span className="pixel-header">Bugs</span>
        <p className="mt-2 text-sm text-ink-soft">
          Falhas ativas e histórico de correções da v1.6+ — todo bug é um amigo escondido.
        </p>
      </header>

      <div className="pixel-divider mb-4" />

      {/* Filtros */}
      <div className="flex flex-col gap-3 mb-6">
        <Input
          leftIcon={<Filter size={14} />}
          placeholder="filtre por texto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "rounded-sm border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all",
                status === s
                  ? "border-wood-dark bg-gold text-ink-shadow shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                  : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
              )}
            >
              {s === "todos" ? "Todos" : statusLabel[s]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PLATFORM_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={cn(
                "rounded-sm border-2 px-3 py-1 text-xs font-bold tracking-wide transition-all uppercase",
                platform === p
                  ? "border-wood-dark bg-water/30 text-water shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                  : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
              )}
            >
              {p === "todas" ? "Todas" : p}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {byVersion.length === 0 ? (
        <p className="text-center text-ink-soft py-12">Nenhum bug encontrado.</p>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-1 bg-wood-dark/30 rounded-sm" />
          <div className="space-y-6 pl-10">
            {byVersion.map(([version, bugs]) => (
              <div key={version} className="relative">
                <div className="absolute -left-10 top-1 flex items-center">
                  <div className="w-2.5 h-2.5 bg-berry border-2 border-wood-dark rounded-sm" />
                </div>
                <div className="mb-3">
                  <span className="inline-block pixel-header text-base">{version}</span>
                </div>
                <div className="space-y-3">
                  {bugs.map((b) => (
                    <Card key={b.slug} id={b.slug}>
                      <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant={statusVariant[b.status] ?? "default"}>
                            {statusLabel[b.status] ?? b.status}
                          </Badge>
                          <span className="text-xs text-ink-soft font-mono">v{b.versao}</span>
                          <span className={cn("text-xs font-bold uppercase", sevColor[b.severidade])}>
                            ● {b.severidade}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {b.plataformas.map((p) => (
                            <Tag key={p} color="muted" className="text-[10px]">{p}</Tag>
                          ))}
                        </div>
                      </div>
                      <h3 className="font-display text-xl text-ink leading-tight mb-1">{b.titulo}</h3>
                      <p className="text-sm text-ink-soft">{b.descricao}</p>
                      {b.fonte_url && (
                        <a
                          href={b.fonte_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-xs font-semibold text-water hover:text-ink-shadow underline-offset-2 hover:underline"
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
