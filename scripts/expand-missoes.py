"""
Expande o seed de missões para cobrir o canônico de Stardew Valley 1.6+
Roda com: python scripts/expand-missoes.py
"""
import json
from pathlib import Path

SEED = Path(__file__).parent.parent / "data" / "seed" / "missoes.json"

WIKI = "https://stardewvalleywiki.com/Quests"

def m(slug, titulo, descricao, tipo, npc, como_obter, localizacao, recompensa,
      requisitos=None, dificuldade=1, versao="1.0", fonte=None):
    return {
        "slug": slug,
        "titulo": titulo,
        "descricao": descricao,
        "tipo": tipo,
        "npc": npc,
        "como_obter": como_obter,
        "localizacao": localizacao,
        "recompensa": recompensa,
        "requisitos": requisitos,
        "dificuldade": dificuldade,
        "versao_adicionada": versao,
        "fonte_url": fonte or f"https://stardewvalleywiki.com/{titulo.replace(' ', '_').replace(chr(39), '%27')}",
    }

# ============================================
# STORY QUESTS (mail-triggered ou auto)
# ============================================
STORY = [
    m("to-the-beach",
      "To The Beach",
      "Visitar a praia ao sul da fazenda pela primeira vez.",
      "story", "Lewis",
      "Carta no correio em Spring 2, Ano 1",
      "Pelican Town — sair pela ponte sul",
      "Conhecimento da praia"),

    m("raising-animals",
      "Raising Animals",
      "Visitar a fazenda da Marnie para aprender sobre animais.",
      "story", "Marnie",
      "Carta no correio em Spring 5, Ano 1",
      "Marnie's Ranch — Cindersap Forest",
      "Conhecimento sobre criação"),

    m("advancement",
      "Advancement",
      "Plantar 15 parsnip seeds para mostrar progresso ao Pierre.",
      "story", "Pierre",
      "Carta no correio em Spring 6, Ano 1",
      "Sua fazenda",
      "100g + acesso a sementes melhores",
      requisitos="15 parsnip seeds plantadas"),

    m("archaeology",
      "Archaeology",
      "Doar o primeiro artefato no museu para iniciar a coleção.",
      "story", "Gunther",
      "Mostrar primeiro artefato ao Gunther",
      "Museum — Pelican Town",
      "Acesso completo às doações"),

    m("rat-problem",
      "Rat Problem",
      "Investigar barulhos estranhos no Community Center.",
      "story", "Mayor Lewis",
      "Conversar com Lewis após entrar no CC pela 1ª vez",
      "Community Center",
      "Acesso à sala da Junimos",
      dificuldade=2),

    m("meet-the-wizard-redux",
      "A Visit To The Wizard",
      "Encontrar o Wizard na torre dele em Cindersap Forest.",
      "story", "Wizard",
      "Após Rat Problem",
      "Wizard's Tower — Cindersap Forest",
      "Habilidade de ler runas da Junimo",
      requisitos="Rat Problem completa",
      dificuldade=2),

    m("forging-ahead",
      "Forging Ahead",
      "Trazer 1 Copper Ore ao Clint para aprender a fundir.",
      "story", "Clint",
      "Carta no correio após Mining Lvl 1",
      "Blacksmith — Pelican Town",
      "Receita do Furnace + 1 Copper Bar"),

    m("smelting",
      "Smelting",
      "Fundir uma Copper Bar e levar ao Clint.",
      "story", "Clint",
      "Após Forging Ahead + ter Furnace",
      "Blacksmith",
      "Receita da Bomba",
      requisitos="1 Copper Bar"),

    m("jodis-request-fixed",
      "Jodi's Request",
      "Levar 1 Cauliflower para Jodi cozinhar para a família.",
      "story", "Jodi",
      "Carta no correio em Spring 19, Ano 1",
      "1 Willow Lane — Pelican Town",
      "350g + 1 coração com Jodi",
      requisitos="1 Cauliflower (colher na primavera)"),

    m("marnies-request",
      "Marnie's Request",
      "Trazer 1 Cave Carrot para a Marnie alimentar os animais.",
      "story", "Marnie",
      "Carta no correio em Spring 18, Ano 1",
      "Marnie's Ranch",
      "500g + 1 coração com Marnie",
      requisitos="1 Cave Carrot (caverna nível 10+)"),

    m("pam-is-thirsty-fixed",
      "Pam Is Thirsty",
      "Levar 1 Pale Ale para a Pam após um dia quente.",
      "story", "Pam",
      "Carta no correio em Summer 18, Ano 2",
      "Trailer da Pam — Pelican Town",
      "750g + 1 coração com Pam",
      requisitos="1 Pale Ale (Keg + Hops, ~2 dias)"),

    m("cows-delight",
      "Cow's Delight",
      "Trazer 1 Amaranth para as vacas da Marnie.",
      "story", "Marnie",
      "Carta no correio em Fall 19, Ano 1",
      "Marnie's Ranch",
      "500g + 1 coração com Marnie",
      requisitos="1 Amaranth (outono)"),

    m("the-mysterious-qi",
      "The Mysterious Qi",
      "Seguir as pistas do bilhete na lunchbox — leva ao Mr. Qi.",
      "story", "Mr. Qi",
      "Encontrar lunchbox em um trash can",
      "Bus Stop tunnel → Mr. Qi",
      "Acesso ao Casino + introdução ao Mr. Qi",
      requisitos="Joja Cola, Battery Pack, Solar Essence, Rainbow Shell",
      dificuldade=3),

    m("carving-pumpkins",
      "Carving Pumpkins",
      "Levar 1 Pumpkin para a Caroline na Spirit's Eve.",
      "story", "Caroline",
      "Carta no correio em Fall 26, Ano 1",
      "Pierre's General Store",
      "350g + 1 coração com Caroline",
      requisitos="1 Pumpkin (outono)"),

    m("fresh-fruit",
      "Fresh Fruit",
      "Levar 1 Apricot para a Caroline.",
      "story", "Caroline",
      "Carta no correio em Spring 6, Ano 2",
      "Pierre's General Store",
      "350g + 1 coração com Caroline",
      requisitos="1 Apricot (Apricot Tree, primavera)"),

    m("aquatic-research",
      "Aquatic Research",
      "Trazer 1 Pufferfish para a pesquisa do Demetrius.",
      "story", "Demetrius",
      "Carta no correio em Summer 5, Ano 1",
      "Carpenter's Shop (1ª andar) — Mountain",
      "650g + 1 coração com Demetrius",
      requisitos="1 Pufferfish (praia, verão, ensolarado, 12-16h)",
      dificuldade=2),

    m("a-soldiers-star",
      "A Soldier's Star",
      "Trazer 1 Starfruit para Kent, lembrança da guerra.",
      "story", "Kent",
      "Carta no correio em Summer 14, Ano 2+ (após Kent voltar)",
      "1 River Road — Pelican Town",
      "750g + 1 coração com Kent",
      requisitos="1 Starfruit (Calico Desert, verão) + Kent em casa",
      dificuldade=2),

    m("mayors-need",
      "Mayor's Need",
      "Levar 1 Hot Pepper urgentemente para o Lewis.",
      "story", "Mayor Lewis",
      "Carta no correio em Summer 6, Ano 1",
      "Manor do Lewis — Pelican Town",
      "750g + 1 coração com Lewis",
      requisitos="1 Hot Pepper (verão)"),

    m("lewiss-lucky-purple-shorts",
      "Lewis's Lucky Purple Shorts",
      "Encontrar os shorts roxos perdidos do prefeito (sem dizer pra ninguém!).",
      "story", "Mayor Lewis",
      "Carta no correio do Lewis em Spring 12, Ano 1",
      "Marnie's bedroom (requer 2 corações com Marnie)",
      "750g + amizade + segredos do vilarejo",
      requisitos="2 corações com Marnie",
      dificuldade=2),

    m("a-dark-reagent",
      "A Dark Reagent",
      "Levar 1 Solar Essence para o Wizard reverter um feitiço.",
      "story", "Wizard",
      "Carta no correio do Wizard após Dark Talisman",
      "Wizard's Tower",
      "2500g + acesso a mais magias",
      requisitos="1 Solar Essence + Dark Talisman completa",
      dificuldade=3),

    m("the-pirates-wife",
      "The Pirate's Wife",
      "Reunir Birdie com seu marido pirata trazendo memorabilia.",
      "story", "Birdie",
      "Conversar com Birdie em Ginger Island Beach",
      "Ginger Island — vários locais",
      "War Memento + Necklace + acesso ao Pirate Cove",
      requisitos="Acesso à Ginger Island + 5 itens específicos",
      dificuldade=4, versao="1.5"),

    m("granny-fluffy-tail",
      "Granny's Gift",
      "Trazer 1 Leek para a avó da Evelyn (Evelyn).",
      "story", "Evelyn",
      "Carta no correio em Spring 17, Ano 1",
      "24 Grandpa's Walk — Pelican Town",
      "500g + amizade",
      requisitos="1 Leek (forrageiro, primavera)"),
]

