import { r, tbl, slot } from './util.js';
import { refsHtml, qaHtml, glossaryHtml } from './refs.js';

const P3 = '3 · Ranking the materials', P4 = '4 · Structure design', P5 = '5 · Production method', P6 = '6 · Conclusion';

const bar = (label, dot, value, max, text, color, extra = '') =>
  `<div class="hbar" style="grid-template-columns:420px 1fr 190px"><span>${dot ? `<i class="dot ${dot}"></i>` : ''}${label}</span><div class="track"><div class="fill now ${extra}" style="width:${(value / max) * 100}%;background:${color}"></div></div><span class="v">${text}</span></div>`;

// slide 12: weighted score (out of 5) in two weight scenarios; scenario B appears on step 1
const SCORES = [['Press-hardened steel', 'st', 3.75, 3.25], ['Aluminium', 'al', 3.15, 3.3], ['CFRP', 'cf', 3.0, 3.3], ['FR glass-fibre SMC', 'smc', 3.0, 2.75], ['Magnesium', 'mg', 2.75, 3.1], ['Stainless 304', '', 2.75, 2.5]];
const col = (v, c, win, s) => `<div ${s ? `data-s="${s}"` : ''} style="display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;width:46%">
  <b style="font-size:30px;margin-bottom:6px;${win ? 'color:#fff' : 'color:#c5d3ea;font-weight:600'}">${v.toFixed(2)}</b>
  <div style="width:100%;height:${(v / 5) * 100}%;background:${c};border-radius:10px 10px 0 0;${win ? 'box-shadow:0 0 0 4px #fff inset' : 'opacity:.85'}"></div></div>`;
const chart12 = `<div style="height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:14px">
  <div class="legend"><span><i class="dot" style="background:#f59e0b"></i>Cost &amp; fire focus</span><span data-s="1"><i class="dot" style="background:var(--accent)"></i>Range focus</span><span class="small">score out of 5</span></div>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:22px;align-items:end;border-bottom:2px solid rgba(255,255,255,.3);background:repeating-linear-gradient(to top,rgba(255,255,255,.07) 0 1px,transparent 1px 20%);padding:0 8px">
    ${SCORES.map(([, , a, b]) => `<div style="display:flex;gap:10px;align-items:flex-end;justify-content:center;height:100%">${col(a, '#f59e0b', a === 3.75)}${col(b, 'var(--accent)', b === 3.3, 1)}</div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:22px;font-size:25px;text-align:center;line-height:1.2;padding:0 8px">${SCORES.map(([n, d]) => `<span>${d ? `<i class="dot ${d}"></i>` : ''}${n}</span>`).join('')}</div>
