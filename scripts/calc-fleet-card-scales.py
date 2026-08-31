#!/usr/bin/env python3
"""Mede a bounding-box opaca real de cada 01-oficial.webp e calcula, para o
card /frota (moldura 16/9, object-bottom), a ESCALA e o DESLOCAMENTO vertical
de cada viatura para que:

  * TODAS tenham a mesma LARGURA renderizada (~80% da moldura) — a largura é
    a dimensão que o olho usa para comparar o tamanho de um carro de perfil;
  * as carroçarias baixas (limousine, Brabus, sedans) ganhem presença: há um
    "piso" de altura (>= ~50% da moldura);
  * vans/citadinos altos não estourem: trava de altura (<= ~92%) + folga de
    tejadilho;
  * fiquem assentes na base (~13px acima do fundo), sem NUNCA cortar, mesmo
    no zoom do hover.

Só conta o pixel opaco — as margens transparentes do PNG podem sair do quadro.

O modelo geométrico é aproximado. Depois de colar os dois blocos em
src/data/fleetPresentation.ts, medir no browser (largura opaca, folga das
rodas, folga do tejadilho) e afinar os outliers à mão — foi assim que os
valores atuais foram obtidos.
"""
import re
import pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[1]
FLYER = (ROOT / "src/data/fleetFlyer2026.ts").read_text().split("FLYER_VEHICLES")[1]
PAIRS = re.findall(r"\bid:\s*'([a-z0-9-]+)'[\s\S]*?image:\s*'([a-z0-9-]+)'", FLYER)

FRAME_ASPECT = 16 / 9
CONTENT_W_FRAC = 0.90
CONTENT_H_FRAC = 0.88          # (frameH - pt-5 - pb-2) / frameH  em ~257px
TARGET_CAR_W = 0.80           # largura opaca-alvo (fração da largura do frame)
FLOOR_CAR_H = 0.50           # altura opaca mínima (dá presença às carroçarias baixas)
MAX_CAR_H = 0.92            # altura opaca máxima (estado hover)
HOVER_MUL = 1.02
ROOF_MIN = 0.02            # folga mínima tejadilho ↔ topo (fração do frame)
TARGET_BOT_GAP = 0.05     # folga desejada rodas ↔ base

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
    top_frac = bbox[1] / h
    bot_frac = (h - bbox[3]) / h
    car_w_frac = (bbox[2] - bbox[0]) / w
    car_h_frac = (bbox[3] - bbox[1]) / h
    n_asp = w / h

    dwOF = min(CONTENT_W_FRAC, CONTENT_H_FRAC * n_asp / FRAME_ASPECT)
    dhOF = min(CONTENT_H_FRAC, CONTENT_W_FRAC * FRAME_ASPECT / n_asp)

    # largura-alvo, com piso de altura para as carroçarias baixas
    scale = max(TARGET_CAR_W / (dwOF * car_w_frac),
                FLOOR_CAR_H / (dhOF * car_h_frac))
    # travas de altura e de tejadilho (estado hover)
    scale = min(scale, MAX_CAR_H / (HOVER_MUL * dhOF * car_h_frac))
    scale = min(scale, (1 - ROOF_MIN) / (HOVER_MUL * dhOF * (1 - top_frac)))
    scale = round(scale, 2)

    # deslocamento: empurra para baixo até as rodas ficarem a TARGET_BOT_GAP
    s = scale * HOVER_MUL
    car_bot = 1 - bot_frac * s * dhOF
    offset = max(0.0, round((1 - TARGET_BOT_GAP) - car_bot, 3))

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