# ============================================
# SPECIAL ORDERS (Mayor's bulletin board)
# ============================================
SPECIAL = [
    m("special-cave-patrol",
      "Cave Patrol",
      "Eliminar 80 monstros nas minas para o Marlon.",
      "special_order", "Marlon",
      "Quadro de Special Orders no Town (após CC restored ou Joja)",
      "The Mines",
      "30.000g + Statue Of Blessings",
      requisitos="80 monstros mortos em 7 dias",
      dificuldade=3, versao="1.5"),

    m("special-aquatic-overpopulation",
      "Aquatic Overpopulation",
      "Catch 80 fish (qualquer espécie) para pesquisa do Demetrius.",
      "special_order", "Demetrius",
      "Quadro de Special Orders",
      "Qualquer ponto de pesca",
      "30.000g",
      requisitos="80 peixes em 7 dias",
      dificuldade=2, versao="1.5"),

    m("special-biome-balance",
      "Biome Balance",
      "Coletar 1 forrageiro de cada estação + 1 crop de cada estação.",
      "special_order", "Demetrius",
      "Quadro de Special Orders",
      "Vários biomas",
      "30.000g + Auto-Petter (raro)",
      requisitos="8 itens específicos em 14 dias",
      dificuldade=3, versao="1.5"),

    m("special-rock-rejuvenation",
      "Rock Rejuvenation",
      "Levar 1 Ruby, 1 Topaz, 1 Emerald, 1 Jade e 1 Aquamarine para Emily.",
      "special_order", "Emily",
      "Quadro de Special Orders",
      "Caverna ou Geodes",
      "30.000g + Bone Sword",
      requisitos="5 gemas específicas em 7 dias",
      dificuldade=2, versao="1.5"),

    m("special-gifts-for-george",
      "Gifts For George",
      "Dar 4 itens para George (1 por semana, 4 semanas).",
      "special_order", "Evelyn",
      "Quadro de Special Orders",
      "Casa do George — Pelican Town",
      "30.000g + receita Stardrop Tea",
      requisitos="George loved/liked gifts",
      dificuldade=2, versao="1.5"),

    m("special-fragments-of-the-past",
      "Fragments of the Past",
      "Cavar 15 artefatos para o Gunther (artifact spots).",
      "special_order", "Gunther",
      "Quadro de Special Orders",
      "Toda Pelican Town (artifact spots)",
      "30.000g + Ancient Doll",
      requisitos="15 artefatos em 14 dias",
      dificuldade=2, versao="1.5"),

    m("special-gus-famous-omelet",
      "Gus' Famous Omelet",
      "Conseguir 1 Large Egg para o omelete famoso do Gus.",
      "special_order", "Gus",
      "Quadro de Special Orders",
      "Coop da fazenda",
      "30.000g + Magic Rock Candy (raro)",
      requisitos="1 Large Egg em 5 dias",
      dificuldade=1, versao="1.5"),

    m("special-crop-order",
      "Crop Order",
      "Entregar 500 crops de qualidade gold para o Lewis.",
      "special_order", "Mayor Lewis",
      "Quadro de Special Orders",
      "Sua fazenda",
      "30.000g + Statue Of Perfection",
      requisitos="500 crops gold em 14 dias",
      dificuldade=4, versao="1.5"),

    m("special-community-cleanup",
      "Community Cleanup",
      "Pescar 8 lixos diferentes nos rios para o Linus.",
      "special_order", "Linus",
      "Quadro de Special Orders",
      "Rios de Pelican Town",
      "30.000g + Auto-Petter (raro)",
      requisitos="8 lixos em 7 dias",
      dificuldade=2, versao="1.5"),

    m("special-the-strong-stuff",
      "The Strong Stuff",
      "Entregar 1 Pale Ale envelhecida em Iridium Cask para a Pam.",
      "special_order", "Pam",
      "Quadro de Special Orders",
      "Adega da fazenda",
      "30.000g + Pale Ale recipe boost",
      requisitos="Pale Ale Iridium quality em 7 dias",
      dificuldade=3, versao="1.5"),

    m("special-pierres-prime-produce",
      "Pierre's Prime Produce",
      "Entregar 5 crops gold + 5 large eggs para o Pierre.",
      "special_order", "Pierre",
      "Quadro de Special Orders",
      "Pierre's General Store",
      "30.000g + Junimo Plush (raro)",
      requisitos="5 crops gold + 5 large eggs em 7 dias",
      dificuldade=3, versao="1.5"),

    m("special-robins-project",
      "Robin's Project",
      "Coletar 200 hardwoods para a Robin construir algo especial.",
      "special_order", "Robin",
      "Quadro de Special Orders",
      "Cindersap Forest + Secret Woods",
      "30.000g + receita de Deluxe Scarecrow",
      requisitos="200 hardwood em 7 dias",
      dificuldade=3, versao="1.5"),

    m("special-robins-resource-rush",
      "Robin's Resource Rush",
      "Crafting massivo: 30 Stone Fence + 30 Stone Floor + 30 Sprinklers.",
      "special_order", "Robin",
      "Quadro de Special Orders",
      "Sua fazenda",
      "30.000g + receita Practical Hat",
      requisitos="Materiais para 90 crafted items em 7 dias",
      dificuldade=4, versao="1.5"),

    m("special-juicy-bugs-wanted",
      "Juicy Bugs Wanted!",
      "Coletar 100 Bug Meat para a isca especial do Willy.",
      "special_order", "Willy",
      "Quadro de Special Orders",
      "Minas, caverna",
      "30.000g + Bug Steak recipe",
      requisitos="100 Bug Meat em 7 dias",
      dificuldade=2, versao="1.5"),

    m("special-tropical-fish-surprise",
      "Tropical Fish Surprise",
      "Pescar 2 Stingrays + 2 Lionfish + 2 Blue Discus.",
      "special_order", "Willy",
      "Quadro de Special Orders",
      "Ginger Island",
      "30.000g + Stardrop Tea",
      requisitos="6 peixes de Ginger Island em 7 dias + acesso à ilha",
      dificuldade=3, versao="1.5"),

    m("special-a-curious-substance",
      "A Curious Substance",
      "Levar 1 Purple Mushroom para o Wizard analisar.",
      "special_order", "Wizard",
      "Quadro de Special Orders",
      "Minas (floors 80+) ou Skull Cavern",
      "30.000g + Wizard Hat (cosmético)",
      requisitos="1 Purple Mushroom em 7 dias",
      dificuldade=2, versao="1.5"),

    m("special-prismatic-jelly",
      "Prismatic Jelly",
      "Caçar e derrotar um Prismatic Slime para o Wizard.",
      "special_order", "Wizard",
      "Quadro de Special Orders",
      "The Mines (qualquer floor com slime)",
      "30.000g + Prismatic Shard chance",
      requisitos="Encontrar e matar Prismatic Slime em 7 dias",
      dificuldade=4, versao="1.5"),
]

