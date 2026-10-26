import * as THREE from 'three';
import { buildPack } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix, clamp01 } from '../stage.js';

// Slide 7 - three miniature test rigs, ~4 s each (12 s): crush, bottom impact, thermal propagation.
// Simplified illustration of the test principles, not the real rigs.
const BURN = 45;
const X = [-3.3, 0, 3.3];
const basic = (color, o = {}) => new THREE.MeshBasicMaterial({ color, transparent: true, ...o });

export default {
  duration: 12,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.4, key: 2.8 });
    const camera = stage.camera(28);
    const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.7, roughness: 0.35, ...o });
    const cast = (m) => { m.castShadow = true; return m; };

    const packs = X.map((x) => {
      const p = buildPack();
      p.group.position.x = x;
      p.group.scale.setScalar(1.05);
      scene.add(p.group);
      return p;
    });
    // active-rig ring under each pack
    const rings = X.map((x) => {
      const m = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.32, 64).rotateX(-Math.PI / 2), basic(0x5eead4, { opacity: 0 }));
      m.position.set(x, -0.39, 0);
      scene.add(m);
      return m;
    });

    // rig 1: 75 mm half-cylinder platen pressing on the pack side
    const platen = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.3, 28, 1, false, 0, Math.PI), std(0xc7ced6)));
    platen.rotation.y = Math.PI / 2 + Math.PI; // flat side faces away from the pack
    const holder = cast(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.4), std(0x445066)));
    scene.add(platen, holder);
    // rig 2: 30 mm impactor head on a rod, from below
    const head = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.05, 20), std(0xdfe3e8)));
    const rod = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.8, 12), std(0x445066)));
    scene.add(head, rod);
    // rig 3: flames
    const flame = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 10), basic(0xff8a1f, { blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(flame);
    const burnPos = new THREE.Vector3(X[2] + packs[2].cells[BURN].x * 1.05, 0.03, packs[2].cells[BURN].z * 1.05);

    const titles = ['Crush · UN R100', 'Bottom impact · GB 38031', 'Thermal propagation · GB 38031'];
    const tl = titles.map((s, i) => stage.addLabel(s, new THREE.Vector3(X[i], -0.45, 1.05), { cls: 'big' }));
    const gauge = [
      stage.addLabel('', new THREE.Vector3(X[0], 0.5, -0.9), { cls: 'warn big' }),
      stage.addLabel('', new THREE.Vector3(X[1], 0.35, 0.9), { cls: 'warn big' }),
      stage.addLabel('', new THREE.Vector3(X[2], 0.6, 0.0), { cls: 'big' }),
    ];
    const notes = [
      stage.addLabel('75 mm platen · ≥100 kN', new THREE.Vector3(X[0], -0.62, 1.05), { cls: 'sub' }),
      stage.addLabel('30 mm head · 150 J × 3 · SOC ≥ 95%', new THREE.Vector3(X[1], -0.62, 1.05), { cls: 'sub' }),
      stage.addLabel('one cell in thermal runaway · no fire for ≥ 2 h', new THREE.Vector3(X[2], -0.62, 1.05), { cls: 'sub' }),
    ];

    return {
      scene, camera,
      update(t) {
        const i = Math.min(2, Math.floor(t / 4));
        const e = lin(t, i * 4, i * 4 + 4);
        packs.forEach((p, k) => { p.focus(null); p.glow('all', 0, 0); p.dent(0); p.bumpShield(0); p.resetCells(); p.clip(k === 2 ? 0.075 : null); });
        rings.forEach((m, k) => { m.material.opacity = k === i ? 0.9 : 0.15; });
        platen.visible = holder.visible = head.visible = rod.visible = flame.visible = true;

        // 1: platen presses the side, force gauge climbs to 100 kN
        const press = seg(lin(t, 0.4, 3.4), 0, 1);
        const pz = mix(-1.05, -0.636, press);
        platen.position.set(X[0], 0.0, pz);
        holder.position.set(X[0], 0.0, pz - 0.28);
        packs[0].dent(clamp01((pz + 0.705) / 0.069)); // only once the platen touches the sill
        gauge[0].setText(`${Math.round(press * 100)} kN`);
        gauge[0].alpha = lin(t, 0.4, 0.8) * (t < 4.5 ? 1 : 0.35);
        if (i === 0) packs[0].glow('Sill_L', C.danger, 0.15 + 0.35 * press);

        // 2: three hits from below
        const tt = lin(t, 4.6, 7.6) * 3; // 0..3 hits
        const ph = tt % 1;
        const hit = Math.floor(tt);
        const strike = hit < 3 && tt > 0 ? Math.sin(Math.min(1, ph / 0.55) * Math.PI) : 0; // 0 away .. 1 touching
        const hy = mix(-0.78, -0.14, strike);
        head.position.set(X[1] + 0.25, hy, 0.1);
        rod.position.set(X[1] + 0.25, hy - 0.42, 0.1);
        packs[1].bumpShield(strike * 0.8);
        gauge[1].setText(tt <= 0 ? '' : `hit ${Math.min(3, hit + 1)} / 3`);
        gauge[1].alpha = tt > 0 ? 1 : 0;
        if (i === 1) packs[1].glow('Shield', C.warn, 0.4 * strike);

        // 3: one cell burns, the neighbours stay normal; the clock runs 0 -> 2 h
        const clock = lin(t, 8.3, 11.6);
        packs[2].setCellColor(BURN, new THREE.Color(0xff2a1a));
        packs[2].glow('Barrier', C.barrier, 0.45);
        flame.position.set(burnPos.x, 0.09, burnPos.z);
        const fl = 0.8 + 0.4 * Math.sin(t * 14);
        flame.scale.set(fl, fl * 1.3, fl);
        flame.visible = clock < 0.35; // the flame is inside the cell: it is out of the barrier and gone
        const mins = Math.round(clock * 120);
        const done = clock >= 1;
        gauge[2].setText(done ? '2:00 h · no fire ✓' : `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')} h`);
        gauge[2].el.className = 'label3d big ' + (done ? 'good' : '');
        gauge[2].alpha = lin(t, 8.3, 8.7);
        if (i !== 2) flame.visible = false;

        tl.forEach((l, k) => { l.alpha = k === i ? 1 : 0.55; });
        notes.forEach((l, k) => { l.alpha = k === i ? seg(t, i * 4, i * 4 + 0.5) : 0; });
        camKeys(camera, t, [{ t: 0, p: [0, 2.6, 6.0], l: [0, -0.1, 0] }, { t: 12, p: [0, 2.6, 6.0], l: [0, -0.1, 0] }]);
        stage.setPhase(i);
      },
    };
  },
};
