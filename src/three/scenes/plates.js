import * as THREE from 'three';
import { addMorph } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix } from '../stage.js';

// Slide 8 - Model C: three plates with the SAME bending stiffness (E*t^3 equal), so t ~ E^(-1/3):
// steel t, aluminium 1.40 t, magnesium 1.62 t. Same load -> same deflection; then weigh them (mass = rho*t).
const MAT = [
  { name: 'Steel', E: 190, rho: 7.9, color: C.steel },
  { name: 'Aluminium', E: 69, rho: 2.7, color: C.aluminium },
  { name: 'Magnesium', E: 45, rho: 1.7, color: C.magnesium },
];
const T0 = 0.1;
MAT.forEach((m) => { m.t = T0 * Math.cbrt(190 / m.E); m.mass = (m.rho * m.t) / (7.9 * T0); });
const SPAN = 1.7, WID = 1.0, DEFL = 0.16;
const X = [-2.3, 0, 2.3];

export default {
  duration: 12,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.5, key: 2.6 });
    const camera = stage.camera(30);
    const cast = (m) => { m.castShadow = m.receiveShadow = true; return m; };
    const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.6, roughness: 0.38, ...o });

    const plates = MAT.map((m, i) => {
      const g = new THREE.BoxGeometry(SPAN, m.t, WID, 60, 1, 1);
      // bending shape key: simply supported, load in the middle (parabola-like)
      addMorph(g, (x) => [0, -DEFL * (1 - (2 * x / SPAN) ** 2), 0]);
      const mesh = cast(new THREE.Mesh(g, std(m.color)));
      const grp = new THREE.Group();
      grp.position.set(X[i], 0, 0);
      grp.add(mesh);
      // supports stay behind when the plate is lifted onto the scale
      for (const s of [-1, 1]) {
        const sup = cast(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.22, WID + 0.1), std(0x56606e)));
        sup.position.set(X[i] + s * (SPAN / 2 - 0.05), -m.t / 2 - 0.11, 0);
        scene.add(sup);
      }
      // press (indenter)
      const press = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, WID + 0.1, 24).rotateX(Math.PI / 2), std(0xdfe3e8)));
      const ram = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 12), std(0x7b8594)));
      grp.add(press, ram);
      scene.add(grp);
      return { m, mesh, grp, press, ram };
    });

    // scales: base + dial + needle
    const scales = MAT.map((m, i) => {
      const g = new THREE.Group();
      g.position.set(X[i], -0.46, 2.0);
      const base = cast(new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.12, 1.3), std(0x3a4350)));
      const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.02, 36), std(0xdfe3e8, { metalness: 0.1 }));
      dial.position.set(0, 0.07, 0.53);
      const needle = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.01, 0.12), new THREE.MeshBasicMaterial({ color: C.danger }));
      needle.position.set(0, 0.09, 0.53);
      needle.geometry.translate(0, 0, -0.05);
      g.add(base, dial, needle);
      scene.add(g);
      return { g, needle };
    });

    const names = MAT.map((m, i) => stage.addLabel(`${m.name} · ${(m.t / T0).toFixed(2)} t`, new THREE.Vector3(X[i], 0.5, 0), { cls: 'part' }));
    const same = stage.addLabel('same load → same deflection', new THREE.Vector3(0, 0.95, 0), { cls: 'warn big' });
    const masses = MAT.map((m, i) => stage.addLabel(`${m.mass.toFixed(2)}`, new THREE.Vector3(X[i], 0.5, 2.0), { cls: 'big good' }));
    const massCap = stage.addLabel('relative mass (steel = 1.00)', new THREE.Vector3(0, 1.0, 2.0), { cls: 'sub' });

    return {
      scene, camera,
      update(t) {
        const push = seg(t, 0.8, 3.2) * (1 - seg(t, 5.0, 6.0));
        const lift = seg(t, 6.0, 7.2), slide = seg(t, 7.2, 8.8);
        plates.forEach((p, i) => {
          p.mesh.morphTargetInfluences[0] = push;
          const topY = p.m.t / 2 - DEFL * push;
          p.press.position.set(0, topY + 0.07 + 0.0, 0);
          p.ram.position.set(0, topY + 0.47, 0);
          p.press.visible = p.ram.visible = t < 6.2;
          // after the test the plate is lifted and moved onto its scale
          const rest = -0.38 + p.m.t / 2; // plate bottom sits on the scale top
          p.grp.position.set(X[i], mix(mix(0, 0.55, lift), rest, seg(t, 8.0, 8.8)), mix(0, 2.0, slide));
          // needle swings in proportion to the mass once the plate sits on it
          scales[i].needle.rotation.y = mix(0, -2.4 * p.m.mass, seg(t, 8.8, 10.2));
        });
        scales.forEach((sc) => { sc.g.visible = t > 5.8; });
        same.alpha = seg(t, 3.0, 3.5) * (1 - seg(t, 5.2, 5.6));
        names.forEach((l) => { l.alpha = seg(t, 0.2, 0.8) * (1 - seg(t, 6.0, 6.8)); });
        masses.forEach((l, i) => { l.alpha = seg(t, 9.6 + i * 0.3, 10.2 + i * 0.3); });
        massCap.alpha = seg(t, 9.4, 10);
        camKeys(camera, t, [
          { t: 0, p: [0, 2.0, 6.2], l: [0, 0, 0] }, { t: 6, p: [0, 2.0, 6.2], l: [0, 0, 0] },
          { t: 8, p: [0, 2.2, 7.4], l: [0, -0.1, 1.0] }, { t: 12, p: [0, 2.2, 7.4], l: [0, -0.1, 1.0] },
        ]);
        stage.setPhase(t < 6 ? 0 : 1);
      },
    };
  },
};
