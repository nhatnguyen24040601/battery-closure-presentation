import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { finish, worldUV } from './materials.js';

/** Shared road-vehicle parts: a lofted generic EV body (ghosted), real wheels, suspension, interior. Units: metres, X = car length (+X = front). */

const rbox = (w, h, d, r = 0.01) => worldUV(new RoundedBoxGeometry(w, h, d, 3, r));
const put = (geo, mat, x = 0, y = 0, z = 0, cast = true) => {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = cast;
  m.receiveShadow = true;
  return m;
};

/** loft a smooth body through cross-sections: stations = [x, yBottom, yTop, halfWidth, squareness]; squareness 2 = ellipse, higher = boxier */
export function loft(stations, M = 48) {
  const pos = [], idx = [];
  for (const [x, yb, yt, hw, n = 2.6] of stations) {
    const ym = (yb + yt) / 2, hh = (yt - yb) / 2;
    for (let j = 0; j < M; j++) {
      const a = (j / M) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      pos.push(x, ym + hh * Math.sign(s) * Math.abs(s) ** (2 / n), hw * Math.sign(c) * Math.abs(c) ** (2 / n));
    }
  }
  const N = stations.length;
  for (let i = 0; i < N - 1; i++) for (let j = 0; j < M; j++) {
    const a = i * M + j, b = (i + 1) * M + j, c = i * M + ((j + 1) % M), d = (i + 1) * M + ((j + 1) % M);
    idx.push(a, b, c, b, d, c);
  }
  // end caps: a fan around each end ring's centre
  for (const [i, flip] of [[0, false], [N - 1, true]]) {
    const [x, yb, yt] = stations[i];
    const o = pos.length / 3;
    pos.push(x, (yb + yt) / 2, 0);
    for (let j = 0; j < M; j++) {
      const a = i * M + j, b = i * M + ((j + 1) % M);
      idx.push(...(flip ? [o, b, a] : [o, a, b]));
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** see-through paint / glass that turns opaque towards the silhouette (fresnel), so a ghost still reads as a solid, glossy shell */
export function ghost(color, opacity, o = {}) {
  const m = new THREE.MeshPhysicalMaterial({ color, transparent: true, opacity, side: THREE.DoubleSide, depthWrite: false, ...o });
  m.onBeforeCompile = (s) => {
    s.fragmentShader = s.fragmentShader.replace('#include <opaque_fragment>',
      'float fr = pow(1.0 - abs(dot(normalize(vViewPosition), normal)), 2.2); diffuseColor.a = min(1.0, diffuseColor.a * (1.0 + 8.0 * fr));\n#include <opaque_fragment>');
  };
  return m;
}

// ---- wheel ---------------------------------------------------------------------------------------
const RIM_R = 0.205, TYRE_R = 0.346, TYRE_W = 0.215;
const lathe = (pts, seg = 64) => worldUV(new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg).rotateX(Math.PI / 2));

let wheelGeo;
function wheelGeometry() {
  return (wheelGeo ||= (() => {
    const h = TYRE_W / 2;
    // tyre: bead -> sidewall bulge -> shoulder -> tread with two circumferential grooves
    const half = [[RIM_R - 0.004, h * 0.8], [RIM_R + 0.02, h * 0.95], [0.255, h], [0.30, h * 0.97], [0.333, h * 0.82], [0.343, h * 0.6], [TYRE_R, h * 0.45], [TYRE_R, 0.045], [TYRE_R - 0.007, 0.035], [TYRE_R, 0.025], [TYRE_R, 0]];
    const tyre = lathe([...half.map(([r, y]) => [r, -y]), ...half.slice().reverse().map(([r, y]) => [r, y])]);
    // five tapered, bevelled spokes
    const spokes = [];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2, P = (r, da) => new THREE.Vector2(Math.cos(a + da) * r, Math.sin(a + da) * r);
      const sh = new THREE.Shape([P(0.045, -0.3), P(RIM_R - 0.012, -0.15), P(RIM_R - 0.012, 0.15), P(0.045, 0.3)]);
      spokes.push(new THREE.ExtrudeGeometry(sh, { depth: 0.014, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.005, bevelSegments: 2 }).translate(0, 0, 0.03));
    }
    const face = mergeGeometries(spokes);
    // barrel: the rim well, seen through the spokes
    const barrel = lathe([[0.215, -0.108], [0.208, -0.1], [0.196, -0.07], [0.192, -0.02], [0.192, 0.045], [0.2, 0.09], [0.214, 0.104], [0.218, 0.108]], 48);
    // hub: cap, centre ring and five lug nuts
    const hub = [new THREE.CylinderGeometry(0.048, 0.055, 0.03, 32).rotateX(Math.PI / 2).translate(0, 0, 0.05)];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2 + 0.3;
      hub.push(new THREE.CylinderGeometry(0.0085, 0.0085, 0.014, 6).rotateX(Math.PI / 2).translate(Math.cos(a) * 0.036, Math.sin(a) * 0.036, 0.062));
    }
    // brake disc with drilled hat, and the caliper behind the spokes
    const disc = mergeGeometries([new THREE.CylinderGeometry(0.155, 0.155, 0.014, 56).rotateX(Math.PI / 2).translate(0, 0, -0.035), new THREE.CylinderGeometry(0.07, 0.07, 0.04, 32).rotateX(Math.PI / 2).translate(0, 0, -0.025)]);
    const caliper = rbox(0.095, 0.15, 0.06, 0.015).translate(0.105, -0.045, -0.035).rotateZ(0.4);
    return { tyre, face: mergeGeometries([face, ...hub].map((g) => (g.index ? g.toNonIndexed() : g))), barrel, disc, caliper };
  })());
}

