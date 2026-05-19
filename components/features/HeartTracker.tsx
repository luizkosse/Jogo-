"use client";

import { useEffect, useState } from "react";
import { Heart, Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const HEARTS_KEY_PREFIX = "sds:hearts:";
const MAX_HEARTS = 14;
const ROMANCE_THRESHOLD = 8; // 8 corações exigido para dar Bouquet

interface Props {
  slug: string;
  romanceable: boolean;
}

function loadHearts(slug: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(HEARTS_KEY_PREFIX + slug);
    const n = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(n) ? Math.max(0, Math.min(MAX_HEARTS, n)) : 0;
  } catch {
    return 0;
  }
}

function saveHearts(slug: string, n: number) {
  localStorage.setItem(HEARTS_KEY_PREFIX + slug, String(n));
}

export function HeartTracker({ slug, romanceable }: Props) {
  const [hearts, setHearts] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHearts(loadHearts(slug));
    setHydrated(true);
  }, [slug]);

  const update = (n: number) => {
    const clamped = Math.max(0, Math.min(MAX_HEARTS, n));
    setHearts(clamped);
    saveHearts(slug, clamped);
  };

  const reset = () => update(0);

  const max = romanceable ? MAX_HEARTS : 10;
  const progress = (hearts / max) * 100;

  // Renderiza 14 ícones de coração; cheios = hearts, vazios = max-hearts, faded = 14-max (apenas se !romanceable)
  return (
    <div className="wood-frame rounded-sm p-3">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-display text-xl text-ink leading-none flex-1">Amizade</h3>
        <button
          onClick={() => update(hearts - 1)}
          disabled={!hydrated || hearts <= 0}
          className="h-8 w-8 inline-flex items-center justify-center rounded-sm border-2 border-wood-dark bg-paper-soft text-ink disabled:opacity-40 [@media(hover:hover)]:hover:bg-paper-deep active:translate-y-px"
          aria-label="Diminuir 1 coração"
        >
          <Minus size={14} />
        </button>
        <span className="font-mono text-sm text-ink font-bold tabular-nums w-12 text-center">
          {hydrated ? `${hearts}/${max}` : "—"}
        </span>
        <button
          onClick={() => update(hearts + 1)}
          disabled={!hydrated || hearts >= max}
          className="h-8 w-8 inline-flex items-center justify-center rounded-sm border-2 border-wood-dark bg-gold text-ink-shadow disabled:opacity-40 [@media(hover:hover)]:hover:brightness-105 active:translate-y-px shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
          aria-label="Adicionar 1 coração"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Linha de corações clicáveis */}
      <div className="flex flex-wrap gap-0.5 mb-2">
        {Array.from({ length: MAX_HEARTS }).map((_, i) => {
          const idx = i + 1;
          const filled = idx <= hearts;
          const beyondMax = idx > max;
          return (
            <button
              key={i}
              onClick={() => update(idx === hearts ? hearts - 1 : idx)}
              disabled={!hydrated || beyondMax}
              className={cn(
                "h-7 w-7 inline-flex items-center justify-center rounded-sm transition-all",
                beyondMax && "opacity-25 cursor-not-allowed",
                !beyondMax && "active:scale-90 [@media(hover:hover)]:hover:scale-110 cursor-pointer",
              )}
              aria-label={`Definir ${idx} corações`}
            >
              <Heart
                size={20}
                className={cn(
                  filled ? "text-berry fill-berry" : "text-ink-soft/40",
                )}
              />
            </button>
          );
        })}
      </div>

      {/* Barra de progresso */}
      <div className="h-2 rounded-sm bg-paper-deep border border-wood-dark/40 overflow-hidden mb-2">
        <div
          className="h-full bg-berry transition-all"
          style={{ width: hydrated ? `${progress}%` : "0%" }}
        />
      </div>

      {/* Hint conforme threshold */}
      {hydrated && (
        <p className="text-xs text-ink-soft italic">
          {hearts === 0 && "Comece a presentear! Use os botões + ou clique nos corações."}
          {hearts > 0 && hearts < ROMANCE_THRESHOLD && romanceable && `Faltam ${ROMANCE_THRESHOLD - hearts}❤ para o Bouquet (namoro).`}
          {hearts >= ROMANCE_THRESHOLD && hearts < 10 && romanceable && "Pronto para o Bouquet 💐 (Pierre's General Store)."}
          {hearts === 10 && romanceable && "Tudo pronto para o Mermaid's Pendant 💍 (3.000g no Old Mariner — fim de outono na praia)."}
          {hearts === 10 && !romanceable && "Amizade máxima atingida."}
          {hearts > 10 && hearts < MAX_HEARTS && romanceable && "Você está casado! Cada dia juntos vale +20 amizade."}
          {hearts === MAX_HEARTS && "Coração máximo — relacionamento perfeito ❤️"}
        </p>
      )}

      {hydrated && hearts > 0 && (
        <button
          onClick={reset}
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-ink-soft [@media(hover:hover)]:hover:text-berry transition-colors"
        >
          <RotateCcw size={10} /> Resetar
        </button>
      )}

      <p className="mt-2 text-[10px] text-ink-soft/70 italic">
        Salvo localmente no seu navegador — não sincroniza com o save do jogo.
      </p>
    </div>
  );
}
