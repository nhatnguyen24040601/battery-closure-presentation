import * as THREE from 'three';
import { buildPack, rectShape, extrude } from '../pack.js';
import { C } from '../palette.js';
import { camKeys, seg, lin, mix, clamp01 } from '../stage.js';

// Slide 17 - Model E: aluminium extrusion + friction stir welding (20 s)
//  0-1.5 heat the billet (~510 °C) · 1.5-5 extrude through the die · 5-8 quench, strands slide together
//  8-14 FSW: rotating tool, solid state, crescent-ripple weld behind it · 14-15 frame joints · 15-20 helium leak test
const LP = 1.8; // strand length
const X_DIE = -0.45;
const basic = (color, o = {}) => new THREE.MeshBasicMaterial({ color, transparent: true, ...o });

function ripples() {
  const c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#c9d2dc'; g.fillRect(0, 0, 64, 64);
  g.strokeStyle = '#7d8896'; g.lineWidth = 3;
  for (let r = -2; r < 4; r++) { g.beginPath(); g.arc(8 + r * 16, 32, 22, -1.2, 1.2); g.stroke(); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(26, 1);
  return t;
}

export default {
  duration: 20,
  create(stage) {
    const scene = stage.makeScene({ ground: -0.12, key: 1.4 });
    const camera = stage.camera(30);
    const std = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, metalness: 0.75, roughness: 0.35, ...o });
    const cast = (m) => { m.castShadow = m.receiveShadow = true; return m; };

    // ---- extrusion press ----------------------------------------------------------------------
    const alloy = std(0x8d98a8, { emissive: 0xff5a00, emissiveIntensity: 0 });
    const billetMat = std(0xb9c0ca, { emissive: 0xff5a00, emissiveIntensity: 0 });
    const container = new THREE.Mesh(new THREE.CylinderGeometry(0.53, 0.53, 1.3, 48, 1, true).rotateZ(Math.PI / 2), std(0x5c6675, { transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false }));
    container.position.x = -1.2;
    const billet = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 1, 40).rotateZ(Math.PI / 2), billetMat));
    const ram = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 40).rotateZ(Math.PI / 2), std(0x59637a)));
    const rod = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.2, 24).rotateZ(Math.PI / 2), std(0x7b8594)));
    const dieShape = new THREE.Shape();
    dieShape.absarc(0, 0, 0.56, 0, Math.PI * 2, false);
    for (const cx of [-0.3, 0.3]) {
      const h = new THREE.Path();
      h.moveTo(cx - 0.23, -0.03); h.lineTo(cx - 0.23, 0.03); h.lineTo(cx + 0.23, 0.03); h.lineTo(cx + 0.23, -0.03); h.closePath();
      dieShape.holes.push(h);
    }
    const dieGeo = new THREE.ExtrudeGeometry(dieShape, { depth: 0.1, bevelEnabled: false, curveSegments: 48 });
    dieGeo.rotateY(Math.PI / 2);
    const die = cast(new THREE.Mesh(dieGeo, std(0x3b4350, { metalness: 0.9, roughness: 0.3 })));
    die.position.x = X_DIE - 0.1;
    scene.add(container, billet, ram, rod, die);

    // two hollow multi-chamber strands (the tray floor profile)
    const holes = [];
    for (let k = 0; k < 5; k++) holes.push([-0.23 + 0.008 + (0.0824 + 0.008) * k + 0.0412, 0, 0.0412, 0.022]);
    const sg = extrude(rectShape(0.46, 0.06, holes), LP);
    sg.rotateY(Math.PI / 2);
    sg.translate(LP / 2, 0, 0);
    const strands = [-1, 1].map((s) => {
      const m = cast(new THREE.Mesh(sg, alloy));
      m.position.set(X_DIE, 0, s * 0.3);
      m.scale.x = 0.001;
      scene.add(m);
      return m;
    });

    // quench spray
    const NS = 90;
    const spray = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(NS * 3), 3)),
      new THREE.PointsMaterial({ color: 0x9fe3ff, size: 0.035, transparent: true, opacity: 0.85, depthWrite: false }));
    spray.frustumCulled = false;
    scene.add(spray);

    // ---- friction stir welding ---------------------------------------------------------------------
    const tool = new THREE.Group();
    const shoulder = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.05, 32), std(0x2b303a, { metalness: 0.9, roughness: 0.3 })));
    const pin = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.014, 0.075, 8), std(0x59637a, { metalness: 0.9 })));
    pin.position.y = -0.06;
    const shaft = cast(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 20), std(0x3b4350)));
    shaft.position.y = 0.25;
    const heat = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.004, 40), basic(0xff7a1a, { blending: THREE.AdditiveBlending, depthWrite: false }));
    heat.position.y = -0.026;
    tool.add(shoulder, pin, shaft, heat);
    scene.add(tool);
    const weldTex = ripples();
    const weldGeo = new THREE.BoxGeometry(1, 0.006, 0.075);
    weldGeo.translate(0.5, 0, 0);
    const weld = new THREE.Mesh(weldGeo, new THREE.MeshStandardMaterial({ map: weldTex, metalness: 0.6, roughness: 0.4 }));
    weld.position.set(0, 0.0335, 0);
    weld.scale.x = 0.0001;
    scene.add(weld);
    const toolLight = new THREE.PointLight(0xff8a30, 0, 0.7);
    scene.add(toolLight);

    // ---- helium leak test: the finished tray (Model A tray + sills) inside a closed chamber -------------
    const tray = buildPack();
    for (const [n, g] of Object.entries(tray.parts)) g.visible = ['Tray', 'Sill_L', 'Sill_R', 'Coolant'].includes(n);
    const trayG = new THREE.Group();
    trayG.scale.setScalar(0.62);
    trayG.add(tray.group);
    scene.add(trayG);
    const chamberMat = new THREE.MeshPhysicalMaterial({ color: 0x9fd7ff, transparent: true, opacity: 0.1, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false });
    const chamber = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.34, 0.95), chamberMat);
    const chamberLines = new THREE.LineSegments(new THREE.EdgesGeometry(chamber.geometry), new THREE.LineBasicMaterial({ color: 0x9fd7ff, transparent: true, opacity: 0.7 }));
    const chamberLid = new THREE.Group();
    chamberLid.add(new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.03, 0.95), chamberMat), new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.03, 0.95)), new THREE.LineBasicMaterial({ color: 0x9fd7ff })));
    const NH = 70;
    const hel = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(new Float32Array(NH * 3), 3)),
      new THREE.PointsMaterial({ color: 0x67e8f9, size: 0.03, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending }));
    hel.frustumCulled = false;
    const pass = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 28), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.4 }));
    const CX = 3.4;
    chamber.position.set(CX, 0.02, 0); chamberLines.position.copy(chamber.position);
    pass.position.set(CX + 0.7, 0.18, 0.5);
    scene.add(chamber, chamberLines, chamberLid, hel, pass);

    // conveyor rails for the strands / tray
    const belt = cast(new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.03, 1.2), std(0x1b2230, { metalness: 0.3, roughness: 0.8 })));
    belt.position.set(1.2, -0.075, 0);
    scene.add(belt);

    const labels = {
      heat: stage.addLabel('billet ≈ 510 °C', new THREE.Vector3(-1.15, 0.62, 0), { cls: 'warn big' }),
      die: stage.addLabel('shaped die: hollow profile, like toothpaste', new THREE.Vector3(-0.5, 0.65, 0), { cls: 'part' }),
      sect: stage.addLabel('hollow chambers', new THREE.Vector3(0.9, 0.12, -0.3), { cls: 'part' }),
      quench: stage.addLabel('quench + age to T6', new THREE.Vector3(0.9, 0.5, 0), { cls: 'part big' }),
      fsw: stage.addLabel('solid state · no melting', tool.position, { cls: 'good big', dy: -70 }),
      nofill: stage.addLabel('no filler · no shielding gas', new THREE.Vector3(1.0, 0.1, 0.18), { cls: 'sub' }),
      he: stage.addLabel('helium leak test', new THREE.Vector3(CX, 0.5, 0), { cls: 'part big' }),
      pass: stage.addLabel('PASS', new THREE.Vector3(CX + 0.7, 0.28, 0.5), { cls: 'good big' }),
    };

    const tmp = new THREE.Vector3();
    return {
      scene, camera,
      update(t) {
        // ---- press ---------------------------------------------------------------------------------
        const heatK = seg(t, 0.1, 1.5), push = seg(t, 1.5, 4.9);
        billetMat.emissiveIntensity = 1.2 * heatK * (1 - 0.6 * seg(t, 5, 8));
        billetMat.color.set(0xb9c0ca).lerp(new THREE.Color(0xffa04a), heatK);
        const bl = mix(1.0, 0.18, push); // billet gets used up as it is pushed through the die
        billet.scale.x = bl;
        billet.position.x = X_DIE - 0.1 - bl / 2;
        ram.position.x = billet.position.x - bl / 2 - 0.25;
        rod.position.x = ram.position.x - 0.85;
        const cool = seg(t, 5, 8);
        strands.forEach((m, k) => {
          m.scale.x = Math.max(0.001, seg(t, 1.5, 4.9));
          alloy.emissiveIntensity = 1.1 * (1 - cool);
          alloy.color.set(0xffa04a).lerp(new THREE.Color(0x8d98a8), cool);
          m.position.z = (k ? 1 : -1) * mix(0.3, 0.23, seg(t, 6.6, 8.0));
        });
        alloy.metalness = mix(0.2, 0.8, cool);

        // quench spray: drops fall onto the strands for a moment
        spray.visible = t > 5 && t < 7.6;
        if (spray.visible) {
          const pos = spray.geometry.attributes.position;
          for (let k = 0; k < NS; k++) {
            const f = (t * 1.6 + k * 0.618) % 1;
            pos.setXYZ(k, 0.35 + ((k * 7919) % 100) / 100 * 1.0, mix(0.55, 0.05, f), ((k * 104729) % 100) / 100 * 0.9 - 0.45);
          }
          pos.needsUpdate = true;
        }

        // ---- FSW tool -------------------------------------------------------------------------------
        const plunge = seg(t, 8.0, 9.0), travel = lin(t, 9.2, 13.8), lift = seg(t, 13.8, 14.4);
        const tx = mix(0.05, 1.45, travel);
        const ty = mix(0.34, 0.058, plunge) + 0.3 * lift;
        tool.position.set(tx, ty, 0);
        tool.visible = t > 7.9 && t < 14.6;
        tool.rotation.y = t * 38;
        heat.visible = plunge > 0.9 && lift < 0.2;
        toolLight.position.set(tx, 0.12, 0);
        toolLight.intensity = 0.9 * plunge * (1 - lift);
        weld.scale.x = Math.max(0.0001, tx - 0.05);
        weld.position.x = 0.05;
        weld.visible = travel > 0;

        // ---- test --------------------------------------------------------------------------------------
        const slideIn = seg(t, 14.4, 16.0), lidDown = seg(t, 16.0, 17.0);
        trayG.position.set(mix(1.8, CX, slideIn), -0.03, 0);
        trayG.visible = t > 14.3;
        chamberLid.position.set(CX, mix(0.75, 0.2, lidDown), 0);
        hel.visible = t > 17;
        if (hel.visible) {
          const pos = hel.geometry.attributes.position;
          for (let k = 0; k < NH; k++) {
            const a = k * 2.399 + t * (0.4 + (k % 5) * 0.08);
            pos.setXYZ(k, CX + Math.cos(a) * (0.35 + 0.18 * Math.sin(k)), 0.02 + 0.12 * Math.sin(t * 1.3 + k), Math.sin(a * 1.3) * (0.32 + 0.1 * Math.cos(k)));
          }
          pos.needsUpdate = true;
        }
        pass.visible = t > 18.4;
        chamberMat.opacity = 0.08 + 0.05 * lidDown;

        // ---- labels ------------------------------------------------------------------------------------
        labels.heat.alpha = seg(t, 0.2, 0.7) * (1 - seg(t, 4.0, 4.6));
        labels.die.alpha = seg(t, 2.2, 2.8) * (1 - seg(t, 5.0, 5.4));
        labels.sect.alpha = seg(t, 4.5, 5.0) * (1 - seg(t, 6.4, 6.8));
        labels.quench.alpha = seg(t, 5.2, 5.7) * (1 - seg(t, 7.6, 8));
        labels.fsw.alpha = seg(t, 9.6, 10.2) * (1 - seg(t, 13.6, 14));
        labels.nofill.alpha = seg(t, 11, 11.6) * (1 - seg(t, 13.6, 14));
        labels.he.alpha = seg(t, 16.6, 17.2);
        labels.pass.alpha = seg(t, 18.4, 18.8);
        labels.fsw.target = tool.position;

        camKeys(camera, t, [
          { t: 0, p: [-1.9, 1.4, 3.3], l: [-1.0, 0.1, 0] }, { t: 1.4, p: [-1.9, 1.4, 3.3], l: [-1.0, 0.1, 0] },
          { t: 4.5, p: [-0.1, 1.3, 3.0], l: [0.1, 0.0, 0] }, { t: 7, p: [0.6, 1.5, 3.0], l: [0.7, 0.0, 0] },
          { t: 8.6, p: [0.45, 0.5, 0.85], l: [0.25, 0.04, 0] }, { t: 14, p: [1.55, 0.5, 0.85], l: [1.35, 0.04, 0] },
          { t: 15.4, p: [3.2, 1.3, 3.0], l: [2.9, 0.08, 0] }, { t: 20, p: [3.4, 1.2, 2.9], l: [3.2, 0.08, 0] },
        ]);
        stage.setPhase(t < 1.5 ? 0 : t < 5 ? 1 : t < 8 ? 2 : t < 14 ? 3 : t < 15 ? 4 : 5);
      },
    };
  },
};
