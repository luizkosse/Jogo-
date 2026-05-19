-- Onda 1 do sistema de personagens: expande gifts para 5 níveis + retrato local.
-- Rode no SQL Editor do Supabase ANTES de `pnpm seed`.

alter table public.npcs
  add column if not exists presentes_apreciados text[] default '{}',
  add column if not exists presentes_neutros    text[] default '{}',
  add column if not exists presentes_nao_gostam text[] default '{}',
  add column if not exists retrato              text;
