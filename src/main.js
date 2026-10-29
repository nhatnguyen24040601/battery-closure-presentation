import './style.css';
import { slides } from './slides.js';
import { Stage } from './three/stage.js';
import scenes from './three/scenes/index.js';
import { C, hex } from './three/palette.js';

// ---- palette -> CSS variables (same colours in 2D and 3D) -------------------------------------
const PAL = { al: C.aluminium, steel: C.steel, smc: C.smc, barrier: C.barrier, danger: C.danger, cells: C.cells, seal: C.seal, shield: C.shield, coolant: C.coolant, mg: C.magnesium, cfrp: C.cfrp, warn: C.warn };
for (const [k, v] of Object.entries(PAL)) document.documentElement.style.setProperty('--' + k, hex(v));

const params = new URLSearchParams(location.search);
const PRESENTER = params.has('presenter');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const fmt = (s) => `${s < 0 ? '-' : ''}${String(Math.floor(Math.abs(s) / 60)).padStart(2, '0')}:${String(Math.floor(Math.abs(s) % 60)).padStart(2, '0')}`;
const words = (h) => h.split(/\s+/).filter(Boolean).length;

// planned schedule: cumulative start (s) of every slide, from the plan's timetable
const starts = [];
let acc = 0;
for (const s of slides) { starts.push(acc); acc += s.sec; }
const TOTAL = acc;
const PLAN_SLIDES = slides.filter((s) => s.sec > 0).length;
// steps per slide: one per 3D stop, or per data-s reveal level in the html (whichever is larger)
for (const s of slides) s.n = Math.max(s.stops?.length || 0, 1 + Math.max(-1, ...[...s.html.matchAll(/data-s="(\d+)"/g)].map((m) => +m[1])), 1);

// ---- DOM ----------------------------------------------------------------------------------------
const app = $('#app');
app.innerHTML = `
  <aside id="rail"><div class="rail-h">EV battery pack enclosure<small>20-min talk · ${PLAN_SLIDES} slides</small></div><nav id="list"></nav></aside>
  <main id="main">
    <header id="toolbar">
      <button data-act="prev" title="Previous (←)">‹</button>
      <span id="count"></span><span id="stepdots"></span>
      <button data-act="next" title="Next (→)">›</button>
      <span class="sep"></span>
      <button data-act="replay" title="Replay this step (R)">↻ Replay step</button>
      <button data-act="play" id="playbtn" title="Pause / play 3D">❚❚</button>
      <input id="scrub" type="range" min="0" max="1000" value="0" title="3D timeline" />
      <span id="ttime"></span>
      <span class="sep"></span>
      <button data-act="low" title="Light 3D for slow computers (Q)">Light 3D</button>
      <button data-act="overview" title="Overview (O)">Grid</button>
      <button data-act="presenter" title="Presenter window (P)">Presenter view</button>
      <button data-act="present" class="primary" title="Present (F)">▶ Present</button>
    </header>
    <div id="viewport"><div id="deck"></div></div>
    <section id="notes"></section>
  </main>
  <div id="pv"></div>
  <div id="overview"></div>
  <div id="hud"><div id="bar"><i id="barplan"></i><i id="barnow"></i></div><div id="hudtxt"></div></div>
  <div id="tele"></div>
  <div id="help">
    <b>Shortcuts</b> → / space: next step (then next slide) · ←: back one step · F: present · Esc: exit · N: script · T: timer (start / pause) · Shift+T: reset ·
    R: replay this step · O: grid · P: presenter window · Q: light 3D · B: black · drag on a 3D scene: orbit · click a part: inspect
  </div>`;

const deck = $('#deck');
const stage = new Stage();
const bc = 'BroadcastChannel' in window ? new BroadcastChannel('ev-deck') : null;

