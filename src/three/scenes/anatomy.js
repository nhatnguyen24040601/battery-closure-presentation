import * as THREE from 'three';
import { buildPack, rectShape, extrude } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix } from '../stage.js';

// Slide 13 - Model A, exploded like slide 3. Parts light up in the order of the script (auto), then a close-up
// of the seal (6 mm -> ~4 mm [88]) and the vent (opens at 150 ± 50 mbar [89]).
// Click a part (or a table row) to inspect it; R replays the sequence.
const SEQ = [
  { a: 1.0, b: 3.4, names: ['Tray', 'Coolant'], text: 'Tray' },
  { a: 3.4, b: 5.2, names: ['Sill_L', 'Sill_R'], text: 'Side frame' },
  { a: 5.2, b: 7.2, names: ['CrossMember'], text: 'Cross member' },
  { a: 7.2, b: 9.2, names: ['Shield'], text: 'Underbody plate' },
  { a: 9.2, b: 11.2, names: ['Lid', 'Barrier'], text: 'Lid' },
];
const JOB = {
  Tray: 'Tray · carries the cells, floor stiffness, holds the cooling',
  Coolant: 'Cooling ports · liquid in and out of the tray channels',
  Sill_L: 'Side frame · absorbs side-impact energy', Sill_R: 'Side frame · absorbs side-impact energy',
  CrossMember: 'Cross member · passes the load across the car',
  Shield: 'Underbody plate · stops stones and kerbs',
  Lid: 'Lid · closes, seals, protects the cabin from fire', Barrier: 'Barrier · mica / aerogel liner against fire spread',
  Seal: 'Seal · keeps water out', Vent: 'Vent · lets gas escape', Cells: 'Cells · store the energy',
};

export default {
  duration: 17,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.45, key: 2.8 });
    const camera = stage.camera(30);
    const pack = buildPack();
    scene.add(pack.group);

    // enlarged slice of the extruded tray floor: the hollow chambers are the coolant channels
    const holes = [];
    for (let i = 0; i < 14; i++) holes.push([-0.6 + (1.2 / 14) * (i + 0.5), 0, 1.2 / 28 - 0.006, 0.011]);
    const slice = new THREE.Mesh(extrude(rectShape(1.2, 0.03, holes), 0.012), new THREE.MeshStandardMaterial({ color: C.aluminium, metalness: 0.7, roughness: 0.35, side: THREE.DoubleSide, transparent: true }));
    slice.rotation.y = Math.PI / 2;
    slice.scale.y = 3;
    slice.position.set(-1.25, -0.2, 0);
    scene.add(slice);

    const lab = stage.addLabel('', pack.anchors.Tray, { cls: 'wrap', dy: -14 });
    const sliceLab = stage.addLabel('extruded floor, section ×3: coolant channels', new THREE.Vector3(-1.25, -0.05, 0), { cls: 'sub wrap' });
    const sealLab = stage.addLabel('', pack.anchors.Seal, { cls: 'warn big' });
    const ventLab = stage.addLabel('vent opens at 150 ± 50 mbar [89]', pack.anchors.Vent, { cls: 'good big' });

    const st = { manual: null, last: null };
    const inst = {
      scene, camera, pickables: [pack.group],
      onPick(name) { st.manual = name; },
      reset() { st.manual = null; st.last = null; },
      update(t) {
        const e = seg(t, 0, 1.2);
        // closing sequence (11.2 -> 17): lid comes down, seal is squeezed, vent pops open
        const close = seg(t, 11.4, 13.6), press = seg(t, 12.6, 14);
        const per = st.manual ? {} : { Lid: 1 - close, Barrier: 1 - close * 0.6, Seal: 1 - close, Cells: 1 - close * 0.5, CrossMember: 1 - close * 0.5 };
        pack.explode(e, per);
        pack.focus(null);
        pack.glow('all', 0, 0);
        pack.flow(t);
        pack.sealPress(st.manual ? 1 : press);
        pack.ventOpen(st.manual ? 0 : seg(t, 14.6, 15.4));
        pack.clip(null);
        sealLab.alpha = ventLab.alpha = 0;
        slice.visible = false;
        const pulse = 0.5 + 0.5 * Math.sin(t * 5);
        let names = null, text = '', phase = -1;

        if (st.manual) {
          names = st.manual === 'Sill_R' ? ['Sill_L', 'Sill_R'] : [st.manual];
          text = JOB[st.manual];
          lab.target = pack.anchors[st.manual];
        } else {
          SEQ.forEach((s, i) => { if (t >= s.a && t < s.b) { names = s.names; text = s.text; phase = i; lab.target = pack.anchors[s.names[0]]; } });
          if (t >= 1.0 && t < 3.4) { slice.visible = true; pack.clip(null); }
          if (t >= 11.4) {
            phase = 5;
            names = ['Seal', 'Lid', 'Sill_R', 'Sill_L', 'Tray', 'Vent'];
            pack.focus(['Seal', 'Vent', 'Sill_R', 'Tray', 'Sill_L'], 0.18);
            if (t < 14.5) { text = ''; sealLab.alpha = seg(t, 12.6, 13.2); sealLab.setText(`seal bead ${(6 - 2 * press).toFixed(1)} mm`); }
            ventLab.alpha = seg(t, 14.8, 15.4);
            lab.alpha = 0;
          }
        }
        if (names && phase < 5) {
          pack.focus(names, 0.14);
          for (const n of names) pack.glow(n, 0xffffff, 0.12 + 0.12 * pulse);
          slice.visible = slice.visible && names.includes('Tray');
        }
        if (phase < 5) lab.alpha = text ? 1 : 0;
        sliceLab.alpha = slice.visible ? 1 : 0;
        lab.setText(text);
        const key = st.manual ?? (phase >= 0 ? SEQ[phase]?.names[0] ?? 'Seal' : null);
        if (key !== st.last) { st.last = key; stage.onPick?.(key ?? ''); }
        stage.setPhase(st.manual ? -1 : phase);

        camKeys(camera, t, [
          { t: 0, p: [3.7, 2.3, 3.9], l: [0.2, 0.0, -0.3] }, { t: 11, p: [3.7, 2.3, 3.9], l: [0.2, 0.0, -0.3] },
          { t: 13.4, p: [-1.55, 0.45, 1.5], l: [-0.7, 0.07, 0.25] }, { t: 17, p: [-1.55, 0.45, 1.5], l: [-0.7, 0.07, 0.25] },
        ]);
      },
    };
    return inst;
  },
};
