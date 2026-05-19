-- Adiciona coluna `imagem` na tabela ids para mapear o nome do sprite PNG.
-- Rode no SQL Editor do Supabase, depois rode `pnpm seed` para atualizar.

alter table public.ids
  add column if not exists imagem text;
