import * as THREE from 'three';
import { C } from '../palette.js';
import { camKeys, seg, mix } from '../stage.js';

// Slide 4 - Model B: four enclosures through time on one timeline, camera slides left -> right in 12 s.
// Generic models. Only the T-pack dimensions (400 mm stem, ~1600 x 900 x 300 mm) come from [19].
const X = [-5.1, -1.7, 1.7, 5.1];

function plankTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#9a6a38'; g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 6; i++) {
    g.fillStyle = i % 2 ? '#a8763f' : '#8a5c2f';
    g.fillRect(0, i * 21.3, 128, 20);
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(0, i * 21.3 + 20, 128, 1.5);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, metalness: 0.7, roughness: 0.38, ...o });

export default {
  duration: 12,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.2, key: 2.6 });
    const camera = stage.camera(28);
    const shadow = (o) => { o.castShadow = o.receiveShadow = true; return o; };
    const box = (w, h, d, mat, x = 0, y = 0, z = 0) => { const m = shadow(new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)); m.position.set(x, y, z); return m; };

    const wheelMat = M(0x2b3340, { metalness: 0.4 });
    const axleSet = (grp, xs, z, y, r = 0.2) => xs.forEach((x) => {
      for (const s of [-1, 1]) {
        const w = shadow(new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.07, 24).rotateX(Math.PI / 2), wheelMat));
        w.position.set(x, y, s * z);
        grp.add(w);
      }
      const ax = shadow(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, z * 2, 8).rotateX(Math.PI / 2), M(0x778))); ax.position.set(x, y, 0); grp.add(ax);
    });

    // 1 - 1912: wooden battery boxes front and rear of a simple frame
    const m1 = new THREE.Group(); m1.position.x = X[0]; scene.add(m1);
    const wood = new THREE.MeshStandardMaterial({ map: plankTexture(), roughness: 0.85, metalness: 0 });
    for (const z of [-0.32, 0.32]) m1.add(box(2.1, 0.05, 0.07, M(0x555d68), 0, 0.2, z));
    axleSet(m1, [-0.75, 0.75], 0.5, 0.2, 0.23);
    for (const x of [-0.75, 0.75]) { m1.add(box(0.55, 0.32, 0.6, wood, x, 0.4, 0)); m1.add(box(0.58, 0.04, 0.63, M(0xb88650, { metalness: 0.1 }), x, 0.58, 0)); }
    m1.add(box(0.5, 0.06, 0.55, M(0x7a3b2e, { metalness: 0.1 }), 0, 0.42, 0), box(0.06, 0.4, 0.55, M(0x7a3b2e, { metalness: 0.1 }), -0.25, 0.62, 0));

    // 2 - 2009: T-shaped pack (stem 400 mm in the tunnel, 1600 x 900 cross part under the rear seat, 300 mm high)
    const m2 = new THREE.Group(); m2.position.x = X[1]; scene.add(m2);
    const t = new THREE.Shape();
    const S = 0.2, Wc = 0.8, A = -0.75, B = 0.15, F = 1.35; // stem half-width, cross half-width, cross x range [A,B], stem to F
    t.moveTo(A, -Wc); t.lineTo(B, -Wc); t.lineTo(B, -S); t.lineTo(F, -S); t.lineTo(F, S); t.lineTo(B, S); t.lineTo(B, Wc); t.lineTo(A, Wc); t.closePath();
    const tg = new THREE.ExtrudeGeometry(t, { depth: 0.3, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2 });
    tg.rotateX(Math.PI / 2); // shape y -> world z, depth -> -y
    tg.translate(0, 0.45, 0);
    m2.add(shadow(new THREE.Mesh(tg, M(C.shield, { metalness: 0.85, roughness: 0.32 }))));
    axleSet(m2, [-1.0, 1.1], 0.95, 0.2, 0.2);
    m2.add(box(0.25, 0.012, 1.5, M(C.smc, { metalness: 0.1 }), -0.3, 0.46, 0));

    // 3 - 2011-2014: flat floor pack, underbody shield slides in from below
    const m3 = new THREE.Group(); m3.position.x = X[2]; scene.add(m3);
    m3.add(box(1.9, 0.12, 1.45, M(C.aluminium), 0, 0.35, 0), box(1.9, 0.012, 1.45, M(C.smc, { metalness: 0.1 }), 0, 0.416, 0));
    axleSet(m3, [-1.0, 1.0], 0.95, 0.2, 0.2);
    const shield = box(1.9, 0.025, 1.45, M(C.shield, { metalness: 0.9, roughness: 0.25 }), 0, 0.27, 0);
    m3.add(shield);

    // 4 - 2022: cell-to-body, the lid is the floor and the seat rails bolt straight onto it
    const m4 = new THREE.Group(); m4.position.x = X[3]; scene.add(m4);
    m4.add(box(1.9, 0.16, 1.45, M(C.aluminium), 0, 0.33, 0));
    const floor = box(1.9, 0.02, 1.45, M(C.smc, { metalness: 0.1, roughness: 0.6 }), 0, 0.42, 0);
    m4.add(floor);
    for (const z of [-0.4, 0.4]) {
      m4.add(box(1.1, 0.04, 0.05, M(C.steel), -0.1, 0.46, z));
      m4.add(box(0.5, 0.26, 0.5, M(0x1b2230, { metalness: 0.2, roughness: 0.8 }), -0.35, 0.6, z));
    }
    axleSet(m4, [-1.0, 1.0], 0.95, 0.2, 0.2);

    // labels
    const yr = (txt, i, y) => stage.addLabel(txt, new THREE.Vector3(X[i], y, 1.3), { cls: 'year' });
    const years = ['1912', '2009', '2011–2014', '2022'].map((tx, i) => yr(tx, i, 0.0));
    const subs = [
      stage.addLabel('wooden battery boxes', new THREE.Vector3(X[0], 0.95, 0), { cls: 'sub' }),
      stage.addLabel('T-shaped pack', new THREE.Vector3(X[1], 0.95, 0), { cls: 'sub' }),
      stage.addLabel('flat floor pack', new THREE.Vector3(X[2], 0.8, 0), { cls: 'sub' }),
      stage.addLabel('lid = floor', new THREE.Vector3(X[3], 1.0, 0), { cls: 'sub good' }),
    ];
    const dims = [
      stage.addLabel('≈1600 mm', new THREE.Vector3(X[1] - 0.3, 0.2, 0.85), { cls: 'sub' }),
      stage.addLabel('≈900 mm', new THREE.Vector3(X[1] - 0.3, 0.2, -0.85), { cls: 'sub' }),
      stage.addLabel('400 mm', new THREE.Vector3(X[1] + 0.9, 0.65, 0), { cls: 'sub' }),
    ];
    const shieldLab = stage.addLabel('2014: titanium + aluminium shield', new THREE.Vector3(X[2], 0.15, 0.7), { cls: 'warn' });

    return {
      scene, camera,
      update(t) {
        const kc = [0, 2.2, 3.2, 5.2, 6.2, 8.8, 9.6, 12];
        camKeys(camera, t, [
          { t: kc[0], p: [X[0] + 1.0, 1.8, 5.3], l: [X[0], 0.25, 0] }, { t: kc[1], p: [X[0] + 1.0, 1.8, 5.3], l: [X[0], 0.25, 0] },
          { t: kc[2], p: [X[1] + 1.0, 1.8, 5.3], l: [X[1], 0.25, 0] }, { t: kc[3], p: [X[1] + 1.0, 1.8, 5.3], l: [X[1], 0.25, 0] },
          { t: kc[4], p: [X[2] + 1.0, 1.6, 5.3], l: [X[2], 0.15, 0] }, { t: kc[5], p: [X[2] + 1.0, 1.6, 5.3], l: [X[2], 0.15, 0] },
          { t: kc[6], p: [X[3] + 1.0, 1.8, 5.3], l: [X[3], 0.25, 0] }, { t: kc[7], p: [X[3] + 1.0, 1.8, 5.3], l: [X[3], 0.25, 0] },
        ]);
        [m1, m2, m3, m4].forEach((m, i) => { m.rotation.y = Math.sin(t * 0.5 + i) * 0.12; });
        shield.position.y = mix(-0.45, 0.27, seg(t, 6.6, 8.0));
        shieldLab.alpha = seg(t, 8.0, 8.5);
        const at = [[0, 2.8], [3.0, 5.8], [6.0, 9.2], [9.4, 12.1]];
        years.forEach((l, i) => { l.alpha = 0.35 + 0.65 * (t >= at[i][0] && t < at[i][1] ? 1 : 0); });
        subs.forEach((l, i) => { l.alpha = seg(t, at[i][0] + 0.5, at[i][0] + 1.1) * (t < at[i][1] + 2.5 ? 1 : 0.4); });
        dims.forEach((l) => { l.alpha = seg(t, 3.6, 4.2) * (t < 6.0 ? 1 : 0); });
        stage.setPhase(t < 3 ? 0 : t < 6 ? 1 : t < 9 ? 2 : 3);
      },
    };
  },
};
