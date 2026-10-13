import * as THREE from 'three';
import { createAlaroCamera, studioEnvironment, type AlaroCamera, type CameraColor } from './alaroCamera';

export type Stage = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  view: THREE.PerspectiveCamera;
  product: AlaroCamera;
  key: THREE.DirectionalLight;
  fill: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  render: () => void;
  resize: () => void;
  dispose: () => void;
};

/**
 * A transparent WebGL stage with the Alaro camera, studio reflections and soft
 * shadows. The page behind the canvas provides the background.
 */
export function createStage(canvas: HTMLCanvasElement, { color = 'graphite' as CameraColor, fov = 30, shadows = true } = {}): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = THREE.VSMShadowMap;

  const scene = new THREE.Scene();
  scene.environment = studioEnvironment(renderer);
  scene.environmentIntensity = 0.85;

  const product = createAlaroCamera(color);
  scene.add(product.group);

  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(-14, 30, 14);
  key.castShadow = shadows;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.radius = 10;
  key.shadow.blurSamples = 20;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 5, far: 120 });
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, 0.6);
  fill.position.set(16, 8, 10);
  scene.add(fill);
  const hemi = new THREE.HemisphereLight(0xffffff, 0xe9dccb, 0.35);
  scene.add(hemi);

  const view = new THREE.PerspectiveCamera(fov, 1, 0.5, 400);
  view.position.set(0, 9, 46);
  view.lookAt(0, 6.6, 0);

  const resize = () => {
    const w = canvas.clientWidth || 1;
    const h = canvas.clientHeight || 1;
    renderer.setSize(w, h, false);
    view.aspect = w / h;
    view.updateProjectionMatrix();
  };
  resize();

  const render = () => renderer.render(scene, view);

  const dispose = () => {
    product.dispose();
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh && !product.group.getObjectById(o.id)) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          (m as THREE.MeshStandardMaterial).map?.dispose();
          m.dispose();
        });
      }
    });
    scene.environment?.dispose();
    renderer.dispose();
  };

  return { renderer, scene, view, product, key, fill, hemi, render, resize, dispose };
}

/** Soft radial contact shadow under the camera, for stages without a receiving surface. */
export function contactShadow(size = 11, opacity = 0.5) {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 128;
  const c = cv.getContext('2d')!;
  const g = c.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, `rgba(0,0,0,${opacity})`);
  g.addColorStop(0.5, `rgba(0,0,0,${opacity * 0.45})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  c.fillStyle = g;
  c.fillRect(0, 0, 128, 128);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size * 2, size * 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.02;
  return m;
}

/** A natural little vignette: oak shelf, books, a ceramic vase and a plant. */
export function shelfScene() {
  const group = new THREE.Group();
  // oak grain texture
  const cv = document.createElement('canvas');
  cv.width = 512;
  cv.height = 64;
  const c = cv.getContext('2d')!;
  c.fillStyle = '#c99f72';
  c.fillRect(0, 0, 512, 64);
  for (let i = 0; i < 60; i++) {
    c.strokeStyle = `rgba(${120 + Math.random() * 40},${80 + Math.random() * 30},${50 + Math.random() * 20},${0.12 + Math.random() * 0.18})`;
    c.lineWidth = 1 + Math.random() * 2;
    c.beginPath();
    const y = Math.random() * 64;
    c.moveTo(0, y);
    c.bezierCurveTo(170, y + Math.random() * 6 - 3, 340, y + Math.random() * 6 - 3, 512, y + Math.random() * 4 - 2);
    c.stroke();
  }
  const woodTex = new THREE.CanvasTexture(cv);
  woodTex.colorSpace = THREE.SRGBColorSpace;
  const wood = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.55 });
  const add = (g: THREE.BufferGeometry, m: THREE.Material, x: number, y: number, z: number) => {
    const o = new THREE.Mesh(g, m);
    o.position.set(x, y, z);
    o.castShadow = true;
    o.receiveShadow = true;
    group.add(o);
    return o;
  };

  add(new THREE.BoxGeometry(110, 2.4, 22), wood, 0, -1.2, 0);

  // books leaning together to the right of the camera
  const bookColors = [0x0b3558, 0x006bff, 0xf2ece2, 0xff6b4a];
  let x = 12;
  bookColors.forEach((col, i) => {
    const h = 15 + (i % 2) * 2.5;
    const w = 2.2 + (i % 3) * 0.6;
    const b = add(new THREE.BoxGeometry(w, h, 12), new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 }), x, h / 2, -3);
    if (i === bookColors.length - 1) {
      b.rotation.z = -0.32;
      b.position.x += 2.2;
      b.position.y -= 1;
    }
    x += w + 0.2;
  });
  add(new THREE.BoxGeometry(12, 2.4, 9), new THREE.MeshStandardMaterial({ color: 0x8247f5, roughness: 0.8 }), 32, 1.2, 3);
  add(new THREE.BoxGeometry(11, 2, 8.5), new THREE.MeshStandardMaterial({ color: 0xfff5d6, roughness: 0.8 }), 32, 3.4, 3).rotation.y = 0.2;

  // potted plant further right
  add(new THREE.CylinderGeometry(4.2, 3.4, 7, 40), new THREE.MeshStandardMaterial({ color: 0xd9825b, roughness: 0.7 }), 44, 3.5, -3);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x3f7d4f, roughness: 0.6, side: THREE.DoubleSide });
  for (let i = 0; i < 9; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), leafMat);
    const a = (i / 9) * Math.PI * 2;
    leaf.scale.set(1.3, 5.2, 0.25);
    leaf.position.set(44 + Math.cos(a) * 2.4, 11 + (i % 3) * 1.6, -3 + Math.sin(a) * 2.4);
    leaf.rotation.set(Math.sin(a) * 0.5, -a, Math.cos(a) * 0.55);
    leaf.castShadow = true;
    group.add(leaf);
  }

  // small ceramic vase on the left, low so it doesn't crowd the copy
  const vaseProfile = [
    [0, 0],
    [2.2, 0],
    [2.9, 1.6],
    [3.0, 4],
    [2.2, 6.8],
    [1.2, 8.4],
    [1.4, 9.4],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  add(new THREE.LatheGeometry(vaseProfile, 48), new THREE.MeshPhysicalMaterial({ color: 0xf4f1ea, roughness: 0.35, clearcoat: 0.6 }), -13, 0, -4);
  return group;
}
