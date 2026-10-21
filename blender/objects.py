"""Render the things on the desk: one transparent image per hobby object.

Run:  blender -b -P blender/objects.py -- [name ...]     (no names = all)
Out:  public/media/desk/<name>.webp, plus sizes.json with each frame's size

Every object, the journal included, is seen straight down at the same scale and
under the same lamp, so the site can lay them out together on its pale ground.
One unit is about 10 cm: the journal is 1.5 wide.
"""
import json
import math
import os
import re
import sys

import bpy

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "public", "media", "desk")
FONT = os.path.join(HERE, "fonts", "DMSerifDisplay-Regular.ttf")
FONT_ITALIC = os.path.join(HERE, "fonts", "DMSerifDisplay-Italic.ttf")

PX_PER_UNIT = 640
MARGIN = 0.5           # room around each object for its shadow to fade out
SAMPLES = 128


# ── Small kit ──────────────────────────────────────────────────────────────

def srgb(hex_rgb):
    def chan(c):
        c /= 255
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return tuple(chan(int(hex_rgb[i:i + 2], 16)) for i in (0, 2, 4)) + (1.0,)


def mat(name, colour, rough=0.5, metal=0.0, coat=0.0, glass=0.0, bump=None):
    """A Principled material. `bump` = (noise scale, strength) for a grainy surface."""
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes, links = m.node_tree.nodes, m.node_tree.links
    bsdf = nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = srgb(colour)
    bsdf.inputs["Roughness"].default_value = rough
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Coat Weight"].default_value = coat
    bsdf.inputs["Transmission Weight"].default_value = glass
    if bump:
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = bump[0]
        node = nodes.new("ShaderNodeBump")
        node.inputs["Strength"].default_value = bump[1]
        links.new(noise.outputs["Fac"], node.inputs["Height"])
        links.new(node.outputs[0], bsdf.inputs["Normal"])
    return m


def mottled(name, dark, light, scale, rough=0.3, coat=0.0):
    """Two colours mixed by noise: tortoiseshell, autumn leaves."""
    m = mat(name, dark, rough=rough, coat=coat)
    nodes, links = m.node_tree.nodes, m.node_tree.links
    noise = nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = scale
    noise.inputs["Detail"].default_value = 6
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.38
    ramp.color_ramp.elements[0].color = srgb(dark)
    ramp.color_ramp.elements[1].position = 0.66
    ramp.color_ramp.elements[1].color = srgb(light)
    coords = nodes.new("ShaderNodeTexCoord")
    links.new(coords.outputs["Object"], noise.inputs["Vector"])
    links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], nodes["Principled BSDF"].inputs["Base Color"])
    return m


def cloth(colour):
    """Book cloth: matte colour with a fine woven bump."""
    m = mat("cloth", colour, rough=0.9)
    nodes, links = m.node_tree.nodes, m.node_tree.links
    coords = nodes.new("ShaderNodeTexCoord")
    weave = nodes.new("ShaderNodeMath")
    weave.operation = "ADD"
    for i, direction in enumerate(("X", "Y")):
        wave = nodes.new("ShaderNodeTexWave")
        wave.bands_direction = direction
        wave.inputs["Scale"].default_value = 260
        links.new(coords.outputs["Object"], wave.inputs["Vector"])
        links.new(wave.outputs["Fac"], weave.inputs[i])
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.35
    bump.inputs["Distance"].default_value = 0.002
    links.new(weave.outputs[0], bump.inputs["Height"])
    links.new(bump.outputs[0], nodes["Principled BSDF"].inputs["Normal"])
    return m


def text(body, font_path, size, at, material, spacing=1.0, tracking=1.0):
    """Centred type lying flat, slightly raised, like foil stamped on a cover."""
    curve = bpy.data.curves.new("text", "FONT")
    curve.body = body
    curve.font = bpy.data.fonts.load(font_path, check_existing=True)
    curve.size = size
    curve.align_x = "CENTER"
    curve.space_line = spacing
    curve.space_character = tracking
    curve.extrude = 0.0012
    obj = bpy.data.objects.new("text", curve)
    obj.location = at
    obj.data.materials.append(material)
    bpy.context.collection.objects.link(obj)
    return obj


def finish(obj, material, smooth=True):
    obj.data.materials.append(material)
    if smooth:
        bpy.ops.object.shade_auto_smooth()
    return obj


def box(size, at, material, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1, location=at)
    obj = bpy.context.object
    obj.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = obj.modifiers.new("bevel", "BEVEL")
        mod.width, mod.segments = bevel, 4
    return finish(obj, material)


