/**
 * Gera embeddings para macetes, bugs e missoes e salva no Supabase.
 * Execute com: pnpm tsx scripts/embed.ts
 * Requer SUPABASE_SERVICE_ROLE_KEY em .env.local. Opcional: HF_API_TOKEN.
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { createClient } from "@supabase/supabase-js";
import { embed } from "../lib/ai/embeddings";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
if (!url || !key) { console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const supabase = createClient(url, key);

async function embedTable(name: string, textBuilder: (row: Record<string, unknown>) => string) {
  console.log(`\n🌱 Tabela ${name}...`);
  const { data, error } = await supabase.from(name).select("id, slug, titulo, descricao, tutorial").is("embedding", null);
  if (error) { console.error(`  ❌ ${error.message}`); return; }
  if (!data?.length) { console.log(`  ✅ Nada para embedar (todos já têm embedding)`); return; }

  for (const row of data as Record<string, unknown>[]) {
    const text = textBuilder(row);
    try {
      const v = await embed(text);
      const { error: upErr } = await supabase.from(name).update({ embedding: v }).eq("id", row.id);
      if (upErr) console.error(`  ❌ ${row.slug}: ${upErr.message}`);
      else console.log(`  ✅ ${row.slug}`);
    } catch (e) {
      console.error(`  ❌ ${row.slug}: ${e instanceof Error ? e.message : "erro"}`);
    }
  }
}

(async () => {
  await embedTable("macetes", (r) => `${r.titulo}. ${r.descricao}. ${r.tutorial ?? ""}`);
  await embedTable("bugs", (r) => `${r.titulo}. ${r.descricao}. ${r.tutorial ?? ""}`);
  await embedTable("missoes", (r) => `${r.titulo}. ${r.descricao}`);
  console.log("\n🎉 Embeddings concluídos!");
})();
