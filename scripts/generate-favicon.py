#!/usr/bin/env python3
"""Regenerate the vector favicon and browser icons from the wheel's source palette.

Requires Pillow. Geometry is shared between the SVG and supersampled PNGs.
Run from any directory with: python3 scripts/generate-favicon.py
"""

import json
import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
COLORS = json.loads((ROOT / "src/reference-palette.json").read_text())["primary"]
VIEWBOX = 128
CENTER = VIEWBOX / 2
OUTER_RADIUS = 60
INNER_RADIUS = OUTER_RADIUS * 0.30
START_ANGLE = -120
PAPER = "#f8f9f3"


def point(radius, angle):
    radians = math.radians(angle)
    return (
        f"{CENTER + radius * math.cos(radians):.4f}",
        f"{CENTER + radius * math.sin(radians):.4f}",
    )


def svg_source():
    paths = []
    for index, color in enumerate(COLORS):
        start = START_ANGLE + index * 60
        end = start + 60
        outer_start = " ".join(point(OUTER_RADIUS, start))
        outer_end = " ".join(point(OUTER_RADIUS, end))
        paths.append(
            f'    <path fill="{color}" stroke="{color}" stroke-width="0.25" '
            f'd="M {CENTER:g} {CENTER:g} L {outer_start} '
            f'A {OUTER_RADIUS} {OUTER_RADIUS} 0 0 1 {outer_end} Z"/>'
        )
    ring_path = " ".join(
        f"M {CENTER + radius:g} {CENTER:g} "
        f"A {radius:g} {radius:g} 0 1 0 {CENTER - radius:g} {CENTER:g} "
        f"A {radius:g} {radius:g} 0 1 0 {CENTER + radius:g} {CENTER:g} Z"
        for radius in (OUTER_RADIUS, INNER_RADIUS)
    )
    # Clipping keeps both edges circular. Tiny matching-color strokes prevent
    # transparent antialiasing seams between adjacent wedges at favicon sizes.
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEWBOX} {VIEWBOX}" role="img" aria-label="Department of Emotions">
  <defs>
    <clipPath id="ring">
      <path clip-rule="evenodd" d="{ring_path}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#ring)">
{chr(10).join(paths)}
  </g>
</svg>
'''


def render(size, background=None, inset=1):
    # Render 8x and downsample once for smooth circular edges at 16–192 px.
    scale = 8
    canvas_size = size * scale
    unit = canvas_size / VIEWBOX * inset
    center = canvas_size / 2
    outer = OUTER_RADIUS * unit
    inner = INNER_RADIUS * unit
    bounds = (center - outer, center - outer, center + outer, center + outer)
    image = Image.new("RGBA", (canvas_size, canvas_size), COLORS[0])
    draw = ImageDraw.Draw(image)
    for index, color in enumerate(COLORS):
        start = START_ANGLE + index * 60
        draw.pieslice(bounds, start, start + 60, fill=color)
    mask = Image.new("L", image.size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse(bounds, fill=255)
    mask_draw.ellipse(
        (center - inner, center - inner, center + inner, center + inner), fill=0
    )
    image.putalpha(mask)
    if background:
        paper = Image.new("RGBA", image.size, background)
        image = Image.alpha_composite(paper, image)
    image = image.resize((size, size), Image.Resampling.LANCZOS)
    if not background:
        # Use exact supersample coverage for alpha so the tiny 16px center
        # stays fully transparent instead of collecting Lanczos ringing.
        image.putalpha(mask.resize((size, size), Image.Resampling.BOX))
    return image


def main():
    PUBLIC.mkdir(exist_ok=True)
    (PUBLIC / "favicon.svg").write_text(svg_source())
    render(32).save(PUBLIC / "favicon-32.png")
    render(192).save(PUBLIC / "favicon-192.png")
    render(180, background=PAPER, inset=0.86).convert("RGB").save(
        PUBLIC / "apple-touch-icon.png"
    )
    frames = [render(size) for size in (16, 32, 48)]
    frames[-1].save(
        PUBLIC / "favicon.ico",
        format="ICO",
        sizes=[frame.size for frame in frames],
        append_images=frames[:-1],
    )
    for name, expected_size in (
        ("favicon-32.png", 32),
        ("favicon-192.png", 192),
        ("apple-touch-icon.png", 180),
    ):
        with Image.open(PUBLIC / name) as asset:
            assert asset.size == (expected_size, expected_size)
            if name != "apple-touch-icon.png":
                assert asset.mode == "RGBA"
                assert asset.getpixel((0, 0))[3] == 0
                assert asset.getpixel((expected_size // 2, expected_size // 2))[3] == 0
            else:
                assert asset.getpixel((0, 0)) == (248, 249, 243)
    with Image.open(PUBLIC / "favicon.ico") as icon:
        assert icon.ico.sizes() == {(16, 16), (32, 32), (48, 48)}
        for size in icon.ico.sizes():
            frame = icon.ico.getimage(size)
            assert frame.getpixel((0, 0))[3] == 0
            assert frame.getpixel((size[0] // 2, size[1] // 2))[3] == 0
    print("Generated favicon.svg, PNGs at 32/192 px, Apple icon at 180 px, and ICO at 16/32/48 px.")


if __name__ == "__main__":
    main()
