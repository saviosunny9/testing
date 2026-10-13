# Composites a transparent camera render into a film still.
# usage: python3 composite.py still.jpg render.png out.jpg cx base_y height blur warm exposure
import sys
from PIL import Image, ImageFilter, ImageEnhance
still, render, out = sys.argv[1:4]
cx, by, hgt = map(int, sys.argv[4:7]); blur = float(sys.argv[7]); warm = float(sys.argv[8]); expo = float(sys.argv[9])
bg = Image.open(still).convert('RGB')
im = Image.open(render).convert('RGBA')
a = im.split()[3]
# product = opaque pixels; shadow is the faint alpha around it
prod = a.point(lambda v: 255 if v > 200 else 0).getbbox()
full = a.point(lambda v: 255 if v > 4 else 0).getbbox()
im = im.crop(full)
pl, pt, pr, pb = prod[0]-full[0], prod[1]-full[1], prod[2]-full[0], prod[3]-full[1]
scale = hgt / (pb - pt)
im = im.resize((round(im.width*scale), round(im.height*scale)), Image.LANCZOS)
pl, pt, pr, pb = [round(v*scale) for v in (pl, pt, pr, pb)]
# deepen the soft shadow a little so it reads on real surfaces
r, g, b, a = im.split()
a = a.point(lambda v: min(255, int(v*1.9)) if v < 70 else v)
# warm/expose the product to sit in the scene's light
rgb = Image.merge('RGB', (r, g, b))
rgb = ImageEnhance.Brightness(rgb).enhance(expo)
r, g, b = rgb.split()
r = r.point(lambda v: min(255, int(v*(1+0.06*warm))))
b = b.point(lambda v: int(v*(1-0.10*warm)))
im = Image.merge('RGBA', (r, g, b, a))
if blur > 0:
    im = im.filter(ImageFilter.GaussianBlur(blur))
x = cx - (pl + pr)//2
y = by - pb
bg.paste(im, (x, y), im)
bg.save(out, quality=90)
