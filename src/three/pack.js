import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { C } from './palette.js';
import { finish, worldUV } from './materials.js';

/**
 * Model A: multi-material battery pack enclosure, 1400 x 1200 x 200 mm (box size studied in [5]).
 * Units are metres. X = car length, Y = up, Z = car width (+Z = right side, so Sill_L sits at -Z).
 * 11 named parts, exactly as in the plan: Lid, Barrier, Seal, Cells, CrossMember, Sill_L, Sill_R,
 * Tray, Shield, Vent, Coolant.
 */
export const PACK = { L: 1.4, W: 1.2, H: 0.2, SILL_W: 0.085, SILL_Z: 0.5575 };
const { L, W, SILL_W, SILL_Z } = PACK;

const std = (color, o = {}) => finish.metal(color, { metalness: 0.7, roughness: 0.35, ...o });
const rbox = (w, h, d, r = 0.002) => new RoundedBoxGeometry(w, h, d, 2, r);

export function rectShape(w, h, holes = []) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2, -h / 2); s.lineTo(w / 2, -h / 2); s.lineTo(w / 2, h / 2); s.lineTo(-w / 2, h / 2); s.closePath();
  for (const [cx, cy, hw, hh] of holes) {
    const p = new THREE.Path();
    p.moveTo(cx - hw, cy - hh); p.lineTo(cx - hw, cy + hh); p.lineTo(cx + hw, cy + hh); p.lineTo(cx + hw, cy - hh); p.closePath();
    s.holes.push(p);
  }
  return s;
}

/** bevel > 0 rounds the edges (a small chamfer that catches the light) without growing the part */
export function extrude(shape, depth, steps = 1, bevel = 0) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, steps, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 2 });
  g.translate(0, 0, -depth / 2);
  return g;
}

/** adds morph target 0 = positions displaced by fn(x,y,z) -> [dx,dy,dz] (a "shape key") */
export function addMorph(geo, fn) {
  const pos = geo.attributes.position;
  const out = new Float32Array(pos.array.length);
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const d = fn(x, y, z);
    out[i * 3] = x + d[0]; out[i * 3 + 1] = y + d[1]; out[i * 3 + 2] = z + d[2];
  }
  geo.morphAttributes.position = [new THREE.BufferAttribute(out, 3)];
  return geo;
}

const bump = (d, r) => (Math.abs(d) < r ? 0.5 + 0.5 * Math.cos((Math.PI * d) / r) : 0);

function labelTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#f4c21b'; g.fillRect(0, 0, 512, 256);
  g.fillStyle = '#15171b'; g.fillRect(14, 14, 484, 228);
  g.fillStyle = '#f4c21b';
  g.beginPath(); g.moveTo(90, 46); g.lineTo(150, 160); g.lineTo(30, 160); g.closePath(); g.fill();
  g.fillStyle = '#15171b'; g.font = 'bold 84px sans-serif'; g.textAlign = 'center'; g.fillText('!', 90, 150);
  g.fillStyle = '#f4c21b'; g.textAlign = 'left';
  g.font = 'bold 58px sans-serif'; g.fillText('HIGH', 190, 100); g.fillText('VOLTAGE', 190, 160);
  g.fillStyle = '#c9ced6'; g.font = '30px sans-serif'; g.fillText('MODEL A · 1400×1200×200', 36, 215);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function dashTexture() {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 8;
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 128, 8);
  g.fillStyle = '#9fe3ff';
  g.fillRect(0, 0, 64, 8);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 1);
  return t;
}

/** cell layout: 2 compartments x 4 groups x 9 cells x 2 rows, groups separated by Barrier walls */
export function cellLayout() {
  const out = [];
  const pitch = 0.0155, groupStride = 0.153;
  for (const side of [-1, 1]) {
    for (let g = 0; g < 4; g++) {
      for (let k = 0; k < 9; k++) {
        const x = side * (0.05 + g * groupStride + k * pitch);
        for (const row of [-1, 1]) out.push({ x, z: row * 0.26, side, group: g, row });
      }
    }
  }
  return out;
}

