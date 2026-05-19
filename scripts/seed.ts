/**
 * Script de seed para popular o Supabase com os dados verificados.
 * Execute com: pnpm seed
 * Requer SUPABASE_SERVICE_ROLE_KEY no .env.local
 */

import { config } from "dotenv";
import { resolve } from "path";

// Carrega .env.local primeiro (mais específico), depois .env como fallback
config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

import { createClient } from "@supabase/supabase-js";
import macetesData from "../data/seed/macetes.json";
import bugsData from "../data/seed/bugs.json";
import missoesData from "../data/seed/missoes.json";
import idsData from "../data/seed/ids.json";
import npcsData from "../data/seed/npcs.json";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  console.error("❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  console.log("🌱 Iniciando seed...\n");

  // NPCs primeiro (missões referenciam npcs.id)
  const { error: npcsErr } = await supabase
    .from("npcs")
    .upsert(npcsData, { onConflict: "slug" });
  if (npcsErr) console.error("❌ NPCs:", npcsErr.message);
  else console.log(`✅ ${npcsData.length} NPCs inseridos`);

  const { error: macErr } = await supabase
    .from("macetes")
    .upsert(macetesData, { onConflict: "slug" });
  if (macErr) console.error("❌ Macetes:", macErr.message);
  else console.log(`✅ ${macetesData.length} Macetes inseridos`);

  const { error: bugErr } = await supabase
    .from("bugs")
    .upsert(bugsData, { onConflict: "slug" });
  if (bugErr) console.error("❌ Bugs:", bugErr.message);
  else console.log(`✅ ${bugsData.length} Bugs inseridos`);

  const { error: misErr } = await supabase
    .from("missoes")
    .upsert(missoesData, { onConflict: "slug" });
  if (misErr) console.error("❌ Missões:", misErr.message);
  else console.log(`✅ ${missoesData.length} Missões inseridas`);

  const { error: idsErr } = await supabase
    .from("ids")
    .upsert(idsData, { onConflict: "codigo" });
  if (idsErr) console.error("❌ IDs:", idsErr.message);
  else console.log(`✅ ${idsData.length} IDs inseridos`);

  console.log("\n🎉 Seed concluído!");
}

seed();
