# Spec Kit: NPCs e Sistema de Presentes

**Criado em:** 2026-05-19
**Status:** approved
**Escopo:** `app/personagens/`, `components/features/`, `data/seed/`, `data/schema.sql`, `public/sprites/npcs/`, `scripts/`, `components/layout/Navbar.tsx`

---

## Context

O Stardew Supremo já cobre macetes, bugs, missões e IDs, mas a feature mais consultada do jogo — **descobrir o que cada NPC ama ganhar** — não tem UI dedicada. A tabela `npcs` no Supabase já está populada com 21 NPCs com dados básicos (nome, aniversário, 2 amados + 2 odiados), mas: (a) faltam 17 NPCs canônicos (Lewis, Demetrius, Caroline, Jodi, Kent, etc.); (b) cada NPC tem apenas 2 presentes por nível em vez dos 5+ canônicos; (c) faltam os níveis intermediários "apreciados" / "neutros" / "não gostam" que valem +45 / +20 / -20 de amizade; (d) nada disso é exibido na app — os dados estão dormentes.

A fonte oficial **pt.stardewvalleywiki.com/Lista_de_Todos_os_Presentes** centraliza tudo: retratos 80×80 dos 34 NPCs + tabela de 5 níveis de presentes com ícones 24×24 já em pt-BR. Permite scraping único para gerar todo o seed sem trabalho manual.

A entrega vai dar ao usuário: lista visual de personagens (retrato + nome + aniversário + status romanceável), detalhe com **5 listas de presentes** (amados, apreciados, neutros, não gostam, odiados) com sprite de cada item, página dedicada de **Presentes Universais** (regras gerais que aplicam a todos), e a base para a Onda 2 (heart events, schedule, casamento, tracker de amizade).

---

## 1. Visão e Motivação

**Problema**: jogador novo perde 30-60 minutos por NPC tentando descobrir o que ele gosta de ganhar. Wiki é em inglês, esparso, multipage. App atual não ajuda.

**Resultado ideal**: em 1 clique no nome do NPC (vindo de uma missão, do mapa, ou da nova página de Personagens), o jogador vê os 5+ presentes amados com sprites, o aniversário e onde encontra o personagem.

---

## 2. Usuários e Stakeholders

| Persona | Descrição | Necessidades principais |
|---|---|---|
| Jogador iniciante | Acabou de chegar em Pelican Town, quer escolher quem casar | Lista visual com retratos + corações iniciais sugeridos |
| Jogador veterano | Já no ano 2+, quer otimizar amizade | Consulta rápida "o que dar pro Sebastian?" — vai direto no detalhe |
| Speedrunner Community Center | Precisa terminar bundles + ganhar amizade pra liberar NPCs específicos | Lista de presentes universais para reciclar drops |

---

## 3. Capacidades Desejadas

- **CAP-01**: Listar todos os 34 NPCs canônicos com retrato, nome, aniversário e status romanceável.
- **CAP-02**: Filtrar por: romanceáveis / não-romanceáveis / aniversário no mês X / localização.
- **CAP-03**: Página de detalhe `/personagens/[slug]` com 5 listas de presentes (amados, apreciados, neutros, não gostam, odiados), cada item exibido com sprite + nome em pt-BR.
- **CAP-04**: Página `/personagens/presentes-universais` com as regras gerais (Universal Loves/Likes/Neutrals/Dislikes/Hates) e exceções por NPC.
- **CAP-05**: Cada NPC linkado a partir de quests (`/missoes/[slug]`) e do mapa StardewMap.
- **CAP-06**: Link "Comer/Cozinhar?" indicando se item presente é cooked dish (visualizar receita futura).
- **CAP-07**: Item clicável dentro da lista de presente vai para `/ids?q=<nome>` (ou futuro detalhe de item).
- **CAP-08**: Onda 2 — tracker de corações localStorage por NPC.

---

## 4. Fora do Escopo

- ❌ Heart events (cutscenes com texto/personagens) — Onda 2
- ❌ Schedules semanais detalhados (onde NPC está cada dia/hora) — Onda 2
- ❌ Diálogos por estação/clima — não pretendido
- ❌ Marriage benefits / spouse gifts — Onda 2
- ❌ NPCs especiais sem dados de presente (Mr. Qi, Birdie, Junimos) — apenas listagem básica, sem aba de presentes
- ❌ Sincronização do tracker com save real do jogo — apenas localStorage

---

## 5. Cenários e Edge Cases