const state = { i: 0, step: 0, present: false, tele: false, black: false, timer: { running: false, base: 0, at: 0 } };
const els = slides.map((s, i) => {
  const sec = document.createElement('section');
  sec.className = `slide ${s.layout || ''}`;
  sec.dataset.i = i;
  sec.dataset.step = 0;
  const bare = s.layout === 'title' || s.layout === 'section';
  const hd = bare ? '' : `<div class="hd"><div class="kicker">${s.part}</div><h2>${s.title}</h2></div>`;
  const ft = bare ? '' : `<div class="ft"><span class="src">${s.sources || ''}</span><span class="n">${s.sec ? i + 1 : 'Backup'}</span></div>`;
  sec.innerHTML = `${hd}<div class="bd">${s.html}</div>${ft}`;
  deck.appendChild(sec);
  return sec;
});

// slide list (rail)
let lastPart = '';
$('#list').innerHTML = slides.map((s, i) => {
  const head = s.part !== lastPart ? `<div class="part">${s.part}</div>` : '';
  lastPart = s.part;
  return `${head}<a data-go="${i}"><b>${s.sec ? i + 1 : '·'}</b><span>${s.short || s.title}</span>${s.scene ? '<em title="3D scene">3D</em>' : ''}</a>`;
}).join('');

// ---- scaling ----------------------------------------------------------------------------------
function fit(box, el) {
  const w = box.clientWidth, h = box.clientHeight;
  const s = Math.min(w / 1920, h / 1080);
  el.style.transform = `translate(${(w - 1920 * s) / 2}px, ${(h - 1080 * s) / 2}px) scale(${s})`;
}
function layout() {
  fit($('#viewport'), deck);
  if (PRESENTER) renderPresenter(false);
  stage.ok && stage.resize();
}
new ResizeObserver(layout).observe($('#viewport'));
window.addEventListener('resize', layout);

// ---- 3D -----------------------------------------------------------------------------------------
const frozen = params.get('t') ?? new URLSearchParams(location.hash.split('&').slice(1).join('&')).get('t');

function mount3D(i, snap) {
  const s = slides[i];
  const slot = $('.stage3d', els[i]);
  if (!slot) return;
  const def = scenes[s.scene];
  if (!stage.ok) { slot.insertAdjacentHTML('beforeend', '<div class="nogl">3D is not available on this computer.<br>Slide content is complete without it.</div>'); return; }
  if (!def) { slot.insertAdjacentHTML('beforeend', `<div class="nogl">3D scene “${s.scene}” is not built yet.</div>`); return; }
  stage.mount(slot, def, s.sceneOpts);
  stage.onPick = (name) => { els[i].dataset.pick = name; };
  if (frozen !== null && frozen !== undefined) stage.freeze(parseFloat(frozen));
  play3D(snap);
}

/** drive the 3D scene to the rest time of the current step (loops free-run) */
function play3D(snap = false) {
  const s = slides[state.i];
  if (!stage.ok || !stage.inst || !s.stops || stage.def.loop) return;
  stage.goTo(s.stops[Math.min(state.step, s.stops.length - 1)], { snap });
}

/** show the text state of a step: [data-s] appears from that step on, [data-h] is highlighted on its step */
function applySteps() {
  const el = els[state.i], n = state.step;
  el.dataset.step = n;
  $$('[data-s]', el).forEach((x) => x.classList.toggle('on', +x.dataset.s <= n));
  $$('[data-h]', el).forEach((x) => x.classList.toggle('cur', x.dataset.h.split(',').includes(String(n))));
}

// ---- navigation -------------------------------------------------------------------------------
function go(i, { silent = false, step = 0, snap = false } = {}) {
  i = Math.max(0, Math.min(slides.length - 1, i));
  const prev = state.i;
  state.i = i;
  state.step = step === 'last' ? slides[i].n - 1 : Math.min(step, slides[i].n - 1);
  els.forEach((e, k) => e.classList.toggle('active', k === i));
  els[i].dataset.pick = '';
  if (stage.ok) stage.unmount();
  if (!PRESENTER) mount3D(i, snap || step === 'last');
  applySteps();
  $$('#list a').forEach((a) => a.classList.toggle('on', +a.dataset.go === i));
  $('#list a.on')?.scrollIntoView({ block: 'nearest' });
  renderNotes();
  syncNav(silent);
  // the clock starts by itself when the talk moves off the title slide in present mode
  if (state.present && prev === 0 && i === 1 && !state.timer.running && state.timer.base === 0) toggleTimer();
  if (PRESENTER) renderPresenter(true);
}

