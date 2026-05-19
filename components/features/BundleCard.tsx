import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

interface Room {
  id: string;
  nome: string;
  cor: string;
  descricao: string;
  bundles: { nome: string }[];
}

const corMap: Record<string, "gold" | "grass" | "water" | "danger" | "wood" | "muted"> = {
  grass: "grass",
  gold: "gold",
  water: "water",
  wood: "wood",
  danger: "danger",
  muted: "muted",
};

export function BundleCard({ room }: { room: Room }) {
  return (
    <Link href={`/bundles/${room.id}`} className="block group">
      <Card hover className="flex flex-col gap-2 h-full">
        <div className="flex items-start justify-between gap-2">
          <Tag color={corMap[room.cor] ?? "muted"}>{room.bundles.length} bundles</Tag>
        </div>
        <h3 className="font-display text-2xl text-ink leading-tight group-hover:text-wood-dark transition-colors">
          {room.nome}
        </h3>
        <p className="text-sm text-ink-soft line-clamp-3">{room.descricao}</p>
        <ul className="mt-auto pt-1 text-xs text-ink-soft space-y-0.5">
          {room.bundles.slice(0, 3).map((b) => (
            <li key={b.nome} className="truncate">▸ {b.nome}</li>
          ))}
          {room.bundles.length > 3 && (
            <li className="text-ink-soft/70 italic">+ {room.bundles.length - 3} bundle(s)</li>
          )}
        </ul>
      </Card>
    </Link>
  );
}