export function buildPack() {
  const group = new THREE.Group();
  group.name = 'ModelA';
  const parts = {};
  const anchors = {};

  const mats = {
    lid: finish.smc(C.smc),
    barrier: finish.plastic(C.barrier, { roughness: 0.45, clearcoat: 0.2, opacity: 0.9 }),
    seal: finish.rubber(C.seal),
    cell: finish.plastic(0xffffff, { metalness: 0.15, roughness: 0.38 }),
    tab: finish.metal(0xc98a52, { roughness: 0.28 }),
    steel: finish.steel(C.steel),
    alu: finish.alu(C.aluminium),
    shield: finish.alu(C.shield, { metalness: 0.95, roughness: 0.34 }),
    vent: finish.metal(C.vent, { roughness: 0.22 }),
    bolt: finish.metal(0x2b2f36, { roughness: 0.38 }),
    coolant: finish.plastic(C.coolant, { roughness: 0.2, clearcoat: 1, opacity: 0.85 }),
    label: new THREE.MeshStandardMaterial({ map: labelTexture(), roughness: 0.55, metalness: 0, transparent: true, polygonOffset: true, polygonOffsetFactor: -2 }),
  };
  const m4 = new THREE.Matrix4();
  // hex head on a washer, origin on the surface it sits on
  const boltGeo = mergeGeometries([new THREE.CylinderGeometry(0.0125, 0.0125, 0.002, 20).translate(0, 0.001, 0), new THREE.CylinderGeometry(0.0085, 0.0085, 0.005, 6).translate(0, 0.0045, 0)]);
  mats.alu.side = THREE.DoubleSide; // cut-aways show the inside of the hollow chambers

  const shadow = (o) => { o.castShadow = o.receiveShadow = true; return o; };
  const mesh = (g, m) => shadow(new THREE.Mesh(g, m));
  const part = (name, children, pos = [0, 0, 0], anchor = [0, 0, 0]) => {
    const g = new THREE.Group();
    g.name = name;
    g.userData.part = name;
    g.position.fromArray(pos);
    g.add(...children);
    const a = new THREE.Object3D();
    a.position.fromArray(anchor);
    g.add(a);
    anchors[name] = a;
    g.userData.home = g.position.clone();
    parts[name] = g;
    group.add(g);
    return g;
  };

  // ---- Tray: extruded multi-chamber floor (coolant channels) + end walls --------------------------
  const nCh = 14, pitch = W / nCh;
  const holes = [];
  for (let i = 0; i < nCh; i++) holes.push([-W / 2 + pitch * (i + 0.5), 0, pitch / 2 - 0.006, 0.011]);
  const trayShape = rectShape(W, 0.03, holes);
  const floor = extrude(trayShape, L, 1, 0.0015); // extruded along local Z ...
  floor.rotateY(Math.PI / 2); // ... then turned so the chambers run along X
  floor.translate(0, -0.085, 0);
  worldUV(floor);
  const wallGeo = worldUV(rbox(0.02, 0.16, W - 2 * SILL_W));
  const wallF = mesh(wallGeo, mats.alu); wallF.position.set(L / 2 - 0.03, 0.01, 0);
  const wallR = mesh(wallGeo, mats.alu); wallR.position.set(-L / 2 + 0.03, 0.01, 0);
  part('Tray', [mesh(floor, mats.alu), wallF, wallR], [0, 0, 0], [0.5, -0.085, 0.58]);

  // ---- Sills: multi-cell hollow section, with a crush "shape key" on Sill_L ---------------------
  const sillHoles = [];
  const hw = (SILL_W - 4 * 0.005) / 6;
  for (const cx of [-2 * hw - 0.005, 0, 2 * hw + 0.005]) for (const cy of [-0.04, 0.04]) sillHoles.push([cx, cy, hw, 0.0325]);
  const sillShape = rectShape(SILL_W, 0.16, sillHoles);
  for (const [name, s] of [['Sill_L', -1], ['Sill_R', 1]]) {
    const g = extrude(sillShape, L, 70, 0.0015);
    g.rotateY(Math.PI / 2);
    g.translate(0, 0.01, s * SILL_Z);
    worldUV(g);
    if (s < 0) {
      // pole impact at x = 0: outer face goes in most, the section crushes
      addMorph(g, (x, y, z) => {
        const b = bump(x, 0.3);
        const t = ((z - s * SILL_Z) * s + SILL_W / 2) / SILL_W; // 0 inner .. 1 outer
        return [0, -(y - 0.01) * 0.2 * b, -s * 0.075 * (0.25 + 0.75 * t) * b];
      });
    }
    // mounting lugs clear of the crush zone, each with a bolt
    const lugs = [], lugBolts = shadow(new THREE.InstancedMesh(boltGeo, mats.bolt, 4));
    [-0.58, -0.38, 0.38, 0.58].forEach((x, i) => {
      const z = s * (SILL_Z + SILL_W / 2 + 0.017);
      lugs.push(worldUV(rbox(0.07, 0.006, 0.036, 0.002).translate(x, -0.03, z)));
      lugBolts.setMatrixAt(i, m4.makeTranslation(x, -0.027, z));
    });
    part(name, [mesh(g, mats.steel), mesh(mergeGeometries(lugs), mats.steel), lugBolts], [0, 0, 0], [0.3, 0.09, s * SILL_Z]);
  }

  // ---- CrossMember: steel beam between the two compartments, carries load sideways ----------------
  const cmShape = rectShape(0.06, 0.12, [[-0.015, 0, 0.0115, 0.052], [0.015, 0, 0.0115, 0.052]]);
  const cm = extrude(cmShape, W - 2 * SILL_W, 1, 0.0015);
  cm.translate(0, -0.01, 0);
  worldUV(cm);
  part('CrossMember', [mesh(cm, mats.steel)], [0, 0, 0], [0, 0.05, 0.25]);

  // ---- Cells: flat prismatic plates, 2 compartments ---------------------------------------------
  const cells = cellLayout();
  const cellMesh = shadow(new THREE.InstancedMesh(rbox(0.012, 0.1, 0.5, 0.003), mats.cell, cells.length));
  const tabMesh = shadow(new THREE.InstancedMesh(new THREE.BoxGeometry(0.01, 0.006, 0.05), mats.tab, cells.length * 2));
  const white = new THREE.Color(0xe3e7ec);
  cells.forEach((c, i) => {
    cellMesh.setMatrixAt(i, m4.makeTranslation(c.x, -0.02, c.z));
    cellMesh.setColorAt(i, white);
    tabMesh.setMatrixAt(i * 2, m4.makeTranslation(c.x, 0.033, c.z - 0.14));
    tabMesh.setMatrixAt(i * 2 + 1, m4.makeTranslation(c.x, 0.033, c.z + 0.14));
  });
  part('Cells', [cellMesh, tabMesh], [0, 0, 0], [-0.35, 0.03, 0.3]);

  // ---- Barrier: fire/heat liner under the lid + walls between cell groups ---------------------------
  const sheet = new THREE.BoxGeometry(L - 0.12, 0.003, W - 2 * SILL_W - 0.01);
  sheet.translate(0, 0.058, 0);
  const walls = [];
  for (const side of [-1, 1]) {
    for (let g = 0; g < 3; g++) {
      const w = new THREE.BoxGeometry(0.0015, 0.105, W - 2 * SILL_W - 0.02);
      w.translate(side * (0.05 + (g + 1) * 0.153 - 0.0095), -0.018, 0);
      walls.push(w);
    }
  }
  part('Barrier', [mesh(mergeGeometries([sheet, ...walls]), mats.barrier)], [0, 0, 0], [-0.5, 0.06, -0.1]);

  // ---- Lid: flat SMC plate with ribs and perimeter bolts ---------------------------------------
  const lid = rbox(L, 0.006, W);
  lid.translate(0, 0.097, 0);
  const ribs = [];
  for (const z of [-0.3, 0, 0.3]) ribs.push(rbox(L - 0.2, 0.01, 0.014, 0.003).translate(0, 0.105, z));
  for (const x of [-0.45, -0.15, 0.15, 0.45]) ribs.push(rbox(0.014, 0.01, W - 0.2, 0.003).translate(x, 0.105, 0));
  const lidMesh = mesh(worldUV(mergeGeometries([lid, ...ribs])), mats.lid);
  const spots = [];
  for (let i = 0; i < 12; i++) {
    const x = -0.62 + i * (1.24 / 11);
    spots.push([x, -0.575], [x, 0.575]);
  }
  for (let i = 1; i < 8; i++) {
    const z = -0.575 + i * (1.15 / 8);
    spots.push([-0.685, z], [0.685, z]);
  }
  const bolts = shadow(new THREE.InstancedMesh(boltGeo, mats.bolt, spots.length));
  spots.forEach(([x, z], i) => bolts.setMatrixAt(i, m4.makeTranslation(x, 0.1, z)));
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.12).rotateX(-Math.PI / 2).translate(0.43, 0.1005, -0.16), mats.label);
  label.receiveShadow = true;
  part('Lid', [lidMesh, bolts, label], [0, 0, 0], [0.45, 0.105, 0.35]);

  // ---- Seal: sealant bead around the perimeter, 6 mm squeezed to ~4 mm [88] --------------------------
  const pts = [];
  const hx = L / 2 - 0.012, hz = SILL_Z, R = 0.07, n = 14;
  for (const [cx, cz, a0] of [[hx - R, hz - R, 0], [-hx + R, hz - R, 90], [-hx + R, -hz + R, 180], [hx - R, -hz + R, 270]]) {
    for (let i = 0; i <= n; i++) {
      const a = ((a0 + (90 * i) / n) * Math.PI) / 180;
      pts.push(new THREE.Vector3(cx + R * Math.cos(a), 0, cz + R * Math.sin(a)));
    }
  }
  const seal = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'centripetal'), 360, 0.003, 8, true);
  const sealMesh = mesh(seal, mats.seal);
  part('Seal', [sealMesh], [0, 0.092, 0], [0.62, 0, -0.5]);
  parts.Seal.scale.y = 0.667; // compressed state: 6 mm -> 4 mm

  // ---- Shield: sandwich underbody plate (2 sheets + zig-zag core) ------------------------------------
  const sheetGeo = (y) => {
    const g = new THREE.BoxGeometry(L - 0.02, 0.004, W - 0.02, 46, 1, 40);
    g.translate(0, y, 0);
    return worldUV(g);
  };
  const zz = [];
  const nz = 34, pz = (L - 0.04) / nz;
  for (let i = 0; i <= nz; i++) { zz.push(new THREE.Vector2(-(L - 0.04) / 2 + i * pz, i % 2 ? 0.016 : 0)); }
  const zshape = new THREE.Shape([...zz, ...zz.map((p) => new THREE.Vector2(p.x, p.y + 0.003)).reverse()]);
  const core = extrude(zshape, W - 0.04, 40);
  core.translate(0, -0.123, 0);
  worldUV(core);
  const sandwich = [sheetGeo(-0.125), sheetGeo(-0.105), core];
  addMorph(sandwich[0], (x, y, z) => [0, 0.022 * Math.exp(-((x - 0.25) ** 2 + (z - 0.1) ** 2) / (2 * 0.28 ** 2)), 0]);
  addMorph(sandwich[1], (x, y, z) => [0, 0.022 * Math.exp(-((x - 0.25) ** 2 + (z - 0.1) ** 2) / (2 * 0.28 ** 2)), 0]);
  addMorph(core, (x, y, z) => [0, 0.022 * Math.exp(-((x - 0.25) ** 2 + (z - 0.1) ** 2) / (2 * 0.28 ** 2)), 0]);
  part('Shield', sandwich.map((g) => mesh(g, mats.shield)), [0, 0, 0], [-0.45, -0.125, 0.5]);

  // ---- Vent: pressure-relief valve on the rear end wall, with a hinged cap ----------------------------
  const body = new THREE.CylinderGeometry(0.022, 0.022, 0.034, 24).rotateZ(Math.PI / 2).translate(-L / 2 + 0.026, 0.03, 0.25);
  const ring = new THREE.CylinderGeometry(0.03, 0.03, 0.008, 6).rotateZ(Math.PI / 2).translate(-L / 2 + 0.04, 0.03, 0.25);
  const hinge = new THREE.Group();
  hinge.position.set(-L / 2 + 0.048, 0.06, 0.25);
  const cap = mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.005, 24).rotateZ(Math.PI / 2).translate(-0.002, -0.03, 0), mats.vent);
  hinge.add(cap);
  part('Vent', [mesh(body, mats.vent), mesh(ring, mats.vent), hinge], [0, 0, 0], [-L / 2 - 0.05, 0.03, 0.25]);

  // ---- Coolant: manifold + ports at the front end; dashes show the flow -------------------------------
  const flowTex = dashTexture();
  const flowMat = std(0x2a6f96, { metalness: 0.1, roughness: 0.3, emissive: 0x7dd3fc, emissiveMap: flowTex, emissiveIntensity: 1.2, opacity: 0.9 });
  const tube = new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(L / 2 + 0.02, -0.085, -0.5), new THREE.Vector3(L / 2 + 0.02, -0.085, 0.5)), 40, 0.018, 16);
  const ports = [-0.22, 0.22].map((z) => {
    const p = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.09, 20).rotateZ(Math.PI / 2).translate(L / 2 + 0.085, -0.085, z), mats.coolant);
    const f = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 20).rotateZ(Math.PI / 2).translate(L / 2 + 0.125, -0.085, z), mats.coolant);
    return [p, f];
  }).flat();
  part('Coolant', [mesh(tube, flowMat), ...ports], [0, 0, 0], [L / 2 + 0.1, -0.085, -0.3]);

  // ---- bookkeeping: unique materials per part, base state for focus()/glow() -------------------------
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  for (const g of Object.values(parts)) {
    const set = new Set();
    g.traverse((o) => o.material && set.add(o.material));
    g.userData.mats = [...set];
    for (const m of set) {
      m.userData.base = m.opacity;
      m.userData.emissive = m.emissive.clone();
      m.userData.emissiveIntensity = m.emissiveIntensity;
    }
  }

  const EXPLODE = {
    Lid: [0, 0.62, 0], Barrier: [0, 0.44, 0], Seal: [0, 0.31, 0], Cells: [0, 0.2, 0], CrossMember: [0, 0.2, 0],
    Sill_L: [0, 0.05, -0.16], Sill_R: [0, 0.05, 0.16], Tray: [0, 0, 0], Shield: [0, -0.3, 0], Vent: [-0.18, 0, 0], Coolant: [0.18, 0, 0],
  };

  const api = {
    group, parts, anchors, cells, cellMesh, size: [L, 0.2, W], flowTex, clipPlane: clip,
    /** vertical explode: e = 0 assembled .. 1 fully apart. per = {Name: e} overrides one part */
    explode(e, per = {}) {
      for (const [n, g] of Object.entries(parts)) {
        const k = per[n] ?? e;
        g.position.set(g.userData.home.x + EXPLODE[n][0] * k, g.userData.home.y + EXPLODE[n][1] * k, g.userData.home.z + EXPLODE[n][2] * k);
      }
    },
    /** names = parts to keep solid, the rest fade to `dim` opacity; null = everything solid */
    focus(names, dim = 0.12) {
      for (const [n, g] of Object.entries(parts)) {
        const on = !names || names.includes(n);
        for (const m of g.userData.mats) {
          const op = on ? m.userData.base : Math.min(m.userData.base, dim);
          m.opacity = op;
          m.depthWrite = op >= 0.98;
        }
      }
    },
    /** emissive glow of one part (name) or all parts ('all') */
    glow(name, color, k) {
      for (const [n, g] of Object.entries(parts)) {
        if (name !== 'all' && n !== name) continue;
        for (const m of g.userData.mats) {
          if (m.emissiveMap) continue;
          m.emissive.set(k > 0 ? color : 0x000000);
          m.emissiveIntensity = k;
        }
      }
    },
    /** cut everything above height y (metres); null = no cut */
    clip(y) {
      clip.constant = y ?? 0;
      for (const g of Object.values(parts)) for (const m of g.userData.mats) { m.clippingPlanes = y === null ? null : [clip]; }
    },
    setCellColor(i, color) { cellMesh.setColorAt(i, color); cellMesh.instanceColor.needsUpdate = true; },
    resetCells() { cells.forEach((_, i) => cellMesh.setColorAt(i, white)); cellMesh.instanceColor.needsUpdate = true; },
    /** 0..1: crush the left sill (morph target) */
    dent(k) { parts.Sill_L.children[0].morphTargetInfluences[0] = k; },
    /** 0..1: push the underbody shield up around the stone impact */
    bumpShield(k) { for (const m of parts.Shield.children) if (m.morphTargetInfluences) m.morphTargetInfluences[0] = k; },
    /** 0..1: pop the vent cap open */
    ventOpen(k) { parts.Vent.children[2].rotation.z = -1.15 * k; },
    /** 0..1: flatten the seal as the lid comes down (1 = compressed, 4 mm) */
    sealPress(k) { parts.Seal.scale.y = 1 - 0.333 * k; },
    flow(t) { flowTex.offset.x = -t * 0.8; },
    /** set colour/tint of a whole part without touching emissive (used for thermal colouring) */
    tint(name, color) { for (const m of parts[name].userData.mats) m.color.set(color); },
  };
  api.explode(0);
  api.sealPress(1);
  return api;
}
