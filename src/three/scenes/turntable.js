import * as THREE from 'three';
import { buildPack } from '../pack.js';
import { camKeys } from '../stage.js';

// Slide 19 - Model A, fully assembled and coloured by material; slow 360° turn in 8 s, looped.
export default {
  duration: 8,
  loop: true,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.35, key: 3 });
    const camera = stage.camera(30);
    const pack = buildPack();
    scene.add(pack.group);
    return {
      scene, camera, pickables: [pack.group],
      update(t) {
        pack.flow(t);
        pack.group.rotation.y = (t / 8) * Math.PI * 2 + 0.5;
        camKeys(camera, t, [{ t: 0, p: [0.0, 1.5, 3.7], l: [0, -0.05, 0] }, { t: 8, p: [0.0, 1.5, 3.7], l: [0, -0.05, 0] }]);
      },
    };
  },
};
