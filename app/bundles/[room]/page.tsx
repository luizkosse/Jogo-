import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trophy } from "lucide-react";
import { Tag } from "@/components/ui/Tag";
import { BundleItem } from "@/components/features/BundleItem";
import bundlesData from "@/data/seed/bundles.json";
import type { Metadata } from "next";

interface Bundle {
  nome: string;
  necessarios: string;
  itens: string[];
  recompensa: string;
}

interface Room {
  id: string;
  nome: string;
  cor: string;
  descricao: string;
  bundles: Bundle[];
}

interface Props {
  params: Promise<{ room: string }>;
}

const corMap: Record<string, "gold" | "grass" | "water" | "danger" | "wood" | "muted"> = {
  grass: "grass",
  gold: "gold",
  water: "water",
  wood: "wood",
  danger: "danger",
  muted: "muted",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { room } = await params;
  const r = (bundlesData.rooms as Room[]).find((x) => x.id === room);
  if (!r) return {};
  return { title: r.nome, description: r.descricao };
}

export async function generateStaticParams() {
  return (bundlesData.rooms as Room[]).map((r) => ({ room: r.id }));
}

export default async function RoomDetail({ params }: Props) {
  const { room } = await params;
  const r = (bundlesData.rooms as Room[]).find((x) => x.id === room);
  if (!r) notFound();

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8">
      <Link
        href="/bundles"
        className="inline-flex items-center gap-1 text-sm font-semibold text-water [@media(hover:hover)]:hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para Community Center
      </Link>

      <header className="mb-6">
        <Tag color={corMap[r.cor] ?? "muted"} className="mb-2">{r.bundles.length} bundles</Tag>
        <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{r.nome}</h1>
        <p className="mt-2 text-sm text-ink-soft">{r.descricao}</p>
      </header>

      <div className="space-y-4">
        {r.bundles.map((b) => (
          <article key={b.nome} className="wood-frame rounded-sm overflow-hidden">
            <header className="bg-paper-deep border-b-2 border-wood-dark px-3 py-2 flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-xl text-ink leading-none">{b.nome}</h2>
                <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft mt-0.5">
                  Requer: {b.necessarios}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-sm border-2 border-gold/60 bg-gold/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-shadow">
                <Trophy size={10} /> Recompensa
              </span>
            </header>

            <div className="bg-paper-soft">
              <ul className="divide-y divide-wood-dark/15">
                {b.itens.map((raw, i) => (
                  <BundleItem key={i} raw={raw} />
                ))}
              </ul>
              <div className="px-3 py-2 bg-gold/10 border-t-2 border-wood-dark/20 text-sm text-ink">
                <span className="font-bold text-wood-dark">🏆 </span>
                {b.recompensa}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
