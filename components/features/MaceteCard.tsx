import Link from "next/link";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { Badge } from "@/components/ui/Badge";
import type { Macete } from "@/types/db";
import { catColor, catLabel } from "@/lib/constants/macetes";

interface MaceteCardProps {
  macete: Macete;
}

export function MaceteCard({ macete }: MaceteCardProps) {
  return (
    <Link href={`/macetes/${macete.slug}`} className="block group">
      <Card hover className="relative flex flex-col gap-2 h-full" id={macete.slug}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <Tag color={catColor[macete.categoria] ?? "muted"}>
              {catLabel[macete.categoria] ?? macete.categoria}
            </Tag>
            {!macete.funciona && <Badge variant="corrigido">Não funciona mais</Badge>}
          </div>
        </div>

        <h3 className="font-display text-2xl text-ink leading-tight group-hover:text-wood-dark transition-colors">
          {macete.titulo}
        </h3>

        <p className="text-sm text-ink-soft line-clamp-3">{macete.descricao}</p>

        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {macete.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-sm border border-wood-dark/30 bg-paper-deep px-1.5 py-0.5 text-[10px] font-mono text-ink-soft"
            >
              #{tag}
            </span>
          ))}
        </div>

        {macete.plataformas.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-ink-soft">
            <Zap size={12} className="text-gold" />
            {macete.plataformas.join(", ")}
          </div>
        )}
      </Card>
    </Link>
  );
}