# ============================================
# MR. QI QUESTS (Walnut Room, Ginger Island)
# ============================================
QI = [
    m("qi-qis-crop",
      "Qi's Crop",
      "Plantar e colher 500 Qi Fruit em 28 dias usando Qi Beans.",
      "mr_qi", "Mr. Qi",
      "Quadro de Special Orders da Sala dos Walnuts",
      "Sua fazenda + Qi Beans",
      "20 Qi Gems",
      requisitos="500 Qi Fruit colhidas em 28 dias",
      dificuldade=4, versao="1.5"),

    m("qi-qis-hungry-challenge",
      "Qi's Hungry Challenge",
      "Comer 5 peixes raros diferentes sem cozinhar.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts",
      "Vários pontos de pesca raros",
      "20 Qi Gems",
      requisitos="5 fish lengendários ou raros em 7 dias",
      dificuldade=4, versao="1.5"),

    m("qi-qis-cuisine",
      "Qi's Cuisine",
      "Vender 25 pratos cozinhados diferentes para o Mr. Qi.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts",
      "Cozinha da fazenda",
      "20 Qi Gems",
      requisitos="25 receitas únicas em 14 dias",
      dificuldade=4, versao="1.5"),

    m("qi-qis-kindness",
      "Qi's Kindness",
      "Dar 50 'liked' gifts para NPCs diferentes.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts",
      "Toda Pelican Town",
      "20 Qi Gems",
      requisitos="50 liked/loved gifts diferentes em 14 dias",
      dificuldade=3, versao="1.5"),

    m("qi-qis-prismatic-grange",
      "Qi's Prismatic Grange",
      "Colocar 1 item de cada cor primária no display.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts (sazonal)",
      "Sala dos Walnuts (display)",
      "5 Qi Gems",
      requisitos="9 itens prismáticos diferentes em 3 dias",
      dificuldade=3, versao="1.5"),

    m("qi-skull-cavern-invasion",
      "Skull Cavern Invasion",
      "Chegar ao floor 100 da Skull Cavern com 8 'lives' restantes.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts",
      "Skull Cavern",
      "40 Qi Gems",
      requisitos="Chegar floor 100 com 8 lives em 1 dia",
      dificuldade=5, versao="1.5"),

    m("qi-qis-race",
      "Qi's Race",
      "Vencer Mr. Qi em uma corrida pelo Junimo Kart endless.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts",
      "Junimo Kart machine — Sala dos Walnuts",
      "10 Qi Gems",
      requisitos="Score 50.000+ no Junimo Kart Endless",
      dificuldade=4, versao="1.5"),

    m("qi-danger-in-the-deep",
      "Danger In The Deep",
      "Limpar o floor 100 das Minas no modo Dangerous.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts (após enable Dangerous Mines)",
      "The Mines (Dangerous Mode)",
      "30 Qi Gems",
      requisitos="Floor 100 das Minas em Dangerous Mode",
      dificuldade=5, versao="1.5"),

    m("qi-island-ingredients",
      "Island Ingredients",
      "Entregar Taro, Ginger e Pineapple para o Mr. Qi.",
      "mr_qi", "Mr. Qi",
      "Quadro Walnuts",
      "Ginger Island farming",
      "20 Qi Gems",
      requisitos="1 Taro + 1 Ginger + 1 Pineapple gold quality em 14 dias",
      dificuldade=3, versao="1.5"),
]

