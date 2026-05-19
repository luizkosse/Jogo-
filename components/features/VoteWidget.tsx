"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSION_KEY = "sds:session";
const VOTE_KEY_PREFIX = "sds:vote:";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

interface Counts { works: number; broken: number; enabled: boolean }

export function VoteWidget({ slug }: { slug: string }) {
  const [counts, setCounts] = useState<Counts>({ works: 0, broken: 0, enabled: false });
  const [myVote, setMyVote] = useState<"works" | "broken" | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMyVote((localStorage.getItem(VOTE_KEY_PREFIX + slug) as "works" | "broken" | null) ?? null);
    fetch(`/api/macetes/${slug}/votes`)
      .then((r) => r.json())
      .then((d: Counts) => setCounts(d))
      .catch(() => {});
  }, [slug]);

  const vote = async (v: "works" | "broken") => {
    if (loading) return;
    setLoading(true);
    const prevVote = myVote;
    setMyVote(v);
    localStorage.setItem(VOTE_KEY_PREFIX + slug, v);

    // Atualização otimista das contagens
    setCounts((c) => {
      const next = { ...c };
      if (prevVote === "works") next.works = Math.max(0, c.works - 1);
      if (prevVote === "broken") next.broken = Math.max(0, c.broken - 1);
      if (v === "works") next.works += 1;
      else next.broken += 1;
      return next;
    });

    try {
      const res = await fetch(`/api/macetes/${slug}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: v, session_id: getSessionId() }),
      });
      const data = await res.json();
      if (data.enabled === false) {
        // Sem Supabase configurado — voto fica só no localStorage
      }
    } catch {
      // Reverter em caso de erro
      setMyVote(prevVote);
      if (prevVote) localStorage.setItem(VOTE_KEY_PREFIX + slug, prevVote);
      else localStorage.removeItem(VOTE_KEY_PREFIX + slug);
    } finally {
      setLoading(false);
    }
  };

  const total = counts.works + counts.broken;
  const worksPct = total > 0 ? Math.round((counts.works / total) * 100) : 0;

  return (
    <div className="wood-frame rounded-sm p-3">
      <p className="font-display text-xl text-ink mb-3 leading-none">Esta dica ainda funciona?</p>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => vote("works")}
          disabled={loading}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-sm border-2 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50",
            myVote === "works"
              ? "border-wood-dark bg-grass/30 text-grass-dark shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_2px_0_var(--color-wood-dark)]"
              : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:border-wood-dark hover:text-grass-dark active:translate-y-px"
          )}
        >
          <ThumbsUp size={14} /> Funciona{counts.enabled ? ` (${counts.works})` : ""}
        </button>
        <button
          onClick={() => vote("broken")}
          disabled={loading}
          className={cn(
            "flex-1 inline-flex items-center justify-center gap-2 rounded-sm border-2 px-3 py-2 text-sm font-semibold uppercase tracking-wide transition-all disabled:opacity-50",
            myVote === "broken"
              ? "border-wood-dark bg-berry/30 text-berry shadow-[inset_0_0_0_2px_var(--color-gold-soft),0_2px_0_var(--color-wood-dark)]"
              : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:border-wood-dark hover:text-berry active:translate-y-px"
          )}
        >
          <ThumbsDown size={14} /> Não funciona{counts.enabled ? ` (${counts.broken})` : ""}
        </button>
      </div>
      {counts.enabled && total > 0 && (
        <div className="space-y-1">
          <div className="h-2 rounded-sm bg-paper-deep border border-wood-dark/40 overflow-hidden">
            <div className="h-full bg-grass" style={{ width: `${worksPct}%` }} />
          </div>
          <p className="text-xs text-ink-soft">
            {worksPct}% dos {total} {total === 1 ? "voto confirma" : "votos confirmam"} que funciona
          </p>
        </div>
      )}
      {!counts.enabled && (
        <p className="text-xs text-ink-soft italic">Voto salvo localmente (Supabase não configurado).</p>
      )}
    </div>
  );
}