let wheelMats;
/** one wheel + tyre + brake, axis along Z, outer face towards +Z; rotate.y = PI for the left side */
export function buildWheel() {
  const g = wheelGeometry();
  wheelMats ||= {
    tyre: finish.rubber(0x15171b, { roughness: 0.78, bumpScale: 0.25 }),
    rim: finish.alu(0xc9d0d9, { roughness: 0.3, metalness: 1, clearcoat: 0.4 }),
    dark: finish.metal(0x23272e, { roughness: 0.5, side: THREE.DoubleSide }), // the rim well is seen from inside
    disc: finish.metal(0x8a929d, { roughness: 0.42 }),
    caliper: finish.plastic(0xc2331f, { roughness: 0.4 }),
  };
  const m = wheelMats, w = new THREE.Group();
  w.add(put(g.tyre, m.tyre), put(g.face, m.rim), put(g.barrel, m.dark), put(g.disc, m.disc), put(g.caliper, m.caliper));
  return w;
}

// ---- the whole car -----------------------------------------------------------------------------------
const BODY = [
  [-2.3, 0.42, 0.78, 0.5, 2.4], [-2.22, 0.3, 0.98, 0.76, 2.8], [-1.9, 0.26, 1.03, 0.86, 3], [-1.0, 0.24, 1.0, 0.89, 3.2],
  [0, 0.24, 0.98, 0.89, 3.2], [1.0, 0.24, 0.95, 0.89, 3.2], [1.7, 0.25, 0.86, 0.87, 3], [2.1, 0.27, 0.74, 0.8, 2.8], [2.32, 0.34, 0.6, 0.58, 2.4],
];
const CABIN = [
  [-1.78, 0.92, 1.05, 0.66, 2.4], [-1.55, 0.92, 1.28, 0.73, 2.6], [-1.0, 0.92, 1.46, 0.75, 3], [-0.3, 0.92, 1.52, 0.73, 3],
  [0.3, 0.92, 1.48, 0.71, 3], [0.72, 0.92, 1.37, 0.7, 2.8], [1.08, 0.92, 1.16, 0.74, 2.6], [1.3, 0.92, 0.96, 0.78, 2.4],
];
export const WHEEL_X = [-1.35, 1.35], WHEEL_Z = 0.8, WHEEL_Y = 0.346;

