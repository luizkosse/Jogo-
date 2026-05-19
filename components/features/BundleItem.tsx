import { ItemSprite } from "./ItemSprite";
import idsData from "@/data/seed/ids.json";
import type { ItemId } from "@/types/db";

// Index dos IDs por (1) nome pt-BR e (2) nome inglês derivado da imagem.
const idsByKey = new Map<string, ItemId>();
for (const i of idsData as ItemId[]) {
  if (i.nome) idsByKey.set(i.nome.toLowerCase(), i);
  if (i.imagem) {
    const en = i.imagem.replace(/\.png$/i, "").replace(/_/g, " ").toLowerCase();
    if (!idsByKey.has(en)) idsByKey.set(en, i);
  }
}

function parseItemString(raw: string): { quantidade: number | null; nome: string } {
  // Examples: "99 Wood", "5 Parsnip (gold)", "Cauliflower", "2.500g (entregue)"
  const trimmed = raw.trim();
  const m = trimmed.match(/^(\d[\d.]*)\s+(.+)$/);
  if (m) {
    const qty = parseInt(m[1].replace(/[^\d]/g, ""), 10);
    return { quantidade: Number.isFinite(qty) ? qty : null, nome: m[2].trim() };
  }
  return { quantidade: null, nome: trimmed };
}

function findItem(nome: string): ItemId | null {
  const cleaned = nome.replace(/\s*\([^)]+\)\s*/g, "").toLowerCase().trim();
  return idsByKey.get(cleaned) ?? idsByKey.get(nome.toLowerCase()) ?? null;
}

export function BundleItem({ raw }: { raw: string }) {
  const { quantidade, nome } = parseItemString(raw);
  const item = findItem(nome);
  const displayName = item?.nome ?? nome;

  return (
    <li className="flex items-center gap-2 px-2.5 py-1.5 text-sm">
      <ItemSprite imagem={item?.imagem ?? null} alt={displayName} categoria={item?.categoria} size={24} />
      <div className="flex-1 min-w-0">
        <p className="text-ink truncate">
          {quantidade != null && <span className="font-mono text-wood-dark font-bold mr-1">{quantidade}×</span>}
          {displayName}
        </p>
      </div>
      {item && (
        <code className="font-mono text-[10px] text-ink-soft">[{item.codigo}]</code>
      )}
    </li>
  );
}