def cyl(radius, height, at, material, axis="Z", top=None):
    """A cylinder (or a cone when `top` gives the far radius), along `axis`."""
    bpy.ops.mesh.primitive_cone_add(vertices=72, radius1=radius, radius2=radius if top is None else top,
                                    depth=height, location=at)
    obj = bpy.context.object
    if axis == "X":
        obj.rotation_euler = (0, math.pi / 2, 0)
    elif axis == "Y":
        obj.rotation_euler = (math.pi / 2, 0, 0)
    return finish(obj, material)


def torus(major, minor, at, material, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=major, minor_radius=minor, major_segments=72,
                                     minor_segments=16, location=at, rotation=rot)
    return finish(bpy.context.object, material)


def ball(scale, at, material):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, segments=48, ring_count=24, location=at)
    obj = bpy.context.object
    obj.scale = scale
    return finish(obj, material)


def outline_mesh(points, thickness, material, rings=6, curl=0.0):
    """A flat shape from an outline, built as rings shrinking to the centre so it can curl."""
    cx = sum(p[0] for p in points) / len(points)
    cy = sum(p[1] for p in points) / len(points)
    half = max(abs(p[0] - cx) for p in points) or 1
    n = len(points)
    verts, faces = [], []
    for k in range(rings, 0, -1):
        f = k / rings
        for x, y in points:
            px, py = cx + (x - cx) * f, cy + (y - cy) * f
            verts.append((px, py, curl * ((px - cx) / half) ** 2))
    verts.append((cx, cy, 0))
    for k in range(rings - 1):
        for i in range(n):
            a, b = k * n + i, k * n + (i + 1) % n
            faces.append((a, b, b + n, a + n))
    last = (rings - 1) * n
    faces += [(last + i, last + (i + 1) % n, len(verts) - 1) for i in range(n)]
    mesh = bpy.data.meshes.new("shape")
    mesh.from_pydata(verts, [], faces)
    obj = bpy.data.objects.new("shape", mesh)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    obj.modifiers.new("solid", "SOLIDIFY").thickness = thickness
    return finish(obj, material)


def turn(objs, degrees, about=(0, 0)):
    """Rotate a group of objects on the desk, as if nudged by hand."""
    pivot = bpy.data.objects.new("pivot", None)
    pivot.location = (about[0], about[1], 0)
    bpy.context.collection.objects.link(pivot)
    bpy.context.view_layer.update()
    for obj in objs:
        world = obj.matrix_world.copy()
        obj.parent = pivot
        obj.matrix_world = world
    pivot.rotation_euler.z = math.radians(degrees)


def svg_outline(d, steps=10):
    """Points along an SVG path made of M, C and c commands (y flipped to point up)."""
    tokens = re.findall(r"[MCcz]|-?\d+\.?\d*", d)
    pts, cur, cmd, i = [], (0.0, 0.0), None, 0
    while i < len(tokens):
        if tokens[i] in "MCcz":
            cmd = tokens[i]
            i += 1
            continue
        if cmd == "M":
            cur = (float(tokens[i]), float(tokens[i + 1]))
            pts.append(cur)
            i += 2
            continue
        nums = [float(t) for t in tokens[i:i + 6]]
        i += 6
        ctrl = [(nums[j], nums[j + 1]) for j in (0, 2, 4)]
        if cmd == "c":
            ctrl = [(cur[0] + x, cur[1] + y) for x, y in ctrl]
        p0, (p1, p2, p3) = cur, ctrl
        for s in range(1, steps + 1):
            t = s / steps
            u = 1 - t
            pts.append(tuple(u ** 3 * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t ** 3 * p3[k] for k in (0, 1)))
        cur = p3
    return [(x, -y) for x, y in pts[:-1]]


# ── The objects ────────────────────────────────────────────────────────────

