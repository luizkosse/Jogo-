import { cn } from "@/lib/utils";

interface Props {
  /** Nome do arquivo PNG em /public/sprites/items/ (ex: "Prismatic_Shard.png") */
  imagem: string | null | undefined;
  /** Texto alt para acessibilidade (nome do item). */
  alt: string;
  /** Categoria, usada como fallback quando imagem não existe. */
  categoria?: string;
  size?: 24 | 32 | 40 | 48 | 64;
  className?: string;
}

const sizeMap: Record<number, string> = {
  24: "h-6 w-6",
  32: "h-8 w-8",
  40: "h-10 w-10",
  48: "h-12 w-12",
  64: "h-16 w-16",
};

const fallbackEmoji: Record<string, string> = {
  gema: "💎",
  fruta: "🍎",
  vegetal: "🥕",
  peixe: "🐟",
  mineral: "🪨",
  artefato: "🏺",
  forrageiro: "🌿",
  recurso: "🪵",
  artisan: "🥫",
  especial: "⭐",
  semente: "🌱",
  barra: "🟨",
  "slime-egg": "🥚",
  anel: "💍",
  fossil: "🦴",
  geodo: "🪨",
  flor: "🌸",
  equipamento: "⚙️",
  construcao: "🧱",
  fertilizante: "💧",
  lixo: "🗑️",
  tempero: "🧂",
};

export function ItemSprite({ imagem, alt, categoria, size = 32, className }: Props) {
  const dimClass = sizeMap[size];

  if (!imagem) {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-sm border-2 border-wood-dark/40 bg-paper-deep",
          dimClass,
          className
        )}
        role="img"
        aria-label={alt}
      >
        <span style={{ fontSize: `${size * 0.55}px`, lineHeight: 1 }}>
          {fallbackEmoji[categoria ?? ""] ?? "❔"}
        </span>
      </span>
    );
  }

  return (
    <img
      src={`/sprites/items/${imagem}`}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cn(
        "rounded-sm border-2 border-wood-dark/30 bg-paper-deep object-contain",
        dimClass,
        className
      )}
      style={{ imageRendering: "pixelated" }}
    />
  );
}
