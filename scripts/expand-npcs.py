"""
Faz scrape de https://pt.stardewvalleywiki.com/Lista_de_Todos_os_Presentes
e popula data/seed/npcs.json com 5 níveis de presentes + retratos por NPC.

Roda com: python scripts/expand-npcs.py

Estratégia:
- Parse da tabela `wikitable sortable roundedborder`
- Cada <tr> tem: 1ª col = retrato NPC (80px) + 5 colunas com listas de presentes
- Item names extraídos do atributo `title` dos <a> que envolvem os <img>
- Merge com npcs.json existente preservando campos atuais (descricao, localizacao, aniversario, romanceable, fonte_url)
- NPCs novos ganham entry básico com TBD nas faltantes
"""
import json
import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).parent.parent
SEED = ROOT / "data" / "seed" / "npcs.json"
URL = "https://pt.stardewvalleywiki.com/Lista_de_Todos_os_Presentes"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def fetch_html() -> str:
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8")


class GiftTableParser(HTMLParser):
    """Estado-máquina que captura {npc_slug: {amados, apreciados, neutros, nao_gostam, odiados}}."""

    def __init__(self):
        super().__init__()
        self.in_table = False
        self.in_row = False
        self.in_cell = False
        self.cell_idx = -1
        self.current_npc: str | None = None
        self.current_birthday_text: str = ""
        self.capture_text = False
        self.current_items: list[list[str]] = [[], [], [], [], []]  # 5 níveis
        self.table_class = ""
        self.data: dict[str, dict] = {}

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        if tag == "table":
            cls = attrs_dict.get("class", "")
            if "wikitable" in cls and "sortable" in cls:
                self.in_table = True
                self.table_class = cls
            return

        if not self.in_table:
            return

        if tag == "tr":
            self.in_row = True
            self.cell_idx = -1
            self.current_npc = None
            self.current_birthday_text = ""
            self.current_items = [[], [], [], [], []]
            return

        if tag in ("td", "th") and self.in_row:
            self.cell_idx += 1
            self.in_cell = True
            self.capture_text = self.cell_idx == 1  # 2ª célula = aniversário (texto)
            return

        if tag == "img" and self.in_cell:
            src = attrs_dict.get("src", "")
            alt = attrs_dict.get("alt", "")
            title = attrs_dict.get("title", "")

            # Extrair nome canônico (inglês) do filename
            canonical = None
            if src:
                m = re.search(r"/([^/]+?)\.png", src)
                if m:
                    canonical = m.group(1).replace("_", " ")

            if self.cell_idx == 0:
                # 1ª célula = retrato NPC (80px). Sempre usar nome do filename (canonical EN)
                if "80px-" in src and canonical:
                    self.current_npc = canonical.strip()
            elif self.cell_idx >= 2:
                # Colunas 2-6 = items por nível (2=amados, ..., 6=odiados)
                # Usar canonical EN (do filename) p/ alinhar com ids.json e /sprites/items/
                display_name = canonical or alt or title or ""
                if display_name.endswith(".png"):
                    display_name = display_name[:-4]
                display_name = display_name.strip()
                if not display_name:
                    return
                gift_idx = self.cell_idx - 2
                if 0 <= gift_idx < 5 and display_name not in self.current_items[gift_idx]:
                    self.current_items[gift_idx].append(display_name)

    def handle_data(self, data):
        if self.capture_text and self.in_cell:
            self.current_birthday_text += data

    def handle_endtag(self, tag):
        if tag in ("td", "th"):
            self.in_cell = False
            self.capture_text = False
            return
        if tag == "tr" and self.in_row:
            self.in_row = False
            if self.current_npc:
                self.data[self.current_npc] = {
                    "aniversario_pt": self.current_birthday_text.strip(),
                    "amados": self.current_items[0],
                    "apreciados": self.current_items[1],
                    "neutros": self.current_items[2],
                    "nao_gostam": self.current_items[3],
                    "odiados": self.current_items[4],
                }
            return
        if tag == "table":
            self.in_table = False