| # | Cenário | Comportamento esperado | Prioridade |
|---|---|---|---|
| 1 | Usuário clica em "Sebastian" na lista | Abre `/personagens/sebastian` com 5 listas de presentes | Alta |
| 2 | NPC sem retrato disponível (fallback) | Mostra emoji 👤 + inicial do nome no avatar | Média |
| 3 | Presente que NPC ama é também Universal Loved | Indicador "🌟 Universal" no card do item | Média |
| 4 | NPC tem exceção a Universal (ex: Sebastian ODEIA Cheese mesmo sendo Universal Loved) | Card destacado em vermelho com badge "Exceção" | Média |
| 5 | Mobile 390px — 5 listas longas | Accordion colapsável por nível (amados aberto por padrão) | Alta |
| 6 | Item de presente é sprite que já temos em `/sprites/items/` | Reusa o sprite local; senão usa fallback emoji por categoria | Alta |
| 7 | Aniversário hoje (data atual = aniversário do NPC) | Badge dourada "🎂 Aniversário hoje" no card da lista | Baixa |
| 8 | Universal gift que é ODIADO por todos (ex: Hated universal) | Mostrar warning vermelho na lista universal | Média |

---

## 6. Critérios de Aceite

- [ ] AC-01: `/personagens` lista 34 NPCs com retrato, nome, aniversário, ícone romanceable.
- [ ] AC-02: `/personagens/[slug]` exibe 5 listas de presentes com sprite de cada item.
- [ ] AC-03: `/personagens/presentes-universais` lista 5 níveis universais + exceções.
- [ ] AC-04: Link "Personagens" aparece na Navbar (entre Missões e IDs).
- [ ] AC-05: Build estático gera 34 páginas de detalhe (`generateStaticParams`).
- [ ] AC-06: Sprites NPC carregam de `/sprites/npcs/<slug>.png` com `image-rendering: pixelated`.
- [ ] AC-07: GlobalSearch (⌘K) indexa nomes de NPCs e leva ao detalhe.
- [ ] AC-08: iPhone 13 (390×844): cards stack em 1 coluna; tabela de presentes em accordion.
- [ ] AC-09: Build limpo (`pnpm build`).
- [ ] AC-10: `pnpm seed` popula 34 NPCs com 5 níveis no Supabase.

---

## 7. Requisitos Não-Funcionais

- **Performance**: lista de 34 cards renderiza em < 100ms (SSR estático). Detalhe abre em < 200ms.
- **Acessibilidade**: WCAG AA. `aria-current` nos filtros ativos. Retratos com `alt={nome}`.
- **Mobile-first**: viewport 390×844 como baseline.
- **Cache**: sprites NPC servidos com `Cache-Control: public, max-age=31536000, immutable` (hash de build do Next.js já garante).
- **Coverage**: cobrir 34 NPCs com dados completos. Os 17 NPCs já existentes ganham os 3 níveis novos.

---

## 8. Análise Técnica

### 8.1 Mapa de Impacto

| Módulo | Caminho | Tipo de Mudança |
|---|---|---|
| Tipos | `types/db.ts` | Editar — adicionar `presentes_apreciados`, `presentes_neutros`, `presentes_nao_gostam`, `retrato` no tipo `Npc` |
| Schema | `data/schema.sql` | Editar — adicionar 4 colunas em `npcs` |
| Migration | `data/migrations/003_npcs_gifts_full.sql` | Criar — alter table com `add column if not exists` |
| Seed | `data/seed/npcs.json` | Editar — expandir 21 → 34 NPCs com 5 níveis |
| Seed | `data/seed/universal-gifts.json` | Criar — Universal Loves/Likes/Neutrals/Dislikes/Hates + exceções |
| Sprites | `public/sprites/npcs/*.png` | Criar — 34 retratos 80×80 |
| Script | `scripts/expand-npcs.py` | Criar — scrape do wiki pt-BR + atualiza seed |
| Script | `scripts/fetch-npc-portraits.py` | Criar — baixa retratos para `public/sprites/npcs/` |
| Página | `app/personagens/page.tsx` | Criar — lista com filtros |
| Página | `app/personagens/[slug]/page.tsx` | Criar — detalhe com 5 listas |
| Página | `app/personagens/presentes-universais/page.tsx` | Criar — regras universais |
| UI states | `app/personagens/loading.tsx`, `error.tsx`, `[slug]/loading.tsx`, `[slug]/error.tsx` | Criar |
| Component | `components/features/NpcCard.tsx` | Criar — card com retrato + nome + aniv |
| Component | `components/features/NpcPortrait.tsx` | Criar — wrapper de img com fallback |
| Component | `components/features/GiftList.tsx` | Criar — renderiza nível com ItemSprite + nome em chip |
| Layout | `components/layout/Navbar.tsx` | Editar — adicionar link "Personagens" |
| Layout | `components/layout/Footer.tsx` | Editar — adicionar link |