# ============================================
# HELP WANTED (categorias do quadro fora da loja)
# ============================================
HELP = [
    m("help-item-delivery",
      "Item Delivery",
      "NPC pede um item específico. Aparece no quadro fora da Pierre's. Aleatório diário.",
      "help_wanted", "Vários",
      "Quadro de avisos fora da Pierre's General Store",
      "Pelican Town",
      "3× preço base do item + 150 amizade",
      requisitos="Entregar item antes do prazo (2 dias)",
      dificuldade=1, versao="1.0"),

    m("help-gathering",
      "Gathering",
      "Pierre pede uma quantidade de crop/forrageiro. Apenas Domingos.",
      "help_wanted", "Pierre",
      "Quadro de avisos — apenas Domingos",
      "Sua fazenda + forrageamento",
      "3× preço base + 150 amizade",
      requisitos="Coletar X unidades em 2 dias",
      dificuldade=2, versao="1.0"),

    m("help-fishing",
      "Fishing Quest",
      "Willy pede que você pegue 1 peixe específico antes do prazo.",
      "help_wanted", "Willy",
      "Quadro de avisos",
      "Ponto de pesca específico do peixe",
      "3× preço base + 150 amizade + chance de tackle",
      requisitos="1 peixe específico em 2 dias",
      dificuldade=2, versao="1.0"),

    m("help-slay-monsters",
      "Slay Monsters",
      "Marlon pede que você mate X monstros de um tipo.",
      "help_wanted", "Marlon",
      "Quadro de avisos",
      "The Mines ou Skull Cavern",
      "1000-2500g + 150 amizade + item de combate",
      requisitos="Matar X monstros do tipo em 2 dias",
      dificuldade=3, versao="1.0"),
]