def slugify(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def main():
    print("Fetching wiki pt-BR...")
    html = fetch_html()
    print(f"  {len(html):,} bytes")

    parser = GiftTableParser()
    parser.feed(html)
    print(f"  {len(parser.data)} NPCs extraídos da tabela")

    # Carregar existente
    existing = {e["slug"]: e for e in json.loads(SEED.read_text(encoding="utf-8"))}
    print(f"  {len(existing)} NPCs no seed atual")

    # Defaults para NPCs novos (descricao/aniversario/localizacao/romanceable hardcoded)
    NEW_NPCS_DEFAULTS = {
        "lewis": {
            "descricao": "Prefeito de Pelican Town. Vive sozinho e tem segredos pessoais.",
            "localizacao": "Manor do prefeito — centro de Pelican Town",
            "aniversario": "Spring 7",
            "romanceable": False,
        },
        "demetrius": {
            "descricao": "Cientista marido de Robin. Estuda flora e fauna do vale.",
            "localizacao": "Carpenter's Shop — Mountain",
            "aniversario": "Summer 19",
            "romanceable": False,
        },
        "caroline": {
            "descricao": "Esposa do Pierre, mãe da Abigail. Pratica yoga e tem um jardim secreto.",
            "localizacao": "Pierre's General Store (atrás)",
            "aniversario": "Winter 7",
            "romanceable": False,
        },
        "clint": {
            "descricao": "Ferreiro local. Apaixonado pela Emily mas tímido demais para se declarar.",
            "localizacao": "Blacksmith — Pelican Town",
            "aniversario": "Winter 26",
            "romanceable": False,
        },
        "jodi": {
            "descricao": "Mãe do Sam e Vincent. Marido (Kent) estava na guerra; volta na 2ª primavera.",
            "localizacao": "1 Willow Lane — Pelican Town",
            "aniversario": "Fall 11",
            "romanceable": False,
        },
        "kent": {
            "descricao": "Pai do Sam e Vincent, marido da Jodi. Veterano de guerra, volta no início do ano 2.",
            "localizacao": "1 Willow Lane (a partir de Spring 1, Ano 2)",
            "aniversario": "Spring 4",
            "romanceable": False,
        },
        "vincent": {
            "descricao": "Filho caçula da Jodi e Kent, amigo da Jas. Aluno da Penny.",
            "localizacao": "1 Willow Lane",
            "aniversario": "Spring 10",
            "romanceable": False,
        },
        "jas": {
            "descricao": "Sobrinha da Marnie, afilhada do Shane. Amiga do Vincent. Aluna da Penny.",
            "localizacao": "Marnie's Ranch",
            "aniversario": "Summer 4",
            "romanceable": False,
        },
        "evelyn": {
            "descricao": "'Granny'. Avó do Alex, esposa do George. Doce velhinha que cuida do jardim da cidade.",
            "localizacao": "1 River Road — Pelican Town",
            "aniversario": "Winter 20",
            "romanceable": False,
        },
        "george": {
            "descricao": "'Grandpa'. Avô do Alex, marido da Evelyn. Idoso ranzinza em cadeira de rodas.",
            "localizacao": "1 River Road — Pelican Town",
            "aniversario": "Fall 24",
            "romanceable": False,
        },
        "sandy": {
            "descricao": "Atendente da loja do Calico Desert. Amiga de Emily.",
            "localizacao": "Oasis — Calico Desert",
            "aniversario": "Fall 15",
            "romanceable": False,
        },
        "dwarf": {
            "descricao": "Habitante das Minas. Fala dwarvish — precisa de Dwarvish Translation Guide.",
            "localizacao": "Minas (floor 100, depois Mountain)",
            "aniversario": "Summer 22",
            "romanceable": False,
        },
        "leo": {
            "descricao": "Garoto da Ginger Island criado por papagaios. Move-se para Pelican Town após 6 corações.",
            "localizacao": "Ginger Island (inicialmente) → Mountain",
            "aniversario": "Summer 26",
            "romanceable": False,
        },
    }

    # Merge: cada NPC extraído do scrape vira ou atualiza entry
    new_count = 0
    updated_count = 0
    for npc_name, gifts in parser.data.items():
        slug = slugify(npc_name)

        if slug in existing:
            entry = existing[slug]
            updated_count += 1
        else:
            defaults = NEW_NPCS_DEFAULTS.get(slug, {})
            entry = {
                "slug": slug,
                "nome": npc_name,
                "descricao": defaults.get("descricao", f"NPC de Pelican Town — {npc_name}."),
                "localizacao": defaults.get("localizacao", "Pelican Town"),
                "aniversario": defaults.get("aniversario", "TBD"),
                "romanceable": defaults.get("romanceable", False),
                "fonte_url": f"https://pt.stardewvalleywiki.com/{npc_name.replace(' ', '_')}",
            }
            existing[slug] = entry
            new_count += 1

        # Atualizar 5 níveis (sobrescreve com dados oficiais do wiki)
        entry["presentes_amados"] = gifts["amados"]
        entry["presentes_apreciados"] = gifts["apreciados"]
        entry["presentes_neutros"] = gifts["neutros"]
        entry["presentes_nao_gostam"] = gifts["nao_gostam"]
        entry["presentes_odiados"] = gifts["odiados"]
        # Aniversário em pt-BR direto da wiki (ex: "Verão 13") sobrescreve o inglês
        if gifts.get("aniversario_pt"):
            entry["aniversario"] = gifts["aniversario_pt"]
        # Retrato: nome do arquivo esperado em public/sprites/npcs/<slug>.png
        entry["retrato"] = f"{slug}.png"

    # Salvar
    out = sorted(existing.values(), key=lambda e: e["slug"])
    SEED.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"\nOK — total: {len(out)} NPCs ({new_count} novos, {updated_count} atualizados)")

    # Stats
    print("\nDistribuição de presentes:")
    for niveis in ("amados", "apreciados", "neutros", "nao_gostam", "odiados"):
        counts = [len(e.get(f"presentes_{niveis}", [])) for e in out]
        non_zero = [c for c in counts if c > 0]
        if non_zero:
            print(f"  {niveis}: média {sum(non_zero)//len(non_zero)}/NPC, total {sum(non_zero)} entries")


if __name__ == "__main__":
    main()
