"""
Baixa sprites de itens de https://eduanttunes.github.io/stardew_valley_ids/
e mapeia codigo -> nome de arquivo no seed.

Roda com: python scripts/fetch-sprites.py

Saída:
- public/sprites/items/*.png (574 sprites pixel-art)
- data/seed/ids.json com novo campo `imagem`
"""
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).parent.parent
SEED = ROOT / "data" / "seed" / "ids.json"
SPRITES_DIR = ROOT / "public" / "sprites" / "items"
SPRITES_DIR.mkdir(parents=True, exist_ok=True)

BASE = "https://eduanttunes.github.io/stardew_valley_ids"


def fetch_index() -> dict[str, str]:
    """Retorna mapa codigo -> filename a partir do HTML do site."""
    with urllib.request.urlopen(BASE + "/") as r:
        html = r.read().decode("utf-8", errors="ignore")

    # Procura por linhas de tabela: <td>123</td>...<img data-src="public/img/Foo.png">
    # Padrão observado: cada item tem um td com codigo e um img com data-src
    out: dict[str, str] = {}
    # Estratégia: dividir por linhas que contém data-src e capturar com regex
    # encontra todos os blocos com codigo (TD com numero) seguido por data-src
    pattern = re.compile(r'<th[^>]*>\s*\[(\d+)\]\s*</th>\s*<td[^>]*>\s*<img[^>]*data-src="public/img/([^"]+\.png)"', re.DOTALL)
    for m in pattern.finditer(html):
        codigo = m.group(1)
        filename = m.group(2)
        out[codigo] = filename

    print(f"Encontrados {len(out)} pares codigo->arquivo no HTML")
    return out


def download_one(filename: str) -> tuple[str, str]:
    """Baixa um sprite. Retorna (filename, status)."""
    dest = SPRITES_DIR / filename
    if dest.exists() and dest.stat().st_size > 0:
        return filename, "skip"
    try:
        with urllib.request.urlopen(f"{BASE}/public/img/{urllib.request.quote(filename)}", timeout=10) as r:
            dest.write_bytes(r.read())
        return filename, "ok"
    except Exception as e:
        return filename, f"erro: {e}"


def main():
    print("Buscando índice do site...")
    code_to_file = fetch_index()
    if not code_to_file:
        print("ERRO: nenhuma imagem encontrada no HTML")
        sys.exit(1)

    # Baixar em paralelo
    filenames = sorted(set(code_to_file.values()))
    print(f"Baixando {len(filenames)} sprites em paralelo...")
    ok = skip = err = 0
    with ThreadPoolExecutor(max_workers=12) as pool:
        futures = [pool.submit(download_one, f) for f in filenames]
        for i, fut in enumerate(as_completed(futures), 1):
            _, status = fut.result()
            if status == "ok": ok += 1
            elif status == "skip": skip += 1
            else: err += 1
            if i % 50 == 0 or i == len(filenames):
                print(f"  {i}/{len(filenames)} (ok={ok} skip={skip} err={err})")

    # Atualizar seed
    print("\nAtualizando data/seed/ids.json...")
    data = json.loads(SEED.read_text(encoding="utf-8"))
    matched = 0
    for entry in data:
        fname = code_to_file.get(entry["codigo"])
        if fname:
            entry["imagem"] = fname
            matched += 1
        else:
            entry["imagem"] = None
    SEED.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    print(f"  {matched}/{len(data)} entries com sprite mapeado")
    print(f"\nOK — {ok + skip} sprites salvos em {SPRITES_DIR}")


if __name__ == "__main__":
    main()
