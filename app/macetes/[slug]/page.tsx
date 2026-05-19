import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Card } from "@/components/ui/Card";
import macetesData from "@/data/seed/macetes.json";
import type { Metadata } from "next";
import type { Macete } from "@/types/db";
import { catColor } from "@/lib/constants/macetes";

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
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8">
      <Link
        href="/macetes"
        className="inline-flex items-center gap-1 text-sm font-semibold text-water hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para macetes
      </Link>

      <div className="mb-5 flex items-start gap-2">
        <Zap size={28} className="text-gold mt-1 shrink-0" />
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Tag color={catColor[m.categoria] ?? "muted"}>{m.categoria}</Tag>
            {!m.funciona && <Badge variant="corrigido">Não funciona mais</Badge>}
            {m.versao_fim && (
              <span className="text-xs text-ink-soft">até v{m.versao_fim}</span>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{m.titulo}</h1>
        </div>
      </div>

      <p className="text-ink-soft mb-6">{m.descricao}</p>

      {m.tutorial && (
        <Card className="mb-6">
          <h2 className="font-display text-2xl text-wood-dark mb-3 flex items-center gap-2 leading-none">
            <Zap size={18} className="text-gold" /> Tutorial passo a passo
          </h2>
          <div className="space-y-2">{lines}</div>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div className="wood-frame rounded-sm p-3">
          <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-2">Plataformas</p>
          <div className="flex flex-wrap gap-1">
            {m.plataformas.map((p) => (<Tag key={p} color="muted">{p}</Tag>))}
          </div>
        </div>
        {m.versao_inicio && (
          <div className="wood-frame rounded-sm p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-1">Funciona desde</p>
            <p className="font-display text-2xl text-ink leading-none">v{m.versao_inicio}</p>
          </div>
        )}
      </div>

      {m.tags.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-2">Tags</p>
          <div className="flex flex-wrap gap-1">
            {m.tags.map((tag) => (
              <span key={tag} className="rounded-sm border border-wood-dark/30 bg-paper-deep px-2 py-0.5 text-xs font-mono text-ink-soft">
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
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-water hover:text-ink-shadow underline-offset-2 hover:underline"
        >
          <ExternalLink size={14} /> Ver fonte
        </a>
      )}
    </div>
  );
}
