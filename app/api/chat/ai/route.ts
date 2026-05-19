import { NextRequest, NextResponse } from "next/server";
import { retrieveContext } from "@/lib/ai/retrieve";
import { streamGroqChat, type ChatTurn } from "@/lib/ai/groq";
import { checkRateLimit, gcBuckets, getClientKey } from "@/lib/rate-limit";

const SYSTEM_PROMPT = `Você é o Stardew Supremo — assistente especialista em Stardew Valley 1.6+ que responde em português brasileiro.

SUA MISSÃO: DAR RESPOSTAS COMPLETAS E ÚTEIS direto na conversa. O jogador não quer ser redirecionado para outras páginas — quer SOLUÇÃO AQUI.

COMO RESPONDER:
1. SINTETIZE o contexto em uma resposta acionável. Se há 3 macetes de dinheiro no contexto, EXPLIQUE OS TRÊS com passos práticos, valores e quanto rendem.
2. SEMPRE inclua: valores numéricos (preços em g, tempo em dias), pré-requisitos, melhores estações, IDs entre colchetes [N].
3. USE LISTAS NUMERADAS para tutoriais e passos. Use marcadores (•) para opções alternativas.
4. CITE títulos exatos entre aspas para que o jogador possa clicar no card resultado abaixo, MAS não pare aí — explique também o que tem dentro.
5. CRUZE informações: se o jogador pergunta de um NPC, junte aniversário + presentes + eventos de coração + casamento (se romanceável). Se pergunta de um item, mencione qual NPC ama, em qual bundle entra, qual macete usa.
6. BUGS: se algo no contexto está marcado como bug ativo, AVISE antes de recomendar.

RIGOROSO:
- NUNCA invente macetes, IDs, NPCs, versões ou valores. Use APENAS dados do <contexto>.
- Se a pergunta não tem contexto suficiente, faça o melhor com o que existe — mas NÃO mande o usuário "buscar em /macetes". Diga o que você sabe e o que falta no banco.
- Tom: direto, prático, sem rodeios. "Você" em vez de "tu". Sem "talvez", "provavelmente", "pode ser que".

TAMANHO: Resposta robusta. 8-15 linhas é normal para perguntas práticas. Tutoriais detalhados podem ser maiores. Não corte por brevidade.`;

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

  const { results, contextText, mode } = await retrieveContext(body.message, 10);
  console.log(`[chat/ai] retrieval mode=${mode}, results=${results.length}, contextLen=${contextText.length}`);

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
