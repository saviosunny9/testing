# Builds the lifestyle photos in public/media/life/ from the client's reference photography:
# removes other brands' products (inpainting), crops, and composites an Alaro render into each scene.
# usage: python3 lifestyle.py <photo dir> <render dir> <out dir> [scene ...]
#   photo dir: the client photos 10.jpg … 14.jpg   render dir: r10.png … r14.png from shoot.js (see README)
import sys
import numpy as np
import cv2
from PIL import Image, ImageFilter, ImageEnhance

src, rdir, out = sys.argv[1:4]
only = set(sys.argv[4:])


def load(n):
    return cv2.imread(f'{src}/{n}.jpg')


def inpaint(img, mask, r=7):
    return cv2.inpaint(img, mask, r, cv2.INPAINT_TELEA)


def rect_mask(img, *rects, dilate=0):
    m = np.zeros(img.shape[:2], np.uint8)
    for x0, y0, x1, y1 in rects:
        m[y0:y1, x0:x1] = 255
    if dilate:
        m = cv2.dilate(m, np.ones((dilate, dilate), np.uint8))
    return m


def poly_mask(img, *polys):
    m = np.zeros(img.shape[:2], np.uint8)
    for p in polys:
        cv2.fillPoly(m, [np.array(p, np.int32)], 255)
    return m


def repaint_plain(img, mask):
    """Fill a printed area with the plain surface around the print: a smooth shading plane
    (colour = a*x + b*y + c per channel) fitted on the unprinted pixels, plus a little grain."""
    out = img.copy()
    ys, xs = np.nonzero(mask)
    pix = img[ys, xs].astype(float)
    # unprinted: bright, neutral-to-warm (the print is blue, grey or orange)
    plain = (pix.min(axis=1) > 200) & (np.ptp(pix, axis=1) < 32) & (pix[:, 0] <= pix[:, 2] + 2)
    A = np.stack([xs, ys, np.ones_like(xs)], axis=1).astype(float)
    base = np.zeros_like(pix)
    for c in range(3):
        coef, *_ = np.linalg.lstsq(A[plain], pix[plain, c], rcond=None)
        base[:, c] = A @ coef
    # match the level of the clean surface just outside the patch
    ring = cv2.dilate(mask, np.ones((9, 9), np.uint8)) & ~mask
    ry, rx = np.nonzero(ring)
    rp = img[ry, rx].astype(float)
    rplain = (rp.min(axis=1) > 200) & (np.ptp(rp, axis=1) < 40)
    if rplain.sum() > 10:
        base += np.median(rp[rplain], axis=0) - np.median(base, axis=0)
    noise = np.random.default_rng(3).normal(0, 1.4, base.shape)
    out[ys, xs] = np.clip(base + noise, 0, 255).astype(np.uint8)
    soft = cv2.GaussianBlur(out, (3, 3), 0)
    edge = cv2.dilate(mask, np.ones((3, 3), np.uint8)) - cv2.erode(mask, np.ones((3, 3), np.uint8))
    out[edge > 0] = soft[edge > 0]
    return out


def text_mask(img, box, keep=lambda b, g, r: False, thresh=40):
    """Pixels inside box that differ from the label's (light) ground: printed text and logos."""
    x0, y0, x1, y1 = box
    m = np.zeros(img.shape[:2], np.uint8)
    roi = img[y0:y1, x0:x1].astype(int)
    b, g, r = roi[..., 0], roi[..., 1], roi[..., 2]
    ground = np.median(roi.reshape(-1, 3), axis=0)
    dist = np.abs(roi - ground).sum(axis=2)
    sel = (dist > thresh) & ~keep(b, g, r)
    m[y0:y1, x0:x1][sel] = 255
    return cv2.dilate(m, np.ones((3, 3), np.uint8))


