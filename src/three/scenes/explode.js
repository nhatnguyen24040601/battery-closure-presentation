import * as THREE from 'three';
import { buildPack, cellLayout } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix } from '../stage.js';

// Slide 3 - Model A assembled -> exploded (0-8 s), then a cell -> module -> pack inset (8-12 s)
const NAMES = {
  Lid: 'lid', Tray: 'tray', Sill_R: 'side frame', CrossMember: 'cross member', Shield: 'underbody plate',
  Seal: 'seal', Vent: 'vent', Coolant: 'cooling plate',
};
const LABEL_AT = { Tray: 5.0, Lid: 5.3, Sill_R: 5.6, CrossMember: 5.9, Shield: 6.2, Seal: 6.5, Vent: 6.8, Coolant: 7.1 };

function insetScene(stage) {
  const scene = stage.makeScene({ key: 2.2 });
  scene.background = new THREE.Color(0x0a1327); // opaque: the frame sits in the DOM above the canvas
  const cam = stage.camera(28);
  cam.position.set(0.9, 0.75, 1.5);
  cam.lookAt(0, 0, 0);
  const g = new THREE.Group();
  scene.add(g);
  const N = 36; // 4 modules x 9 cells
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.25, roughness: 0.5 });
  const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.012, 0.1, 0.5), mat, N);
  for (let i = 0; i < N; i++) inst.setColorAt(i, new THREE.Color(0xe3e7ec));
  g.add(inst);
  const shellMat = new THREE.MeshStandardMaterial({ color: 0xaab4c0, transparent: true, opacity: 0, metalness: 0.3, roughness: 0.3, depthWrite: false });
  const shells = [0, 1, 2, 3].map((m) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.12, 0.54), shellMat);
    g.add(s);
    return s;
  });
  const trayMat = new THREE.MeshStandardMaterial({ color: C.aluminium, transparent: true, opacity: 0, metalness: 0.7, roughness: 0.35, depthWrite: false });
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.14, 1.3), trayMat);
  tray.position.y = -0.012;
  g.add(tray);
  const modPos = [[-0.17, -0.3], [0.17, -0.3], [-0.17, 0.3], [0.17, 0.3]]; // x, z of the 4 module centres in the pack
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), s = new THREE.Vector3();
  return {
    scene, camera: cam,
    update(t) {
      const kB = seg(t, 9.0, 10.2), kC = seg(t, 10.5, 11.6);
      g.rotation.y = mix(-0.5, 0.35, lin(t, 7.5, 12));
      g.scale.setScalar(mix(1, 0.62, kC));
      for (let i = 0; i < N; i++) {
        const mod = Math.floor(i / 9), k = i % 9;
        // A: one cell in the middle; B: a module of 9 cells; C: four modules in a pack tray
        const a = i === 0 ? 1 : 0;
        const b = mod === 0 ? 1 : 0;
        const ax = 0, bx = (k - 4) * 0.03 * (mod === 0 ? 1 : 0);
        const cx = modPos[mod][0] + (k - 4) * 0.03, cz = modPos[mod][1];
        p.set(mix(mix(ax, bx, kB), cx, kC), 0, mix(0, cz, kC));
        const sc = mix(mix(a, b, kB), 1, kC);
        s.setScalar(Math.max(sc, 0.0001));
        m4.compose(p, q, s);
        inst.setMatrixAt(i, m4);
      }
      inst.instanceMatrix.needsUpdate = true;
      shellMat.opacity = 0.18 * seg(t, 10.0, 10.4) * (1 - 0.0);
      shells.forEach((sh, m) => {
        const cxm = mix(0, modPos[m][0], kC), czm = mix(0, modPos[m][1], kC);
        sh.position.set(cxm, 0, czm);
        sh.visible = m === 0 || kC > 0;
        sh.scale.setScalar(m === 0 ? 1 : seg(t, 10.5, 11.0));
      });
      trayMat.opacity = 0.25 * seg(t, 11.0, 11.7);
    },
  };
}

export default {
  duration: 12,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.45 });
    const camera = stage.camera(30);
    const pack = buildPack();
    scene.add(pack.group);
    const labels = Object.entries(NAMES).map(([part, text]) => {
      const l = stage.addLabel(text, pack.anchors[part], { cls: 'part', dy: -8 });
      return { part, l };
    });
    const inset = insetScene(stage);
    const frame = document.createElement('div');
    frame.className = 'inset-frame';
    frame.style.cssText = 'left:68%;top:3%;width:30%;aspect-ratio:1';
    stage.labelsEl.appendChild(frame);
    return {
      scene, camera, pack, pickables: [pack.group],
      inset: { scene: inset.scene, camera: inset.camera, x: 0.68, y: 0.03, w: 0.3, ar: 1 },
      update(t, dt) {
        pack.explode(seg(t, 3, 7.5));
        pack.flow(t);
        pack.ventOpen(0);
        pack.group.rotation.y = mix(-0.35, 0.1, lin(t, 0, 8));
        camKeys(camera, t, [
          { t: 0, p: [2.5, 1.9, 2.9], l: [0, 0, 0] },
          { t: 3, p: [2.5, 1.9, 2.9], l: [0, 0, 0] },
          { t: 8, p: [3.5, 2.1, 3.7], l: [0.4, 0.0, -0.4] },
          { t: 12, p: [3.5, 2.1, 3.7], l: [0.4, 0.0, -0.4] },
        ]);
        for (const { part, l } of labels) l.alpha = seg(t, LABEL_AT[part], LABEL_AT[part] + 0.5);
        const showInset = lin(t, 7.9, 8.4);
        frame.style.opacity = showInset;
        inset.update(t);
        this.inset.w = showInset > 0 ? 0.3 : 0;
        stage.setPhase(t < 9.0 ? 0 : t < 10.4 ? 1 : 2);
      },
    };
  },
};
