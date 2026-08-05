"""Genera las capas del retrato del hero a partir de la foto original.

Salidas en public/images/:
  - ricardo-hero.png           retrato recortado (alpha), graduado y con base fundida
  - ricardo-hero-ambient.webp  entorno del set sin el sujeto, desenfocado y disuelto

Uso: python scripts/hero-portrait.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public" / "images" / "ricardo-zuluaga.png"
OUT_DIR = ROOT / "public" / "images"

# Fondo del sitio (zinc-950): los bordes de cada capa deben fundirse a este color.
BG = (9, 9, 11)


def cutout(src: Image.Image) -> Image.Image:
    """Máscara del sujeto. Sin alpha matting: en esta foto deja halo del set."""
    from rembg import new_session, remove

    session = new_session("u2net_human_seg")
    return remove(src, session=session).convert("RGBA")


def smoothstep(pos: float) -> float:
    return pos * pos * (3 - 2 * pos)


def grade(rgba: Image.Image) -> Image.Image:
    """Coloca al sujeto en una escena oscura: menos brillo, sombras frías."""
    rgb = rgba.convert("RGB")
    rgb = ImageEnhance.Contrast(rgb).enhance(1.04)
    rgb = ImageEnhance.Color(rgb).enhance(0.94)
    rgb = ImageEnhance.Brightness(rgb).enhance(0.95)

    # Roll-off de altas luces: el hoodie blanco no debe quemarse sobre fondo negro.
    rgb = rgb.point(lambda v: v if v < 226 else int(226 + (v - 226) * 0.55))

    # Tinte teal en las sombras, ponderado por la luminancia invertida.
    shadow_weight = rgb.convert("L").point(lambda v: int((255 - v) * 0.28))
    tint = Image.new("RGB", rgb.size, (8, 22, 20))
    rgb = Image.composite(tint, rgb, shadow_weight)

    # merge, no paste: pegar RGB sobre RGBA fuerza alfa 255 y anula el recorte.
    return Image.merge("RGBA", (*rgb.split(), rgba.getchannel("A")))


def refine_alpha(rgba: Image.Image) -> Image.Image:
    """Contrae un pixel y suaviza el borde para eliminar el contorno del set."""
    alpha = rgba.getchannel("A")
    alpha = alpha.filter(ImageFilter.MinFilter(3))
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))
    alpha = alpha.point(lambda v: 0 if v < 10 else v)
    out = rgba.copy()
    out.putalpha(alpha)
    return out


def reframe(rgba: Image.Image, headroom: float = 0.07, ratio: float = 3 / 4) -> Image.Image:
    """Reencuadra sobre el sujeto: sin aire muerto arriba, centrado en horizontal."""
    box = rgba.getchannel("A").point(lambda v: 255 if v > 16 else 0).getbbox()
    if box is None:
        return rgba
    left, top, right, bottom = box
    subject_h = bottom - top

    out_h = int(subject_h / (1 - headroom))
    out_w = int(out_h * ratio)
    canvas = Image.new("RGBA", (out_w, out_h), (0, 0, 0, 0))

    dx = (out_w - (right - left)) // 2 - left
    dy = int(out_h * headroom) - top
    canvas.paste(rgba, (dx, dy))
    return canvas


def feather_base(rgba: Image.Image, ratio: float = 0.3) -> Image.Image:
    """Disuelve la parte inferior para que el recorte no acabe en un corte seco."""
    w, h = rgba.size
    fade_px = max(int(h * ratio), 2)
    ramp = Image.new("L", (1, h), 255)
    for i in range(fade_px):
        ramp.putpixel((0, h - fade_px + i), int(255 * smoothstep(1 - i / (fade_px - 1))))
    mask = ramp.resize((w, h), Image.BILINEAR)
    out = rgba.copy()
    out.putalpha(ImageChops.multiply(rgba.getchannel("A"), mask))
    return out


def additive_alpha(scene: Image.Image, strength: float = 0.9, gamma: float = 1.25) -> Image.Image:
    """Convierte la escena en una capa que solo suma luz.

    El alfa sale de la luminancia y el color se normaliza a brillo pleno, así que
    compuesta con alpha normal equivale a una mezcla aditiva: las zonas oscuras
    del set desaparecen (deja ver la retícula del fondo) y solo pasan las luces.
    No necesita mix-blend-mode, que framer-motion aísla con su stacking context.
    """
    import numpy as np

    rgb = np.asarray(scene.convert("RGB"), dtype=np.float32) / 255.0
    lum = rgb.max(axis=2)
    alpha = np.clip(lum**gamma * strength, 0.0, 1.0)
    norm = rgb / np.maximum(lum, 1e-4)[..., None]

    out = np.concatenate([norm, alpha[..., None]], axis=2)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype("uint8"), "RGBA")


def radial_mask(size: tuple[int, int], rx: float = 0.62, ry: float = 0.56, cy: float = 0.42) -> Image.Image:
    """Máscara elíptica suave para disolver la capa de entorno en el fondo."""
    import numpy as np

    w, h = size
    x = (np.arange(w) - w * 0.5) / (w * rx)
    y = (np.arange(h) - h * cy) / (h * ry)
    dist = np.sqrt(x[None, :] ** 2 + y[:, None] ** 2)
    fade = np.clip(1.0 - dist, 0.0, 1.0)
    fade = fade * fade * (3 - 2 * fade)
    return Image.fromarray((fade * 255).astype("uint8"), "L")


def ambient(src: Image.Image, subject_alpha: Image.Image) -> Image.Image:
    """Entorno del set sin el sujeto: bokeh oscuro que da profundidad al hero.

    El sujeto ocupa el centro, así que el hueco se rellena espejando las franjas
    laterales; con el desenfoque final la costura es invisible.
    """
    w, h = src.size
    left, _, right, _ = subject_alpha.point(lambda v: 255 if v > 16 else 0).getbbox()
    left, right = max(left, 24), min(right, w - 24)

    scene = src.convert("RGB").copy()
    gap = right - left
    half = gap // 2 + 2
    for strip, dest in (
        (src.crop((0, 0, left, h)), left),
        (src.crop((right, 0, w, h)), left + half),
    ):
        filler = strip.resize((half, h), Image.LANCZOS).transpose(Image.FLIP_LEFT_RIGHT)
        scene.paste(filler, (dest, 0))

    scene = scene.filter(ImageFilter.GaussianBlur(30))
    scene = ImageEnhance.Brightness(scene).enhance(0.62)
    scene = ImageEnhance.Color(scene).enhance(1.1)
    scene = scene.resize((w // 2, h // 2), Image.LANCZOS)

    out = additive_alpha(scene)
    out.putalpha(ImageChops.multiply(out.getchannel("A"), radial_mask(out.size)))
    return out


def main() -> None:
    src = Image.open(SRC).convert("RGB")
    raw = cutout(src)

    portrait = feather_base(reframe(refine_alpha(grade(raw))))
    portrait_path = OUT_DIR / "ricardo-hero.png"
    portrait.save(portrait_path, optimize=True)

    ambient_path = OUT_DIR / "ricardo-hero-ambient.webp"
    ambient(src, raw.getchannel("A")).save(ambient_path, quality=82, method=6)

    for path in (portrait_path, ambient_path):
        size = Image.open(path).size
        print(f"{path.relative_to(ROOT)}  {size}  {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
