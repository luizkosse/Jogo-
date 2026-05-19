-- Adiciona constraint UNIQUE em ids.codigo para suportar upsert via seed.
-- Rode esta query no SQL Editor do Supabase ANTES de rodar `pnpm seed`.

alter table public.ids
  add constraint ids_codigo_unique unique (codigo);
