import "server-only";

/**
 * Rate limiter in-memory por chave (IP/sessão).
 * Funciona por instância serverless — Vercel pode ter múltiplas regiões/instâncias,
 * mas para baixa escala isso é suficiente. Para escala maior, migrar para
 * Upstash Redis ou Vercel Edge Config.
 */

interface Bucket { count: number; resetAt: number }
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Máximo de requisições na janela. */
  limit: number;
  /** Janela em ms. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetInMs: number;
}

export function checkRateLimit(key: string, opts: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { ok: true, remaining: opts.limit - 1, resetInMs: opts.windowMs };
  }

  if (existing.count >= opts.limit) {
    return { ok: false, remaining: 0, resetInMs: existing.resetAt - now };
  }

  existing.count += 1;
  return { ok: true, remaining: opts.limit - existing.count, resetInMs: existing.resetAt - now };
}

/** GC simples — limpa buckets expirados a cada 10 min, no max 1000 entries. */
let lastGC = 0;
export function gcBuckets() {
  const now = Date.now();
  if (now - lastGC < 10 * 60 * 1000 && buckets.size < 1000) return;
  lastGC = now;
  for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
}

export function getClientKey(req: Request): string {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? req.headers.get("x-real-ip")
    ?? "anon";
  return ip;
}
