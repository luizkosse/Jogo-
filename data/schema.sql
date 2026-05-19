-- Habilitar extensão uuid
create extension if not exists "pgcrypto";

-- =====================
-- Tabela: npcs
-- =====================
create table if not exists npcs (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  nome                text not null,
  descricao           text,
  localizacao         text,
  aniversario         text,
  presentes_amados    text[] default '{}',
  presentes_odiados   text[] default '{}',
  romanceable         boolean default false,
  fonte_url           text,
  created_at          timestamptz default now()
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
  codigo          text not null,
  string_id       text,
  categoria       text not null,
  descricao       text,
  preco_venda     int,
  fonte_obtencao  text,
  fonte_url       text,
  created_at      timestamptz default now()
);
create index if not exists ids_categoria_idx on ids (categoria);
create index if not exists ids_codigo_idx on ids (codigo);

-- =====================
-- RLS
-- =====================
alter table npcs enable row level security;
alter table macetes enable row level security;
alter table bugs enable row level security;
alter table missoes enable row level security;
alter table ids enable row level security;

-- Leitura pública
create policy "public read npcs" on npcs for select using (true);
create policy "public read macetes" on macetes for select using (true);
create policy "public read bugs" on bugs for select using (true);
create policy "public read missoes" on missoes for select using (true);
create policy "public read ids" on ids for select using (true);
