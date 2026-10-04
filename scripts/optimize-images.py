"""
Builds lightweight WebP copies of the site's photos so the browser can pick
the right size for each screen (srcset) instead of downloading the camera
original.

    python scripts/optimize-images.py

Requires Pillow (pip install pillow). Originals are never modified. Output
goes to src/assets/_optimized/, mirroring each original's path with a
-<width>w.webp suffix:

    src/assets/boda/X.jpg        -> src/assets/_optimized/boda/X-640w.webp ...
    public/projects/Y-poster.png -> src/assets/_optimized/public/projects/Y-poster-640w.webp ...

src/utils/responsiveImage.js picks these up automatically. A photo with no
copies yet (e.g. one just dropped into a folder) still works — it falls
back to the original file — so re-run this after adding new photos.
Already-processed photos are skipped unless the original changed.
"""

import os
import sys

from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'src', 'assets', '_optimized')
WIDTHS = [640, 1280, 2048]
QUALITY = 80
EXTENSIONS = ('.jpg', '.jpeg', '.png', '.webp')

Image.MAX_IMAGE_PIXELS = None  # camera originals are legitimately huge


def sources():
    assets = os.path.join(ROOT, 'src', 'assets')
    for dirpath, dirnames, filenames in os.walk(assets):
        dirnames[:] = [d for d in dirnames if d != '_optimized']
        for name in filenames:
            if name.lower().endswith(EXTENSIONS):
                rel = os.path.relpath(os.path.join(dirpath, name), assets)
                yield os.path.join(dirpath, name), rel

    # Posters and page photos served from public/ (logos are already small).
    projects = os.path.join(ROOT, 'public', 'projects')
    for name in os.listdir(projects):
        if name.lower().endswith(EXTENSIONS) and 'logo' not in name.lower():
            yield os.path.join(projects, name), os.path.join('public', 'projects', name)


def target_widths(width):
    widths = [w for w in WIDTHS if w < width]
    if width <= WIDTHS[-1]:
        widths.append(width)
    return widths


def process(src, rel):
    stem = os.path.splitext(rel)[0]
    out_base = os.path.join(OUT_DIR, stem)
    src_mtime = os.path.getmtime(src)

    with Image.open(src) as im:
        icc = im.info.get('icc_profile')
        im = ImageOps.exif_transpose(im)  # keep the orientation the browser shows
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA')
            if im.getchannel('A').getextrema()[0] == 255:
                im = im.convert('RGB')  # fully opaque screenshot — drop alpha
        elif im.mode != 'RGB':
            im = im.convert('RGB')

        written = 0
        for w in target_widths(im.width):
            out = f'{out_base}-{w}w.webp'
            if os.path.exists(out) and os.path.getmtime(out) >= src_mtime:
                continue
            os.makedirs(os.path.dirname(out), exist_ok=True)
            h = round(im.height * w / im.width)
            resized = im if w == im.width else im.resize((w, h), Image.LANCZOS)
            resized.save(out, 'WEBP', quality=QUALITY, method=6, icc_profile=icc)
            written += 1
        return written


def main():
    total = 0
    for src, rel in sources():
        n = process(src, rel)
        if n:
            print(f'{n} file(s)  {rel}')
        total += n
    print(f'Done — {total} WebP file(s) written.')


if __name__ == '__main__':
    sys.stdout.reconfigure(encoding='utf-8')
    main()