/** returns { group, fade: [[material, baseOpacity], …] }: the materials that dim when the camera dives under the car */
export function buildCar() {
  const group = new THREE.Group(), fade = [];
  const track = (m, o) => { fade.push([m, o]); return m; };

  // body paint + glass
  const paint = track(ghost(0x4d8dff, 0.14, { roughness: 0.12, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.05 }), 0.14);
  const glass = track(ghost(0x9cc4ff, 0.12, { roughness: 0.04, metalness: 0 }), 0.12);
  group.add(put(loft(BODY), paint, 0, 0, 0, false), put(loft(CABIN), glass, 0, 0, 0, false));

  // lights
  const lamp = (color, k) => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: k, roughness: 0.2 });
  const head = lamp(0xe6f0ff, 1.6), tail = lamp(0xff3030, 1.8);
  for (const s of [-1, 1]) {
    const h = put(rbox(0.22, 0.045, 0.3, 0.02), head, 2.1, 0.68, s * 0.55, false); h.rotation.set(0, s * -0.35, -0.2);
    group.add(h);
  }
  group.add(put(rbox(0.03, 0.05, 1.3, 0.015), tail, -2.255, 0.9, 0, false));

  // wheels, with arm + spring + damper + driveshaft at each corner
  const steel = track(finish.steel(0x6f86a8, { metalness: 0.7, roughness: 0.4 }), 1);
  const dark = finish.metal(0x2c3138, { roughness: 0.45 });
  const spring = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 81 }, (_, i) => { const a = (i / 80) * Math.PI * 14; return new THREE.Vector3(Math.cos(a) * 0.045, 0.3 + (i / 80) * 0.3, Math.sin(a) * 0.045); })), 160, 0.0075, 6);
  for (const x of WHEEL_X) for (const s of [-1, 1]) {
    const w = buildWheel();
    w.position.set(x, WHEEL_Y, s * WHEEL_Z);
    if (s < 0) w.rotation.y = Math.PI;
    group.add(w);
    for (const dx of [-0.16, 0.16]) { // wishbone: two links from the subframe to the hub
      const a = new THREE.Vector3(x + dx * 0.4, 0.27, s * 0.42), b = new THREE.Vector3(x, 0.3, s * (WHEEL_Z - 0.1));
      const arm = put(new THREE.CylinderGeometry(0.011, 0.011, a.distanceTo(b), 8), steel, (a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2);
      arm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize());
      group.add(arm);
    }
    group.add(put(spring, dark, x, 0, s * 0.62), put(new THREE.CylinderGeometry(0.018, 0.018, 0.34, 12), finish.metal(0xaab2bd), x, 0.46, s * 0.62));
    group.add(put(new THREE.CylinderGeometry(0.018, 0.018, WHEEL_Z - 0.3, 12).rotateX(Math.PI / 2), dark, x, WHEEL_Y, s * (0.3 + (WHEEL_Z - 0.3) / 2 - 0.05)));
  }

  // chassis: side rails, sub-frames, a motor + inverter on each axle
  for (const z of [-0.75, 0.75]) group.add(put(rbox(1.9, 0.06, 0.08, 0.02), steel, 0, 0.3, z)); // between the axles, clear of the pack
  for (const x of WHEEL_X) {
    group.add(put(rbox(0.07, 0.05, 1.1, 0.015), steel, x - 0.22, 0.29, 0), put(rbox(0.07, 0.05, 1.1, 0.015), steel, x + 0.22, 0.29, 0));
    group.add(put(new THREE.CylinderGeometry(0.115, 0.115, 0.42, 40).rotateX(Math.PI / 2), finish.alu(0x8a94a3, { metalness: 0.8 }), x, WHEEL_Y, 0));
    group.add(put(rbox(0.26, 0.09, 0.3, 0.02), finish.alu(0x56606e), x, WHEEL_Y + 0.14, 0));
  }

  // interior: dash, two rows of seats, steering wheel
  const trim = track(finish.rubber(0x1b2230, { roughness: 0.8 }), 1), tx = (g, ...p) => group.add(put(g, trim, ...p, false));
  tx(rbox(0.26, 0.14, 1.3, 0.04), 0.95, 0.84, 0);
  for (const [x, r] of [[0.15, 1], [-0.9, 0.9]]) for (const s of [-0.38, 0.38]) {
    tx(rbox(0.42, 0.1, 0.4 * r, 0.04), x, 0.46, s);
    tx(rbox(0.08, 0.4, 0.4 * r, 0.03).rotateZ(-0.18), x - 0.22, 0.7, s);
  }
  tx(new THREE.TorusGeometry(0.17, 0.016, 8, 28).rotateY(Math.PI / 2).rotateZ(0.5), 0.62, 1.0, -0.38);
  return { group, fade };
}
