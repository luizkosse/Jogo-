import Link from "next/link";
import { ArrowRight, Zap, Bug, Map, Hash, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PixelDivider } from "@/components/decor/PixelDivider";
import macetesData from "@/data/seed/macetes.json";
import bugsData from "@/data/seed/bugs.json";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stardew Supremo — Macetes, Missões e Segredos",
};

const quickLinks = [
  { href: "/macetes", icon: Zap, title: "Macetes", desc: "Truques, atalhos e estratégias de ouro.", color: "text-gold" },
  { href: "/bugs", icon: Bug, title: "Bugs", desc: "Falhas ativas e histórico de correções.", color: "text-berry" },
  { href: "/missoes", icon: Map, title: "Missões", desc: "Missões da história, NPCs e recompensas.", color: "text-water" },
  { href: "/ids", icon: Hash, title: "IDs", desc: "Códigos de itens para o truque do nome.", color: "text-grass-dark" },
];

export default function Home() {
  const topMacetes = [...macetesData].sort((a, b) => b.popularidade - a.popularidade).slice(0, 3);
  const activeBugs = bugsData.filter((b) => b.status === "ativo").slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6">
      {/* Hero */}
      <section className="wood-frame relative overflow-hidden rounded-sm">
        {/* Céu + colinas — sem animais */}
        <div className="relative h-44 sm:h-56 md:h-64" aria-hidden="true">
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #aedaf2 0%, #c9e3a8 65%, #7bb53f 100%)" }} />
          {/* Sol */}
          <div className="absolute top-4 right-6 sm:right-12 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gold shadow-[0_0_0_4px_var(--color-gold-soft)]" />
          {/* Colinas */}
          <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-2/3">
            <path d="M 0 140 Q 100 80 200 110 T 400 100 T 600 120 T 800 100 L 800 200 L 0 200 Z" fill="#9bbf6a" />
            <path d="M 0 170 Q 80 130 180 160 T 380 150 T 600 165 T 800 145 L 800 200 L 0 200 Z" fill="#7bb53f" />
            {/* Árvores estilizadas */}
            {[80, 220, 360, 520, 680].map((cx, i) => (
              <g key={i} transform={`translate(${cx} ${130 + (i % 2) * 8})`}>
                <ellipse cx="0" cy="0" rx="14" ry="18" fill="#3d6b1c" />
                <rect x="-2" y="14" width="4" height="10" fill="#5b3a1f" />
              </g>
            ))}
          </svg>
          {/* Cerca pixel */}
          <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "repeating-linear-gradient(90deg, #5b3a1f 0 4px, #a76e3b 4px 14px)" }} />
        </div>

        {/* Título sobreposto */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl text-ink-shadow drop-shadow-[2px_2px_0_var(--color-gold-soft)] tracking-wider">
            STARDEW SUPREMO
          </h1>
          <div className="mt-2 inline-block bg-ink/90 text-paper-soft border-2 border-wood-dark rounded-sm px-3 py-1 text-xs sm:text-sm font-mono">
            macetes · missões · bugs · segredos
          </div>
        </div>
      </section>

      {/* CTAs */}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/macetes">
            <Zap size={16} /> Ver macetes
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href="/chat">
            <MessageCircle size={16} /> Abrir assistente
          </Link>
        </Button>
      </div>

      <PixelDivider />

      {/* Quick links */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="pixel-header">Explorar</span>
          <span className="hidden sm:inline text-xs text-ink-soft italic">quatro caminhos para se perder em Pelican Town</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickLinks.map((ql) => {
            const Icon = ql.icon;
            return (
              <Link key={ql.href} href={ql.href}>
                <Card hover className="flex flex-col gap-2 h-full">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-sm bg-paper-deep border-2 border-wood-dark ${ql.color}`}>
                    <Icon size={20} />
                  </div>
                  <p className="font-display text-2xl uppercase tracking-wide text-ink leading-none mt-1">{ql.title}</p>
                  <p className="text-xs text-ink-soft">{ql.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <PixelDivider />

      {/* Top macetes */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="pixel-header">Macetes populares</span>
          <Link href="/macetes" className="inline-flex items-center gap-1 text-sm font-semibold text-water hover:text-ink transition-colors">
            ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {topMacetes.map((m) => (
            <Link key={m.slug} href={`/macetes/${m.slug}`}>
              <Card hover className="flex flex-col gap-2 h-full">
                <span className="inline-flex w-fit items-center rounded-sm border-2 border-wood-dark bg-gold/30 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ink-shadow">
                  {m.categoria}
                </span>
                <p className="font-display text-xl text-ink leading-tight">{m.titulo}</p>
                <p className="text-sm text-ink-soft line-clamp-3">{m.descricao}</p>
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {m.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-sm border border-wood-dark/30 bg-paper-deep px-1.5 py-0.5 text-[10px] font-mono text-ink-soft">
                      #{tag}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <PixelDivider />

      {/* Bugs ativos */}
      <section>
        <div className="flex items-center justify-between mb-4 gap-2">
          <span className="pixel-header">Bugs ativos</span>
          <Link href="/bugs" className="inline-flex items-center gap-1 text-sm font-semibold text-water hover:text-ink transition-colors">
            ver todos <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {activeBugs.map((b) => (
            <Link key={b.slug} href={`/bugs#${b.slug}`}>
              <Card hover className="flex flex-col gap-2 h-full">
                <span className="inline-flex w-fit items-center rounded-sm border-2 border-berry/60 bg-berry/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-berry">
                  v{b.versao}
                </span>
                <p className="font-display text-xl text-ink leading-tight">{b.titulo}</p>
                <p className="text-sm text-ink-soft line-clamp-2">{b.descricao}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
