"use client";

import { useState, useMemo } from "react";
import { Hash, Copy, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Tag } from "@/components/ui/Tag";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import idsData from "@/data/seed/ids.json";

const CATEGORIES = [
  "todas",
  "gema",
  "mineral",
  "forrageiro",
  "vegetal",
  "fruta",
  "recurso",
  "barra",
  "artisan",
  "peixe",
  "artefato",
  "semente",
  "especial",
  "slime-egg",
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
  artefato: "muted",
  semente: "grass",
  especial: "danger",
  "slime-egg": "muted",
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Hash size={24} className="text-accent-grass" />
          <h1 className="font-display text-4xl text-text-parchment">IDs DE ITENS</h1>
        </div>
        <p className="text-text-muted">
          Códigos para usar no exploit de nome do personagem. Clique para copiar.
        </p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 mb-6">
        <Input
          leftIcon={<Search size={14} />}
          placeholder="Buscar por nome ou código..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs capitalize transition-colors",
                categoria === c
                  ? "border-accent-grass bg-accent-grass/15 text-accent-grass"
                  : "border-white/10 text-text-muted hover:border-white/30 hover:text-text-parchment"
              )}
            >
              {c === "todas" ? "Todas" : c}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-text-dim mb-4">{filtered.length} itens encontrados</p>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-bg-deep border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left text-text-muted font-medium">Código</th>
              <th className="px-4 py-3 text-left text-text-muted font-medium">String ID</th>
              <th className="px-4 py-3 text-left text-text-muted font-medium">Nome</th>
              <th className="px-4 py-3 text-left text-text-muted font-medium">Categoria</th>
              <th className="px-4 py-3 text-right text-text-muted font-medium">Preço</th>
              <th className="px-4 py-3 text-center text-text-muted font-medium">Copiar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((item) => (
              <tr
                key={item.codigo}
                className="hover:bg-white/3 transition-colors group"
              >
                <td className="px-4 py-3">
                  <code className="font-mono text-accent-gold">[{item.codigo}]</code>
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-text-dim text-xs">
                    {item.string_id ?? "—"}
                  </code>
                </td>
                <td className="px-4 py-3 text-text-parchment font-medium">{item.nome}</td>
                <td className="px-4 py-3">
                  <Tag color={catColor[item.categoria] ?? "muted"} className="text-xs">
                    {item.categoria}
                  </Tag>
                </td>
                <td className="px-4 py-3 text-right text-text-muted">
                  {item.preco_venda != null ? `${item.preco_venda}g` : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => copyCode(item.codigo, item.nome)}
                    className="rounded p-1.5 text-text-muted hover:bg-white/10 hover:text-accent-gold transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Copiar [${item.codigo}]`}
                  >
                    <Copy size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="py-12 text-center text-text-muted">Nenhum item encontrado.</p>
        )}
      </div>
    </div>
  );
}