def journal():
    """The closed journal: green cloth, the title in gold foil, a rust ribbon trailing out."""
    wide, tall, pages, board, lip = 1.5, 2.1, 0.12, 0.012, 0.035
    green = cloth("2f4a36")
    foil = mat("foil", "d2a04a", rough=0.38, metal=1.0)
    top = board + pages
    box((wide + lip, tall + 2 * lip, board), (0, 0, board / 2), green, bevel=0.004)
    box((wide - lip, tall, pages), (-lip / 2, 0, board + pages / 2), mat("paper", "f3ebda", rough=0.85))
    box((board, tall + 2 * lip, top + board), (-(wide + lip + board) / 2, 0, (top + board) / 2), green, bevel=0.004)
    box((wide + lip, tall + 2 * lip, board), (0, 0, top + board / 2), green, bevel=0.004)

    z = top + board + 0.0006
    text("A  FIELD  JOURNAL", FONT, 0.062, (0, 0.72, z), foil, tracking=1.25)
    text("Things I do\nwhen I'm not\nworking.", FONT_ITALIC, 0.215, (0, 0.26, z), foil, spacing=0.92)
    text("C.", FONT_ITALIC, 0.13, (0, -0.82, z), foil)
    box((0.5, 0.004, 0.0012), (0, 0.64, z), foil)
    inset_w, inset_h = wide - 0.2, tall - 0.16
    for sign in (-1, 1):
        box((inset_w, 0.005, 0.0012), (0, sign * inset_h / 2, z), foil)
        box((0.005, inset_h, 0.0012), (sign * inset_w / 2, 0, z), foil)

    ribbon = outline_mesh([(0.18, -tall / 2 + 0.2), (0.27, -tall / 2 + 0.2), (0.27, -tall / 2 - 0.34),
                           (0.225, -tall / 2 - 0.29), (0.18, -tall / 2 - 0.34)], 0.002,
                          mat("ribbon", "b4532a", rough=0.7), rings=1)
    ribbon.location.z = 0.003


def camera():
    """A rangefinder lying on its back, lens up. Photography."""
    leather = mat("leather", "17140f", rough=0.75, bump=(260, 0.5))
    chrome = mat("chrome", "c9c6bd", rough=0.28, metal=1.0)
    black = mat("black", "0d0d0d", rough=0.35, metal=0.6)
    glass = mat("lens", "05070f", rough=0.03, coat=1.0)
    window = mat("window", "1b2430", rough=0.05, coat=1.0)
    objs = [
        box((1.35, 0.78, 0.30), (0, 0, 0.15), leather, bevel=0.05),
        box((1.36, 0.17, 0.31), (0, 0.305, 0.155), chrome, bevel=0.04),
        box((1.36, 0.07, 0.31), (0, -0.355, 0.155), chrome, bevel=0.03),
        # Lens: mount, barrel, focus ring, front ring, glass.
        cyl(0.31, 0.05, (0.05, -0.04, 0.325), chrome),
        cyl(0.27, 0.26, (0.05, -0.04, 0.46), black),
        cyl(0.29, 0.07, (0.05, -0.04, 0.44), mat("knurl", "151515", rough=0.5, metal=0.5, bump=(400, 1.0))),
        cyl(0.255, 0.02, (0.05, -0.04, 0.595), chrome),
        cyl(0.215, 0.02, (0.05, -0.04, 0.598), black),
        ball((0.17, 0.17, 0.035), (0.05, -0.04, 0.60), glass),
        # Viewfinder, frame-line and rangefinder windows in the top plate.
        box((0.22, 0.11, 0.02), (-0.43, 0.305, 0.315), window, bevel=0.01),
        box((0.15, 0.08, 0.02), (-0.14, 0.305, 0.315), mat("frost", "d8d8d2", rough=0.6), bevel=0.01),
        box((0.09, 0.07, 0.02), (0.36, 0.305, 0.315), window, bevel=0.01),
        # Knobs on the top plate, seen edge-on.
        box((0.20, 0.05, 0.20), (0.49, 0.415, 0.15), chrome, bevel=0.015),
        box((0.13, 0.04, 0.13), (0.24, 0.41, 0.15), chrome, bevel=0.012),
        box((0.17, 0.045, 0.17), (-0.50, 0.412, 0.15), chrome, bevel=0.015),
        # Self-timer lever.
        box((0.035, 0.15, 0.02), (-0.33, -0.12, 0.31), chrome, bevel=0.008),
    ]
    turn(objs, -9)


