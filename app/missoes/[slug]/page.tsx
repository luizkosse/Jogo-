import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Map as MapIcon, Star, ExternalLink, User, Award, ListChecks, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { StardewMap } from "@/components/features/StardewMap";
import missoesData from "@/data/seed/missoes.json";
import type { Metadata } from "next";
import type { Missao } from "@/types/db";

interface Props {
  params: Promise<{ slug: string }>;
}

const tipoLabel: Record<string, string> = {
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = missoesData.find((x) => x.slug === slug);
  if (!m) return {};
  return { title: m.titulo, description: m.descricao };
}

export async function generateStaticParams() {
  return missoesData.map((m) => ({ slug: m.slug }));
}

export default async function MissaoDetail({ params }: Props) {
  const { slug } = await params;
  const m = missoesData.find((x) => x.slug === slug) as Missao | undefined;
  if (!m) notFound();

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8">
      <Link
        href="/missoes"
        className="inline-flex items-center gap-1 text-sm font-semibold text-water hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para missões
      </Link>

      <div className="mb-5 flex items-start gap-2">
        <MapIcon size={28} className="text-water mt-1 shrink-0" />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-2">
            <Tag color={tipoColor[m.tipo] ?? "muted"}>{tipoLabel[m.tipo] ?? m.tipo}</Tag>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={i < m.dificuldade ? "text-gold fill-gold" : "text-ink-soft/30"} />
              ))}
            </div>
            {m.versao_adicionada && (
              <span className="text-xs text-ink-soft">v{m.versao_adicionada}</span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{m.titulo}</h1>
        </div>
      </div>

      <p className="text-ink-soft mb-6">{m.descricao}</p>

      {m.localizacao && (
        <div className="mb-6">
          <StardewMap location={m.localizacao} />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {m.npc && (
          <div className="wood-frame rounded-sm p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-1">
              <User size={12} /> NPC
            </div>
            <p className="font-display text-xl text-ink leading-none">{m.npc}</p>
          </div>
        )}
        {m.localizacao && (
          <div className="wood-frame rounded-sm p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-1">
              <MapIcon size={12} /> Local
            </div>
            <p className="text-ink text-sm">{m.localizacao}</p>
          </div>
        )}
        {m.recompensa && (
          <div className="wood-frame rounded-sm p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-1">
              <Award size={12} /> Recompensa
            </div>
            <p className="font-semibold text-wood-dark">{m.recompensa}</p>
          </div>
        )}
        {m.requisitos && (
          <div className="wood-frame rounded-sm p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-1">
              <ListChecks size={12} /> Requisitos
            </div>
            <p className="text-ink-soft text-sm">{m.requisitos}</p>
          </div>
        )}
      </div>

      {m.como_obter && (
        <Card className="mb-6">
          <h2 className="font-display text-2xl text-wood-dark mb-2 flex items-center gap-2 leading-none">
            <Lightbulb size={18} className="text-gold" /> Como obter
          </h2>
          <p className="text-ink-soft whitespace-pre-line text-sm">{m.como_obter}</p>
        </Card>
      )}

      {m.fonte_url && (
        <a
          href={m.fonte_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-accent-water hover:text-text-parchment transition-colors"
        >
          <ExternalLink size={14} /> Ver fonte
        </a>
      )}
    </div>
  );
}
