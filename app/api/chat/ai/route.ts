import { NextRequest, NextResponse } from "next/server";
import { retrieveContext } from "@/lib/ai/retrieve";
import { streamGroqChat, type ChatTurn } from "@/lib/ai/groq";
import { checkRateLimit, gcBuckets, getClientKey } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Você é o Stardew Supremo — um assistente especialista em Stardew Valley 1.6+ que responde em português brasileiro.

REGRAS:
- Use APENAS o contexto fornecido entre <contexto>...</contexto> para responder. Se não houver contexto relevante, diga honestamente que não tem certeza e sugira uma busca em /macetes, /bugs, /missoes ou /ids.
- Seja direto, curto e prático. Máximo 4-6 linhas, exceto se o usuário pedir tutorial detalhado.
- Quando citar um macete, bug ou missão, mencione o título exato entre aspas para que o usuário possa clicar no card abaixo.
- IDs de itens sempre entre colchetes: [16], [422], etc.
- Se o jogador perguntar sobre algo que tem bug conhecido na versão atual, AVISE.
- Nunca invente macetes, IDs ou versões. Se não estiver no contexto, não invente.
- Tom: amigável, direto ao ponto, sem rodeios. Use "você" em vez de "tu".`;

export const runtime = "nodejs";

interface Body {
  message: string;
  history?: ChatTurn[];
}

export async function POST(req: NextRequest) {
  // Rate limit: 15 req/min por IP
  gcBuckets();
  const rl = checkRateLimit(getClientKey(req), { limit: 15, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Muitas requisições. Tente novamente em ${Math.ceil(rl.resetInMs / 1000)}s.` },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.resetInMs / 1000)) } },
    );
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  if (!body?.message?.trim()) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }

  const { results, contextText, mode } = await retrieveContext(body.message, 6);
  console.log(`[chat/ai] retrieval mode=${mode}, results=${results.length}`);

  const messages: ChatTurn[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(body.history ?? []).slice(-6),
    {
      role: "user",
      content: contextText
        ? `<contexto>\n${contextText}\n</contexto>\n\nPergunta: ${body.message}`
        : `Pergunta: ${body.message}\n\n(Nenhum resultado relevante na base de dados — responda com cautela ou sugira buscar manualmente.)`,
    },
  ];

  const encoder = new TextEncoder();

  try {
    const aiStream = await streamGroqChat(messages);

    const composedStream = new ReadableStream<Uint8Array>({
      async start(controller) {
        // Linha 1: NDJSON com os resultados
        controller.enqueue(encoder.encode(JSON.stringify({ type: "results", data: results }) + "\n"));
        const reader = aiStream.getReader();
        const decoder = new TextDecoder();
        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            if (text) controller.enqueue(encoder.encode(JSON.stringify({ type: "text", data: text }) + "\n"));
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : "stream error";
          controller.enqueue(encoder.encode(JSON.stringify({ type: "error", data: msg }) + "\n"));
        }
        controller.close();
      },
    });

    return new Response(composedStream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json({ error: msg, results }, { status: 500 });
  }
}
