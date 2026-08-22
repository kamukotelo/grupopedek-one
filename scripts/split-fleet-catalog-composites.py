#!/usr/bin/env python3
"""Split the premium five-panel fleet catalogs into customer-ready images."""

from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE_ROOT = ROOT / "public" / "fleet-carousel-generated"
OUTPUTS = (
    "01-exterior-principal.webp",
    "02-exterior-traseira.webp",
    "03-exterior-lateral.webp",
    "04-interior-cockpit.webp",
    "05-interior-passageiros.webp",
)


def white_separator_runs(image: Image.Image) -> list[tuple[int, int]]:
    pixels = np.asarray(image.convert("RGB"))
    nearly_white = pixels.mean(axis=2) > 242
    rows = np.flatnonzero(nearly_white.mean(axis=1) > 0.9)
    runs: list[tuple[int, int]] = []
    for row in rows:
        if runs and row <= runs[-1][1] + 1:
            runs[-1] = (runs[-1][0], int(row))
        else:
            runs.append((int(row), int(row)))
    return [run for run in runs if run[0] > image.height * 0.25]


def vertical_separator(image: Image.Image, top: int, bottom: int) -> tuple[int, int]:
    pixels = np.asarray(image.convert("RGB"))[top:bottom]
    nearly_white = pixels.mean(axis=2) > 242
    columns = np.flatnonzero(nearly_white.mean(axis=0) > 0.85)
    middle = [int(column) for column in columns if image.width * 0.35 < column < image.width * 0.65]
    if not middle:
        midpoint = image.width // 2
        return midpoint, midpoint
    return min(middle), max(middle)


def split_catalog(source: Path) -> None:
    image = Image.open(source).convert("RGB")
    runs = white_separator_runs(image)
    if len(runs) >= 2:
        first, second = runs[0], runs[1]
        hero_bottom = first[0]
        middle_top = first[1] + 1
        middle_bottom = second[0]
        bottom_top = second[1] + 1
    else:
        hero_bottom = round(image.height * 0.5)
        middle_top = hero_bottom
        middle_bottom = round(image.height * 0.75)
        bottom_top = middle_bottom

    middle_left, middle_right = vertical_separator(image, middle_top, middle_bottom)
    bottom_left, bottom_right = vertical_separator(image, bottom_top, image.height)
    boxes = (
        (0, 0, image.width, hero_bottom),
        (0, middle_top, middle_left, middle_bottom),
        (middle_right + 1, middle_top, image.width, middle_bottom),
        (0, bottom_top, bottom_left, image.height),
        (bottom_right + 1, bottom_top, image.width, image.height),
    )

    for filename, box in zip(OUTPUTS, boxes):
        image.crop(box).save(source.parent / filename, "WEBP", quality=92, method=6)
    print(f"{source.parent.name}: {image.size} -> {len(boxes)} imagens")


for catalog in sorted(SOURCE_ROOT.glob("*/catalog-v1.webp")):
    split_catalog(catalog)
