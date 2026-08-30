#!/usr/bin/env python3
"""Mede a bounding-box opaca real de cada 01-oficial.webp e calcula a escala
do card /frota para que TODAS as viaturas fiquem assentes na base com a mesma
ALTURA renderizada, sem nunca cortar (topo ou rodas).

Saída: bloco TS pronto para colar em src/data/fleetPresentation.ts.
"""
import re
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
FLYER = (ROOT / "src/data/fleetFlyer2026.ts").read_text()

# id -> pasta da imagem
PAIRS = re.findall(r"id:\s*'([^']+)'[^}]*?image:\s*'([^']+)'", FLYER)

# Geometria do card: frame aspect 16/10, padding aproximado (px-7 pt-7 pb-2).
# Fração da altura do frame ocupada pela área de conteúdo vertical.
CONTENT_H_FRAC = 0.90          # (frameH - pt - pb) / frameH  (~pt 28 / pb 8 em ~360)
CONTENT_W_FRAC = 0.90
FRAME_ASPECT = 16 / 10
TARGET_CAR_H = 0.87            # altura opaca-alvo do carro (fração do frame)
HOVER_MUL = 1.02              # zoom do hover — a trava tem de aguentar isto
TOP_MARGIN = 0.04            # folga mínima entre o tejadilho e o topo do frame

rows = []
for vid, folder in PAIRS:
    p = ROOT / "public/fleet-flyer-2026" / folder / "01-oficial.webp"
    if not p.exists():
        print(f"# FALTA {vid}: {p}")
        continue
    im = Image.open(p).convert("RGBA")
    w, h = im.size
    bbox = im.getbbox()  # (l, t, r, b) do conteúdo não-transparente
    if not bbox:
        continue
    top_frac = bbox[1] / h                         # margem transparente no topo
    car_h_frac = (bbox[3] - bbox[1]) / h           # altura opaca / altura ficheiro
    n_asp = w / h

    # object-contain dentro da caixa de conteúdo (imagem mais larga que a caixa):
    # altura desenhada dh = contentW / n_asp ; frameH = frameW / FRAME_ASPECT
    # dh / frameH = (CONTENT_W_FRAC * FRAME_ASPECT) / n_asp
    dh_over_frame = (CONTENT_W_FRAC * FRAME_ASPECT) / n_asp
    dh_over_frame = min(dh_over_frame, CONTENT_H_FRAC)  # se limitada pela altura

    # escala para a altura opaca do carro == TARGET_CAR_H do frame
    scale = TARGET_CAR_H / (dh_over_frame * car_h_frac)

    # trava real: com a viatura assente na base, o tejadilho opaco não pode
    # passar o topo do frame nem no zoom do hover. Só conta o pixel opaco —
    # a margem transparente pode sair do quadro à vontade.
    #   carTop = 1 - S*HOVER_MUL*dh_over_frame*(1 - top_frac)  >=  TOP_MARGIN
    max_scale = (1 - TOP_MARGIN) / (HOVER_MUL * dh_over_frame * (1 - top_frac))
    scale = min(scale, max_scale)
    rows.append((vid, round(scale, 2)))

print("const FLEET_IMAGE_SCALES: Record<string, number> = {")
for vid, s in rows:
    print(f"  '{vid}': {s},")
print("};")