</div>`;

// weights (%) for the backup slide: [criterion, cost & fire, range]
const W12 = [['Panel stiffness per kg', 20, 30], ['Strength / crash', 15, 15], ['Fire resistance', 15, 10], ['Cost', 20, 10], ['Fatigue &amp; corrosion', 10, 10], ['EMI shielding', 5, 5], ['Thermal conductivity', 5, 10], ['CO₂ &amp; recycling', 10, 10], ['Optical', 0, 0]];

// Slides 10-20 + backups
export default [
  // ------------------------------------------------------------------------------------------ Part 3
  {
    part: P3, sec: 55, scene: null, short: 'Step 1 · Ashby screen',
    title: 'Step 1 · Ashby: lightest at equal stiffness',
    html: `<div class="cols" style="grid-template-columns:600px 1fr;gap:64px">
        <div class="stack" style="gap:34px">
          <div class="lead">Panels in bending:<br>maximise <span class="hl">E<sup>⅓</sup>/ρ</span> ${r(50)}</div>
          <div class="small" style="font-size:27px">higher = lighter at equal stiffness</div>
          <div class="callout" data-s="1">The index ignores <b>cost, fire, corrosion and CO₂</b> → we need more criteria</div>
        </div>
        <div class="panel" style="align-self:start;padding:34px 40px">
          ${bar('CFRP', 'cf', 2.4, 2.6, '~2.4*', '#6b7686', 'dash')}
          ${bar('Magnesium', 'mg', 2.1, 2.6, '2.10', 'var(--mg)')}
          ${bar('Aluminium', 'al', 1.52, 2.6, '1.52', 'var(--al)')}
          ${bar('FR glass-fibre SMC', 'smc', 1.4, 2.6, '1.33–1.47', '#5d7da0')}
          ${bar('Stainless steel', '', 0.75, 2.6, '0.75', 'var(--shield)')}
          ${bar('Press-hardened steel', 'st', 0.73, 2.6, '0.73', 'var(--steel)')}
          <div class="small" style="margin-top:12px">* assumed density 1.55 g/cm³ (dashed bar)</div>
        </div>
      </div>`,
    sources: '[50] Ansys Granta EduPack lecture unit, citing Ashby, Materials Selection in Mechanical Design, 2016 · data [51][53][55][56][57][58]',
    script: `How do we rank materials that each win a different test? Step one is a quick screen with Ashby's method. Because the floor and the lid are panels in bending, the index to maximise is E to the one-third over density. Carbon fibre and magnesium come out on top, aluminium is in the middle, and both steels come last. This tells us which materials give the lightest box for the same stiffness. But it tells us nothing about cost, fire, corrosion or carbon footprint. Magnesium, for example, has a great index but starts melting below 550 degrees. So Ashby is a good first filter, not the final answer. For the final answer, engineers use multi-criteria decision making. Before I show my own ranking, let me show what published studies found.`,
    tip: '→ adds the limit of the index. Report correction: the report listed “Mg (2.10) > CFRP (~2.4)”; 2.4 is larger, so CFRP goes first here (its density is assumed). Source detail: [51][53][55][56][57][58].',
  },
  {
    part: P3, sec: 65, scene: null, short: 'Step 2 · Published studies',
    title: 'Step 2 · Published studies: no single winner',
    html: `<div style="display:grid;gap:36px;align-content:start">
        ${tbl(['Study', 'What it measured', 'Winner'], [
          [`<b>Gökciler &amp; Geren</b> 2026 ${r(4)}`, 'Mass + cost, then crash', '<b>Aluminium</b> (CFRP above 100 km/h)'],
          [{ t: `<b>Li et al.</b> 2024 ${r(5)}`, s: 1 }, { t: 'CO₂ over the whole life', s: 1 }, { t: '<b>Aluminium</b> −44%, CF-SMC −35% vs steel', s: 1 }],
          [{ t: `<b>Fragiadaki et al.</b> 2026 ${r(6)}`, s: 2 }, { t: 'CO₂ and cost at the factory gate', s: 2 }, { t: 'Al lightest; <b>SMC</b> lowest CO₂ and cost', s: 2 }],
        ], { cls: 'big' })}
        <div class="callout" data-s="3">Different system boundary → different winner</div>
      </div>`,
    sources: '[4] Gökciler & Geren, Int. J. Automotive Sci. Technol. 10(1), 2026 · [5] Li et al., Sci. Rep. 14:2594, 2024 · [6] Fragiadaki et al., Batteries 12(9):318, 2026',
    script: `Three peer-reviewed studies are especially useful. Gökciler and Geren, 2026, compared stainless steel, aluminium and carbon fibre. When only mass and cost matter, aluminium wins. When crash energy is added, aluminium is best at around 60 kilometres per hour, but carbon fibre is better above 100. Li and colleagues, 2024, looked at carbon emissions over the whole life of a battery box with equal stiffness. Compared with steel, aluminium cut global warming impact by 44 percent, and carbon-fibre SMC by 35 percent. Fragiadaki and colleagues, 2026, only counted emissions up to the factory gate. There, aluminium was the lightest, but glass-fibre SMC had the lowest carbon per kilogram and the lowest cost. These results do not contradict each other. They measure different things. So every ranking must say clearly what it measures and how much each criterion matters.`,
    tip: 'One study per →, then the key message: per kg at the factory gate aluminium is penalised; over the whole life aluminium wins [5][6]. Gökciler: crash best Al at ~60 km/h, CFRP above 100 km/h.',
  },
  {
    part: P3, sec: 90, scene: null, short: 'Step 3 · Weighted ranking',
    title: 'Step 3 · Weights decide: steel for cost, Al for range',
    html: `<div style="display:grid;grid-template-rows:1fr auto auto;gap:16px;height:100%">
        ${chart12}
        <div class="callout teal" data-s="2">Move 10–15 points of weight and the winner changes → <b>priorities decide</b></div>
        <div class="small"><b>Own synthesis:</b> weighted sum of 8 criteria, scores 1–5 from the cited data (weights and example in the backup slides)</div>
      </div>`,
    sources: 'Scores based on [4][5][6][51]–[59][64][79]; method: weighted-sum multi-criteria decision making',
    script: `Step three is my own weighted ranking. I want to be clear that this is my synthesis of the data, not a published result. I chose eight criteria, gave each a weight, and scored each material from one to five using fixed rules based on the data you have seen. Optical properties get zero weight. I ran two scenarios. In the first, cost and fire resistance weigh more, like a mass-market car under China's new fire rule. Here, press-hardened steel wins clearly with 3.75, ahead of aluminium with 3.15. In the second scenario, range and cooling weigh more, like a long-range premium car. Now aluminium and carbon fibre tie at 3.30, and steel drops to third. Some results do not change: stainless steel and magnesium never rise above fourth. The most important lesson is this: moving only 10 to 15 percentage points of weight changes the winner. So the material choice is really a decision about priorities. And because no single material wins everything, the best enclosure uses each material where it works best. That is the idea behind the structure design.`,
    tip: '→ ① scenario “cost and fire” (steel 3.75 first) · ② scenario “range” (Al = CFRP 3.30, steel third) · ③ the lesson. Bridge to Part 4: “No single winner, so the structure must put each material where it works best.” Weights table and worked example: backup slide.',
  },

  // ------------------------------------------------------------------------------------------ Part 4
  {
    part: P4, sec: 70, scene: 'anatomy', stops: [3.0, 5.0, 7.0, 9.0, 11.0, 15.6], short: 'Anatomy',
    title: 'Every part of the enclosure has one main job',
    html: `<div class="cols" style="grid-template-columns:1fr 800px;gap:40px">
        <div class="stack">
          ${tbl(['Part', 'Main job'], [
            ['Tray (floor)', 'Carries cells, holds cooling'],
            ['Side frame', 'Absorbs side impact'],
            ['Cross members', 'Pass the load across'],
            ['Underbody plate', 'Stops stones and kerbs'],
            ['Lid', 'Closes, seals, blocks fire'],
            ['Seal + vent', 'Water out, gas out'],
          ], { cls: 'big', rowAttr: (row) => `data-part="${{ 'Tray (floor)': 'Tray', 'Side frame': 'Sill_L', 'Cross members': 'CrossMember', 'Underbody plate': 'Shield', Lid: 'Lid', 'Seal + vent': 'Seal' }[row[0]]}"` })}
        </div>
        ${slot('Illustrative model · click a part to inspect it')}
      </div>`,
    sources: '[7] Audi Technology Portal · [36] Gasgoo 2022 · [86] 42how 2022 · [88] US Patent 11,515,600 B2 (GM) · [89] W. L. Gore data sheet 2025',
    script: `Now let's open the box. The easiest way to understand the structure is to match each part to its main job. The tray carries the cells and the cooling system. Audi, for example, bonds extruded aluminium cooling chambers under the housing. The side frame, or sill, absorbs energy in a side crash. Cross members do something different: they do not absorb energy, they pass the load across the car to the other side. The underbody plate stops stones; on the Audi e-tron it is a 3.5 millimetre aluminium plate. The lid closes the box, and in BYD's design it is also the cabin floor. Finally, a seal and a vent. GM's patent squeezes a 6 millimetre bead of sealant down to about 4 millimetres, and a Gore vent opens at about 150 millibar to release gas. Audi's frame mixes extrusions, sheet and castings, and the whole pack adds 27 percent to the car's torsional stiffness.`,
    tip: 'One part per →, the row lights up. Real examples: tray = Audi e-tron extruded Al cooling chambers [7] · sill = cast nodes + extrusions [7] · cross members = SAIC-GM Ultium 1500 MPa steel [86] · plate = Audi 3.5 mm Al [7] · lid = BYD CTB cover = floor [36] · seal 6 → ~4 mm [88], vent opens at 150 ± 50 mbar [89]. Audi frame: 47% extrusions, 36% sheet, 17% castings; +27% torsional rigidity [7]. Click a part to inspect; any → returns to the sequence.',
  },
  {
    part: P4, sec: 65, scene: 'architectures', stops: [3.4, 5.9, 12], short: 'Architectures',
    title: 'More integration: the enclosure becomes the car body',
    html: `<div style="display:grid;grid-template-rows:1fr auto;gap:22px;height:100%">
        <div class="cols" style="grid-template-columns:1fr 840px;gap:40px;min-height:0">
          <div class="cards">
            <div class="card" data-h="0"><h3>Module pack</h3><p>Cells → modules → enclosure. The frame carries all loads.</p></div>
            <div class="card" data-h="1"><h3>Cell-to-pack</h3><p>No modules; cells act as beams. Space use 50% → 72%*</p></div>
            <div class="card" data-h="2"><h3>Cell-to-body</h3><p>Lid = car floor. Stiffer body, harder to repair.</p></div>
          </div>
          ${slot('Illustrative model, not to scale · * manufacturer claim')}
        </div>
        <div class="callout teal" data-s="2" style="padding:14px 28px">integration <b>↑</b> → fewer parts, stiffer body → repairability <b style="color:var(--bad)">↓</b></div>
      </div>`,
    sources: '[7] Audi · [26] VW Group · [31] CATL via Kyodo · [32] Gasgoo 2020 · [35] CnEVPost 2022 · [36] Gasgoo 2022 · [92] InsideEVs',
    script: `The structure also depends on how much the battery is integrated into the car. In a classic module pack, cells sit inside modules, and the enclosure alone carries every load. This needs heavy internal frames, but a broken module can be replaced. In cell-to-pack designs, like BYD's Blade or CATL's Qilin, the module layer disappears. The long cells themselves work like beams, so fewer cross members are needed, and CATL claims the space used by cells rises from below 50 to 72 percent. The final step is cell-to-body. Here the lid of the battery is the floor of the car. BYD claims its car body becomes much stiffer this way. But there is a price: Tesla's structural pack is filled with foam, and teardown experts said it was not designed to be repaired. So as integration increases, we gain stiffness and space, but we lose repairability.`,
    tip: 'One architecture per →. Examples: module pack = Audi e-tron (36 modules), VW MEB (up to 12) [7][26] · CTP = BYD Blade, CATL Qilin [31][32] · CTB = BYD claims 40,000 N·m/deg torsional stiffness [36]; Leapmotor +25% [35]; Tesla 4680 pack “not envisioned for repairs” (Munro) [92].',
  },
  {
    part: P4, sec: 75, scene: 'crash', stops: [4.95, 9.95, 15], short: 'Crash · fire → layout',
    title: 'Absorb outside, transfer inside, contain fire on top',
    html: `<div class="cols" style="grid-template-columns:1fr 840px;gap:40px">
        <div class="cards">
          <div class="card" data-h="0"><h3 style="color:var(--steel)">Crash</h3><p>The sill absorbs the side-pole hit; the cross member passes the load across.</p></div>
          <div class="card" data-h="1"><h3 style="color:var(--shield)">Underbody</h3><p>A sandwich shield spreads the load: over 50% less cell deformation.</p></div>
          <div class="card" data-h="2"><h3 style="color:var(--barrier)">Fire</h3><p>The barrier holds, the vent opens, gas leaves away from the cabin.</p></div>
        </div>
        ${slot('Illustrative animation, not simulation results')}
      </div>`,
    sources: '[7] Audi · [69] Zhou et al., Polym. Degrad. Stab. 2025 · [84] SSAB Docol EV concept · [88] GM patent · [90] E-Mobility Engineering · [98] Zhu et al., SAE 2018-01-1438',
    script: `Let me finish this part with three design rules. First, crash. In a side-pole impact, the sill on the outside must absorb the energy, because nothing may enter the cells. The cross members inside should not absorb energy; they pass the force to the other side. SSAB showed that a roll-formed martensitic steel sill can match an aluminium multi-cell beam. Under the car, an MIT and Tsinghua study found that a sandwich shield reduced cell deformation by more than half. Second, fire: insulating barriers between cells, vents that open under pressure, and paths that send hot gas away from the passengers. Third, sealing: the seal works only if the tray is very flat. Putting everything together, my proposed layout is multi-material: an aluminium tray with built-in cooling for light weight and heat transfer, steel or multi-cell aluminium sills for crash, a sandwich shield underneath, and a flame-retardant lid with a fire barrier on top. Now, how do we actually make it?`,
    tip: 'One scenario per →: ① pole hits the sill, arrows run through the cross member · ② stone hits the shield · ③ cell fire, barrier holds, gas leaves. Facts: 1700 MPa roll-formed steel sill ≈ aluminium 6082-T6 multi-cell beam [84]; sandwich shield cut cell deformation by >50% vs a 6.35 mm Al plate [98]; polyimide-silica aerogel fully stopped propagation in one study [69]; sealing needs a flat tray [88]. The proposed layout (own synthesis) is on the conclusion slide. If asked: an illustration of the principle, not FEA.',
  },

  // ------------------------------------------------------------------------------------------ Part 5
  {
    part: P5, sec: 45, scene: null, short: 'Four production routes',
    title: 'Production volume decides the route',
    html: `<div style="display:grid;gap:26px;align-content:start">
        ${tbl(['Route', 'Best fit', 'Main risk'], [
          [`<b>Extrusion + friction stir welding</b> <span class="hl">◀ my focus</span>`, 'Medium–high volume, many pack sizes', 'Distortion, slow welding'],
          [{ t: '<b>High-pressure die casting</b>', s: 1 }, { t: 'Very high, stable volume', s: 1 }, { t: 'Die cost, porosity', s: 1 }],
          [{ t: '<b>Stamping, roll forming</b>', s: 2 }, { t: 'Lowest-cost cars', s: 2 }, { t: 'Mass, flatness', s: 2 }],
          [{ t: '<b>SMC compression moulding</b>', s: 3 }, { t: 'Lids and covers', s: 3 }, { t: 'Needs a metal frame', s: 3 }],
        ], { cls: 'big', rowAttr: (row) => (String(row[0].t ?? row[0]).includes('my focus') ? 'class="hi"' : '') })}
        <div class="callout teal" data-s="3">Honda 0 Series case: 60+ parts → 3 with large castings ${r(100)}</div>
      </div>`,
    sources: '[77] ArcelorMittal 2023 · [87][120] CompositesWorld · [100] Honda 2024 · [108] ASSEMBLY Magazine 2025 · [110] S&P Global Mobility 2023 · [115] FormingWorld 2026 · [129] AluStir',
    script: `There are four main ways to make an enclosure. Aluminium extrusions joined by friction stir welding are the established workhorse. High-pressure die casting, or megacasting, replaces dozens of parts with a few huge castings: Honda turns more than 60 parts into 3. But the dies cost millions, so it only pays at very high volume. Steel stamping, hot stamping and roll forming reuse the existing body shop and give the lowest cost, but the box is heavier. And compression-moulded SMC is now standard for lids, though it needs a metal frame to take crash loads. For the rest of this part, I will focus on the most widely proven route for mass production: aluminium extrusion plus friction stir welding.`,
    tip: 'One route per →. Numbers: FSW ≈ 300 s per tray per 2-gantry cell [129]; die casting ≈ 120–150 s per large casting [110], dies “several million dollars”, porosity [108]; SMC 60–180 s [120], needs a metal frame for crash [87]; stamping risks: mass, springback, flatness [77][115].',
  },
  {
    part: P5, sec: 80, scene: 'process', stops: [1.45, 4.95, 7.95, 13.2, 16.0, 19.9], short: 'Extrusion + FSW',
    title: 'Extrusion shapes it; friction stir welding joins it',
    html: `<div class="cols" style="grid-template-columns:1fr 800px;gap:40px">
        ${slot('Illustrative process model, not to scale')}
        <div class="steps" style="gap:12px">
          ${[['Heat', 'aluminium billet, ≈ 510 °C'], ['Extrude', 'through a shaped die'], ['Quench and age', 'to T6 strength'], ['Friction stir weld', 'solid state, no melting'], ['Add', 'frame joints, adhesive, coating'], ['Test', 'helium leak check, every tray']]
            .map(([a, b], i) => `<div class="step" data-h="${i}" style="padding:12px 22px"><i>${i + 1}</i><div><b>${a}</b><small>${b}</small></div></div>`).join('')}
        </div>
      </div>`,
    sources: '[102] Kneuper et al., Automotive Innovation 7:182–193, 2024 · [103] EUROGUSS 365, 2022 · [105] Benteler · [115] FormingWorld · [128] Marposs',
    script: `Here is how it works, step by step. First, an aluminium billet is heated to about 500 degrees. It is then pushed through a shaped steel die, a bit like squeezing toothpaste, to make long profiles. For the floor, these are flat profiles with hollow chambers inside, which protect against impacts from below and can carry coolant. The profiles are quenched and aged to the T6 condition for full strength. Next comes the key step: friction stir welding. A rotating tool presses into the joint between two profiles. Friction heats the metal until it is soft, but it never melts, and the tool stirs the two sides together. Because nothing melts, there is no filler wire, no shielding gas, little distortion, and the seam is leak-tight. A peer-reviewed study calls it the predominant method for trays. Finally, frame parts are added, the tray is coated, and every single tray is leak-tested with helium.`,
    tip: 'One process step per →; step ④ (welding) is the key idea of the slide, take your time. Details: billet ≈ 510 °C, die ≈ 450 °C, ram 3 mm/s, ratio ≈ 26 [102]; spray quenching gave ≈ 10% higher tensile strength than air [102]; FSW: no filler, no shielding gas, low distortion [103]; frame joints by MIG [105]; helium leak test + flatness [128][115].',
  },
  {
    part: P5, sec: 55, scene: null, short: 'In numbers: pros & cons',
    title: 'Proven in production, but slow and sensitive to distortion',
    html: `<div style="display:grid;grid-template-rows:auto 1fr;gap:34px;height:100%">
        <div class="tiles" style="grid-template-columns:repeat(3,1fr)">
          <div class="tile"><b>≈80<small>trays/day</small></b><span>per FSW gantry ${r(103)}</span></div>
          <div class="tile"><b>≈300<small>s</small></b><span>per tray in a 2-gantry cell ${r(129)}</span></div>
          <div class="tile"><b>±3<small>mm</small></b><span>distortion, vs ±1.5 mm flatness needed ${r(112, 115)}</span></div>
        </div>
        <div class="cmp">
          <div class="pro panel" data-s="1"><h3>Why it wins</h3><ul class="pts">
            <li>Factory proof: 6 FSW gantries at TPV ${r(103)}</li><li>Cheap dies, many pack sizes</li><li>Leak-tight solid-state seams ${r(102)}</li></ul></div>
          <div class="con panel" data-s="2"><h3>Where it struggles</h3><ul class="pts">
            <li>Slow: ≈ €15 per car for FSW ${r(129)}</li><li>Distortion needs straightening</li><li>Strict leak-test limits ${r(102)}</li></ul></div>
        </div>
      </div>`,
    sources: '[102] Kneuper et al. 2024 · [103] EUROGUSS 365 · [112] Sabry et al., J. Manuf. Processes 101, 2023 · [115] FormingWorld · [129] AluStir (consultancy estimate)',
    script: `Why is this route so common? Because it is proven. In Slovenia, TPV Automotive builds trays from nine extrusions and four cover plates on six welding gantries, and each gantry makes about 80 trays a day. The dies are cheap, the same profiles can be cut to many pack sizes, and the seams are leak-tight. But it has weaknesses. Welding at about 3 metres per minute is slow, and a consultancy estimates about 15 euros of welding cost per car. Heat from welding can also bend the tray by about 3 millimetres, while the seal needs a flatness of about 1.5 millimetres, so extra straightening may be needed. That is why the industry is now testing bigger castings and integrated cooling. Still, for most carmakers today, extrusion plus friction stir welding is the safest choice.`,
    tip: '→ ① strengths · ② weaknesses. Details: TPV tray = 4 cover plates + 9 extrusions [103]; 2-gantry cell at 3 m/min, €2.5 M per cell, ≈ €15 per car vs ≈ €4 for robotic MIG (consultancy “educated guesses”) [129]; burnishing cuts distortion ±3 → ±0.75 mm [112]; helium leak limit ≤ 1×10⁻³ mbar·l/s (research) [102]; recycled Al saves ≈ 95% energy [79]. Trend: integrated cooling, larger castings, recycled aluminium [100][71][133].',
  },

  // ------------------------------------------------------------------------------------------ Part 6
  {
    part: P6, sec: 70, scene: 'turntable', short: 'Conclusion',
    title: 'No single winner: each material where it works best',
    html: `<div class="cols" style="grid-template-columns:1fr 760px;gap:40px">
        <div style="display:grid;gap:16px;align-content:start">
          <div class="step"><i>1</i><div>The job changed: carry mass → resist impact → <b>contain fire</b></div></div>
          <div class="step" data-s="1"><i>2</i><div><b>Steel</b> wins on cost and fire; <b>Al and CFRP</b> win on range</div></div>
          <div class="step" data-s="2"><i>3</i><div><b>Multi-material:</b> Al tray with cooling, steel sills, sandwich shield, FR SMC lid + fire barrier</div></div>
          <div class="step" data-s="3"><i>4</i><div><b>6xxx aluminium extrusion + friction stir welding</b></div></div>
          <div class="small" data-s="4" style="margin-top:10px"><b>Open questions:</b> independent crash and fire tests · an enclosure cost model · most fire and cost data are industry claims</div>
        </div>
        ${slot('Illustrative model, not to scale')}
      </div>`,
    sources: '[3] AVL · [4] Gökciler & Geren 2026 · [5] Li et al. 2024 · [6] Fragiadaki et al. 2026 · [102] Kneuper et al. 2024 · [103] EUROGUSS 365',
    script: `To conclude. The enclosure began as a box that carried heavy batteries. It became a crash structure, and with China's new rule, it is now also a fire container. When we rank the materials, there is no single winner. Steel wins when cost and fire matter most; aluminium and carbon fibre win when range matters most. So the material choice is really a decision about priorities, set by regulation and by the type of car. My recommendation is a multi-material enclosure: an aluminium tray with built-in cooling, strong steel or multi-cell aluminium at the sides, a protective shield underneath, and a flame-retardant lid with a fire barrier. And for production, aluminium extrusion with friction stir welding is today's most proven route. One honest limitation: most fire and cost data still come from industry, so independent tests are needed. Thank you for listening. I am happy to take your questions.`,
    tip: 'One conclusion point per →, then the open questions. GB 38031-2025: no fire for ≥ 2 h [3]. Reference layout (own synthesis): aluminium extrusion tray with built-in cooling, steel or multi-cell aluminium sills, sandwich underbody shield, FR SMC or steel lid, mica / aerogel liner [7][69][84]. Leave this slide up during Q&A (B = black screen).',
  },
  {
    part: P6, sec: 5, scene: null, short: 'References',
    title: 'References',
    html: `<div style="height:100%;overflow:hidden">${refsHtml()}</div>`,
    sources: 'Numbers match the research report “Building the box that guards EV batteries”. Click a number to open the source.',
    script: '',
    tip: 'Do not read this slide aloud. If a lecturer prefers academic sources, point to the peer-reviewed and official groups.',
  },

  // ------------------------------------------------------------------------------------------ Backup
  {
    part: 'Backup', sec: 0, scene: null, short: 'Q&A preparation',
    title: 'Q&A: questions you may get, and short answers',
    html: `<div>${qaHtml()}</div>`,
    sources: '', script: '',
  },
  {
    part: 'Backup', sec: 0, scene: null, short: 'Weights and example',
    title: 'Backup: criteria weights and one worked example',
    html: `<div class="cols" style="grid-template-columns:1fr 760px;gap:48px">
        <table class="tbl sm"><thead><tr><th>Criterion</th><th class="num">Cost &amp; fire</th><th class="num">Range</th></tr></thead><tbody>
          ${W12.map(([c, a, b]) => `<tr><td>${c}</td><td class="num">${a}%</td><td class="num">${b}%</td></tr>`).join('')}
        </tbody></table>
        <div class="stack">
          <div class="callout teal">Steel, cost &amp; fire scenario<br><span class="small" style="font-size:26px">0.20×1 + 0.15×5 + 0.15×5 + 0.20×5 + 0.10×4 + 0.05×4 + 0.05×3 + 0.10×3 = <b>3.75</b></span></div>
          <div class="small">Own synthesis. Scores 1–5 follow explicit rules from the cited property, cost and CO₂ data; missing data = neutral 3. Optical properties: weight 0.</div>
        </div>
      </div>`,
    sources: 'Scores based on [4][5][6][51]–[59][64][79]; method: weighted-sum multi-criteria decision making', script: '',
  },
  {
    part: 'Backup', sec: 0, scene: null, short: 'Glossary (VI · EN · 中文)',
    title: 'Glossary for the presenter',
    html: `${glossaryHtml()}`,
    sources: '', script: '',
  },
];
