import Link from "next/link";
import { Info } from "lucide-react";
import { BundleCard } from "@/components/features/BundleCard";
import bundlesData from "@/data/seed/bundles.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Center Bundles",
  description: "Os 6 quartos do Centro Comunitário com seus bundles, itens necessários e recompensas.",
};

interface Room {
  id: string;
  nome: string;
  cor: string;
  descricao: string;
  bundles: { nome: string }[];
}

export default function BundlesPage() {
  const rooms = bundlesData.rooms as Room[];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <span className="pixel-header">Community Center</span>
        <p className="mt-2 text-sm text-ink-soft">{bundlesData._descricao}</p>
      </header>

      <div className="wood-frame rounded-sm p-3 mb-6 bg-paper-soft">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-water shrink-0 mt-0.5" />
          <div className="text-sm text-ink">
            <p className="font-semibold text-ink mb-1">Como começar</p>
            <p className="text-ink-soft text-xs">{bundlesData.info_geral.como_iniciar}</p>
            <p className="text-ink-soft text-xs mt-1 italic">
              Alternativa: {bundlesData.info_geral.alternativa_joja}
            </p>
          </div>
        </div>
      </div>

      <div className="pixel-divider mb-4" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <BundleCard key={room.id} room={room} />
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-soft italic">
        ✨ Completar todos os 30 bundles restaura o Centro Comunitário e desbloqueia o Junimo Plush, Stardrop e ponte para Quarry.
      </p>

      <Link
        href="https://pt.stardewvalleywiki.com/Centro_Comunit%C3%A1rio"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-water [@media(hover:hover)]:hover:text-ink-shadow underline-offset-2 [@media(hover:hover)]:hover:underline"
      >
        Ver no Wiki oficial pt-BR →
      </Link>
    </div>
  );
}
