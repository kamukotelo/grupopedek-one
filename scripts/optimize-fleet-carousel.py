from pathlib import Path
from PIL import Image, ImageOps

converted = 0

roots = [Path("public/fleet-carousel"), Path("public/fleet-carousel-generated")]
sources = [source for root in roots for source in root.glob("*/*")]
for source in sorted(sources):
    if source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        continue
    target = source.with_suffix(".webp")
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        if image.mode not in {"RGB", "RGBA"}:
            image = image.convert("RGB")
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        image.save(target, "WEBP", quality=84, method=6)
    source.unlink()
    converted += 1

print(f"Otimizadas {converted} imagens para WebP.")
