import * as THREE from 'three';

/**
 * Procedural model of the Alaro camera: a cylindrical base with a rotating cap,
 * a rear arm and hinge, and a pan/tilt head with a domed black glass face.
 * Units are centimetres; the base sits on y = 0.
 */

export type CameraColor = 'graphite' | 'white' | 'red';

export const BODY_COLORS: Record<CameraColor, { body: number; rough: number; logo: string }> = {
  graphite: { body: 0x3a3b3e, rough: 0.62, logo: '#f2f2f2' },
  white: { body: 0xeeedea, rough: 0.58, logo: '#2b2b2d' },
  red: { body: 0xb8232b, rough: 0.6, logo: '#f7f2f0' },
};

export const BASE_R = 3.7;
export const BASE_H = 4.4;
export const HEAD_R = 4.1;
export const HEAD_L = 4.6;
export const TOTAL_H = BASE_H + 1.25 + HEAD_R * 2;

function roundedProfile(R: number, y0: number, y1: number, r0: number, r1: number, seg = 10) {
  const pts = [new THREE.Vector2(0, y0)];
  for (let i = 0; i <= seg; i++) {
    const a = -Math.PI / 2 + (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - r0 + Math.cos(a) * r0, y0 + r0 + Math.sin(a) * r0));
  }
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - r1 + Math.cos(a) * r1, y1 - r1 + Math.sin(a) * r1));
  }
  pts.push(new THREE.Vector2(0, y1));
  return pts;
}

function lathe(pts: THREE.Vector2[], segs = 128) {
  const g = new THREE.LatheGeometry(pts, segs);
  g.computeVertexNormals();
  return g;
}

/** Fine speckle used as roughness and bump on the shell: reads as soft-touch matte plastic. */
function grainTexture() {
  const size = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = size;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = 150 + Math.round((Math.random() - 0.5) * 46);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 5);
  return tex;
}

function logoTexture(color: string) {
  const cv = document.createElement('canvas');
  cv.width = 1024;
  cv.height = 256;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.font = '700 76px Switzer, "Helvetica Neue", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('alaro.', 512, 128);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export type AlaroCamera = {
  group: THREE.Group;
  /** Rotates the head around the vertical axis (radians). */
  pan: THREE.Group;
  /** Tilts the head up (positive, radians). */
  tilt: THREE.Group;
  setColor: (c: CameraColor) => void;
  dispose: () => void;
};

