import * as THREE from 'three';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix } from '../stage.js';

// Slide 14 - Model D: the same tray morphs through three architectures in 12 s:
// module pack (12 modules, 5 cross members) -> cell-to-pack (blade cells, 1 cross member) -> cell-to-body (lid = floor).
const COLS = 6, K = 8; // 6 module columns x 2 rows x 8 cells
const CELL = [0.012, 0.09, 0.46];

export default {
  duration: 12,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.3, key: 2.8 });
    const camera = stage.camera(30);
    const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.65, roughness: 0.4, transparent: true, ...o });
    const cast = (m) => { m.castShadow = m.receiveShadow = true; return m; };
    const box = (w, h, d, mat, x = 0, y = 0, z = 0) => { const m = cast(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)); m.position.set(x, y, z); return m; };

    // tray: floor + frame, aluminium blue
    const alu = std(C.aluminium);
    const tray = new THREE.Group();
    tray.add(box(1.7, 0.04, 1.3, alu, 0, -0.07, 0));
    for (const s of [-1, 1]) tray.add(box(1.7, 0.12, 0.05, alu, 0, -0.01, s * 0.625), box(0.05, 0.12, 1.3, alu, s * 0.825, -0.01, 0));
    scene.add(tray);

    // modules: 12 shells + 5 cross members (4 of them fade out in cell-to-pack)
    const shellMat = std(0x9aa4af, { opacity: 0.2, metalness: 0.3, roughness: 0.3, depthWrite: false });
    const modCx = (c) => (c - (COLS - 1) / 2) * 0.255;
    const shells = [];
    for (let c = 0; c < COLS; c++) for (const z of [-0.27, 0.27]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.115, 0.5), shellMat);
      s.position.set(modCx(c), -0.0, z);
      scene.add(s);
      shells.push(s);
    }
    const beamFade = std(C.steel), beamKeep = std(C.steel);
    const beams = [];
    for (let g = 0; g < COLS - 1; g++) {
      const x = (modCx(g) + modCx(g + 1)) / 2;
      const b = box(0.03, 0.1, 1.2, g === 2 ? beamKeep : beamFade, x, 0, 0);
      scene.add(b);
      beams.push({ b, g });
    }

    // cells: instanced plates, module layout -> blade layout
    const N = COLS * 2 * K;
    const cellMat = new THREE.MeshStandardMaterial({ color: 0xe3e7ec, metalness: 0.25, roughness: 0.5 });
    const cells = new THREE.InstancedMesh(new THREE.BoxGeometry(...CELL), cellMat, N);
    cells.castShadow = true;
    scene.add(cells);
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();

    // lid + floor panel with seat rails (cell-to-body)
    const lidMat = std(C.smc, { metalness: 0.1, roughness: 0.6 });
    const lid = box(1.7, 0.018, 1.3, lidMat, 0, 0.07, 0);
    const floor = new THREE.Group();
    const floorMat = std(C.smc, { metalness: 0.1, roughness: 0.6 });
    floor.add(box(1.7, 0.018, 1.3, floorMat));
    const railMat = std(C.steel), seatMat = std(0x1b2230, { metalness: 0.2, roughness: 0.8 });
    for (const z of [-0.38, 0.38]) floor.add(box(1.0, 0.04, 0.05, railMat, -0.1, 0.03, z), box(0.5, 0.26, 0.5, seatMat, -0.35, 0.16, z));
    scene.add(lid, floor);

    const L1 = stage.addLabel('12 modules · 5 cross members', new THREE.Vector3(0, 0.55, 0), { cls: 'part big' });
    const L2 = stage.addLabel('', new THREE.Vector3(0, 0.55, 0), { cls: 'part big' });
    const L3 = stage.addLabel('lid = floor · seat rails on the lid', new THREE.Vector3(0, 0.9, 0), { cls: 'part big good' });

    return {
      scene, camera,
      update(t) {
        const kB = seg(t, 3.6, 6.4); // cell-to-pack
        const kC = seg(t, 8.0, 10.4); // cell-to-body
        // cells
        for (let c = 0; c < COLS; c++) for (let r = 0; r < 2; r++) for (let k = 0; k < K; k++) {
          const i = (c * 2 + r) * K + k;
          const mx = modCx(c) + (k - (K - 1) / 2) * 0.026, mz = r ? 0.27 : -0.27;
          const bi = c * K + k; // blade index along the tray (row 0 carries the full-width blade)
          const bx = (bi - (COLS * K - 1) / 2) * 0.0335;
          p.set(mix(mx, bx, kB), -0.005, mix(mz, 0, kB));
          const sz = r === 0 ? mix(1, 2.6, kB) : mix(1, 0.0001, kB); // row 0 stretches into a blade, row 1 merges into it
          s.set(mix(1, 1.9, kB), 1, Math.max(sz, 0.0001));
          m4.compose(p, q, s);
          cells.setMatrixAt(i, m4);
        }
        cells.instanceMatrix.needsUpdate = true;
        shells.forEach((m) => { m.visible = kB < 0.98; });
        shellMat.opacity = 0.2 * (1 - seg(t, 3.6, 5.0));
        beamFade.opacity = 1 - seg(t, 3.8, 5.2);
        beams.forEach(({ b, g }) => { if (g !== 2) b.visible = beamFade.opacity > 0.01; });
        // lid / floor
        lid.visible = true;
        lidMat.opacity = t < 6.4 ? seg(t, 6.0, 7.0) : 1 - seg(t, 10.0, 10.8);
        lid.position.y = 0.07;
        floor.position.y = mix(1.0, 0.09, seg(t, 8.0, 10.0));
        floor.visible = t > 7.8;
        L1.alpha = 1 - seg(t, 3.4, 3.9);
        const vol = Math.round(mix(50, 72, kB));
        L2.setText(kB < 0.02 ? '' : `no modules · volume use ${kB < 0.98 ? '≈' + vol : '72'}% (manufacturer claims)`);
        L2.alpha = seg(t, 3.9, 4.4) * (1 - seg(t, 7.8, 8.2));
        L3.alpha = seg(t, 10.4, 11);
        camKeys(camera, t, [
          { t: 0, p: [2.5, 2.0, 3.0], l: [0, 0, 0] }, { t: 6, p: [2.8, 2.3, 3.0], l: [0, 0, 0] }, { t: 12, p: [3.2, 2.2, 3.1], l: [0, 0.2, 0] },
        ]);
        stage.setPhase(t < 3.6 ? 0 : t < 8.0 ? 1 : 2);
      },
    };
  },
};