**Total: ~17 arquivos** (limite do skill: dividir em ondas se > 15 — vamos dividir).

### 8.2 Padrões Reutilizáveis

- `ItemSprite` em [`components/features/ItemSprite.tsx`](stardew-supremo/components/features/ItemSprite.tsx) — já tem fallback emoji por categoria. Usar para cada item dentro de `GiftList`.
- Pattern de detalhe estático com `generateStaticParams` em [`app/missoes/[slug]/page.tsx`](stardew-supremo/app/missoes/[slug]/page.tsx) — replicar mesma estrutura.
- Wood-frame cozy + pixel-header dos componentes UI atuais.
- Padrão de tabela mobile→desktop em [`app/ids/page.tsx`](stardew-supremo/app/ids/page.tsx).
- Sistema de scrape Python em [`scripts/expand-ids.py`](stardew-supremo/scripts/expand-ids.py) e [`scripts/fetch-sprites.py`](stardew-supremo/scripts/fetch-sprites.py) — replicar.

### 8.3 Riscos e Complexidades

| # | Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|---|
| 1 | HTML do wiki pt-BR muda estrutura | Baixa | Alto (quebra scraper) | Script idempotente; fallback para wiki en se pt fail; warning explícito no script |
| 2 | Nomes de itens em pt-BR diferem dos atuais em `ids.json` (inglês) | Alta | Médio | Mapear via `string_id` ou ID numérico no scrape; salvar nome em pt no JSON |
| 3 | Wiki pt-BR retorna 403 para WebFetch mas funciona com curl + UA | Alta | Baixo | Script usa `urllib` com User-Agent customizado (já validado) |
| 4 | Sprite de item presente não está em `/sprites/items/` (URLs do wiki vs eduanttunes) | Média | Baixo | Fallback do `ItemSprite` (emoji por categoria) cobre |
| 5 | NPC sem retrato (Junimos, Mr. Qi às vezes) | Média | Baixo | Fallback no `NpcPortrait` (emoji 👤 + inicial) |
| 6 | Universal gifts têm 100+ itens — UI fica longa | Alta | Médio | Página separada com accordion por nível |
| 7 | Itens novos da 1.6+ podem não ter sprite | Baixa | Baixo | Fallback emoji já cobre |

### 8.4 Alternativas Consideradas

| # | Alternativa | Prós | Contras | Recomendação |
|---|---|---|---|---|
| A | Hardcoded manual no JSON | Sem dependência externa | 1700+ linhas de JSON manual; alto risco de erro | ❌ Rejeitada |
| B | Scrape do wiki pt-BR em build (server-side) | Sempre atualizado | Build mais lento; falha de rede quebra build | ❌ Rejeitada |
| C | Scrape único em script Python → JSON versionado | Idempotente, offline-friendly, controlável | Atualizações exigem rerodar script manualmente | ✅ **Escolhida** |
| D | API externa em runtime | Sempre fresh | Latência + dependência de terceiro | ❌ Rejeitada |

---

## 9. Restrições e Dependências

- **Stack atual**: Next.js 16, React 19, Tailwind v4, Supabase, JSON seed → manter.
- **Dados existentes**: 21 NPCs em `npcs.json` — preservar IDs e slugs, **mesclar** novos níveis.
- **Sprites**: pixel-art 16×16 (items) / 80×80 (NPCs). Manter consistência visual.
- **Mobile-first**: viewport 390px.
- **Sem novas deps NPM**: usar `<img>` (não `next/image`) para sprites — Next 16 cobra optimization warning, mas o tamanho é mínimo e o ganho de optimize é negligível para 16×16.

---

## 10. Premissas Assumidas

