#!/usr/bin/env python3
"""Create high-resolution fleet assets while preserving the original cutouts."""

from pathlib import Path

import numpy as np
from PIL import Image, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "rent_car_transparent"
DESTINATION = ROOT / "public" / "rent_car_hd"
TARGET_SIZE = (1200, 1200)


def resize_with_alpha(image: Image.Image) -> Image.Image:
    rgba = np.asarray(image.convert("RGBA"), dtype=np.float32) / 255.0
    alpha = rgba[..., 3]
    premultiplied = rgba[..., :3] * alpha[..., None]

    resized_alpha = np.asarray(
        Image.fromarray(alpha).resize(TARGET_SIZE, Image.Resampling.LANCZOS),
        dtype=np.float32,
    )
    resized_channels = [
        np.asarray(
            Image.fromarray(premultiplied[..., channel]).resize(
                TARGET_SIZE, Image.Resampling.LANCZOS
            ),
            dtype=np.float32,
        )
        for channel in range(3)
    ]
    resized_premultiplied = np.stack(resized_channels, axis=-1)
    safe_alpha = np.maximum(resized_alpha[..., None], 1 / 255)
    resized_rgb = np.where(
        resized_alpha[..., None] > 0,
        resized_premultiplied / safe_alpha,
        0,
    )

    rgb = Image.fromarray(np.uint8(np.clip(resized_rgb, 0, 1) * 255))
    rgb = ImageEnhance.Contrast(rgb).enhance(1.02)
    rgb = rgb.filter(ImageFilter.UnsharpMask(radius=0.85, percent=90, threshold=3))
    output = rgb.convert("RGBA")
    output.putalpha(Image.fromarray(np.uint8(np.clip(resized_alpha, 0, 1) * 255)))
    return output


def main() -> None:
    DESTINATION.mkdir(parents=True, exist_ok=True)
    sources = sorted(SOURCE.glob("*.webp"))
    if not sources:
        raise SystemExit(f"Nenhuma imagem encontrada em {SOURCE}")

    for source in sources:
        with Image.open(source) as image:
            enhanced = resize_with_alpha(image)
            enhanced.save(
                DESTINATION / source.name,
                "WEBP",
                quality=95,
                method=6,
                exact=True,
            )

    print(f"{len(sources)} imagens HD criadas em {DESTINATION}")


if __name__ == "__main__":
    main()