def place(img, render, cx, base_y, height, warm=0.0, expo=1.0, shadow=1.0, blur=0.0, sat=1.0):
    """Composite a transparent render: product bottom at base_y, product height in px."""
    bg = Image.fromarray(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
    im = Image.open(render).convert('RGBA')
    a = im.split()[3]
    prod = a.point(lambda v: 255 if v > 200 else 0).getbbox()
    full = a.point(lambda v: 255 if v > 4 else 0).getbbox()
    im = im.crop(full)
    pl, pt, pr, pb = prod[0] - full[0], prod[1] - full[1], prod[2] - full[0], prod[3] - full[1]
    s = height / (pb - pt)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    pl, pt, pr, pb = [round(v * s) for v in (pl, pt, pr, pb)]
    r, g, b, a = im.split()
    a = a.point(lambda v: min(255, int(v * 1.9 * shadow)) if v < 70 else v)
    rgb = Image.merge('RGB', (r, g, b))
    rgb = ImageEnhance.Brightness(rgb).enhance(expo)
    rgb = ImageEnhance.Color(rgb).enhance(sat)
    r, g, b = rgb.split()
    r = r.point(lambda v: min(255, int(v * (1 + 0.06 * warm))))
    g = g.point(lambda v: min(255, int(v * (1 + 0.015 * warm))))
    b = b.point(lambda v: int(v * (1 - 0.10 * warm)))
    im = Image.merge('RGBA', (r, g, b, a))
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    bg.paste(im, (cx - (pl + pr) // 2, base_y - pb), im)
    return cv2.cvtColor(np.array(bg), cv2.COLOR_RGB2BGR)


def grain(img, amount=3.0):
    n = np.random.default_rng(7).normal(0, amount, img.shape)
    return np.clip(img.astype(float) + n, 0, 255).astype(np.uint8)


def save(img, name, width=None):
    if width and img.shape[1] > width:
        h = round(img.shape[0] * width / img.shape[1])
        img = cv2.resize(img, (width, h), interpolation=cv2.INTER_AREA)
    cv2.imwrite(f'{out}/{name}.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 86, cv2.IMWRITE_JPEG_OPTIMIZE, 1])
    print('wrote', name, img.shape[1], 'x', img.shape[0])


R = lambda n: f'{rdir}/r{n}.png'
scenes = {}


def scene(fn):
    scenes[fn.__name__] = fn
    return fn


@scene
def evening():
    """10: a speaker on the side table becomes Alaro."""
    img = load(10)
    img = inpaint(img, poly_mask(img, [(296, 330), (322, 312), (456, 318), (458, 572), (300, 572)]), 11)
    img = place(img, R(10), 377, 566, 262, warm=1.6, expo=0.98, shadow=0.85, blur=0.35)
    save(grain(img, 2.4), 'evening', 1100)


@scene
def lounge():
    """14: robot vacuum and its dock removed; Alaro on the wooden side table."""
    img = load(14)
    # the rug is even, so patch it from just to the right and blend the light across (Poisson)
    m = poly_mask(img, [(652, 552), (672, 547), (728, 548), (746, 542), (754, 556), (752, 598), (700, 602), (655, 594)])
    m = cv2.dilate(m, np.ones((7, 7), np.uint8))
    patch = np.roll(img, -112, axis=1)
    img = cv2.seamlessClone(patch, img, m, (703, 568), cv2.NORMAL_CLONE)
    img = img[:, 130:]  # the dock sits against the left wall
    img = place(img, R(14), 1018 - 130, 449, 66, warm=0.9, expo=1.02, shadow=0.9)
    save(grain(img, 2.0), 'lounge', 1600)


@scene
def companion():
    """13: the orange frame and the pet-food bag are cropped away; Alaro on the side table by the dog."""
    img = load(13)
    img = img[0:505, 20:1180]
    img = place(img, R(13), 1012 - 20, 447, 62, warm=2.2, expo=0.78, shadow=0.8, sat=0.9)
    save(grain(img, 2.6), 'companion', 1600)


@scene
def kitchen_family():
    """12: brand marks removed from the spray bottle; the sunscreen stick on the island becomes Alaro."""
    img = load(12)
    # the bottle's printed label, traced between the thumb and fingers, is repainted as plain bottle
    label = poly_mask(img, [(507, 368), (527, 363), (532, 378), (530, 398), (524, 412), (521, 428), (515, 445),
                            (498, 448), (492, 435), (492, 415), (498, 398), (503, 383)])
    img = repaint_plain(img, label)
    img = inpaint(img, rect_mask(img, (838, 498, 890, 592), dilate=5), 9)
    img = place(img, R(12), 866, 592, 112, warm=1.4, expo=1.0, shadow=0.95)
    save(grain(img, 2.0), 'kitchen-family', 1400)


@scene
def playroom():
    """11: Alaro on the woven bench by the window."""
    img = load(11)
    img = place(img, R(11), 958, 240, 64, warm=1.4, expo=1.0, shadow=0.9)
    save(grain(img, 2.0), 'playroom', 1200)


for name, fn in scenes.items():
    if not only or name in only:
        fn()