- [PREMISSA-01] Slug do menu: `personagens` (pt-BR). Slug dos NPCs: lower-snake como já existe (`alex`, `mr-qi`).
- [PREMISSA-02] Nomes de itens dentro das listas de presentes serão armazenados em pt-BR (do wiki). Quando clicáveis, fazem fuzzy match contra `ids.json` (que tem nomes em inglês) por similaridade.
- [PREMISSA-03] Retratos hospedados localmente em `public/sprites/npcs/<slug>.png` para evitar hotlink.
- [PREMISSA-04] Página de Universal Gifts é estática, com dados em `data/seed/universal-gifts.json` curados manualmente (são poucos itens).
- [PREMISSA-05] NPCs sem dados de presente (Birdie, Marlon, Gunther — não recebem presentes no jogo) aparecem na lista mas com nota "Não aceita presentes".
- [PREMISSA-06] Aniversários no formato `Spring 13` (inglês das estações) — mantém consistência com seed atual.

---

## 11. Perguntas Resolvidas

| # | Pergunta | Resposta | Rodada |
|---|---|---|---|
| 1 | Cobertura: completar 21 ou expandir para 38? | Expandir para 34 (todos NPCs canônicos com presentes) | 1 |
| 2 | Profundidade dos presentes (2 vs 5 níveis)? | 5 níveis completos | 1 |
| 3 | Universal gifts — onde? | Página dedicada `/personagens/presentes-universais` | 1 |
| 4 | Heart tracker? | Onda 2 (localStorage) | 1 |
| 5 | Heart events / schedule / casamento? | Onda 2 | 1 |
| 6 | Fonte de dados? | pt.stardewvalleywiki.com/Lista_de_Todos_os_Presentes (usuário forneceu) | 2 |
| 7 | Retratos NPC? | 80px do wiki pt-BR, hospedados localmente | 2 |

---

## 12. Plano de Implementação

### 12.1 Ondas

#### Onda 1 — Fundação + lista + detalhe + Universal Gifts

**Objetivo:** entregar a feature completa "ver retrato + 5 níveis de presentes por NPC", navegável a partir da home/nav, com 34 NPCs canônicos populados.

**Arquivos:**

- `scripts/expand-npcs.py` — **criar** — scrape de pt.stardewvalleywiki + parse de tabela + escreve `data/seed/npcs.json`
- `scripts/fetch-npc-portraits.py` — **criar** — baixa 34 retratos 80px para `public/sprites/npcs/`
- `data/seed/npcs.json` — **editar** — expandir 21 → 34 com 5 níveis de presentes
- `data/seed/universal-gifts.json` — **criar** — Universal Loved/Liked/Neutral/Disliked/Hated + exceções por NPC
- `public/sprites/npcs/*.png` — **criar** — 34 retratos 80×80 pixel-art
- `data/schema.sql` — **editar** — adicionar `presentes_apreciados`, `presentes_neutros`, `presentes_nao_gostam`, `retrato` em `npcs`
- `data/migrations/003_npcs_gifts_full.sql` — **criar** — `alter table npcs add column if not exists ...`
- `types/db.ts` — **editar** — atualizar `Npc` interface com 4 novos campos
- `components/features/NpcPortrait.tsx` — **criar** — wrapper de `<img>` com fallback emoji+inicial
- `components/features/NpcCard.tsx` — **criar** — card da lista (retrato + nome + aniv + romanceable)
- `components/features/GiftList.tsx` — **criar** — accordion por nível, renderiza ItemSprite + chip nome
- `app/personagens/page.tsx` — **criar** — lista com filtros (romanceable, aniversário, busca)
- `app/personagens/[slug]/page.tsx` — **criar** — detalhe com `generateStaticParams` (34 páginas)
- `app/personagens/presentes-universais/page.tsx` — **criar** — regras + exceções
- `app/personagens/loading.tsx`, `error.tsx` — **criar**
- `app/personagens/[slug]/loading.tsx`, `error.tsx` — **criar**
- `components/layout/Navbar.tsx` — **editar** — adicionar `{ href: "/personagens", label: "Personagens" }` (entre Missões e IDs)
- `components/layout/Footer.tsx` — **editar** — adicionar mesmo link
- `lib/search.ts` ou similar — **editar** — adicionar NPCs no índice Fuse (para Cmd+K)

**Passos:**

1. **Schema**: editar `data/schema.sql` adicionando 4 colunas. Criar migration `003_npcs_gifts_full.sql`. Avisar usuário para rodar no SQL Editor.
2. **Tipos**: atualizar `types/db.ts` (`Npc` interface).
3. **Scraper de dados**: `scripts/expand-npcs.py`:
   - GET `https://pt.stardewvalleywiki.com/Lista_de_Todos_os_Presentes` com UA
   - Parse de `<table class="wikitable">` — cada `<tr>` tem 6 colunas: NPC (img 80px) + 5 níveis (img 24px cada item)
   - Para cada NPC: extrair slug do nome do retrato (`Alex.png` → `alex`), extrair item names dos `title=` ou `alt=` dos imgs
   - Merge com `npcs.json` existente preservando dados que já temos (descricao, localizacao, aniversario, romanceable, fonte_url)
   - Para 13 NPCs novos: criar entries básicos (descricao TBD, aniversário scrape de outra página ou hardcode)