export function createAlaroCamera(color: CameraColor = 'graphite', { segments = 128 } = {}): AlaroCamera {
  const conf = BODY_COLORS[color];
  const grain = grainTexture();
  const body = new THREE.MeshPhysicalMaterial({
    color: conf.body,
    roughness: conf.rough + 0.08,
    roughnessMap: grain,
    bumpMap: grain,
    bumpScale: 0.0025,
    metalness: 0,
    clearcoat: 0.08,
    clearcoatRoughness: 0.6,
    sheen: 0.25,
    sheenRoughness: 0.9,
    sheenColor: new THREE.Color(0xffffff),
  });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x020203, roughness: 0.035, clearcoat: 1, clearcoatRoughness: 0.03, ior: 1.52, envMapIntensity: 1.25 });
  const glassInner = new THREE.MeshPhysicalMaterial({ color: 0x141418, roughness: 0.18, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.05 });
  const rimMat = new THREE.MeshPhysicalMaterial({ color: 0x0e0e10, roughness: 0.25, metalness: 0.6 });
  const lensRing = new THREE.MeshPhysicalMaterial({ color: 0x1a1b1e, roughness: 0.28, metalness: 0.85 });
  const lensGlass = new THREE.MeshPhysicalMaterial({
    color: 0x0a1020,
    roughness: 0.02,
    metalness: 0.2,
    clearcoat: 1,
    clearcoatRoughness: 0,
    iridescence: 0.6,
    iridescenceIOR: 1.6,
    iridescenceThicknessRange: [200, 500],
  });
  const holeMat = new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.9 });
  const portMat = new THREE.MeshStandardMaterial({ color: 0x111112, roughness: 0.5, metalness: 0.4 });
  const logoMat = new THREE.MeshPhysicalMaterial({ map: logoTexture(conf.logo), transparent: true, roughness: 0.4, depthWrite: false });

  const mesh = (g: THREE.BufferGeometry, m: THREE.Material, cast = true) => {
    const o = new THREE.Mesh(g, m);
    o.castShadow = cast;
    o.receiveShadow = true;
    return o;
  };

  const group = new THREE.Group();

  // base
  group.add(mesh(lathe(roundedProfile(BASE_R, 0, BASE_H - 0.95, 0.35, 0.06), segments), body));
  group.add(mesh(lathe(roundedProfile(BASE_R - 0.02, BASE_H - 0.9, BASE_H, 0.06, 0.32), segments), body));
  const seam = mesh(new THREE.CylinderGeometry(BASE_R - 0.05, BASE_R - 0.05, 0.05, segments, 1, true), holeMat, false);
  seam.position.y = BASE_H - 0.925;
  group.add(seam);

  const span = 1.7;
  const logo = new THREE.Mesh(new THREE.CylinderGeometry(BASE_R + 0.004, BASE_R + 0.004, 1.6, 64, 1, true, -span / 2 + 0.32, span), logoMat);
  logo.position.y = 1.5;
  group.add(logo);

  {
    const shape = new THREE.Shape();
    const w = 0.95, h = 0.32, r = 0.16;
    shape.moveTo(-w / 2 + r, -h / 2);
    shape.lineTo(w / 2 - r, -h / 2);
    shape.absarc(w / 2 - r, 0, r, -Math.PI / 2, Math.PI / 2);
    shape.lineTo(-w / 2 + r, h / 2);
    shape.absarc(-w / 2 + r, 0, r, Math.PI / 2, Math.PI * 1.5);
    const port = mesh(new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false }), portMat, false);
    port.position.set(0.3, 0.75, -BASE_R + 0.03);
    port.rotation.y = Math.PI;
    group.add(port);
  }

  // head
  const pan = new THREE.Group();
  pan.position.y = BASE_H;
  group.add(pan);

  const HINGE_Y = 1.25 + HEAD_R;
  const armShape = new THREE.Shape();
  armShape.moveTo(-0.55, 0);
  armShape.lineTo(0.55, 0);
  armShape.lineTo(0.55, HINGE_Y);
  armShape.absarc(0, HINGE_Y, 0.55, 0, Math.PI);
  armShape.lineTo(-0.55, 0);
  const arm = mesh(new THREE.ExtrudeGeometry(armShape, { depth: 0.5, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3, curveSegments: 16 }), body);
  arm.position.set(0, -0.2, -HEAD_L / 2 - 0.62);
  pan.add(arm);
  const stem = mesh(new THREE.BoxGeometry(1.0, 1.4, 1.2), body);
  stem.position.set(0, 0.5, -HEAD_L / 2 - 0.1);
  pan.add(stem);

  const tilt = new THREE.Group();
  tilt.position.set(0, HINGE_Y, 0);
  pan.add(tilt);

  const shell = mesh(lathe(roundedProfile(HEAD_R, -HEAD_L / 2, HEAD_L / 2 - 0.02, 0.3, 0.05), segments + 32), body);
  shell.rotation.x = Math.PI / 2;
  tilt.add(shell);
  const knuckle = mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.3, 32), body);
  knuckle.rotation.z = Math.PI / 2;
  knuckle.position.set(0, 0, -HEAD_L / 2 - 0.45);
  tilt.add(knuckle);
  const backRing = mesh(new THREE.TorusGeometry(HEAD_R * 0.62, 0.025, 8, segments), holeMat, false);
  backRing.position.z = -HEAD_L / 2 - 0.005;
  tilt.add(backRing);

  const FRONT_Z = HEAD_L / 2 + 0.03;
  const DOME_R = 24;
  const APEX = FRONT_Z + 0.36;
  const domeZ = (r: number) => APEX - (DOME_R - Math.sqrt(DOME_R * DOME_R - r * r));
  const domeCap = (radius: number, rr: number, mat: THREE.Material) => {
    const m = mesh(new THREE.SphereGeometry(rr, segments + 32, 32, 0, Math.PI * 2, 0, Math.asin(radius / rr)), mat, false);
    m.rotation.x = Math.PI / 2;
    m.position.z = APEX - DOME_R;
    return m;
  };
  const rim = mesh(new THREE.TorusGeometry(HEAD_R - 0.08, 0.12, 24, segments + 32), rimMat, false);
  rim.position.z = domeZ(HEAD_R - 0.1) - 0.02;
  tilt.add(rim);
  tilt.add(domeCap(HEAD_R - 0.1, DOME_R, glass));
  tilt.add(domeCap(HEAD_R * 0.52, DOME_R + 0.012, glassInner));

  const barrel = mesh(new THREE.CylinderGeometry(0.95, 1.02, 0.28, 64), lensRing, false);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.12, APEX + 0.1);
  tilt.add(barrel);
  const ring2 = mesh(new THREE.TorusGeometry(0.8, 0.07, 16, 64), lensRing, false);
  ring2.position.set(0, 0.12, APEX + 0.25);
  tilt.add(ring2);
  const lens = mesh(new THREE.SphereGeometry(0.82, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.28), lensGlass, false);
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 0.12, APEX - 0.44);
  tilt.add(lens);
  const pupil = mesh(new THREE.CircleGeometry(0.3, 32), new THREE.MeshPhysicalMaterial({ color: 0x1b2a3a, roughness: 0.1, metalness: 0.5, clearcoat: 1 }), false);
  pupil.position.set(0, 0.12, APEX + 0.235);
  tilt.add(pupil);
  // inner lens elements: a dark aperture ring and a thin coated rim that catches light
  const aperture = mesh(new THREE.RingGeometry(0.3, 0.52, 48), new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.35, metalness: 0.6 }), false);
  aperture.position.set(0, 0.12, APEX + 0.232);
  tilt.add(aperture);
  const coat = mesh(
    new THREE.TorusGeometry(0.54, 0.018, 8, 64),
    new THREE.MeshPhysicalMaterial({ color: 0x2a3550, roughness: 0.15, metalness: 0.9, iridescence: 1, iridescenceIOR: 1.8 }),
    false,
  );
  coat.position.set(0, 0.12, APEX + 0.236);
  tilt.add(coat);

  for (const [y, r] of [
    [HEAD_R * 0.78, 0.07],
    [-HEAD_R * 0.48, 0.05],
  ]) {
    const d = mesh(new THREE.CircleGeometry(r, 16), new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.3 }), false);
    d.position.set(0, y, domeZ(Math.abs(y)) + 0.02);
    tilt.add(d);
  }
  const holeGeo = new THREE.CircleGeometry(0.07, 12);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 6; row++) {
      const ang = Math.PI + 0.2 - row * 0.085;
      const z = HEAD_L / 2 - 0.55 - col * 0.32;
      const hole = mesh(holeGeo, holeMat, false);
      hole.position.set(Math.cos(ang) * (HEAD_R + 0.003), Math.sin(ang) * (HEAD_R + 0.003), z);
      hole.lookAt(hole.position.x * 2, hole.position.y * 2, z);
      tilt.add(hole);
    }
  }

  const setColor = (c: CameraColor) => {
    const next = BODY_COLORS[c];
    body.color.setHex(next.body);
    body.roughness = next.rough;
    logoMat.map?.dispose();
    logoMat.map = logoTexture(next.logo);
    logoMat.needsUpdate = true;
  };

  const dispose = () => {
    group.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
          m.dispose();
        });
      }
    });
    grain.dispose();
  };

  return { group, pan, tilt, setColor, dispose };
}

