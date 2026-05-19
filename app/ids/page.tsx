"use client";

import { useState, useMemo } from "react";
import { Hash, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { useToast } from "@/components/ui/Toast";
import { ItemSprite } from "@/components/features/ItemSprite";
import { cn } from "@/lib/utils";
import idsData from "@/data/seed/ids.json";

const CATEGORIES = [
  "todas",
  "gema",
  "mineral",
  "forrageiro",
  "vegetal",
  "fruta",
  "peixe",
  "recurso",
  "barra",
  "artisan",
  "artefato",
  "fossil",
  "geodo",
  "anel",
  "flor",
  "semente",
  "equipamento",
  "construcao",
  "fertilizante",
  "especial",
  "slime-egg",
  "lixo",
  "tempero",
] as const;

const catColor: Record<string, "gold" | "grass" | "water" | "danger" | "wood" | "muted"> = {
  gema: "water",
  mineral: "muted",
  forrageiro: "grass",
  vegetal: "grass",
  fruta: "gold",
  recurso: "wood",
  barra: "gold",
  artisan: "gold",
  peixe: "water",
  artefato: "wood",
  semente: "grass",
  especial: "danger",
  "slime-egg": "muted",
  anel: "water",
  fossil: "wood",
  geodo: "muted",
  flor: "danger",
  equipamento: "muted",
  construcao: "wood",
  fertilizante: "grass",
  lixo: "muted",
  tempero: "danger",
};

export default function IdsPage() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return idsData.filter((item) => {
      if (categoria !== "todas" && item.categoria !== categoria) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          item.nome.toLowerCase().includes(q) ||
          item.codigo.includes(q) ||
          (item.string_id ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [query, categoria]);

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(`[${code}]`).then(() => {
      toast(`[${code}] copiado! (${name})`);
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-6 sm:py-8">
      <header className="mb-6">
        <span className="pixel-header">IDs de Itens</span>
        <p className="mt-2 text-sm text-ink-soft">
          Códigos para o truque do nome do personagem. Toque para copiar.
        </p>
      </header>

      <div className="pixel-divider mb-4" />

      {/* Filtros */}
      <div className="flex flex-col gap-3 mb-4">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="busque por nome ou código..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                "rounded-sm border-2 px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-all",
                categoria === c
                  ? "border-wood-dark bg-grass/30 text-grass-dark shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                  : "border-wood-dark/40 bg-paper-soft text-ink-soft hover:bg-paper-deep hover:border-wood-dark"
              )}
            >
              {c === "todas" ? "Todas" : c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-soft mb-3">{filtered.length} itens encontrados</p>

      {/* Mobile: cards. Desktop: tabela */}
      <div className="md:hidden grid gap-2">
        {filtered.map((item) => (
          <button
            key={item.codigo}
            onClick={() => copyCode(item.codigo, item.nome)}
            className="wood-frame rounded-sm px-3 py-2.5 text-left flex items-center gap-2.5 active:translate-y-px [@media(hover:hover)]:hover:bg-paper-deep transition-colors"
            aria-label={`Copiar [${item.codigo}]`}
          >
            <ItemSprite imagem={item.imagem} alt={item.nome} categoria={item.categoria} size={40} />
            <code className="font-mono text-wood-dark font-bold text-sm shrink-0">[{item.codigo}]</code>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink truncate">{item.nome}</p>
              <div className="flex items-center gap-2 text-[10px] text-ink-soft">
                <Tag color={catColor[item.categoria] ?? "muted"} className="text-[10px]">{item.categoria}</Tag>
                {item.preco_venda != null && <span>{item.preco_venda}g</span>}
              </div>
            </div>
            <Copy size={14} className="text-ink-soft shrink-0" />
          </button>
        ))}
      </div>

      <div className="hidden md:block wood-frame rounded-sm overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-wood text-paper-soft">
            <tr>
              <th className="px-2 py-2 text-left font-display text-base tracking-wide w-12">Img</th>
              <th className="px-3 py-2 text-left font-display text-base tracking-wide">Código</th>
              <th className="px-3 py-2 text-left font-display text-base tracking-wide">String ID</th>
              <th className="px-3 py-2 text-left font-display text-base tracking-wide">Nome</th>
              <th className="px-3 py-2 text-left font-display text-base tracking-wide">Categoria</th>
              <th className="px-3 py-2 text-right font-display text-base tracking-wide">Preço</th>
              <th className="px-3 py-2 text-center font-display text-base tracking-wide">Copiar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wood-dark/20">
            {filtered.map((item, i) => (
              <tr key={item.codigo} className={cn("transition-colors [@media(hover:hover)]:hover:bg-paper-deep group", i % 2 === 0 ? "bg-paper-soft" : "bg-paper")}>
                <td className="px-2 py-1.5"><ItemSprite imagem={item.imagem} alt={item.nome} categoria={item.categoria} size={32} /></td>
                <td className="px-3 py-2"><code className="font-mono text-wood-dark font-bold">[{item.codigo}]</code></td>
                <td className="px-3 py-2"><code className="font-mono text-ink-soft text-xs">{item.string_id ?? "—"}</code></td>
                <td className="px-3 py-2 text-ink font-medium">{item.nome}</td>
                <td className="px-3 py-2"><Tag color={catColor[item.categoria] ?? "muted"} className="text-[10px]">{item.categoria}</Tag></td>
                <td className="px-3 py-2 text-right text-ink-soft font-mono">{item.preco_venda != null ? `${item.preco_venda}g` : "—"}</td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => copyCode(item.codigo, item.nome)}
                    className="inline-flex items-center gap-1 rounded-sm border-2 border-wood-dark/40 bg-paper px-2 py-1 text-xs font-semibold text-ink-soft hover:border-wood-dark hover:text-ink"
                    aria-label={`Copiar [${item.codigo}]`}
                  >
                    <Copy size={12} /> copiar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-ink-soft">Nenhum item encontrado.</p>
        )}
      </div>
    </div>
  );
}
