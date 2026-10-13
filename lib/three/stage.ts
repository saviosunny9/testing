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