function setStep(n, { silent = false } = {}) {
  state.step = n;
  applySteps();
  if (!PRESENTER) play3D();
  syncNav(silent);
}

function syncNav(silent) {
  const s = slides[state.i];
  $('#count').textContent = `${s.sec ? state.i + 1 : 'Backup'} / ${PLAN_SLIDES}`;
  $('#stepdots').innerHTML = s.n > 1 ? Array.from({ length: s.n }, (_, k) => `<i class="${k === state.step ? 'on' : k < state.step ? 'done' : ''}"></i>`).join('') : '';
  if (!silent) { history.replaceState(null, '', `#${state.i + 1}`); bc?.postMessage({ type: 'nav', i: state.i, step: state.step }); }
  updateHud();
  updateToolbar();
}

/** next / previous step; past the last step the deck moves to the next slide (and back to the last step of the previous one) */
function next() { if (state.step < slides[state.i].n - 1) setStep(state.step + 1); else if (state.i < slides.length - 1) go(state.i + 1); }
function prev() { if (state.step > 0) setStep(state.step - 1); else if (state.i > 0) go(state.i - 1, { step: 'last' }); }

function renderNotes() {
  const s = slides[state.i];
  const n = words(s.script || '');
  const info = (s.scene && scenes[s.scene] ? `<span class="chip">3D${scenes[s.scene].loop ? ' loop' : ''}</span>` : '') + (s.n > 1 ? `<span class="chip">${s.n} steps · → plays the next one</span>` : '');
  const html = `<div class="nh"><b>Script</b><span>${n} words · ≈${Math.round((n / 130) * 60)} s at 130 wpm · slide budget ${s.sec ? fmt(s.sec) : '–'}</span>${info}</div>
    <p>${s.script || '<i>No script for this slide.</i>'}</p>${s.tip ? `<p class="tip">${s.tip}</p>` : ''}`;
  $('#notes').innerHTML = html;
  $('#tele').innerHTML = `<div>${s.script || ''}</div>`;
}

// ---- timer ----------------------------------------------------------------------------------------
const elapsed = () => state.timer.base + (state.timer.running ? (Date.now() - state.timer.at) / 1000 : 0);
function toggleTimer(reset = false) {
  const t = state.timer;
  if (reset) { t.running = false; t.base = 0; }
  else if (t.running) { t.base = elapsed(); t.running = false; }
  else { t.at = Date.now(); t.running = true; }
  bc?.postMessage({ type: 'timer', t: { ...t } });
  updateHud();
}
function updateHud() {
  const e = elapsed();
  const plan = starts[state.i] ?? 0;
  const delta = e - plan; // > 0 means behind schedule (at the start of this slide)
  const slideEnd = starts[state.i] + slides[state.i].sec;
  $('#barnow').style.width = Math.min(100, (e / TOTAL) * 100) + '%';
  $('#barplan').style.width = Math.min(100, (slideEnd / TOTAL) * 100) + '%';
  const late = delta > 20, early = delta < -20;
  const status = !state.timer.running && e === 0 ? 'timer stopped' : late ? `${fmt(delta)} behind` : early ? `${fmt(-delta)} ahead` : 'on pace';
  $('#hudtxt').innerHTML = `<b>${slides[state.i].sec ? state.i + 1 : 'B'}</b>/${PLAN_SLIDES}${slides[state.i].n > 1 ? ` · step ${state.step + 1}/${slides[state.i].n}` : ''} · ${fmt(e)} / ${fmt(TOTAL)} · <span class="${late ? 'late' : early ? 'early' : ''}">${status}</span>`;
  const p = $('#pv-time');
  if (p) {
    p.innerHTML = `<div class="big">${fmt(e)}</div><div class="${late ? 'late' : early ? 'early' : ''}">${status} · plan ${fmt(plan)}→${fmt(slideEnd)}</div>`;
  }
}
setInterval(updateHud, 500);

