import * as THREE from 'three';

/**
 * Procedural surface finishes. They only drive roughness and bump, never colour, so the palette
 * (plan rule 2: colour = material) stays exact. Texture UVs are in metres, see worldUV().
 */
const TILE = 0.3; // metres covered by one texture tile

function rng(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvasTex(S, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  draw(g, S);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / TILE, 1 / TILE);
  t.anisotropy = 8;
  return t;
}

const grey = (v, a = 1) => `rgba(${v},${v},${v},${a})`;
const cache = {};
const once = (k, f) => (cache[k] ||= f());

/** machined / brushed streaks along U (the car length) */
export const brushed = () =>
  once('brushed', () =>
    canvasTex(512, (g, S) => {
      const r = rng(7);
      g.fillStyle = grey(225); g.fillRect(0, 0, S, S);
      for (let i = 0; i < 2600; i++) {
        const y = r() * S, x = r() * S, len = 60 + r() * 380, v = 150 + r() * 105;
        g.fillStyle = grey(v, 0.1 + r() * 0.3);
        g.fillRect(x, y, len, r() < 0.8 ? 1 : 2);
        g.fillRect(x - S, y, len, 1); // wrap
      }
    }));

/** soft orange-peel of paint / e-coat */
export const peel = () =>
  once('peel', () =>
    canvasTex(512, (g, S) => {
      const r = rng(11);
      g.fillStyle = grey(200); g.fillRect(0, 0, S, S);
      for (let i = 0; i < 700; i++) {
        const x = r() * S, y = r() * S, R = 3 + r() * 9, v = r() < 0.5 ? 120 : 255;
        for (const dx of [-S, 0, S]) for (const dy of [-S, 0, S]) {
          const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, R);
          gr.addColorStop(0, grey(v, 0.22)); gr.addColorStop(1, grey(v, 0));
          g.fillStyle = gr; g.fillRect(x + dx - R, y + dy - R, 2 * R, 2 * R);
        }
      }
    }));

/** fine speckle of moulded composite / rubber */
export const grain = () =>
  once('grain', () =>
    canvasTex(512, (g, S) => {
      const r = rng(3);
      const img = g.createImageData(S, S);
      for (let i = 0; i < S * S; i++) {
        const v = 150 + r() * 105;
        img.data.set([v, v, v, 255], i * 4);
      }
      g.putImageData(img, 0, 0);
    }));

/** rewrite UVs to metres, projected along each vertex's dominant normal, so a texture tiles evenly on any part */
export function worldUV(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    const [u, v] = ax > ay && ax > az ? [p.getZ(i), p.getY(i)] : ay > az ? [p.getX(i), p.getZ(i)] : [p.getX(i), p.getY(i)];
    uv[i * 2] = u; uv[i * 2 + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

const phys = (color, o) => new THREE.MeshPhysicalMaterial({ color, transparent: true, ...o }); // transparent from the start: flipping it later recompiles the shader

/** finishes: each returns a fresh MeshPhysicalMaterial */
export const finish = {
  /** extruded or cast aluminium, brushed */
  alu: (c, o = {}) => phys(c, { metalness: 0.9, roughness: 0.42, anisotropy: 0.55, roughnessMap: brushed(), bumpMap: brushed(), bumpScale: 0.35, ...o }),
  /** painted / e-coated steel */
  steel: (c, o = {}) => phys(c, { metalness: 0.55, roughness: 0.4, clearcoat: 0.45, clearcoatRoughness: 0.3, bumpMap: peel(), bumpScale: 0.5, ...o }),
  /** moulded composite */
  smc: (c, o = {}) => phys(c, { metalness: 0.05, roughness: 0.5, clearcoat: 0.3, clearcoatRoughness: 0.4, roughnessMap: grain(), bumpMap: grain(), bumpScale: 0.25, ...o }),
  /** rubber / sealant */
  rubber: (c, o = {}) => phys(c, { metalness: 0, roughness: 0.85, bumpMap: grain(), bumpScale: 0.6, ...o }),
  /** shiny polymer film */
  plastic: (c, o = {}) => phys(c, { metalness: 0.05, roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.2, ...o }),
  /** plain machined metal */
  metal: (c, o = {}) => phys(c, { metalness: 1, roughness: 0.25, ...o }),
};
