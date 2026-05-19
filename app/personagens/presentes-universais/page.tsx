import Link from "next/link";
import { ArrowLeft, AlertTriangle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import data from "@/data/seed/universal-gifts.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Presentes Universais",
  description: "Regras gerais de presentes que aplicam a todos os aldeões de Stardew Valley.",
};

interface Nivel {
  nivel: string;
  label: string;
  amizade: string;
  cor: string;
  descricao: string;
  itens: string[];
  excecoes: string[];
}

const corClasses: Record<string, string> = {
  danger: "border-berry/60 bg-berry/15 text-berry",
  gold: "border-gold/60 bg-gold/15 text-ink-shadow",
  muted: "border-wood-dark/40 bg-paper-deep text-ink-soft",
  water: "border-water/60 bg-water/15 text-water",
};

export default function PresentesUniversaisPage() {
  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8">
      <Link
        href="/personagens"
        className="inline-flex items-center gap-1 text-sm font-semibold text-water [@media(hover:hover)]:hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para personagens
      </Link>

      <header className="mb-6">
        <span className="pixel-header">Presentes Universais</span>
        <p className="mt-2 text-sm text-ink-soft">{data.descricao}</p>
      </header>

      <div className="pixel-divider mb-6" />

      <div className="space-y-4">
        {(data.niveis as Nivel[]).map((n) => (
          <div key={n.nivel} className="wood-frame rounded-sm overflow-hidden">
            <div className={`flex items-center justify-between gap-2 px-3 py-2 border-b-2 ${corClasses[n.cor] ?? corClasses.muted}`}>
              <div>
                <h2 className="font-display text-xl leading-none">{n.label}</h2>
                <p className="text-[10px] font-mono uppercase tracking-wide opacity-90">{n.amizade} amizade</p>
              </div>
            </div>
            <div className="bg-paper-soft p-3">
              <p className="text-sm text-ink-soft mb-3">{n.descricao}</p>

              <h3 className="text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-1">Itens</h3>
              <ul className="space-y-1 mb-3">
                {n.itens.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-ink">
                    <span className="text-wood-dark">▸</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {n.excecoes.length > 0 && (
                <>
                  <h3 className="text-[10px] font-bold uppercase tracking-wide text-berry mb-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> Exceções por NPC
                  </h3>
                  <ul className="space-y-1">
                    {n.excecoes.map((exc) => (
                      <li key={exc} className="flex items-start gap-2 text-xs text-ink-soft">
                        <span className="text-berry">▸</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Regras extras */}
      <Card className="mt-6">
        <h2 className="font-display text-2xl text-wood-dark mb-3 leading-none">📋 Regras extras</h2>
        <ul className="space-y-2 text-sm text-ink">
          {data.regras_extras.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-gold">★</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Card>

      {data.fonte_url && (
        <a
          href={data.fonte_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-water [@media(hover:hover)]:hover:text-ink-shadow underline-offset-2 [@media(hover:hover)]:hover:underline"
        >
          <ExternalLink size={14} /> Wiki oficial pt-BR
        </a>
      )}
    </div>
  );
}
