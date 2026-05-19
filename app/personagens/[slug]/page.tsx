import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Cake, Heart, MapPin, ExternalLink, Sparkles, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { NpcPortrait } from "@/components/features/NpcPortrait";
import { GiftList } from "@/components/features/GiftList";
import { HeartTracker } from "@/components/features/HeartTracker";
import { HeartEventList } from "@/components/features/HeartEventList";
import { MarriageInfo } from "@/components/features/MarriageInfo";
import npcsData from "@/data/seed/npcs.json";
import heartEventsData from "@/data/seed/heart-events.json";
import marriageData from "@/data/seed/marriage.json";
import type { Metadata } from "next";
import type { Npc } from "@/types/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = (npcsData as Partial<Npc>[]).find((x) => x.slug === slug);
  if (!n) return {};
  return {
    title: n.nome,
    description: n.descricao ?? `Conheça ${n.nome}, aldeão de Pelican Town`,
  };
}

export async function generateStaticParams() {
  return (npcsData as Partial<Npc>[]).map((n) => ({ slug: n.slug! }));
}

export default async function NpcDetail({ params }: Props) {
  const { slug } = await params;
  const n = (npcsData as Partial<Npc>[]).find((x) => x.slug === slug) as Npc | undefined;
  if (!n) notFound();

  const amados = n.presentes_amados ?? [];
  const apreciados = n.presentes_apreciados ?? [];
  const neutros = n.presentes_neutros ?? [];
  const naoGostam = n.presentes_nao_gostam ?? [];
  const odiados = n.presentes_odiados ?? [];

  const semDados =
    amados.length + apreciados.length + neutros.length + naoGostam.length + odiados.length === 0;

  const eventos = (heartEventsData.eventos as Record<string, { hearts: number; local: string; condicao: string; resumo: string }[]>)[slug] ?? [];
  const casamento = (marriageData.conjuges as Record<string, {
    presentes_diarios?: string[];
    beneficio_unico?: string;
    stardrop?: string;
    quarto?: string;
    personalidade_casado?: string;
    nota?: string;
  }>)[slug];

  return (
    <div className="mx-auto max-w-3xl px-3 sm:px-6 py-6 sm:py-8">
      <Link
        href="/personagens"
        className="inline-flex items-center gap-1 text-sm font-semibold text-water [@media(hover:hover)]:hover:text-ink mb-4 transition-colors"
      >
        <ArrowLeft size={14} /> Voltar para personagens
      </Link>

      {/* Header com retrato + dados */}
      <div className="wood-frame rounded-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <NpcPortrait retrato={n.retrato} alt={n.nome} size={128} className="shrink-0 mx-auto sm:mx-0" />
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-1.5 flex-wrap">
              <h1 className="font-display text-3xl sm:text-4xl text-ink leading-none">{n.nome}</h1>
              {n.romanceable && (
                <span className="inline-flex items-center gap-1 rounded-sm border-2 border-berry/50 bg-berry/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-berry">
                  <Heart size={10} className="fill-berry" /> Romanceável
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-ink-soft justify-center sm:justify-start mb-2">
              {n.aniversario && (
                <span className="inline-flex items-center gap-1">
                  <Cake size={12} /> {n.aniversario}
                </span>
              )}
              {n.localizacao && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} /> {n.localizacao}
                </span>
              )}
            </div>
            {n.descricao && <p className="text-sm text-ink-soft">{n.descricao}</p>}
          </div>
        </div>
      </div>

      {/* Heart tracker — sempre visível */}
      <div className="mb-6">
        <HeartTracker slug={n.slug} romanceable={n.romanceable} />
      </div>

      {/* Listas de presentes */}
      {semDados ? (
        <Card className="text-center text-ink-soft">
          <Sparkles size={20} className="mx-auto text-wood mb-2" />
          <p className="font-semibold text-ink">Este personagem não recebe presentes</p>
          <p className="text-xs mt-1">NPCs especiais como Marlon, Gunther, Mr. Qi e Birdie não aceitam presentes no jogo.</p>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3 gap-2">
            <h2 className="font-display text-2xl text-ink leading-none">Presentes</h2>
            <Link
              href="/personagens/presentes-universais"
              className="inline-flex items-center gap-1 text-xs font-semibold text-water [@media(hover:hover)]:hover:text-ink underline-offset-2 [@media(hover:hover)]:hover:underline"
            >
              regras universais →
            </Link>
          </div>
          <div className="space-y-3">
            <GiftList nivel="amados" itens={amados} defaultOpen />
            <GiftList nivel="apreciados" itens={apreciados} />
            <GiftList nivel="neutros" itens={neutros} />
            <GiftList nivel="nao_gostam" itens={naoGostam} />
            <GiftList nivel="odiados" itens={odiados} />
          </div>

          <p className="mt-4 text-xs text-ink-soft italic">
            💡 Dica: presente entregue no aniversário do NPC vale 8x amizade. Limite: 2 presentes/semana.
          </p>
        </>
      )}

      {/* Heart Events */}
      {eventos.length > 0 && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-berry" />
            <h2 className="font-display text-2xl text-ink leading-none">Eventos de coração</h2>
          </div>
          <p className="text-xs text-ink-soft mb-3 italic">
            Cutscenes que disparam ao atingir os corações indicados. Verifique condições de hora/local.
          </p>
          <HeartEventList eventos={eventos} />
        </section>
      )}

      {/* Marriage info — apenas para romanceáveis */}
      {n.romanceable && casamento && (
        <section className="mt-8">
          <div className="flex items-center gap-2 mb-3">
            <Heart size={18} className="text-berry fill-berry" />
            <h2 className="font-display text-2xl text-ink leading-none">Pós-casamento</h2>
          </div>
          <p className="text-xs text-ink-soft mb-3 italic">
            O que esperar após dar o Mermaid&apos;s Pendant (10❤ + casa upgrade).
          </p>
          <MarriageInfo data={casamento} nome={n.nome} />
        </section>
      )}

      {n.fonte_url && (
        <a
          href={n.fonte_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-water [@media(hover:hover)]:hover:text-ink-shadow underline-offset-2 [@media(hover:hover)]:hover:underline"
        >
          <ExternalLink size={14} /> Ver no Stardew Valley Wiki
        </a>
      )}
    </div>
  );
}
