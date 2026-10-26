# EV battery pack enclosure: 20-min presentation

Web app (Vite + three.js) built from `EV Battery Pack Enclosure — 20-min Presentation Plan.md`.
20 slides, 11 with a procedural 3D model of the pack ("Model A", 1400×1200×200 mm), plus backup slides (Q&A, weights, glossary).

```
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

## You control the animation

Every slide is split into **steps**. A 3D animation plays one step at a time, and text appears or is highlighted with it.

| Key | Action |
|---|---|
| → / space / ↓ | next step; after the last step, the next slide |
| ← / ↑ | back one step (the 3D rewinds); at the first step, the previous slide at its last step |
| F | present mode (fullscreen); click the right two thirds = next, left third = back |
| N | teleprompter script in present mode |
| T / Shift+T | start-pause / reset timer (starts on slide 1→2 in present mode) |
| R | replay the 3D animation of this step |
| O | slide grid |
| P | presenter window (notes, timer, next slide; follows your steps) |
| Q | light 3D (weak laptops) |
| B | black screen |
| drag on 3D | orbit (the next step returns to the scene camera); click a part on slide 13 to inspect it |

Looping scenes (title, conclusion) turn by themselves. The toolbar shows a dot per step.

URLs: `?present` = bare present mode, `?presenter` = presenter window, `#12` = slide 12, `#13&s=3` = slide 13 at step 4, `#13&t=6` = slide 13 frozen at 6 s.

## Edit content

- Slides: `src/slides-a.js` (1–9), `src/slides-b.js` (10–20 + backup). Per slide: `stops` = scene time each step rests at, `data-s="n"` = text that appears on step n, `data-h="n"` = highlighted on step n. The number of steps is derived from these. Detail that does not fit on the slide lives in `script` and `tip` (presenter notes).
- One type scale for all slides: `src/style.css` (title 54 · body 34 · sub 27 · caption 21 px on the 1920×1080 canvas).
- References / Q&A / glossary: `src/refs.js`
- 3D: `src/three/pack.js` (the model), `src/three/scenes/*` (one file per slide scene; a scene is a pure function of its time `t`, which is why it can rewind)
- Author, course and date: `meta` in `src/util.js` (placeholders, set yours)
