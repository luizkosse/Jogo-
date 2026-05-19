-- Habilitar extensões
create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- =====================
-- Tabela: npcs
-- =====================
create table if not exists npcs (
  id                     uuid primary key default gen_random_uuid(),
  slug                   text unique not null,
  nome                   text not null,
  descricao              text,
  localizacao            text,
  aniversario            text,
  presentes_amados       text[] default '{}',
  presentes_apreciados   text[] default '{}',
  presentes_neutros      text[] default '{}',
  presentes_nao_gostam   text[] default '{}',
  presentes_odiados      text[] default '{}',
  romanceable            boolean default false,
  retrato                text,
  fonte_url              text,
  created_at             timestamptz default now()
);

-- =====================
-- Tabela: macetes
-- =====================
create table if not exists macetes (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  titulo        text not null,
  descricao     text not null,
  tutorial      text,
  categoria     text not null check (categoria in ('dinheiro','itens','energia','tempo','combate','fazenda')),
  tags          text[] default '{}',
  plataformas   text[] default '{}',
  versao_inicio text,
  versao_fim    text,
  funciona      boolean default true,
  fonte_url     text,
  popularidade  int default 0,
  created_at    timestamptz default now()
);
create index if not exists macetes_categoria_idx on macetes (categoria);
create index if not exists macetes_tags_idx on macetes using gin (tags);

-- =====================
-- Tabela: bugs
-- =====================
create table if not exists bugs (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  titulo        text not null,
  descricao     text not null,
  tutorial      text,
  versao        text not null,
  versao_fix    text,
  plataformas   text[] default '{}',
  status        text not null check (status in ('ativo','corrigido','parcial')),
  severidade    text default 'media' check (severidade in ('baixa','media','alta')),
  fonte_url     text,
  created_at    timestamptz default now()
);
create index if not exists bugs_status_versao_idx on bugs (status, versao);

-- =====================
-- Tabela: missoes
-- =====================
create table if not exists missoes (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  titulo            text not null,
  descricao         text not null,
  tipo              text not null check (tipo in ('story','help_wanted','special_order','mr_qi')),
  npc               text,
  npc_id            uuid references npcs(id),
  como_obter        text,
  localizacao       text,
  recompensa        text,
  requisitos        text,
  dificuldade       int check (dificuldade between 1 and 5) default 1,
  versao_adicionada text,
  fonte_url         text,
  created_at        timestamptz default now()
);

-- =====================
-- Tabela: ids
-- =====================
create table if not exists ids (
  id              uuid primary key default gen_random_uuid(),
  nome            text not null,
  codigo          text not null unique,
  string_id       text,
  categoria       text not null,
  descricao       text,
  preco_venda     int,
  fonte_obtencao  text,
  fonte_url       text,
  imagem          text,
  created_at      timestamptz default now()
);
create index if not exists ids_categoria_idx on ids (categoria);
create index if not exists ids_codigo_idx on ids (codigo);

-- =====================
-- Embeddings (pgvector) — 384 dim (compatível com all-MiniLM-L6-v2)
-- =====================
alter table macetes add column if not exists embedding vector(384);
alter table bugs    add column if not exists embedding vector(384);
alter table missoes add column if not exists embedding vector(384);

create index if not exists macetes_embedding_idx on macetes using ivfflat (embedding vector_cosine_ops) with (lists = 50);
create index if not exists bugs_embedding_idx    on bugs    using ivfflat (embedding vector_cosine_ops) with (lists = 50);
create index if not exists missoes_embedding_idx on missoes using ivfflat (embedding vector_cosine_ops) with (lists = 50);

-- Função de busca semântica unificada (retorna top-k de cada tipo)
create or replace function match_content(query_embedding vector(384), match_count int default 5)
returns table (
  type text,
  slug text,
  titulo text,
  descricao text,
  similarity float
)
language sql stable as $$
  (select 'macete' as type, m.slug, m.titulo, m.descricao,
          1 - (m.embedding <=> query_embedding) as similarity
   from macetes m where m.embedding is not null
   order by m.embedding <=> query_embedding asc limit match_count)
  union all
  (select 'bug' as type, b.slug, b.titulo, b.descricao,
          1 - (b.embedding <=> query_embedding) as similarity
   from bugs b where b.embedding is not null
   order by b.embedding <=> query_embedding asc limit match_count)
  union all
  (select 'missao' as type, ms.slug, ms.titulo, ms.descricao,
          1 - (ms.embedding <=> query_embedding) as similarity
   from missoes ms where ms.embedding is not null
   order by ms.embedding <=> query_embedding asc limit match_count);
$$;

-- =====================
-- Tabela: macete_votes (votação "ainda funciona?")
-- =====================
create table if not exists macete_votes (
  id           uuid primary key default gen_random_uuid(),
  macete_slug  text not null,
  vote         text not null check (vote in ('works','broken')),
  session_id   text not null,
  created_at   timestamptz default now(),
  unique (macete_slug, session_id)
);
create index if not exists macete_votes_slug_idx on macete_votes (macete_slug);

-- =====================
-- Tabela: chat_messages
-- =====================
create table if not exists chat_messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  role        text not null check (role in ('user','assistant')),
  content     text not null,
  results     jsonb,
  created_at  timestamptz default now()
);
create index if not exists chat_messages_session_idx on chat_messages (session_id, created_at);

-- =====================
-- RLS
-- =====================
alter table npcs enable row level security;
alter table macetes enable row level security;
alter table bugs enable row level security;
alter table missoes enable row level security;
alter table ids enable row level security;
alter table chat_messages enable row level security;
alter table macete_votes enable row level security;

-- Leitura pública
create policy "public read npcs" on npcs for select using (true);
create policy "public read macetes" on macetes for select using (true);
create policy "public read bugs" on bugs for select using (true);
create policy "public read missoes" on missoes for select using (true);
create policy "public read ids" on ids for select using (true);
-- chat_messages e macete_votes: acesso via API server-side com service role (bypassa RLS)
-- Para leitura agregada pública, criar policy específica abaixo
create policy "public read vote counts" on macete_votes for select using (true);