// ---- present mode ---------------------------------------------------------------------------------
async function setPresent(on) {
  state.present = on;
  document.body.classList.toggle('present', on);
  if (on) { try { await document.documentElement.requestFullscreen?.(); } catch { /* embedded or blocked: still present in the window */ } }
  else if (document.fullscreenElement) document.exitFullscreen?.();
  requestAnimationFrame(layout);
  setTimeout(layout, 250);
}
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && state.present) setPresent(false);
});
if (params.has('present')) setPresent(true).then(() => document.body.classList.add('bare'));

let hudTimer;
document.addEventListener('mousemove', () => {
  if (!state.present) return;
  document.body.classList.add('hud-on');
  clearTimeout(hudTimer);
  hudTimer = setTimeout(() => document.body.classList.remove('hud-on'), 2200);
});

// click to advance in present mode (but not while working a 3D scene)
$('#viewport').addEventListener('click', (e) => {
  if (!state.present || e.target.closest('.stage3d, a, button, [data-part], .nogl')) return;
  const r = $('#viewport').getBoundingClientRect();
  if (e.clientX - r.left < r.width / 3) prev(); else next();
});

// ---- toolbar & list --------------------------------------------------------------------------------
function updateToolbar() {
  const has = stage.ok && stage.inst;
  $('#playbtn').textContent = has && !stage.playing ? '▶' : '❚❚';
  $('#toolbar').classList.toggle('no3d', !has);
}
function openPresenter() {
  window.open(location.pathname + '?presenter#' + (state.i + 1), 'ev-presenter', 'width=1400,height=820');
}
const ACT = {
  prev,
  next,
  replay: () => { if (!stage.ok || !stage.inst) return; const st = slides[state.i].stops; stage.replay(st && !stage.def.loop ? (st[state.step - 1] ?? 0) : 0); updateToolbar(); },
  play: () => { if (stage.inst) { stage.playing = !stage.playing; updateToolbar(); } },
  low: () => { const v = !stage.low; stage.setLow(v); document.body.classList.toggle('low', v); },
  overview: () => toggleOverview(),
  presenter: openPresenter,
  present: () => setPresent(!state.present),
};
$('#toolbar').addEventListener('click', (e) => { const b = e.target.closest('[data-act]'); if (b) ACT[b.dataset.act](); });
$('#list').addEventListener('click', (e) => { const a = e.target.closest('[data-go]'); if (a) go(+a.dataset.go); });
const scrub = $('#scrub');
scrub.addEventListener('input', () => { if (stage.inst) { stage.seek((scrub.value / 1000) * stage.duration); updateToolbar(); } });
setInterval(() => {
  if (!stage.ok || !stage.inst) { $('#ttime').textContent = ''; return; }
  if (document.activeElement !== scrub) scrub.value = (stage.time / stage.duration) * 1000;
  $('#ttime').textContent = `${stage.time.toFixed(1)} / ${stage.duration}s`;
}, 100);

// 2D table rows <-> 3D parts (slide 13): clicking a row picks the part
deck.addEventListener('click', (e) => {
  const row = e.target.closest('[data-part]');
  if (row && stage.inst?.onPick) { stage.inst.onPick(row.dataset.part); els[state.i].dataset.pick = row.dataset.part; }
});

// ---- overview grid ----------------------------------------------------------------------------------
function toggleOverview(force) {
  const ov = $('#overview');
  const on = force ?? !ov.classList.contains('on');
  ov.classList.toggle('on', on);
  if (!on) return;
  ov.innerHTML = slides.map((s, i) => `<a data-go="${i}" class="${i === state.i ? 'cur' : ''}"><div class="thumb"></div><span>${s.sec ? i + 1 : 'B'} · ${s.short || s.title}</span></a>`).join('');
  $$('.thumb', ov).forEach((t, i) => {
    const c = els[i].cloneNode(true);
    c.classList.add('active');
    $$('[data-s]', c).forEach((x) => x.classList.add('on'));
    $$('.stage3d', c).forEach((x) => x.insertAdjacentHTML('beforeend', `<div class="nogl">3D</div>`));
    t.appendChild(c);
  });
  ov.onclick = (e) => { const a = e.target.closest('[data-go]'); if (a) { go(+a.dataset.go); toggleOverview(false); } else if (e.target === ov) toggleOverview(false); };
}

