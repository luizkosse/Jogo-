import "server-only";
/**
 * Gera embeddings via Hugging Face Inference API.
 * Modelo: sentence-transformers/all-MiniLM-L6-v2 (384 dim, multilingual-ish).
 *
 * Token opcional: HF_API_TOKEN (acesso anônimo tem rate limit baixo).
 * Para produção, considere OpenAI text-embedding-3-small (1536 dim, melhor qualidade)
 * — ajustar dimensão das colunas no schema antes.
 */

const HF_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2";

export async function embed(text: string): Promise<number[]> {
  const token = process.env.HF_API_TOKEN;
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ inputs: text, options: { wait_for_model: true } }),
  });

  if (!res.ok) throw new Error(`HF embedding ${res.status}: ${await res.text().catch(() => "")}`.slice(0, 200));

  const data = (await res.json()) as number[] | number[][];
  // O endpoint às vezes retorna [[...]] (batch), às vezes [...] direto
  return Array.isArray(data[0]) ? (data[0] as number[]) : (data as number[]);
}

export async function embedBatch(texts: string[]): Promise<number[][]> {
  // Serializado para respeitar rate limit do HF free tier
  const out: number[][] = [];
  for (const t of texts) {
    out.push(await embed(t));
    await new Promise((r) => setTimeout(r, 100));
  }
  return out;
}
