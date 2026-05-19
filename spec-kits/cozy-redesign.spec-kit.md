# Spec Kit: Cozy Redesign — Stardew Supremo

**Criado em:** 2026-05-19
**Status:** approved
**Escopo:** app/, components/, public/, mobile-first (iPhone 13 ≈ 390×844)

---

## Context

O Stardew Supremo está hoje num tema dark genérico, sem identidade visual conectada ao jogo. O usuário forneceu um mockup HTML (`Stardew Supremo - Cozy Redesign.html`) com estética "cozy/parchment" — cores quentes (papel, madeira, ouro), tipografia pixel (VT323), molduras de madeira. A pedido foi: adotar essa estética **mantendo o tom mas removendo ilustrações de gatos e animais**, garantir **mobile-first com prioridade iPhone 13**, e redesenhar o mini-mapa em **estilo pixel-art top-down** semelhante ao próprio jogo.

## 1. Visão

Transformar a UI atual (dark, neutra) em uma experiência "cozy farm wiki" — papel envelhecido, frames de madeira, paleta quente. Identidade clara conectada ao Stardew Valley sem mascotes ilustrados.

## 2. Decisões aprovadas (do briefing)

- **Tema**: substituir totalmente o dark; sem toggle dia/noite na Onda 1.
- **Mapa**: pixel-art top-down do vale com tiles reconhecíveis (fazenda, vila, mina, floresta, praia, deserto, ilha).
- **Chat persona**: remover "Jubileu" — voltar ao "Assistente" neutro, manter system prompt informativo.
- **Sem ilustrações**: nenhum sprite de gato, animal, NPC. Decoração é tipográfica + geométrica (pixel dividers, pixel hearts/stars).
- **Mobile-first**: layouts otimizam para 390px; desktop expande gracioso até 1280px+.

## 3. Tokens de design (do mockup)

```css
--paper:        #f4e4c1;   /* fundo principal */
--paper-deep:   #e7cf9b;   /* fundo secundário, hovers */
--wood:         #a76e3b;   /* frames, navbar */
--wood-light:   #c79360;   /* hover, highlights */
--wood-dark:    #5b3a1f;   /* bordas, sombras, texto em wood */
--ink:          #3a2412;   /* texto principal */
--ink-soft:     #7a5a3e;   /* texto muted */
--ink-shadow:   #2b1a0c;   /* sombras de texto */
--gold:         #e9a72c;   /* primário, CTA */
--gold-soft:    #f5d684;   /* gold suave, highlight */
--grass:        #7bb53f;   /* categoria fazenda/energia */
--grass-dark:   #4e8123;
--berry:        #c4453a;   /* danger, combate */
--water:        #4f8fb3;   /* links, info, itens */
```

Fontes: VT323 (display/títulos), Inter (corpo), JetBrains Mono (códigos).
Pattern: paper-grain (dois radial-gradients sutis).

## 4. Capacidades / Critérios de aceite

- AC-01: Todas as cores cozy aplicadas via tokens em `globals.css`
- AC-02: Componentes base (Card, Button, Tag, Badge, Input) usam wood-frame e ink text
- AC-03: Hero da Home **sem animais**, com pixel-title + pixel divider
- AC-04: Mapa StardewMap renderiza tilemap pixel-art top-down com regiões reconhecíveis e pin no local correto
- AC-05: Chat sem ilustração de gato, sem nome "Jubileu" — apenas "Assistente"
- AC-06: iPhone 13 (390×844): nav colapsa, cards stack em 1 coluna, modais ocupam ≥90% width
- AC-07: Desktop ≥1024px: layouts respiram com grids 2-4 colunas
- AC-08: Modais (Cmd+K, PWA install, Toast) seguem visual cozy

## 5. Fora do escopo (Onda 1)

- Toggle dia/noite
- Animações elaboradas (apenas pulse no pin do mapa)
- Reescrita das APIs ou lógica de dados
- Onboarding/tour de UI

## 6. Plano de Implementação

### Onda 1 — Fundação + páginas-chave

**Objetivo:** Sistema visual cozy estabelecido + Home, Macetes lista, Chat e Mapa redesenhados.

**Arquivos:**
- `app/globals.css` — editar — substituir tokens dark por cozy + paper-grain
- `app/layout.tsx` — editar — themeColor cozy
- `components/ui/Card.tsx` — editar — wood-frame
- `components/ui/Button.tsx` — editar — pixel/wood-frame
- `components/ui/Tag.tsx` — editar — cores cozy
- `components/ui/Badge.tsx` — editar — cozy
- `components/ui/Input.tsx` — editar — paper bg
- `components/decor/PixelDivider.tsx` — editar — fence/wood divider
- `components/decor/WoodFrame.tsx` — criar — wrapper reutilizável
- `components/layout/Navbar.tsx` — editar — wood bar + cozy hamburger
- `components/layout/Footer.tsx` — editar — cozy
- `app/page.tsx` — editar — hero sem animais, cozy
- `app/macetes/page.tsx` — editar — cozy
- `app/chat/page.tsx` — editar — remover persona Jubileu, cozy bubbles
- `components/features/StardewMap.tsx` — reescrever — pixel-art top-down tilemap
- `components/features/MaceteCard.tsx` — editar — cozy

**Critérios pronto:** AC-01, AC-02, AC-03, AC-04, AC-05 + validação visual em iPhone 13 (390×844) e desktop 1280×720.

### Onda 2 — Páginas secundárias + modais

**Arquivos:**
- `app/bugs/page.tsx` — editar
- `app/missoes/page.tsx` — editar (lista)
- `app/missoes/[slug]/page.tsx` — editar (detalhe)
- `app/macetes/[slug]/page.tsx` — editar (detalhe)
- `app/ids/page.tsx` — editar (tabela)
- `components/layout/GlobalSearch.tsx` — editar (modal Cmd+K)
- `components/layout/PWARegister.tsx` — editar (install prompt)
- `components/ui/Toast.tsx` — editar
- `components/ui/PageSkeleton.tsx` — editar
- `components/ui/PageError.tsx` — editar
- `components/features/VoteWidget.tsx` — editar
- `components/layout/ChatFAB.tsx` — editar

**Critérios pronto:** AC-06, AC-07, AC-08

## 7. Verificação E2E

1. `pnpm build` limpo
2. Browser iPhone 13 viewport (390×844): home, macetes, chat, missão detalhada
3. Browser desktop (1280×720): mesmas páginas
4. Cmd+K search aberto + funcional
5. Chat envia mensagem → IA responde, sem persona gato
6. Mapa: navegar `/missoes/robins-lost-axe` → pin em Cindersap Forest no tilemap pixel-art
