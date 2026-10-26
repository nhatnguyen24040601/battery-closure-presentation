import * as THREE from 'three';
import { buildPack } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix, clamp01 } from '../stage.js';

// Slide 6 - Model A and the seven "threats", ~2 s each, in the order of the script (15 s total).
const NAMES = ['Side pole crash', 'Stone from below', 'Water, dust, road salt', 'Cooling', 'One cell on fire', 'High voltage', '≈100 kg enclosure (industry estimate)'];
const BURN = 45; // index of the burning cell (left compartment, middle group)

const basic = (color, o = {}) => new THREE.MeshBasicMaterial({ color, transparent: true, ...o });

export default {
  duration: 15,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.5, key: 2.8 });
    const camera = stage.camera(30);
    const pack = buildPack();
    scene.add(pack.group);
    const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.5, roughness: 0.45, ...o });
    const cast = (m) => { m.castShadow = true; return m; };

    // 1 pole
    const pole = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.4, 28), std(C.danger, { emissive: C.danger, emissiveIntensity: 0.25 })));
    scene.add(pole);
    // 2 stone
    const rock = new THREE.IcosahedronGeometry(0.08, 1);
    const rp = rock.attributes.position;
    for (let i = 0; i < rp.count; i++) { const k = 1 + 0.18 * Math.sin(i * 12.9898); rp.setXYZ(i, rp.getX(i) * k, rp.getY(i) * k * 0.8, rp.getZ(i) * k); }
    rock.computeVertexNormals();
    const stone = cast(new THREE.Mesh(rock, std(0x7b7f86, { roughness: 0.95, metalness: 0.05 })));
    scene.add(stone);
    // 3 water drops
    const drops = [];
    const dropGeo = new THREE.SphereGeometry(0.022, 12, 10);
    for (let i = 0; i < 7; i++) {
      const d = new THREE.Mesh(dropGeo, basic(0x7dd3fc, { opacity: 0.95 }));
      d.userData = { x: -0.4 + i * 0.16, delay: (i % 3) * 0.18 };
      scene.add(d);
      drops.push(d);
    }
    // 5 flames on the burning cell
    const flames = [0, 1, 2].map(() => {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.14, 10), basic(0xff8a1f, { blending: THREE.AdditiveBlending, depthWrite: false }));
      scene.add(f);
      return f;
    });
    const burnPos = new THREE.Vector3(pack.cells[BURN].x, 0.03, pack.cells[BURN].z);
    const fireLight = new THREE.PointLight(0xff6a00, 0, 1.2);
    fireLight.position.copy(burnPos).setY(0.1);
    scene.add(fireLight);
    // 6 lightning + insulation shell
    const bolt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 9 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: 0xfde047 }));
    scene.add(bolt);
    const shellGeo = new THREE.BoxGeometry(1.52, 0.34, 1.32);
    const shell = new THREE.LineSegments(new THREE.EdgesGeometry(shellGeo), new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true }));
    scene.add(shell);
    // 7 scale
    const scale = new THREE.Group();
    const plat = cast(new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.05, 0.08, 48), std(0x3a4350, { metalness: 0.7 })));
    plat.receiveShadow = true;
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.02, 40), std(0xdfe3e8, { metalness: 0.1 }));
    dial.position.set(0, 0.045, 0.78);
    scale.add(plat, dial);
    scale.position.set(0, -0.17, 0);
    scene.add(scale);
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.01, 0.15), basic(C.danger));
    needle.position.set(0, 0.062, 0.78);
    scale.add(needle);

    const labels = NAMES.map((n) => stage.addLabel(n, new THREE.Vector3(), { cls: 'part big' }));
    const tmp = new THREE.Vector3();
    const where = [
      new THREE.Vector3(0, 0.5, -0.9), new THREE.Vector3(0.25, -0.62, 0.1), new THREE.Vector3(0.1, 0.8, 0.57), new THREE.Vector3(0.0, 0.45, 0),
      new THREE.Vector3(pack.cells[BURN].x, 0.4, pack.cells[BURN].z), new THREE.Vector3(0, 0.7, 0), new THREE.Vector3(0, 0.1, 1.2),
    ];
    labels.forEach((l, i) => { l.target = where[i]; });
    const tag = stage.addLabel('', new THREE.Vector3(1.1, -0.25, 1.0), { cls: 'good big' });

    return {
      scene, camera, pickables: [],
      update(t) {
        const i = Math.min(6, Math.floor(t / 2));
        const e = lin(t, i * 2, i * 2 + 2); // progress inside the current threat
        // reset
        pack.focus(null);
        pack.glow('all', 0, 0);
        pack.dent(0);
        pack.bumpShield(0);
        pack.resetCells();
        pack.tint('Tray', C.aluminium);
        pack.group.position.set(0, 0, 0);
        pack.flow(t);
        pole.visible = stone.visible = shell.visible = bolt.visible = false;
        drops.forEach((d) => (d.visible = false));
        flames.forEach((f) => (f.visible = false));
        fireLight.intensity = 0;
        scale.visible = false;
        tag.alpha = 0;
        const pulse = 0.5 + 0.5 * Math.sin(t * 9);

        if (i === 0) { // pole hits the left sill; the sill glows and crushes
          const z = mix(-1.45, -0.615, seg(e, 0.05, 0.75));
          pole.visible = true;
          pole.position.set(0, 0.02, z);
          pack.dent(clamp01((z + 0.69) / 0.075));
          pack.focus(['Sill_L', 'CrossMember', 'Cells'], 0.35);
          pack.glow('Sill_L', C.danger, 0.2 + 0.5 * pulse * seg(e, 0.6, 0.8));
        } else if (i === 1) { // stone from below hits the shield
          stone.visible = true;
          const up = seg(e, 0.05, 0.6);
          stone.position.set(0.25, mix(-1.0, -0.2, up) - 0.12 * seg(e, 0.62, 1), 0.1);
          stone.rotation.set(e * 6, e * 4, 0);
          pack.focus(['Shield'], 0.3);
          pack.bumpShield(seg(e, 0.55, 0.7) * (1 - 0.6 * seg(e, 0.75, 1)));
          pack.glow('Shield', C.warn, 0.5 * pulse * seg(e, 0.55, 0.7));
        } else if (i === 2) { // water stopped by the seal
          pack.focus(['Seal', 'Sill_R'], 0.08);
          drops.forEach((d) => {
            const k = clamp01((e - d.userData.delay) / 0.5);
            if (k <= 0 || k >= 1.15) return;
            d.visible = true;
            d.position.set(d.userData.x, mix(1.2, 0.115, k), 0.565);
            const sp = seg(k, 0.9, 1.15); // splash flattens and fades at the seal
            d.scale.set(1 + 2 * sp, 1 - 0.8 * sp, 1 + 1.2 * sp);
            d.material.opacity = 0.95 * (1 - sp);
          });
          pack.glow('Seal', 0xffffff, 0.45 * seg(e, 0.2, 0.5));
        } else if (i === 3) { // thermal: tray cools from orange to blue, coolant flows
          pack.focus(['Tray', 'Coolant'], 0.2);
          const k = seg(e, 0.15, 0.85);
          const c = new THREE.Color(C.hot).lerp(new THREE.Color(C.aluminium), k);
          pack.tint('Tray', c);
          pack.glow('Tray', c, 0.35 * (1 - k));
          pack.glow('Coolant', C.coolant, 0.1);
        } else if (i === 4) { // one cell burns, the barrier holds
          pack.focus(['Barrier', 'Cells', 'Sill_L', 'Sill_R'], 0.15);
          pack.setCellColor(BURN, new THREE.Color(0xff2a1a));
          pack.parts.Barrier.userData.mats[0].opacity = 0.3; // see the burning cell through the liner
          pack.glow('Barrier', C.barrier, 0.35 + 0.2 * pulse);
          flames.forEach((f, k) => {
            f.visible = true;
            const fl = 0.8 + 0.4 * Math.sin(t * 14 + k * 2);
            f.scale.set(fl, fl * 1.3, fl);
            f.position.set(burnPos.x + (k - 1) * 0.0, 0.07 + 0.05 * fl, burnPos.z + (k - 1) * 0.13);
          });
          fireLight.intensity = 1.5 + 0.8 * pulse;
        } else if (i === 5) { // high voltage stays inside an insulated shell
          shell.visible = true;
          shell.material.opacity = seg(e, 0.1, 0.35);
          bolt.visible = e > 0.3 && e < 0.9 && Math.sin(t * 40) > -0.4;
          if (bolt.visible) {
            const pts = bolt.geometry.attributes.position;
            const top = 1.2, end = 0.2;
            for (let k = 0; k < 9; k++) {
              const f = k / 8;
              pts.setXYZ(k, 0.3 + (k % 8 === 0 ? 0 : (Math.sin(t * 77 + k * 3.1)) * 0.07), mix(top, end, f), 0.0 + (k % 8 === 0 ? 0 : Math.cos(t * 53 + k * 1.7) * 0.07));
            }
            pts.needsUpdate = true;
          }
          pack.glow('all', 0x34d399, 0.18 * seg(e, 0.3, 0.6));
          tag.alpha = seg(e, 0.55, 0.8);
          tag.setText('isolation ≥ 100 Ω/V');
          tag.target = new THREE.Vector3(0.0, 0.45, 0.8);
        } else { // weigh it
          scale.visible = true;
          const drop = seg(e, 0.05, 0.5);
          pack.group.position.y = mix(0.55, 0.0, drop);
          needle.rotation.y = mix(0, -1.5, seg(e, 0.5, 0.9));
          tag.alpha = seg(e, 0.55, 0.8);
          tag.setText('≈100 kg');
          tag.target = new THREE.Vector3(0, 0.1, 1.45);
        }

        labels.forEach((l, k) => { l.alpha = k === i ? seg(e, 0.0, 0.15) : 0; });
        const cam = [[1.9, 1.5, -3.0], [1.1, -1.5, -2.1], [2.1, 1.9, 2.0], [2.5, 1.5, 2.3], [1.4, 1.5, -2.0], [2.6, 1.6, 2.2], [2.4, 1.3, 3.0]];
        camKeys(camera, t, cam.map((p, k) => ({ t: k * 2 + 0.4, p, l: [0, 0, 0] })).concat([{ t: 15, p: cam[6], l: [0, 0, 0] }]));
        stage.setPhase(i + 1);
      },
    };
  },
};
