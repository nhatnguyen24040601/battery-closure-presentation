import * as THREE from 'three';
import { buildPack } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, mix, lin } from '../stage.js';

// Slides 1-2: a generic see-through EV (no brand), Model A glowing under the floor between the axles.
// Slide 1: camera orbits 360° in 8 s, looped. Slide 2: the camera dives into the pack (Morph-style zoom).
const LINE = 0x7fb2ff;

function bodyShape() {
  const pts = [[-2.2, 0.3], [-2.3, 0.55], [-2.15, 0.85], [-1.6, 1.0], [-0.9, 1.38], [-0.1, 1.5], [0.55, 1.42], [1.1, 1.0], [1.7, 0.85], [2.2, 0.7], [2.3, 0.48], [2.2, 0.3], [1.2, 0.24], [-1.2, 0.24]]
    .map(([x, y]) => new THREE.Vector3(x, y, 0));
  const curve = new THREE.CatmullRomCurve3(pts, true, 'centripetal');
  return new THREE.Shape(curve.getPoints(90).map((p) => new THREE.Vector2(p.x, p.y)));
}

function create(stage, zoom) {
  const scene = stage.makeScene({ ground: 0, key: 1.2, exposure: 0.8 });
  const camera = stage.camera(30);
  const fade = []; // materials that dim when the camera dives under the car

  const g = new THREE.Group();
  scene.add(g);

  // shell: faint glass + crisp edge lines
  const body = new THREE.ExtrudeGeometry(bodyShape(), { depth: 1.5, bevelEnabled: true, bevelThickness: 0.14, bevelSize: 0.14, bevelSegments: 4, curveSegments: 40 });
  body.translate(0, 0, -0.75);
  const shellMat = new THREE.MeshPhysicalMaterial({ color: 0x4d8dff, transparent: true, opacity: 0.1, roughness: 0.15, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
  const edgeMat = new THREE.LineBasicMaterial({ color: LINE, transparent: true, opacity: 0.55 });
  g.add(new THREE.Mesh(body, shellMat), new THREE.LineSegments(new THREE.EdgesGeometry(body, 28), edgeMat));
  fade.push([shellMat, 0.1], [edgeMat, 0.55]);

  // wheels: wireframe tyre + rim spokes
  const wheelMat = new THREE.LineBasicMaterial({ color: 0x9fc4ff, transparent: true, opacity: 0.7 });
  fade.push([wheelMat, 0.7]);
  const tyre = new THREE.WireframeGeometry(new THREE.TorusGeometry(0.26, 0.085, 8, 28));
  const rim = new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 5));
  for (const x of [-1.35, 1.35]) {
    for (const z of [-0.86, 0.86]) {
      const w = new THREE.Group();
      w.position.set(x, 0.34, z);
      w.add(new THREE.LineSegments(tyre, wheelMat), new THREE.LineSegments(rim.clone().rotateX(Math.PI / 2), wheelMat));
      g.add(w);
    }
  }

  // chassis rails and cross bars (thin, lit blue-grey)
  const railMat = new THREE.MeshStandardMaterial({ color: 0x6f86a8, metalness: 0.8, roughness: 0.4, transparent: true });
  fade.push([railMat, 1]);
  for (const z of [-0.62, 0.62]) { const m = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.05, 0.06), railMat); m.position.set(0, 0.27, z); g.add(m); }
  for (const x of [-1.35, 1.35]) { const m = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 1.8), railMat); m.position.set(x, 0.3, 0); g.add(m); }

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
        }
        camera.userData.target = camera.userData.target || new THREE.Vector3(0, 0.55, 0);
      } else {
        const a = 0.6, k = seg(t, 0.2, 4.2);
        const far = [Math.cos(a) * 7.4, 2.5, Math.sin(a) * 7.4];
        camKeys(camera, t, [{ t: 0, p: far, l: [0, 0.55, 0] }, { t: 0.2, p: far, l: [0, 0.55, 0] }, { t: 4.2, p: [2.7, 0.75, 2.6], l: [0, 0.14, 0] }, { t: 5, p: [2.7, 0.75, 2.6], l: [0, 0.14, 0] }]);
        const dim = 1 - 0.85 * k;
        for (const [m, base] of fade) m.opacity = base * dim;
        pack.glow('all', C.aluminium, pulse + 0.35 * k);
      }
    },
  };
}

export const vehicle = { duration: 8, loop: true, create: (s) => create(s, false) };
export const vehicleZoom = { duration: 5, loop: false, create: (s) => create(s, true) };