/** Studio environment with feathered softboxes, so the black glass picks up real reflections. */
export function studioEnvironment(renderer: THREE.WebGLRenderer, { dark = false } = {}) {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.SphereGeometry(120, 32, 16), new THREE.MeshBasicMaterial({ color: dark ? 0x050505 : 0x4a4a4c, side: THREE.BackSide })));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(240, 240), new THREE.MeshBasicMaterial({ color: dark ? 0x020202 : 0x6c6c6e }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -2;
  env.add(floor);
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const c = cv.getContext('2d')!;
  const g = c.createRadialGradient(64, 64, 5, 64, 64, 64);
  g.addColorStop(0, '#fff');
  g.addColorStop(0.55, '#d0d0d0');
  g.addColorStop(1, '#000');
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  const soft = new THREE.CanvasTexture(cv);
  const box = (w: number, h: number, x: number, y: number, z: number, k: number) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: soft, color: new THREE.Color(k, k, k), side: THREE.DoubleSide, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
    );
    m.position.set(x, y, z);
    m.lookAt(0, 6, 0);
    env.add(m);
  };
  box(26, 18, -22, 30, 22, dark ? 6 : 5);
  box(8, 40, 34, 10, 6, dark ? 3 : 2.2);
  box(30, 8, 0, 40, -20, dark ? 3.5 : 2);
  box(10, 30, -34, 8, -14, dark ? 2.5 : 1.2);
  box(34, 10, 14, 34, 44, dark ? 4 : 3.2);
  box(12, 5, 4, 27, 46, dark ? 3.4 : 3.2);
  box(34, 22, -12, 12, 46, dark ? 0.18 : 0.16);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const tex = pmrem.fromScene(env, 0.02).texture;
  pmrem.dispose();
  return tex;
}
