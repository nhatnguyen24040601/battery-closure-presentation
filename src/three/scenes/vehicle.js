import * as THREE from 'three';
import { buildPack } from '../pack.js';
import { buildCar } from '../car.js';
import { C } from '../palette.js';
import { camKeys, seg, mix, lin } from '../stage.js';

// Slides 1-2: a generic see-through EV (no brand), Model A glowing under the floor between the axles.
// Slide 1: camera orbits 360° in 8 s, looped. Slide 2: the camera dives into the pack (Morph-style zoom).
function create(stage, zoom) {
  const scene = stage.makeScene({ ground: 0, key: 1.6, exposure: 0.9 });
  const camera = stage.camera(30);

  const g = new THREE.Group();
  scene.add(g);
  const car = buildCar();
  const fade = car.fade; // materials that dim when the camera dives under the car
  g.add(car.group);

  // the pack: Model A, scaled to sit between the axles, glowing blue
  const pack = buildPack();
  pack.group.scale.setScalar(1.15);
  pack.group.position.set(0, 0.14, 0);
  g.add(pack.group);
  const light = new THREE.PointLight(C.aluminium, 6, 4);
  light.position.set(0, 0.1, 0);
  scene.add(light);

  return {
    scene, camera,
    update(t) {
      const pulse = 0.5 + 0.15 * Math.sin(t * 2.4);
      pack.glow('all', C.aluminium, pulse);
      light.intensity = 5 + 2 * Math.sin(t * 2.4);
      pack.flow(t);
      if (!zoom) {
        const a = (t / 8) * Math.PI * 2 + 0.6;
        if (!camera.userData.manual) {
          camera.position.set(Math.cos(a) * 7.4, 2.5 + Math.sin(a * 2) * 0.25, Math.sin(a) * 7.4);
          camera.lookAt(0, 0.55, 0);
          camera.translateX(-1.6); // slide the car right, clear of the title text
        }
        camera.userData.target = camera.userData.target || new THREE.Vector3(0, 0.55, 0);
      } else {
        const a = 0.6, k = seg(t, 0.2, 4.2);
        const far = [Math.cos(a) * 7.4, 2.5, Math.sin(a) * 7.4];
        camKeys(camera, t, [{ t: 0, p: far, l: [0, 0.55, 0] }, { t: 0.2, p: far, l: [0, 0.55, 0] }, { t: 4.2, p: [1.0, 0.8, 2.9], l: [0, 0.14, 0] }, { t: 5, p: [1.0, 0.8, 2.9], l: [0, 0.14, 0] }]);
        const dim = 1 - 0.85 * k;
        for (const [m, base] of fade) m.opacity = base * dim;
        pack.glow('all', C.aluminium, pulse + 0.35 * k);
      }
    },
  };
}

export const vehicle = { duration: 8, loop: true, create: (s) => create(s, false) };
export const vehicleZoom = { duration: 5, loop: false, create: (s) => create(s, true) };
