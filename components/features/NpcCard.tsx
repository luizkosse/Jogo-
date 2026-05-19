"use client";

import Link from "next/link";
import { Heart, Cake } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { NpcPortrait } from "./NpcPortrait";
import type { Npc } from "@/types/db";

interface Props {
  npc: Pick<Npc, "slug" | "nome" | "descricao" | "localizacao" | "aniversario" | "romanceable" | "retrato">;
}

export function NpcCard({ npc }: Props) {
  return (
    <Link href={`/personagens/${npc.slug}`} className="block group">
      <Card hover className="flex gap-3 h-full">
        <NpcPortrait retrato={npc.retrato} alt={npc.nome} size={64} className="shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-display text-xl text-ink leading-none group-hover:text-wood-dark transition-colors truncate">
              {npc.nome}
            </h3>
            {npc.romanceable && (
              <Heart size={12} className="text-berry fill-berry shrink-0" aria-label="Romanceável" />
            )}
          </div>
          {npc.aniversario && (
            <p className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wide text-ink-soft mb-0.5">
              <Cake size={10} /> {npc.aniversario}
            </p>
          )}
          {npc.localizacao && (
            <p className="text-xs text-ink-soft line-clamp-2">{npc.localizacao}</p>
          )}
        </div>
      </Card>
    </Link>
  );
}
