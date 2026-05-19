"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ItemSprite } from "./ItemSprite";
import idsData from "@/data/seed/ids.json";
import type { ItemId } from "@/types/db";

type Nivel = "amados" | "apreciados" | "neutros" | "nao_gostam" | "odiados";

interface Props {
  nivel: Nivel;
  itens: string[];
  defaultOpen?: boolean;
}

const META: Record<Nivel, { label: string; amizade: string; cor: string; emoji: string }> = {
  amados: { label: "Amados", amizade: "+80", cor: "border-berry/60 bg-berry/15", emoji: "❤️" },
  apreciados: { label: "Apreciados", amizade: "+45", cor: "border-gold/60 bg-gold/15", emoji: "👍" },
  neutros: { label: "Neutros", amizade: "+20", cor: "border-wood-dark/40 bg-paper-deep", emoji: "😐" },
  nao_gostam: { label: "Não gostam", amizade: "-20", cor: "border-water/60 bg-water/15", emoji: "👎" },
  odiados: { label: "Odiados", amizade: "-40", cor: "border-berry/60 bg-berry/25", emoji: "💔" },
};

// Index dos IDs por (1) nome pt-BR e (2) nome inglês derivado da imagem.
// O scraper de NPCs usa nomes EN (do filename do wiki); ids.json foi traduzido pra pt-BR.
// Aceitar ambos viabiliza o match.
const idsByKey = new Map<string, ItemId>();
for (const i of idsData as ItemId[]) {
  if (i.nome) idsByKey.set(i.nome.toLowerCase(), i);
  if (i.imagem) {
    const en = i.imagem.replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase();
    if (!idsByKey.has(en)) idsByKey.set(en, i);
  }
}

function findItem(nome: string): ItemId | null {
  const key = nome.toLowerCase().trim();
  const exact = idsByKey.get(key);
  if (exact) return exact;
  // Fuzzy: tenta sem parênteses
  const stripped = nome.replace(/\s*\([^)]+\)\s*/g, "").toLowerCase().trim();
  return idsByKey.get(stripped) ?? null;
}

export function GiftList({ nivel, itens, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = META[nivel];

  if (itens.length === 0) {
    return (
      <details className="wood-frame rounded-sm group" open={defaultOpen}>
        <summary className={cn("flex items-center gap-2 px-3 py-2 cursor-pointer select-none border-b-2", meta.cor)}>
          <span className="text-lg">{meta.emoji}</span>
          <span className="font-display text-lg text-ink leading-none">{meta.label}</span>
          <span className="text-[10px] font-mono text-ink-soft">{meta.amizade}</span>
          <span className="ml-auto text-xs text-ink-soft">— vazio</span>
        </summary>
      </details>
    );
  }

  return (
    <div className={cn("wood-frame rounded-sm overflow-hidden", "border-b-2", meta.cor)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn("w-full flex items-center gap-2 px-3 py-2 cursor-pointer select-none border-b-2 transition-colors", meta.cor, "hover:brightness-95")}
        aria-expanded={open}
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        <span className="text-lg" aria-hidden>{meta.emoji}</span>
        <span className="font-display text-lg text-ink leading-none">{meta.label}</span>
        <span className="text-[10px] font-mono text-ink-soft">{meta.amizade}</span>
        <span className="ml-auto text-xs font-semibold text-ink-soft">{itens.length}</span>
      </button>

      {open && (
        <ul className="divide-y divide-wood-dark/15 bg-paper-soft">
          {itens.map((nome) => {
            const item = findItem(nome);
            return (
              <li key={nome} className="flex items-center gap-2.5 px-3 py-2 text-sm">
                <ItemSprite imagem={item?.imagem ?? null} alt={item?.nome ?? nome} categoria={item?.categoria} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-ink font-medium truncate">{item?.nome ?? nome}</p>
                  {item && (
                    <div className="flex items-center gap-2 text-[10px] text-ink-soft">
                      <code className="font-mono text-wood-dark">[{item.codigo}]</code>
                      {item.preco_venda != null && <span>{item.preco_venda}g</span>}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