def compass():
    """A brass pocket compass. Travel."""
    brass = mat("brass", "b08d3e", rough=0.3, metal=1.0)
    dark = mat("ink", "2b2118", rough=0.6)
    # A shallow case with a raised bezel, so the dial sits in a recess.
    cyl(0.30, 0.06, (0, 0, 0.03), brass)
    torus(0.283, 0.024, (0, 0, 0.066), brass)
    cyl(0.265, 0.004, (0, 0, 0.062), mat("dial", "efe6d0", rough=0.7))
    for i in range(32):
        a = i * math.tau / 32
        long = i % 4 == 0
        tick = box((0.008, 0.05 if long else 0.025, 0.002), (0, 0, 0), dark, bevel=0)
        r = 0.225 if long else 0.2375
        tick.location = (r * math.sin(a), r * math.cos(a), 0.066)
        tick.rotation_euler.z = -a
    font = bpy.data.fonts.load(FONT)
    for i, letter in enumerate("NESW"):
        a = i * math.tau / 4
        curve = bpy.data.curves.new(letter, "FONT")
        curve.body, curve.font, curve.size, curve.align_x, curve.align_y = letter, font, 0.07, "CENTER", "CENTER"
        obj = bpy.data.objects.new(letter, curve)
        obj.location = (0.15 * math.sin(a), 0.15 * math.cos(a), 0.066)
        obj.data.materials.append(mat("red", "a3351f", rough=0.5) if letter == "N" else dark)
        bpy.context.collection.objects.link(obj)
    # Needle: red points north, steel points south; swung a little off north.
    red = outline_mesh([(0, 0.2), (0.026, 0), (-0.026, 0)], 0.004, mat("needle-n", "a3351f", rough=0.35), rings=1)
    steel = outline_mesh([(0, -0.2), (-0.026, 0), (0.026, 0)], 0.004, mat("needle-s", "8a8f96", rough=0.3, metal=1.0), rings=1)
    for half in (red, steel):
        half.location.z = 0.078
    turn([red, steel], 28)
    cyl(0.014, 0.012, (0, 0, 0.08), brass)
    # No glass over the dial: in this renderer it would only shade the face.
    torus(0.055, 0.012, (0, 0.345, 0.03), brass)       # lanyard ring


def pen():
    """A fountain pen, its cap beside it, and an open bottle of ink. Poetry."""
    lacquer = mat("lacquer", "4a2330", rough=0.12, coat=1.0)
    gold = mat("gold", "d2a04a", rough=0.25, metal=1.0)
    black = mat("black", "101010", rough=0.3)
    z = 0.052
    body = [
        cyl(0.05, 0.82, (-0.22, 0, z), lacquer, axis="X"),
        cyl(0.05, 0.05, (-0.655, 0, z), lacquer, axis="X", top=0.034),      # rounded end
        cyl(0.052, 0.025, (0.2, 0, z), gold, axis="X"),
        cyl(0.043, 0.2, (0.31, 0, z), black, axis="X", top=0.036),          # grip section
    ]
    nib = cyl(0.036, 0.22, (0.52, 0, z), gold, axis="X", top=0.003)
    nib.scale = (1, 1, 0.3)       # after the X turn, local Z is the pen's length; flatten across it
    nib.rotation_euler = (0, math.pi / 2, 0)
    nib.scale = (0.3, 1, 1)
    body.append(nib)
    turn(body, 24)
    cap = [
        cyl(0.057, 0.5, (0.15, -0.42, 0.057), lacquer, axis="X"),
        cyl(0.059, 0.03, (-0.07, -0.42, 0.057), gold, axis="X"),
        box((0.3, 0.022, 0.012), (0.22, -0.42, 0.118), gold, bevel=0.004),
    ]
    turn(cap, -12, about=(0.15, -0.42))
    # Ink bottle with its cap off: you look down into the ink.
    glass = mat("bottle", "dfe9ee", rough=0.02, glass=1.0)
    ink = mat("ink", "0a1024", rough=0.05, coat=1.0)
    cyl(0.21, 0.24, (-0.5, 0.52, 0.12), glass)
    cyl(0.185, 0.19, (-0.5, 0.52, 0.115), ink)
    cyl(0.12, 0.07, (-0.5, 0.52, 0.275), glass)
    cyl(0.098, 0.062, (-0.5, 0.52, 0.272), ink)
    cyl(0.135, 0.07, (-0.12, 0.66, 0.035), mat("cap", "121212", rough=0.4, bump=(300, 0.6)))


