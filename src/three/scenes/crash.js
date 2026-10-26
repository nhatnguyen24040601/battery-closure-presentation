import * as THREE from 'three';
import { buildPack } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix, clamp01 } from '../stage.js';

// Slide 15 - Model A cut-away, three situations (5 s each). Illustrative animation, not simulation results.
//  1 side-pole crash: sill absorbs, cross member transfers, cells stay intact
//  2 bottom impact:   sandwich shield deforms widely, cells untouched
//  3 cell fire:       barrier holds, gas leaves through the vent, away from the cabin
const BURN = 45; // left compartment, middle group, +z row
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

    const pole = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.4, 28), std(C.danger, { emissive: C.danger, emissiveIntensity: 0.25 })));
    scene.add(pole);
    const rock = new THREE.IcosahedronGeometry(0.08, 1);
    const rp = rock.attributes.position;
    for (let i = 0; i < rp.count; i++) { const k = 1 + 0.18 * Math.sin(i * 12.9898); rp.setXYZ(i, rp.getX(i) * k, rp.getY(i) * k * 0.8, rp.getZ(i) * k); }
    rock.computeVertexNormals();
    const stone = cast(new THREE.Mesh(rock, std(0x7b7f86, { roughness: 0.95, metalness: 0.05 })));
    scene.add(stone);

    // load path: glowing arrows that run along the cross member from the hit side to the far sill
    const arrowGeo = new THREE.ConeGeometry(0.035, 0.1, 14).rotateX(Math.PI / 2);
    const arrows = [0, 1, 2, 3].map(() => {
      const a = new THREE.Mesh(arrowGeo, basic(0xffb37a, { blending: THREE.AdditiveBlending, depthWrite: false }));
      scene.add(a);
      return a;
    });
    // fire: flames + gas puffs along a path cell -> vent -> outside
    const flames = [0, 1, 2].map(() => {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.14, 10), basic(0xff8a1f, { blending: THREE.AdditiveBlending, depthWrite: false }));
      scene.add(f);
      return f;
    });
    const burn = new THREE.Vector3(pack.cells[BURN].x, 0.03, pack.cells[BURN].z);
    const fireLight = new THREE.PointLight(0xff6a00, 0, 1.2);
    fireLight.position.copy(burn).setY(0.1);
    scene.add(fireLight);
    const path = new THREE.CatmullRomCurve3([burn.clone().setY(0.05), new THREE.Vector3(-0.55, 0.04, 0.25), new THREE.Vector3(-0.72, 0.05, 0.25), new THREE.Vector3(-1.1, 0.12, 0.3), new THREE.Vector3(-1.7, 0.3, 0.45)]);
    const NP = 24;
    const gas = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(NP * 3), 3)),
      new THREE.PointsMaterial({ color: 0xffc9a0, size: 0.07, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending }));
    gas.frustumCulled = false;
    scene.add(gas);

        const ok1 = stage.addLabel('✓ cells intact', new THREE.Vector3(-0.35, 0.05, 0.26), { cls: 'good' });
    const ok1b = stage.addLabel('✓', new THREE.Vector3(0.35, 0.05, -0.26), { cls: 'good' });
    const ok2 = stage.addLabel('✓ global deformation · cells untouched', new THREE.Vector3(0, -0.05, 0), { cls: 'good big' });
    const hold = stage.addLabel('barrier holds', new THREE.Vector3(-0.2, 0.08, -0.1), { cls: 'part' });
    const out = stage.addLabel('gas vented away from the cabin', new THREE.Vector3(-1.15, 0.2, 0.3), { cls: 'warn' });
    const path1 = stage.addLabel('load path: sill → cross member → far sill', new THREE.Vector3(0, 0.15, 0.0), { cls: 'warn' });

    return {
      scene, camera,
      update(t) {
        const i = Math.min(2, Math.floor(t / 5));
        const e = lin(t, i * 5, i * 5 + 5);
        pack.focus(null);
        pack.glow('all', 0, 0);
        pack.resetCells();
        pack.flow(t);
        pack.clip(0.075); // horizontal cut-away: lid and top of the sills removed
        pole.visible = i === 0;
        stone.visible = i === 1;
        flames.forEach((f) => (f.visible = false));
        fireLight.intensity = 0;
        gas.visible = false;
        arrows.forEach((a) => (a.visible = false));
        const pulse = 0.5 + 0.5 * Math.sin(t * 9);

        // 1 ------------------------------------------------------------
        let dent = 0, bump = 0;
        if (i === 0) {
          const z = mix(-1.5, -0.615, seg(e, 0.05, 0.5));
          pole.position.set(0, 0.02, z);
          dent = clamp01((z + 0.69) / 0.075);
          pack.glow('Sill_L', C.danger, 0.15 + 0.35 * pulse * seg(e, 0.4, 0.55));
          const run = seg(e, 0.5, 0.62);
          pack.glow('CrossMember', C.steel, 0.5 * run);
          pack.glow('Sill_R', C.steel, 0.3 * seg(e, 0.8, 1));
          arrows.forEach((a, k) => {
            const f = (e * 5 * 0.9 + k / 4) % 1;
            a.visible = e > 0.5;
            a.position.set(0.0, 0.0, mix(-0.5, 0.52, f));
            a.material.opacity = Math.sin(f * Math.PI);
          });
        } else if (t < 5.6) dent = 1 - seg(t, 5.0, 5.6); // spring the sill back before the next scene
        // 2 ------------------------------------------------------------
        if (i === 1) {
          const up = seg(e, 0.05, 0.5);
          stone.position.set(0.25, mix(-1.0, -0.19, up) - 0.1 * seg(e, 0.55, 1), 0.1);
          stone.rotation.set(e * 6, e * 4, 0);
          bump = seg(e, 0.45, 0.62) * (1 - 0.45 * seg(e, 0.75, 1));
          pack.glow('Shield', C.warn, 0.55 * pulse * seg(e, 0.45, 0.6));
        } else if (t > 9.6 && t < 10.4) bump = 0;
        pack.dent(dent);
        pack.bumpShield(bump);

        // 3 ------------------------------------------------------------
        if (i === 2) {
          pack.setCellColor(BURN, new THREE.Color(0xff2a1a));
          pack.parts.Barrier.userData.mats[0].opacity = 0.35;
          pack.glow('Barrier', C.barrier, 0.35 + 0.2 * pulse);
          flames.forEach((f, k) => {
            f.visible = true;
            const fl = 0.8 + 0.4 * Math.sin(t * 14 + k * 2);
            f.scale.set(fl, fl * 1.3, fl);
            f.position.set(burn.x, 0.07 + 0.05 * fl, burn.z + (k - 1) * 0.1);
          });
          fireLight.intensity = 1.5 + 0.8 * pulse;
          pack.ventOpen(seg(e, 0.35, 0.5));
          gas.visible = e > 0.3;
          const pos = gas.geometry.attributes.position;
          for (let k = 0; k < NP; k++) {
            const f = (e * 5 * 0.35 + k / NP) % 1;
            path.getPoint(f, p0);
            pos.setXYZ(k, p0.x, p0.y + 0.015 * Math.sin(k * 3 + t * 6), p0.z);
          }
          pos.needsUpdate = true;
        } else pack.ventOpen(0);

        ok1.alpha = ok1b.alpha = i === 0 ? seg(e, 0.7, 0.85) : 0;
        path1.alpha = i === 0 ? seg(e, 0.55, 0.7) : 0;
        ok2.alpha = i === 1 ? seg(e, 0.7, 0.85) : 0;
        hold.alpha = i === 2 ? seg(e, 0.4, 0.55) : 0;
        out.alpha = i === 2 ? seg(e, 0.55, 0.7) : 0;

        const cams = [[1.3, 1.8, -1.9], [1.3, -1.5, -1.9], [1.5, 1.8, -1.6]];
        camKeys(camera, t, cams.map((c, k) => ({ t: k * 5 + 0.3, p: c, l: [-0.05, 0, 0] })).concat([{ t: 15, p: cams[2], l: [-0.05, 0, 0] }]));
        stage.setPhase(i);
      },
    };
  },
};
const p0 = new THREE.Vector3();