// ---- presenter window -------------------------------------------------------------------------------
function renderPresenter(full) {
  const pv = $('#pv');
  if (!pv.dataset.ready) {
    pv.dataset.ready = 1;
    pv.innerHTML = `<div class="pv-main"><div id="pv-cur"></div></div>
      <div class="pv-side"><div id="pv-time"></div><div class="pv-nexth">Next</div><div id="pv-next"></div>
      <div class="pv-btns"><button data-act="prev">‹ Prev</button><button data-act="next">Next ›</button><button id="pv-t">Start / pause timer</button></div>
      <div id="pv-script"></div></div>`;
    $('#pv-t').onclick = () => toggleTimer();
    pv.addEventListener('click', (e) => { const b = e.target.closest('[data-act]'); if (b) ACT[b.dataset.act](); });
    // current slide lives in the normal deck: move the viewport into the presenter layout
    $('#pv-cur').appendChild($('#viewport'));
  }
  const nx = els[state.i + 1];
  const box = $('#pv-next');
  box.replaceChildren();
  if (nx) {
    const c = nx.cloneNode(true);
    c.classList.add('active');
    $$('[data-s]', c).forEach((x) => x.classList.add('on'));
    $$('.stage3d', c).forEach((x) => x.insertAdjacentHTML('beforeend', `<div class="nogl">3D scene</div>`));
    const wrap = document.createElement('div');
    wrap.className = 'pv-deck';
    wrap.appendChild(c);
    box.appendChild(wrap);
    fit(box, wrap);
  }
  $('#pv-script').innerHTML = `<h3>${slides[state.i].title}</h3><p>${slides[state.i].script || ''}</p>${slides[state.i].tip ? `<p class="tip">${slides[state.i].tip}</p>` : ''}`;
}

// ---- cross-window sync -------------------------------------------------------------------------------
if (bc) {
  bc.onmessage = (e) => {
    const m = e.data;
    if (m.type === 'nav') { if (m.i !== state.i) go(m.i, { silent: true, step: m.step, snap: true }); else if (m.step !== state.step) setStep(m.step, { silent: true }); }
    if (m.type === 'timer') { state.timer = m.t; updateHud(); }
    if (m.type === 'hello' && !PRESENTER) { bc.postMessage({ type: 'nav', i: state.i, step: state.step }); bc.postMessage({ type: 'timer', t: { ...state.timer } }); }
  };
  if (PRESENTER) bc.postMessage({ type: 'hello' });
}

// ---- keyboard -----------------------------------------------------------------------------------------
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea') && e.key !== 'Escape') return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const k = e.key;
  if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
  else if (k === 'Home') go(0);
  else if (k === 'End') go(PLAN_SLIDES - 1);
  else if (k === 'f' || k === 'F') setPresent(!state.present);
  else if (k === 'Escape') { if ($('#overview').classList.contains('on')) toggleOverview(false); else if (state.present) setPresent(false); }
  else if (k === 'n' || k === 'N') { state.tele = !state.tele; document.body.classList.toggle('tele', state.tele); }
  else if (k === 't') toggleTimer();
  else if (k === 'T') toggleTimer(true);
  else if (k === 'r' || k === 'R') ACT.replay();
  else if (k === 'o' || k === 'O') toggleOverview();
  else if (k === 'p' || k === 'P') openPresenter();
  else if (k === 'q' || k === 'Q') ACT.low();
  else if (k === 'b' || k === 'B') { state.black = !state.black; document.body.classList.toggle('black', state.black); }
  else if (k === '?') document.body.classList.toggle('help');
});

if (PRESENTER) document.body.classList.add('presenter');
const hashN = parseInt(location.hash.slice(1), 10);
const hashStep = new URLSearchParams(location.hash.split('&').slice(1).join('&')).get('s');
go(Number.isFinite(hashN) ? hashN - 1 : 0, { silent: PRESENTER, step: hashStep ? +hashStep : 0, snap: !!hashStep });
layout();
window.__deck = { go, next, prev, stage, state, slides };
