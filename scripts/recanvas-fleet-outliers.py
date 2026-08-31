#!/usr/bin/env python3
"""Re-enquadra os recortes cujo ficheiro PNG tem um rácio muito diferente da
moldura 16/9 do card /frota (ou margens laterais enormes). O `object-contain`
encaixa esses ficheiros pela ALTURA e desperdiça espaço horizontal, pelo que a
viatura fica estreita e a escala bate nas travas antes de chegar aos ~80%.

A correção é só de ENQUADRAMENTO: recortamos a bounding-box opaca (pixels da
viatura ficam 1:1, sem perda) e colamo-la numa tela transparente 16/9, centrada
na horizontal e assente na base. Assim o `object-contain` passa a encaixar pela
largura e a escala fica perto de 1.0.

O ficheiro original é guardado em 01-oficial.orig.webp (só na 1.ª vez).
"""
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]

TARGETS = [
    "suzuki-s-presso",
    "mercedes-g63-atual",
    "range-rover-blindado-2025",
    "novo-toyota-prado",
    "range-rover",
]

CANVAS_ASPECT = 16 / 9
CAR_W_MAX = 0.86      # largura da viatura <= 86% da tela
CAR_H_MAX = 0.88      # altura  da viatura <= 88% da tela
BOTTOM_MARGIN = 0.05  # folga por baixo da viatura

for slug in TARGETS:
    d = ROOT / "public/fleet-flyer-2026" / slug
    src = d / "01-oficial.webp"
    backup = d / "01-oficial.orig.webp"
    if not src.exists():
        print(f"# FALTA {src}")
        continue
    if not backup.exists():
        Image.open(src).save(backup, "WEBP", lossless=True, quality=100)

    im = Image.open(backup if backup.exists() else src).convert("RGBA")
    bbox = im.getbbox()
    car = im.crop(bbox)
    cw, ch = car.size

    # dimensiona a tela: respeita simultaneamente CAR_W_MAX e CAR_H_MAX
    canvas_w = max(cw / CAR_W_MAX, (ch / CAR_H_MAX) * CANVAS_ASPECT)
    canvas_h = canvas_w / CANVAS_ASPECT
    canvas_w, canvas_h = round(canvas_w), round(canvas_h)

    canvas = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    x = (canvas_w - cw) // 2
    y = canvas_h - round(BOTTOM_MARGIN * canvas_h) - ch
    canvas.paste(car, (x, max(0, y)), car)
    canvas.save(src, "WEBP", lossless=True, quality=100)

    print(f"{slug:26s} car {cw}x{ch} (asp {cw/ch:.2f})  ->  tela {canvas_w}x{canvas_h}  "
          f"carW={cw/canvas_w*100:.0f}% carH={ch/canvas_h*100:.0f}% topo={y/canvas_h*100:.0f}%")