4. **Scraper de retratos**: `scripts/fetch-npc-portraits.py` (similar a `fetch-sprites.py`): baixa 34 PNGs para `public/sprites/npcs/<slug>.png`
5. **Universal Gifts**: criar `data/seed/universal-gifts.json` manualmente (curado da página `/Presentes Universais` do wiki — ~30 items por nível + exceções)
6. **Componentes**:
   - `NpcPortrait` — `<img src="/sprites/npcs/<slug>.png">` com fallback
   - `NpcCard` — usa NpcPortrait + nome em VT323 + aniv + tag romanceable
   - `GiftList` — props `{ titulo, itens: string[], variante: 'loved'|'liked'|...}` → renderiza ItemSprite (tenta match com ids.json por nome ou fallback emoji)
7. **Página lista** `app/personagens/page.tsx`:
   - Server Component reading `npcs.json`
   - Filtros client-side (extrair para client component pequeno)
   - Grid 2/3/4 colunas (mobile/tablet/desktop)
8. **Página detalhe** `app/personagens/[slug]/page.tsx`:
   - Server Component
   - `generateStaticParams()` retorna os 34 slugs
   - Cabeçalho: retrato grande (128px) + nome + aniv + localização + romanceable + descricao
   - 5 seções `<GiftList>`: amados (default open), apreciados, neutros, não gostam, odiados
   - Link "Ver presentes universais →"
9. **Universal page** `app/personagens/presentes-universais/page.tsx`:
   - Static
   - 5 accordions com itens + lista de exceções por NPC (ex: "Sebastian odeia Cheese mesmo sendo Universal Loved")
10. **Navbar/Footer**: adicionar link.
11. **Cmd+K search**: atualizar `lib/search.ts` ou similar para incluir NPCs.
12. **Build check** + visual validation iPhone 13 + desktop.

**Critérios de pronto da Onda 1:** AC-01 a AC-10.

#### Onda 2 — Extras (heart events, schedule, marriage, tracker)

**Objetivo:** transformar a página de detalhe em guia completo de relacionamento.

**Arquivos** (esboço):
- `data/seed/heart-events.json` — criar — cutscenes 2/4/6/8/10/14
- `data/seed/npc-schedules.json` — criar — schedule semanal por NPC (opcional)
- `data/seed/marriage.json` — criar — spouse benefits/gifts
- `components/features/HeartTracker.tsx` — criar — barra 0-14 corações clicável (localStorage)
- `components/features/HeartEventList.tsx` — criar — lista de eventos por threshold
- `app/personagens/[slug]/page.tsx` — editar — adicionar tabs ou seções

**Critérios de pronto Onda 2:** heart events visíveis, schedule (se incluído), tracker funcionando, marriage info para 12 romanceáveis.

### 12.2 Ordem de Execução

**Linear**. Onda 2 depende dos dados base (Npc + retratos) da Onda 1. Onda 2 pode ser dividida em fases independentes (heart events ≠ tracker ≠ schedule).

---

## 13. Verificação End-to-End

1. `pnpm build` — esperado: 92 + 34 = 126 rotas estáticas
2. SQL Editor Supabase: rodar `data/migrations/003_npcs_gifts_full.sql`
3. `pnpm seed` — esperado: "✅ 34 NPCs inseridos" com 5 colunas de presentes
4. Browser iPhone 13:
   - `/personagens` → 34 cards com retratos
   - Filtro "romanceáveis" → 12 cards
   - Clicar "Sebastian" → detalhe com retrato 128px + 5 listas de presentes (loved aberto)
   - Tocar "Ver presentes universais" → página com 5 níveis universais
5. Desktop 1280×800:
   - Mesma navegação, grid 4 colunas em /personagens
6. Cmd+K → digitar "shane" → resultado leva para `/personagens/shane`
7. `/missoes/robins-lost-axe` → "Robin" linkado → leva para `/personagens/robin`
8. Validar dados em Supabase via SQL: `select slug, array_length(presentes_amados, 1) from npcs;` → todos > 0
