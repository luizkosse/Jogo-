import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import macetesData from "@/data/seed/macetes.json";
import type { Metadata } from "next";
import type { Macete } from "@/types/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = macetesData.find((x) => x.slug === slug);
  if (!m) return {};
  return {
    title: m.titulo,
    description: m.descricao,
  };
}

export async function generateStaticParams() {
  return macetesData.map((m) => ({ slug: m.slug }));
}

const catColor: Record<string, "gold" | "grass" | "water" | "danger" | "wood" | "muted"> = {
  dinheiro: "gold",
  itens: "water",
  energia: "grass",
  tempo: "muted",
  combate: "danger",
  fazenda: "grass",
};

export default async function MaceteDetail({ params }: Props) {
  const { slug } = await params;
  const m = macetesData.find((x) => x.slug === slug) as Macete | undefined;
  if (!m) notFound();

  const lines = m.tutorial
    ? m.tutorial.split("\n").map((line, i) => {
        const isStep = /^\d+\./.test(line.trim());
        const isHeader = line.trim().startsWith("**") && line.trim().endsWith("**");
        const isTip = line.trim().startsWith(">");

        if (isHeader) {
          const text = line.trim().replace(/\*\*/g, "");
          return <p key={i} className="font-semibold text-accent-gold mt-4">{text}</p>;
        }
        if (isTip) {
          return (
            <p key={i} className="border-l-2 border-accent-water pl-3 text-text-muted italic text-sm">
              {line.replace(/^>\s*/, "")}
            </p>
          );
        }
        if (isStep) {
          return <p key={i} className="text-text-parchment">{line}</p>;
        }
        if (line.trim()) {
          return <p key={i} className="text-text-muted text-sm">{line}</p>;
        }
        return <div key={i} className="h-2" />;
      })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/macetes"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-parchment mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para macetes
      </Link>

      <div className="mb-6 flex items-start gap-3">
        <Zap size={28} className="text-accent-gold mt-1 shrink-0" />
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Tag color={catColor[m.categoria] ?? "muted"}>{m.categoria}</Tag>
            {!m.funciona && <Badge variant="corrigido">Não funciona mais</Badge>}
            {m.versao_fim && (
              <span className="text-xs text-text-dim">até v{m.versao_fim}</span>
            )}
          </div>
          <h1 className="font-display text-4xl text-text-parchment">{m.titulo}</h1>
        </div>
      </div>

      <p className="text-text-muted mb-8">{m.descricao}</p>

      {m.tutorial && (
        <Card className="mb-8">
          <h2 className="font-semibold text-accent-gold mb-4 flex items-center gap-2">
            <Zap size={16} /> Tutorial Passo a Passo
          </h2>
          <div className="space-y-2">{lines}</div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-xs text-text-dim uppercase mb-1">Plataformas</p>
          <div className="flex flex-wrap gap-1">
            {m.plataformas.map((p) => (
              <Tag key={p} color="muted">{p}</Tag>
            ))}
          </div>
        </div>
        {m.versao_inicio && (
          <div>
            <p className="text-xs text-text-dim uppercase mb-1">Funciona desde</p>
            <p className="text-text-parchment">v{m.versao_inicio}</p>
          </div>
        )}
      </div>

      {m.tags.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-text-dim uppercase mb-2">Tags</p>
          <div className="flex flex-wrap gap-1">
            {m.tags.map((tag) => (
              <span
                key={tag}
                className="rounded bg-white/5 px-2 py-0.5 text-xs text-text-dim"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
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
