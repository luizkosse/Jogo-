"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, Send, Trash2, Zap, Bug, Map, Hash, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { SearchResult } from "@/lib/search";
import type { ItemId } from "@/types/db";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  results?: SearchResult[];
  streaming?: boolean;
}

// Site público sem login — chat é efêmero, mensagens vivem apenas na sessão React.

const SUGGESTIONS = [
  "Como fazer dinheiro rápido?",
  "Onde achar Prismatic Shard?",
  "Missão do machado da Robin",
  "Bugs ativos na 1.6",
  "ID do Ancient Fruit",
  "Como chegar na Skull Cavern?",
];

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
    case "missao": return `/missoes/${r.item.slug}`;
    case "id": return `/ids?q=${encodeURIComponent((r.item as ItemId).nome)}`;
  }
};

const typeTitle = (r: SearchResult): string => {
  if (r.type === "id") return (r.item as ItemId).nome;
  return (r.item as { titulo: string }).titulo;
};

async function streamAIChat(
  message: string,
  history: { role: "user" | "assistant"; content: string }[],
  onResults: (r: SearchResult[]) => void,
  onChunk: (text: string) => void,
  onError: (err: string) => void,
) {
  const res = await fetch("/api/chat/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok || !res.body) {
    const errJson = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    onError(errJson.error ?? "Erro ao conectar com a IA");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const evt = JSON.parse(line) as { type: string; data: unknown };
        if (evt.type === "results") onResults(evt.data as SearchResult[]);
        else if (evt.type === "text") onChunk(evt.data as string);
        else if (evt.type === "error") onError(evt.data as string);
      } catch {
        // chunk parcial — ignora
      }
    }
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;
      const userMsg: Message = { id: Date.now(), role: "user", text };
      const replyId = Date.now() + 1;
      const reply: Message = { id: replyId, role: "assistant", text: "", streaming: true };
      setMessages((prev) => [...prev, userMsg, reply]);
      setInput("");
      setLoading(true);

      // Histórico (sem a mensagem em streaming) — usado como contexto na IA
      const historyForAI = messages
        .filter((m) => !m.streaming)
        .slice(-6)
        .map((m) => ({ role: m.role, content: m.text }));

      let accText = "";

      await streamAIChat(
        text,
        historyForAI,
        (results) => {
          setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, results } : m)));
        },
        (chunk) => {
          accText += chunk;
          setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, text: accText } : m)));
        },
        (errMsg) => {
          accText = accText || `⚠️ Não consegui falar com a IA: ${errMsg}. Mas separei resultados relevantes abaixo.`;
          setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, text: accText } : m)));
        },
      );

      setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, streaming: false } : m)));
      setLoading(false);
    },
    [loading, messages]
  );

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 md:h-[calc(100dvh-8rem)]">
        {/* Sidebar desktop */}
        <aside className="hidden md:flex md:w-72 flex-col gap-3 shrink-0">
          <div>
            <span className="pixel-header">Assistente</span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-sm border-2 border-water/40 bg-water/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-water">
              <Sparkles size={10} /> IA
            </span>
          </div>
          <p className="text-sm text-ink-soft">
            Pergunte sobre macetes, missões, bugs ou IDs. Respostas geradas com base na wiki verificada.
          </p>

          <div className="wood-frame rounded-sm p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-ink-soft mb-2">Sugestões</p>
            <div className="flex flex-col gap-1">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left rounded-sm border-2 border-transparent px-2.5 py-1.5 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink hover:border-wood-dark/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {messages.length > 0 && (
            <button
              onClick={clearHistory}
              className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-berry transition-colors"
            >
              <Trash2 size={12} /> Limpar histórico
            </button>
          )}
        </aside>

        {/* Chat area */}
        <div className="flex flex-1 flex-col wood-frame rounded-sm overflow-hidden min-h-[calc(100dvh-12rem)] md:min-h-0">
          {/* Header mobile */}
          <div className="md:hidden flex items-center gap-2 px-3 py-2 bg-paper-deep border-b-2 border-wood-dark">
            <span className="pixel-header text-base">Assistente</span>
            <span className="inline-flex items-center gap-1 rounded-sm border-2 border-water/40 bg-water/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-water">
              <Sparkles size={9} /> IA
            </span>
            {messages.length > 0 && (
              <button
                onClick={clearHistory}
                className="ml-auto text-ink-soft hover:text-berry"
                aria-label="Limpar"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-3 bg-paper-soft">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
                <MessageCircle size={36} className="text-wood" />
                <p className="text-ink-soft">Faça uma pergunta sobre Stardew Valley.</p>
                <div className="flex flex-wrap justify-center gap-2 max-w-sm md:hidden">
                  {SUGGESTIONS.slice(0, 3).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="rounded-sm border-2 border-wood-dark/40 bg-paper px-2.5 py-1 text-xs font-semibold text-ink-soft hover:border-wood-dark hover:text-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[88%] rounded-sm border-2 px-3 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-gold border-wood-dark text-ink-shadow shadow-[inset_0_0_0_2px_var(--color-gold-soft)]"
                      : "bg-paper border-wood-dark text-ink shadow-[inset_0_0_0_2px_var(--color-wood-light)]"
                  }`}
                >
                  {msg.role === "assistant" && msg.streaming && !msg.text ? (
                    <div className="flex gap-1 py-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-sm bg-wood-dark animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="whitespace-pre-line leading-relaxed break-words [overflow-wrap:anywhere]">
                      {msg.text}
                      {msg.streaming && <span className="inline-block w-1.5 h-3.5 bg-wood-dark/70 ml-0.5 align-middle animate-pulse" />}
                    </p>
                  )}

                  {msg.results && msg.results.length > 0 && (
                    <div className="mt-2.5 space-y-1.5">
                      {msg.results.slice(0, 6).map((r) => (
                        <a
                          key={`${r.type}-${r.type === "id" ? r.item.codigo : r.item.slug}`}
                          href={typeHref(r)}
                          className="flex items-center gap-2 rounded-sm border-2 border-wood-dark/40 bg-paper-soft px-2 py-1.5 text-xs hover:border-wood-dark hover:bg-paper-deep transition-colors"
                        >
                          {typeIcon[r.type]}
                          <span className="flex-1 truncate font-semibold text-ink">{typeTitle(r)}</span>
                          <span className="text-ink-soft uppercase font-bold text-[10px]">{r.type}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t-2 border-wood-dark bg-paper-deep px-3 py-2.5">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="conte um sonho, peça um truque..."
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
