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
  {
    href: "/macetes",
    icon: <Zap size={24} className="text-accent-gold" />,
    title: "Macetes",
    desc: "Exploits, truques e estratégias de ouro.",
    color: "hover:border-accent-gold/40",
  },
  {
    href: "/bugs",
    icon: <Bug size={24} className="text-accent-danger" />,
    title: "Bugs",
    desc: "Glitches ativos e histórico de correções.",
    color: "hover:border-accent-danger/40",
  },
  {
    href: "/missoes",
    icon: <Map size={24} className="text-accent-water" />,
    title: "Missões",
    desc: "Story quests, NPCs e recompensas.",
    color: "hover:border-accent-water/40",
  },
  {
    href: "/ids",
    icon: <Hash size={24} className="text-accent-grass" />,
    title: "IDs de Itens",
    desc: "Código de cada item para usar no exploit.",
    color: "hover:border-accent-grass/40",
  },
];

export default function Home() {
  const topMacetes = macetesData
    .sort((a, b) => b.popularidade - a.popularidade)
    .slice(0, 3);

  const activeBugs = bugsData.filter((b) => b.status === "ativo").slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-night px-4 py-20 text-center sm:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, #f4c43020 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%, #7cb34215 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="font-display text-5xl text-accent-gold sm:text-7xl mb-4 tracking-wide">
            STARDEW SUPREMO
          </h1>
          <p className="text-text-parchment text-lg sm:text-xl mb-8 max-w-xl mx-auto">
            Macetes, missões, bugs e segredos de Stardew Valley em um só lugar.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/macetes">
                Ver macetes <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/chat">
                <MessageCircle size={16} /> Abrir assistente
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-16">
        {/* Quick links */}
        <PixelDivider />
        <section>
          <h2 className="font-display text-3xl text-text-parchment mb-6">
            EXPLORAR
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {quickLinks.map((ql) => (
              <Link key={ql.href} href={ql.href}>
                <Card
                  hover
                  className={`flex flex-col gap-2 h-full transition-colors ${ql.color}`}
                >
                  {ql.icon}
                  <p className="font-semibold text-text-parchment">{ql.title}</p>
                  <p className="text-xs text-text-muted">{ql.desc}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <PixelDivider />

        {/* Top macetes */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-text-parchment">
              MACETES POPULARES
            </h2>
            <Link
              href="/macetes"
              className="flex items-center gap-1 text-sm text-accent-water hover:text-text-parchment transition-colors"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {topMacetes.map((m) => (
              <Link key={m.slug} href={`/macetes/${m.slug}`}>
                <Card hover className="flex flex-col gap-2 h-full">
                  <span className="text-xs text-accent-gold font-medium uppercase tracking-wide">
                    {m.categoria}
                  </span>
                  <p className="font-semibold text-text-parchment">{m.titulo}</p>
                  <p className="text-sm text-text-muted line-clamp-2">
                    {m.descricao}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <PixelDivider />

        {/* Bugs ativos */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-3xl text-text-parchment">
              BUGS ATIVOS
            </h2>
            <Link
              href="/bugs"
              className="flex items-center gap-1 text-sm text-accent-water hover:text-text-parchment transition-colors"
            >
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {activeBugs.map((b) => (
              <Link key={b.slug} href={`/bugs#${b.slug}`}>
                <Card hover className="flex flex-col gap-2 h-full border-accent-danger/20">
                  <span className="inline-flex w-fit rounded border border-accent-danger/30 bg-accent-danger/10 px-2 py-0.5 text-xs text-accent-danger">
                    {b.versao}
                  </span>
                  <p className="font-semibold text-text-parchment">{b.titulo}</p>
                  <p className="text-sm text-text-muted line-clamp-2">
                    {b.descricao}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
