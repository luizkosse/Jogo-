"""
Baixa retratos 80x80 dos NPCs do wiki pt-BR para public/sprites/npcs/<slug>.png
Roda com: python scripts/fetch-npc-portraits.py
"""
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).parent.parent
SEED = ROOT / "data" / "seed" / "npcs.json"
SPRITES_DIR = ROOT / "public" / "sprites" / "npcs"
SPRITES_DIR.mkdir(parents=True, exist_ok=True)

URL = "https://pt.stardewvalleywiki.com/Lista_de_Todos_os_Presentes"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"


def fetch_index() -> dict[str, str]:
    """Retorna mapa slug -> url do retrato 80px."""
    req = urllib.request.Request(URL, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        html = r.read().decode("utf-8")

    # Capturar todas as URLs 80px de NPCs
    urls = re.findall(r'src="(https://[^"]*80px-[^"]+\.png)"', html)
    out = {}
    for u in urls:
        m = re.search(r"/80px-([^/]+?)\.png$", u)
        if m:
            slug = re.sub(r"[^a-z0-9]+", "-", m.group(1).lower()).strip("-")
            out[slug] = u
    return out


def download_one(slug: str, url: str) -> tuple[str, str]:
    dest = SPRITES_DIR / f"{slug}.png"
    if dest.exists() and dest.stat().st_size > 0:
        return slug, "skip"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as r:
            dest.write_bytes(r.read())
        return slug, "ok"
    except Exception as e:
        return slug, f"erro: {e}"


def main():
    print("Buscando índice de retratos...")
    portraits = fetch_index()
    print(f"  {len(portraits)} retratos encontrados")

    print(f"Baixando em paralelo...")
    ok = skip = err = 0
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = [pool.submit(download_one, s, u) for s, u in portraits.items()]
        for fut in as_completed(futures):
            slug, status = fut.result()
            if status == "ok":
                ok += 1
            elif status == "skip":
                skip += 1
            else:
                err += 1
                print(f"  ERRO {slug}: {status}")

    print(f"\nOK — {ok} baixados, {skip} já existentes, {err} falhas")

    # Validar que cada NPC do seed tem retrato
    data = json.loads(SEED.read_text(encoding="utf-8"))
    missing = [n["slug"] for n in data if not (SPRITES_DIR / f"{n['slug']}.png").exists()]
    if missing:
        print(f"\nAVISO — {len(missing)} NPCs sem retrato: {missing}")
    else:
        print(f"\n✓ Todos os {len(data)} NPCs do seed têm retrato local")


if __name__ == "__main__":
    main()