def chai():
    """A cup of masala chai on a saucer, cinnamon and cardamom beside it. Cooking."""
    china = mat("china", "ece6d8", rough=0.18, coat=0.6)
    cyl(0.68, 0.03, (0, 0, 0.015), china)
    torus(0.66, 0.03, (0, 0, 0.04), china)
    cyl(0.40, 0.34, (0, 0, 0.20), china)
    torus(0.385, 0.02, (0, 0, 0.37), china)
    cyl(0.365, 0.02, (0, 0, 0.365), mat("tea", "a8703c", rough=0.06, coat=1.0))
    handle = torus(0.14, 0.035, (0.48, 0, 0.2), china, rot=(math.pi / 2, 0, 0))
    turn([handle], -28)
    stick = cyl(0.035, 0.5, (-0.18, -0.53, 0.075), mat("cinnamon", "6b3d1e", rough=0.8, bump=(60, 0.8)), axis="X")
    turn([stick], 14, about=(-0.18, -0.53))
    pod = mat("cardamom", "8f9460", rough=0.7, bump=(90, 0.5))
    for x, y, a in ((0.36, -0.44, 30), (0.47, -0.33, -50), (0.24, -0.55, 80)):
        turn([ball((0.06, 0.03, 0.03), (x, y, 0.075), pod)], a, about=(x, y))


def picks():
    """Three guitar picks, dropped. Guitar."""
    def pick(material, at, degrees):
        pts = []
        for i in range(48):
            a = i * math.tau / 48
            r = 0.15 * (1 + 0.17 * math.cos(3 * (a - math.pi / 2)))
            pts.append((r * math.cos(a), r * math.sin(a) * 1.12))
        obj = outline_mesh(pts, 0.012, material, rings=2)
        obj.location = (at[0], at[1], 0.012)
        obj.rotation_euler.z = math.radians(degrees)

    pick(mottled("tortoise", "2a1206", "b5651d", scale=9, rough=0.12, coat=1.0), (-0.2, 0.12, 0), 20)
    pick(mat("cream", "e8dcc0", rough=0.2, coat=0.8), (0.2, 0.05, 0), -35)
    pick(mat("rust", "b4532a", rough=0.25, coat=0.8), (0.02, -0.27, 0), 165)


def palette():
    """A wooden palette with a thumb hole, paint squeezed round the edge, a brush across it. Painting."""
    top = 0.03
    pts = []
    for i in range(96):
        a = i * math.tau / 96
        # An oval with a notch for the fingers on the left.
        r = 1 - 0.22 * math.exp(-((a - math.pi) / 0.22) ** 2)
        pts.append((0.62 * r * math.cos(a), 0.45 * r * math.sin(a)))
    board = outline_mesh(pts, top, mottled("wood", "b4855a", "c79a6a", scale=7, rough=0.5, coat=0.3), rings=4)
    board.location.z = top
    hole = cyl(0.075, 0.2, (-0.36, -0.17, top), mat("cutter", "000000"))
    hole.hide_render = True
    cut = board.modifiers.new("hole", "BOOLEAN")
    cut.operation, cut.object = "DIFFERENCE", hole

    # Paint, from tube-sized blobs round the rim to one mixed smear in the middle.
    for colour, x, y, s in (("f4efe4", 0.02, 0.33, 1.1), ("e5b62c", 0.27, 0.29, 1.0), ("c43a26", 0.45, 0.15, 0.9),
                            ("8a1f3d", 0.52, -0.07, 0.85), ("2a4a9a", 0.40, -0.26, 1.0), ("2f6b45", 0.17, -0.35, 0.9),
                            ("7a4320", -0.08, -0.36, 0.85), ("1d1f22", -0.24, 0.27, 0.8)):
        ball((0.065 * s, 0.055 * s, 0.03 * s), (x, y, top + 0.012), mat("paint", colour, rough=0.15, coat=0.6))
    smear = ball((0.16, 0.07, 0.008), (0.06, 0.02, top + 0.004), mat("mix", "6f8a8c", rough=0.2, coat=0.5))
    turn([smear], 25, about=(0.06, 0.02))

    # The brush lies across the palette: lacquered handle, steel ferrule, bristles dipped in blue.
    z = top + 0.032
    brush = [
        cyl(0.016, 0.9, (-0.26, 0, z), mat("handle", "1f3a2c", rough=0.15, coat=1.0), axis="X", top=0.026),
        cyl(0.028, 0.13, (0.25, 0, z), mat("ferrule", "c9c6bd", rough=0.25, metal=1.0), axis="X"),
        cyl(0.026, 0.1, (0.36, 0, z), mat("bristle", "d8c39a", rough=0.8), axis="X", top=0.022),
        cyl(0.022, 0.07, (0.445, 0, z), mat("paint", "2a4a9a", rough=0.15, coat=0.6), axis="X", top=0.004),
    ]
    turn(brush, -28, about=(0.1, 0))
    turn([board, hole], 8)


