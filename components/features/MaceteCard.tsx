"use client";

import Link from "next/link";
import { Heart, Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Macete } from "@/types/db";

const catColor: Record<string, "gold" | "grass" | "water" | "danger" | "wood" | "muted"> = {
  dinheiro: "gold",
  itens: "water",
  energia: "grass",
  tempo: "muted",
  combate: "danger",
  fazenda: "grass",
};

const catLabel: Record<string, string> = {
  dinheiro: "💰 Dinheiro",
  itens: "📦 Itens",
  energia: "⚡ Energia",
  tempo: "⏰ Tempo",
  combate: "⚔️ Combate",
  fazenda: "🌾 Fazenda",
};

interface MaceteCardProps {
  macete: Macete;
  favorited?: boolean;
  onFavorite?: (slug: string) => void;
}

export function MaceteCard({ macete, favorited, onFavorite }: MaceteCardProps) {
  return (
    <Card hover className="relative flex flex-col gap-3" id={macete.slug}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <Tag color={catColor[macete.categoria] ?? "muted"}>
            {catLabel[macete.categoria] ?? macete.categoria}
          </Tag>
          {!macete.funciona && (
            <Badge variant="corrigido">Não funciona mais</Badge>
          )}
        </div>
        {onFavorite && (
          <button
            onClick={() => onFavorite(macete.slug)}
            className="shrink-0 text-text-muted hover:text-accent-gold transition-colors"
            aria-label={favorited ? "Remover favorito" : "Favoritar"}
          >
            <Heart
              size={16}
              className={cn(favorited && "fill-accent-gold text-accent-gold")}
            />
          </button>
        )}
      </div>

      <Link href={`/macetes/${macete.slug}`} className="group">
        <h3 className="font-semibold text-text-parchment group-hover:text-accent-gold transition-colors leading-snug">
          {macete.titulo}
        </h3>
      </Link>

      <p className="text-sm text-text-muted line-clamp-2">{macete.descricao}</p>

      <div className="flex flex-wrap gap-1 mt-auto pt-1">
        {macete.tags.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-text-dim"
          >
            #{tag}
          </span>
        ))}
      </div>

      {macete.plataformas.length > 0 && (
        <div className="flex gap-1 text-xs text-text-dim">
          <Zap size={12} className="text-accent-gold mt-0.5 shrink-0" />
          {macete.plataformas.join(", ")}
        </div>
      )}
    </Card>
  );
}
