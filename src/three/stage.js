import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const smooth = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
/** eased 0→1 progress of t between a and b */
export const seg = (t, a, b) => smooth((t - a) / (b - a));
/** linear 0→1 progress of t between a and b */
export const lin = (t, a, b) => clamp01((t - a) / (b - a));
export const mix = (a, b, k) => a + (b - a) * k;

const _p = new THREE.Vector3();
const _l = new THREE.Vector3();

/**
 * Keyframed camera: keys = [{ t, p:[x,y,z], l:[x,y,z] }, …] sorted by t.
 * Skipped once the presenter has grabbed the camera with the mouse.
 */
export function camKeys(camera, t, keys) {
  if (camera.userData.manual) return;
  let i = 0;
  while (i < keys.length - 2 && t > keys[i + 1].t) i++;
  const a = keys[i], b = keys[Math.min(i + 1, keys.length - 1)];
  const k = a === b ? 0 : seg(t, a.t, b.t);
  _p.fromArray(a.p).lerp(_l.fromArray(b.p), k);
  camera.position.copy(_p);
  _p.fromArray(a.l).lerp(_l.fromArray(b.l), k);
  camera.lookAt(_p);
  camera.userData.target = _p.clone();
}

function radialTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(120,170,255,0.35)');
  gr.addColorStop(1, 'rgba(120,170,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export class Stage {
  constructor() {
    this.ok = true;
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
      this.ok = false;
      return;
    }
    const r = this.renderer;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.localClippingEnabled = true;
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFShadowMap;
    r.setClearColor(0x000000, 0);
    this.low = false;
    this.pmrem = new THREE.PMREMGenerator(r);
    this.env = this.pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.glow = radialTexture();
    this.timer = new THREE.Timer();
    this.timer.connect(document);
    this.labelsEl = document.createElement('div');
    this.labelsEl.className = 'labels3d';
    this.labels = [];
    this.inst = null;
    this.def = null;
    this.slot = null;
    this.t = 0;
    this.target = null; // scene time the current step is heading to (null: free-run to the end)
    this.rate = 1;
    this.playing = true;
    this.frozen = null;
    this.onPhase = null;
    this.onPick = null;
    this.phase = -1;
    this.ray = new THREE.Raycaster();
    r.domElement.addEventListener('pointerdown', (e) => { this.down = [e.clientX, e.clientY]; });
    r.domElement.addEventListener('pointerup', (e) => {
      if (this.down && Math.hypot(e.clientX - this.down[0], e.clientY - this.down[1]) < 5) this.pick(e);
    });
  }

  /** a scene with the shared environment, lights and (optional) soft floor */
  makeScene({ ground = null, key = 3, exposure = 1 } = {}) {
    const scene = new THREE.Scene();
    scene.environment = this.env;
    scene.environmentIntensity = 0.75 * exposure;
    const sun = new THREE.DirectionalLight(0xffffff, key);
    sun.position.set(2.2, 4, 2.4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: 0.5, far: 14 });
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.01;
    scene.add(sun);
    scene.add(new THREE.HemisphereLight(0x9fb6ff, 0x101820, 0.55 * exposure));
    if (ground !== null) {
      const disc = new THREE.Mesh(
        new THREE.PlaneGeometry(9, 9),
        new THREE.MeshBasicMaterial({ map: this.glow, transparent: true, depthWrite: false }),
      );
      disc.rotation.x = -Math.PI / 2;
      disc.position.y = ground - 0.002;
      scene.add(disc);
      const catcher = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.4 }));
      catcher.rotation.x = -Math.PI / 2;
      catcher.position.y = ground;
      catcher.receiveShadow = true;
      scene.add(catcher);
    }
    return scene;
  }

  camera(fov = 32) {
    const c = new THREE.PerspectiveCamera(fov, 16 / 9, 0.05, 80);
    c.position.set(2.4, 1.6, 2.8);
    return c;
  }

  /** a text label glued to a 3D point; tweak .alpha / setText() from the scene */
  addLabel(text, target, { cls = '', dx = 0, dy = 0 } = {}) {
    const el = document.createElement('div');
    el.className = 'label3d ' + cls;
    el.textContent = text;
    this.labelsEl.appendChild(el);
    const lab = {
      el, target, dx, dy, alpha: 1,
      setText: (s) => { if (el.textContent !== s) el.textContent = s; },
    };
    this.labels.push(lab);
    return lab;
  }

  mount(slot, def, opts = {}) {
    this.unmount();
    if (!this.ok) return false;
    this.slot = slot;
    this.def = def;
    slot.appendChild(this.renderer.domElement);
    slot.appendChild(this.labelsEl);
    this.t = 0;
    this.target = null;
    this.playing = true;
    this.phase = -1;
    this.inst = def.create(this, opts);
    this.controls = new OrbitControls(this.inst.camera, this.renderer.domElement);
    Object.assign(this.controls, { enableZoom: false, enablePan: false, enableDamping: true, dampingFactor: 0.12 });
    this.controls.addEventListener('start', () => {
      this.inst.camera.userData.manual = true;
      this.controls.target.copy(this.inst.camera.userData.target || new THREE.Vector3());
      this.controls.update();
    });
    this.resize();
    this.inst.update(0, 0);
    this.renderer.setAnimationLoop(() => this.tick());
    return true;
  }

  unmount() {
    if (!this.ok || !this.inst) return;
    this.renderer.setAnimationLoop(null);
    this.controls?.dispose();
    this.inst.dispose?.();
    this.inst.scene.traverse((o) => {
      o.geometry?.dispose();
      for (const m of [o.material ?? []].flat()) {
        for (const v of Object.values(m)) if (v?.isTexture && v !== this.glow && v !== this.env) v.dispose();
        m.dispose();
      }
    });
    this.labels = [];
    this.labelsEl.replaceChildren();
    this.renderer.domElement.remove();
    this.labelsEl.remove();
    this.inst = this.def = this.slot = null;
  }

  resize() {
    if (!this.ok || !this.slot) return;
    const w = this.slot.offsetWidth, h = this.slot.offsetHeight;
    // slide is CSS-scaled: render at the on-screen size so edges stay sharp
    const shown = this.slot.getBoundingClientRect().width || w;
    const dpr = Math.min(window.devicePixelRatio || 1, this.low ? 1 : 2);
    this.renderer.setPixelRatio(dpr * (shown / w));
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    this.size = [w, h];
    if (this.inst) {
      this.inst.camera.aspect = w / h;
      this.inst.camera.updateProjectionMatrix();
    }
  }

  setLow(v) {
    this.low = v;
    this.renderer.shadowMap.enabled = !v;
    this.resize();
  }

  get duration() { return this.def?.duration ?? 0; }
  get time() { return this.frozen ?? this.t; }

  seek(t) { this.t = t; this.target = null; this.playing = false; }
  /** play (or rewind, 3x faster) the scene to time t; snap jumps there at once. Orbiting is reset to the scene camera. */
  goTo(t, { snap = false } = {}) {
    this.rate = t < this.t ? 3 : 1;
    this.target = t;
    if (snap) this.t = t;
    this.playing = true;
    if (this.inst) { this.inst.camera.userData.manual = false; this.inst.reset?.(); }
  }
  freeze(t) { this.frozen = t; }
  /** play again from time `from` to the current target */
  replay(from = 0) {
    this.t = from;
    this.rate = 1;
    this.playing = true;
    if (this.inst) { this.inst.camera.userData.manual = false; this.inst.reset?.(); }
  }

  setPhase(n) {
    if (n !== this.phase) {
      this.phase = n;
      this.onPhase?.(n);
    }
  }

  pick(e) {
    if (!this.inst?.pickables) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    this.ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.inst.camera);
    const hit = this.ray.intersectObjects(this.inst.pickables, true)[0];
    if (!hit) return;
    for (let o = hit.object; o; o = o.parent) {
      if (o.userData.part) { this.inst.onPick?.(o.userData.part); this.onPick?.(o.userData.part); return; }
    }
  }

  tick() {
    this.timer.update();
    const dt = Math.min(this.timer.getDelta(), 0.1);
    const d = this.def.duration;
    if (this.playing && this.frozen === null) {
      if (this.def.loop) this.t = (this.t + dt) % d;
      else if (this.target !== null) this.t += Math.sign(this.target - this.t) * Math.min(Math.abs(this.target - this.t), dt * this.rate);
      else this.t = Math.min(d, this.t + dt);
    }
    const t = this.frozen ?? this.t;
    this.controls.update();
    this.inst.update(t, dt);
    this.updateLabels();
    this.render();
  }

  render() {
    const r = this.renderer, i = this.inst;
    r.render(i.scene, i.camera);
    if (i.inset) {
      const [W, H] = this.size, n = i.inset;
      r.autoClear = false;
      r.setScissorTest(true);
      // inset = square-ish box: x, y (from top) and w are fractions of the stage, ar = w / h in pixels
      const x = n.x * W, w = n.w * W, h = w / n.ar, y = H - n.y * H - h;
      n.camera.aspect = n.ar;
      n.camera.updateProjectionMatrix();
      r.setViewport(x, y, w, h);
      r.setScissor(x, y, w, h);
      r.clearDepth();
      r.render(n.scene, n.camera);
      r.setScissorTest(false);
      r.setViewport(0, 0, W, H);
      r.autoClear = true;
    }
  }

  updateLabels() {
    const [W, H] = this.size;
    const cam = this.inst.camera;
    cam.updateMatrixWorld(); // labels run before render(): don't project with last frame's camera
    for (const l of this.labels) {
      const tg = l.target;
      if (tg.isObject3D) { tg.updateWorldMatrix(true, false); tg.getWorldPosition(_p); } else _p.copy(tg);
      _p.project(cam);
      const vis = l.alpha > 0.02 && _p.z < 1;
      l.el.style.opacity = vis ? l.alpha : 0;
      if (vis) {
        // keep the pill inside the stage even when its anchor is near an edge
        const hw = l.el.offsetWidth / 2 + 6;
        const x = Math.min(W - hw, Math.max(hw, (_p.x * 0.5 + 0.5) * W + l.dx));
        l.el.style.transform = `translate(${x}px,${(-_p.y * 0.5 + 0.5) * H + l.dy}px) translate(-50%,-100%)`;
      }
    }
  }
}