# ============================================
# Merge + reclassify
# ============================================
existing = json.loads(SEED.read_text(encoding="utf-8"))

# Reclassificar 2 entradas existentes que são na verdade story:
RECLASSIFY_TO_STORY = {"jodis-request", "pam-is-thirsty"}
filtered_existing = [e for e in existing if e["slug"] not in {"jodis-request-fixed", "pam-is-thirsty-fixed"}]
for e in filtered_existing:
    if e["slug"] in RECLASSIFY_TO_STORY:
        e["tipo"] = "story"

# Combinar: existentes + novos. Dedup por slug.
all_missions = {e["slug"]: e for e in filtered_existing}
for new_set in (STORY, SPECIAL, QI, HELP):
    for entry in new_set:
        # Se o slug "fixed" já cobre algo existente, remover o antigo
        if entry["slug"].endswith("-fixed"):
            base = entry["slug"][:-6]
            all_missions.pop(base, None)
            entry["slug"] = base  # reusa o slug original sem "-fixed"
        all_missions[entry["slug"]] = entry

# Reescrever
out = list(all_missions.values())
SEED.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

print(f"OK — total: {len(out)} missoes")
from collections import Counter
counter = Counter(m["tipo"] for m in out)
for t, n in counter.items():
    print(f"  {t}: {n}")
