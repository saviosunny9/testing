'use client';

import { useEffect, useRef } from 'react';
import type { MeshPhysicalMaterial } from 'three';
import type { CameraColor } from '@/lib/three/alaroCamera';

/** Drag-to-rotate 3D camera. Colour changes animate the body material. */
export default function ProductViewer({ color, className = '' }: { color: CameraColor; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setColorRef = useRef<(c: CameraColor) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current!;
    let disposed = false;
    let cleanup = () => {};
    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
      const { createStage, contactShadow } = await import('@/lib/three/stage');
      const { BODY_COLORS } = await import('@/lib/three/alaroCamera');
      if (disposed) return;

      const stage = createStage(canvas, { color, fov: 26, shadows: false });
      stage.scene.add(contactShadow(9, 0.42));
      stage.view.position.set(-18, 15, 60);
      const controls = new OrbitControls(stage.view, canvas);
      controls.target.set(0, 7.2, 0);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.autoRotate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      controls.autoRotateSpeed = 1.1;
      controls.minPolarAngle = 0.9;
      controls.maxPolarAngle = 1.62;
      controls.update();

      // tween the body colour rather than snapping it
      const body = new THREE.Color();
      let target = new THREE.Color(BODY_COLORS[color].body);
      setColorRef.current = (c) => {
        target = new THREE.Color(BODY_COLORS[c].body);
        stage.product.setColor(c);
        bodyMat()?.color.copy(body);
      };
      const bodyMat = () => {
        let m: MeshPhysicalMaterial | undefined;
        stage.product.group.traverse((o) => {
          if (!m && o instanceof THREE.Mesh && o.material instanceof THREE.MeshPhysicalMaterial && o.material.sheen > 0) m = o.material;
        });
        return m;
      };
      body.copy(target);

      let visible = true;
      let raf = 0;
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        const m = bodyMat();
        if (m) {
          body.lerp(target, 0.12);
          m.color.copy(body);
        }
        controls.update();
        stage.render();
      };
      loop();
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(canvas);
      const ro = new ResizeObserver(() => stage.resize());
      ro.observe(canvas);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        controls.dispose();
        stage.dispose();
      };
    })();
    return () => {
      disposed = true;
      cleanup();
    };
    // the stage is created once; colour changes go through setColorRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setColorRef.current(color);
  }, [color]);

  return <canvas ref={canvasRef} className={`touch-pan-y ${className}`} aria-label="3D model of the camera. Drag to rotate." role="img" />;
}