def leaf(path, dark, light, degrees):
    """A fallen leaf, slightly cupped."""
    pts = svg_outline(path)
    scale = 0.75 / 100                                   # the outlines are drawn 100 wide
    pts = [(x * scale, y * scale) for x, y in pts]
    blade = outline_mesh(pts, 0.006, mottled("leaf", dark, light, scale=5, rough=0.6), rings=6, curl=0.07)
    cx = sum(p[0] for p in pts) / len(pts)
    top, bottom = max(p[1] for p in pts), min(p[1] for p in pts)
    rib = box((0.012, top - bottom + 0.16, 0.008), (cx, (top + bottom) / 2 - 0.08, 0.006), mat("rib", "5a3418", rough=0.7))
    turn([blade, rib], degrees, about=(cx, (top + bottom) / 2))


ASPEN = "M50 6C74 22 88 46 78 70 70 88 56 94 50 96 44 94 30 88 22 70 12 46 26 22 50 6z"
OAK = ("M50 4c8 6 12 12 9 20 9-3 15 2 13 11 9-1 13 7 9 15 7 2 9 10 3 16 4 6 0 14-8 14-6 8-18 12-26 14-8-2-20-6-26-14"
       "-8 0-12-8-8-14-6-6-4-14 3-16-4-8 0-16 9-15-2-9 4-14 13-11-3-8 1-14 9-20z")

OBJECTS = {
    "journal": journal,
    "camera": camera,
    "compass": compass,
    "pen": pen,
    "chai": chai,
    "picks": picks,
    "palette": palette,
    "leaf-oak": lambda: leaf(OAK, "8a3413", "c96a2b", -32),
    "leaf-aspen": lambda: leaf(ASPEN, "a8761c", "dba93a", 40),
}


# ── Rendering ──────────────────────────────────────────────────────────────

def bounds():
    xs, ys = [], []
    for obj in bpy.context.scene.objects:
        if obj.type in {"MESH", "FONT"}:
            for corner in obj.bound_box:
                p = obj.matrix_world @ __import__("mathutils").Vector(corner)
                xs.append(p.x)
                ys.append(p.y)
    return min(xs), max(xs), min(ys), max(ys)


def render(name, build):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    build()
    bpy.context.view_layer.update()
    x0, x1, y0, y1 = bounds()
    width, height = x1 - x0 + 2 * MARGIN, y1 - y0 + 2 * MARGIN

    bpy.ops.mesh.primitive_plane_add(size=40)
    bpy.context.object.is_shadow_catcher = True

    # The same lamp for every object, so every shadow falls the same way.
    for loc, power, colour, size in (((-3.2, 2.6, 5.0), 620, (1.0, 0.88, 0.72), 4.5),
                                     ((4.0, -2.0, 4.0), 90, (0.8, 0.86, 1.0), 6.0)):
        light = bpy.data.lights.new("lamp", "AREA")
        light.energy, light.color, light.size = power, colour, size
        obj = bpy.data.objects.new("lamp", light)
        obj.location = (loc[0] + (x0 + x1) / 2, loc[1] + (y0 + y1) / 2, loc[2])
        obj.rotation_euler = (math.atan2(-loc[1], loc[2]) * 0.9, math.atan2(loc[0], loc[2]) * 0.9, 0)
        bpy.context.collection.objects.link(obj)

    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = max(width, height)
    cam.location = ((x0 + x1) / 2, (y0 + y1) / 2, 10)
    bpy.context.collection.objects.link(cam)
    scene.camera = cam

    world = bpy.data.worlds.new("room")
    world.use_nodes = True
    world.node_tree.nodes["Background"].inputs["Color"].default_value = (0.05, 0.045, 0.04, 1)
    scene.world = world

    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True
    scene.render.film_transparent = True
    scene.view_settings.view_transform = "Standard"
    scene.render.resolution_x = round(width * PX_PER_UNIT)
    scene.render.resolution_y = round(height * PX_PER_UNIT)
    scene.render.image_settings.file_format = "WEBP"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.quality = 90
    scene.render.filepath = os.path.join(OUT, name + ".webp")
    bpy.ops.render.render(write_still=True)
    return round(width, 3), round(height, 3)


def main():
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    os.makedirs(OUT, exist_ok=True)
    sizes_path = os.path.join(OUT, "sizes.json")
    sizes = json.load(open(sizes_path)) if os.path.exists(sizes_path) else {}
    for name in args or OBJECTS:
        sizes[name] = render(name, OBJECTS[name])
    json.dump(sizes, open(sizes_path, "w"), indent=1)


# Other scripts import the materials from here, so only render when run directly.
if __name__ == "__main__":
    main()
