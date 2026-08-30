#!/usr/bin/env python3
"""Mede a bounding-box opaca real de cada 01-oficial.webp e calcula, para o
card /frota, a ESCALA e o DESLOCAMENTO vertical de cada viatura para que:

  * fique sempre assente na base do card (próximo da parte de baixo);
  * tenha aproximadamente a mesma altura renderizada;
  * NUNCA corte — nem o tejadilho no topo nem as rodas em baixo — mesmo
    durante o zoom do hover.

Só conta o pixel opaco: as margens transparentes do PNG podem sair do quadro.

Saída: dois blocos TS prontos para colar em src/data/fleetPresentation.ts.
"""
import re
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
FLYER = (ROOT / "src/data/fleetFlyer2026.ts").read_text()

# id -> pasta da imagem
PAIRS = re.findall(r"id:\s*'([^']+)'[^}]*?image:\s*'([^']+)'", FLYER)

# Geometria do card: frame aspect 16/10, padding px-7 pt-7 pb-2 (~pt 28 / pb 8).
CONTENT_W_FRAC = 0.90
CONTENT_H_FRAC = 0.90
BOT_PAD_FRAC = 0.022          # pb-2 / altura do frame
FRAME_ASPECT = 16 / 10
TARGET_CAR_H = 0.87           # altura opaca-alvo do carro (fração do frame)
TARGET_BOT_GAP = 0.05        # folga desejada entre as rodas e a base do frame
HOVER_MUL = 1.02             # zoom do hover — as travas têm de aguentar isto
TOP_MARGIN = 0.04           # folga mínima entre o tejadilho e o topo do frame

scales, offsets = [], []
for vid, folder in PAIRS:
    p = ROOT / "public/fleet-flyer-2026" / folder / "01-oficial.webp"
    if not p.exists():
        print(f"# FALTA {vid}: {p}")
        continue
    im = Image.open(p).convert("RGBA")
    w, h = im.size
    bbox = im.getbbox()
    if not bbox:
        continue
    top_frac = bbox[1] / h                      # margem transparente no topo
    bot_frac = (h - bbox[3]) / h                # margem transparente em baixo
    car_h_frac = (bbox[3] - bbox[1]) / h        # altura opaca / altura ficheiro
    n_asp = w / h

    # object-contain: altura desenhada (pré-escala) em frações do frame
    dOF = min((CONTENT_W_FRAC * FRAME_ASPECT) / n_asp, CONTENT_H_FRAC)

    # escala para a altura opaca do carro == TARGET_CAR_H do frame
    scale = TARGET_CAR_H / (dOF * car_h_frac)

    # trava do topo: carTop = 1 - S*HOVER_MUL*dOF*(1-top_frac) >= TOP_MARGIN
    scale = min(scale, (1 - TOP_MARGIN) / (HOVER_MUL * dOF * (1 - top_frac)))
    scale = round(scale, 2)

    # com a viatura assente, onde ficam as rodas? (estado hover = pior caso)
    s = scale * HOVER_MUL
    car_bot = 1 - BOT_PAD_FRAC * s - bot_frac * s * dOF
    # empurra para baixo só o necessário para encostar as rodas à base
    offset = (1 - TARGET_BOT_GAP) - car_bot
    offset = max(0.0, round(offset, 3))

    scales.append((vid, scale))
    if offset >= 0.01:
        offsets.append((vid, f"{round(offset * 100)}%"))

print("const FLEET_IMAGE_SCALES: Record<string, number> = {")
for vid, v in scales:
    print(f"  '{vid}': {v},")
print("};\n")

print("const FLEET_IMAGE_OFFSET_Y: Record<string, string> = {")
for vid, v in offsets:
    print(f"  '{vid}': '{v}',")
print("};")
