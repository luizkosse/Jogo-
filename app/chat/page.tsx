"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, Send, Trash2, Zap, Bug, Map, Hash } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createSearch, SearchResult } from "@/lib/search";
import type { Macete, Bug as BugType, Missao, ItemId } from "@/types/db";
import macetesData from "@/data/seed/macetes.json";
import bugsData from "@/data/seed/bugs.json";
import missoesData from "@/data/seed/missoes.json";
import idsData from "@/data/seed/ids.json";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  results?: SearchResult[];
}

const CHAT_KEY = "sds:chat";

const SUGGESTIONS = [
  "Como fazer dinheiro rápido?",
  "Onde achar Prismatic Shard?",
  "Missão do machado da Robin",
  "Bugs ativos na 1.6",
  "ID do Ancient Fruit",
  "Como chegar na Skull Cavern?",
];

const search = createSearch({
  macetes: macetesData as Macete[],
  bugs: bugsData as BugType[],
  missoes: missoesData as Missao[],
  ids: idsData as ItemId[],
});

const typeIcon: Record<string, React.ReactNode> = {
  macete: <Zap size={12} className="text-accent-gold" />,
  bug: <Bug size={12} className="text-accent-danger" />,
  missao: <Map size={12} className="text-accent-water" />,
  id: <Hash size={12} className="text-accent-grass" />,
};

const typeHref = (r: SearchResult): string => {
  switch (r.type) {
    case "macete": return `/macetes/${r.item.slug}`;
    case "bug": return `/bugs#${r.item.slug}`;
    case "missao": return `/missoes#${r.item.slug}`;
    case "id": return `/ids?q=${encodeURIComponent((r.item as ItemId).nome)}`;
  }
};

const typeTitle = (r: SearchResult): string => {
  if (r.type === "id") return (r.item as ItemId).nome;
  return (r.item as { titulo: string }).titulo;
};

function loadHistory(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CHAT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function buildResponse(query: string, results: SearchResult[]): string {
  if (results.length === 0) {
    return `Hmm, não encontrei nada sobre "${query}". Tente buscar por termos como "dinheiro", "machado", "bug", ou um ID de item.`;
  }
  const tipos = [...new Set(results.map((r) => r.type))];
  const parts: string[] = [`Encontrei ${results.length} resultado(s) para "${query}":`];
  if (tipos.includes("macete")) parts.push("• Macetes/exploits relacionados");
  if (tipos.includes("missao")) parts.push("• Missões correspondentes");
  if (tipos.includes("bug")) parts.push("• Bugs relevantes");
  if (tipos.includes("id")) parts.push("• IDs de itens");
  parts.push("\nClique em um resultado abaixo para ver os detalhes completos.");
  return parts.join("\n");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-50)));
  }, [messages]);

  const handleSend = useCallback(
    (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: Message = { id: Date.now(), role: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setLoading(true);

      setTimeout(() => {
        const results = search(text);
        const reply: Message = {
          id: Date.now() + 1,
          role: "assistant",
          text: buildResponse(text, results),
          results,
        };
        setMessages((prev) => [...prev, reply]);
        setLoading(false);
      }, 400);
    },
    [loading]
  );

  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_KEY);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100dvh-8rem)]">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex md:w-72 flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle size={20} className="text-accent-gold" />
            <h1 className="font-display text-2xl text-text-parchment">ASSISTENTE</h1>
          </div>
          <p className="text-sm text-text-muted">
            Pergunte sobre macetes, missões, bugs ou IDs de itens. Usa busca inteligente no banco de dados.
          </p>

          <div>
            <p className="text-xs text-text-dim uppercase mb-2">Sugestões</p>
            <div className="flex flex-col gap-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left rounded-lg px-3 py-2 text-sm text-text-muted hover:bg-bg-twilight hover:text-text-parchment transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="mt-auto flex items-center gap-1.5 text-xs text-text-dim hover:text-accent-danger transition-colors"
            >
              <Trash2 size={12} /> Limpar histórico
            </button>
          )}
        </aside>

        {/* Chat area */}
        <div className="flex flex-1 flex-col bg-bg-twilight rounded-xl border border-white/10 overflow-hidden">
          {/* Header mobile */}
          <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <MessageCircle size={18} className="text-accent-gold" />
            <span className="font-display text-xl text-text-parchment">ASSISTENTE</span>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="ml-auto text-text-dim hover:text-accent-danger"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <MessageCircle size={40} className="text-text-dim" />
                <p className="text-text-muted">Faça uma pergunta sobre Stardew Valley!</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-sm md:hidden">
                  {SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-text-muted hover:border-accent-gold/30 hover:text-accent-gold transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-accent-gold/20 text-text-parchment"
                      : "bg-bg-deep text-text-parchment"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{msg.text}</p>

                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      {msg.results.slice(0, 6).map((r, i) => (
                        <a
                          key={i}
                          href={typeHref(r)}
                          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10 transition-colors"
                        >
                          {typeIcon[r.type]}
                          <span className="flex-1 truncate text-text-parchment">
                            {typeTitle(r)}
                          </span>
                          <span className="text-text-dim capitalize">{r.type}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-bg-deep rounded-xl px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 px-4 py-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pergunte algo sobre Stardew Valley..."
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || loading} size="md">
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
