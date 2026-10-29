import { r, tbl, slot, meta } from './util.js';

const P0 = '0 · Opening', P1 = '1 · The enclosure', P2 = '2 · Design constraints';

// Slides 1-9. sec = planned seconds (sums to the plan's 20:00), scene = key in three/scenes/index.js.
// Steps: `stops` = scene time each step rests at (→ plays the next beat, ← rewinds); [data-s] = text that appears on that step,
// [data-h] = item highlighted on that step. Keep slide text to headlines; the detail lives in `script` and `tip`.
export default [
  {
    part: P0, layout: 'title', sec: 25, scene: 'vehicle', short: 'Title',
    title: 'The battery pack enclosure',
    html: `${slot('', '', 'bleed')}
      <div class="ttl"><div class="k">Material selection for an EV battery pack enclosure</div>
        <h1>The battery pack <em>enclosure</em></h1></div>
      <div class="who"><b>${meta.author}</b> · ${meta.course} · ${meta.date}</div>`,
    script: `Good morning everyone. Every electric car carries a battery that costs about a third of the whole car. Today I want to talk about the box that protects it: the battery pack enclosure. I will show how engineers choose its material, design its structure, and manufacture it.`,
    tip: 'Pack glows under the floor, camera orbits 360° and loops. → : the camera zooms into the pack.',
  },
  {
    part: P0, sec: 20, scene: 'vehicleZoom', stops: [5], short: 'Agenda',
    title: 'Six parts in twenty minutes',
    html: `<div class="cols" style="grid-template-columns:760px 1fr">
        <ol style="list-style:none;margin:0;padding:0;display:grid;gap:22px;align-content:center">
          ${['The enclosure', 'Design constraints', 'Ranking the materials', 'Structure design', 'Production method', 'Conclusion']
            .map((t, i) => `<li style="display:grid;grid-template-columns:70px 1fr;align-items:center;font-size:40px"><b style="font-size:52px;color:var(--accent)">${i + 1}</b><span>${t}</span></li>`).join('')}
        </ol>
        ${slot('Illustrative generic EV, not to scale')}
      </div>`,
    script: `My talk has six parts. First, what the enclosure is, where it came from, and why the market needs it. Second, the constraints a designer must meet. Third, I will rank the candidate materials. Fourth, the structure. Fifth, how it is made. And finally, my conclusion.`,
  },

  // ------------------------------------------------------------------------------------------ Part 1
  {
    part: P1, sec: 75, scene: 'explode', stops: [0, 7.7, 8.9, 10.3, 11.95], short: 'What is an enclosure?',
    title: 'The enclosure: a strong, sealed box under the floor',
    html: `<div class="cols" style="grid-template-columns:780px 1fr">
        <div class="stack" style="gap:36px">
          <div class="lead">The housing around the cells and modules.</div>
          <div style="display:grid;grid-template-columns:1fr 40px 1fr 40px 1fr;align-items:center;gap:4px;text-align:center;font-size:30px">
            <div class="card" data-h="2" style="padding:20px 10px"><svg viewBox="0 0 60 60" width="76"><rect x="22" y="6" width="16" height="48" rx="3" fill="#dfe3e8"/><rect x="26" y="2" width="8" height="6" fill="#c98a52"/></svg><br><b>Cell</b></div>
            <span class="mute">→</span>
            <div class="card" data-h="3" style="padding:20px 10px"><svg viewBox="0 0 60 60" width="76"><rect x="4" y="10" width="52" height="40" rx="4" fill="none" stroke="#aab4c0" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${10 + i * 7.6}" y="16" width="5" height="28" fill="#dfe3e8"/>`).join('')}</svg><br><b>Module</b></div>
            <span class="mute">→</span>
            <div class="card" data-h="4" style="padding:20px 10px"><svg viewBox="0 0 60 60" width="76"><rect x="3" y="8" width="54" height="44" rx="5" fill="none" stroke="var(--al)" stroke-width="4"/><rect x="9" y="14" width="19" height="14" fill="#aab4c0"/><rect x="32" y="14" width="19" height="14" fill="#aab4c0"/><rect x="9" y="32" width="19" height="14" fill="#aab4c0"/><rect x="32" y="32" width="19" height="14" fill="#aab4c0"/></svg><br><b>Pack</b></div>
          </div>
          <ul class="pts">
            <li data-s="1">Tray · lid · side frames · cross members · underbody plate · seal · vent</li>
            <li data-s="4">Pack ≈ <span class="hl">500 kg</span>, enclosure ≈ <span class="hl">100 kg</span> ${r(9)}</li>
          </ul>
        </div>
        ${slot('Illustrative model; box size 1400 × 1200 × 200 mm')}
      </div>`,
    sources: '[1] ICCT 2023 · [7] Audi Technology Portal · [8] Shaikh et al., arXiv 2309.00637 · [9] Stratview Research · [10] Zhang et al., WEVJ 2025',
    script: `Let's start with the basics. An electric car stores its energy in hundreds or even thousands of small battery cells. In a classic design, cells are grouped into modules, and the modules, wiring, cooling and housing together form the battery pack. The enclosure is that housing. You can picture it as a very strong lunchbox bolted under the floor of the car. The bottom half is the tray, the top half is the lid, and a stiff frame runs around the edge. Inside, cross members divide the space and carry loads. Underneath, a plate protects against stones. A seal keeps water out, a vent lets gas escape, and cooling plates control temperature. This box is not light. An industry estimate says a typical pack weighs about 500 kilograms, and around 100 of those are the enclosure itself. So the enclosure is a big part of the problem, and also a big opportunity.`,
    tip: '→ steps: ① assembled box · ② it explodes into parts · ③ one cell · ④ a module · ⑤ the pack. Extra facts for Q&A: main parts per Audi e-tron [7]; one real aluminium enclosure weighs 149.4 kg [10]; box size as studied in [8].',
  },
  {
    part: P1, sec: 80, scene: 'history', stops: [2.8, 6.8, 10.8, 14.8, 18.8, 22.8], short: 'History',
    title: '130 years: from wooden box to load-bearing floor',
    html: `<div style="display:grid;grid-template-rows:1fr auto;gap:26px;height:100%">
        ${slot()}
        <div class="tl" style="grid-template-columns:repeat(6,1fr);gap:16px">
          <div class="ms" data-h="0"><b>1912</b>Wooden battery boxes</div>
          <div class="ms" data-h="1"><b>1990s</b>Heavy pack under the floor</div>
          <div class="ms" data-h="2"><b>2009</b>T-shaped pack as structure</div>
          <div class="ms" data-h="3"><b>2011–14</b>Flat floor pack + underbody shield</div>
          <div class="ms" data-h="4"><b>2018</b>Aluminium crash frame</div>
          <div class="ms" data-h="5"><b>2019–22</b>Lid = car floor (BYD CTB)</div>
        </div>
      </div>`,
    sources: '[11] US DOE · [12] VEVA · [18] WardsAuto 2009 · [22] Green Car Reports 2011 · [23] MIT Tech Review 2014 · [36] Gasgoo 2022 · also [13][16][26][31][32]',
    script: `The enclosure has a long history. In 1912, a Detroit Electric kept its batteries in wooden boxes. In the 1990s, GM's EV1 carried a lead-acid pack of 533 kilograms, and the pack moved under the floor. With lithium-ion, the Chevrolet Volt used a T-shaped pack as part of the structure, and Tesla's Model S made the pack the floor. But road debris pierced the underside in 2013, so Tesla added a metal shield. After 2018, premium cars used aluminium crash frames. Today, in BYD's design, the lid of the battery is the floor of the cabin.`,
    tip: 'Each → moves the camera to the next era (six steps). Milestones for the script: 1990 California ZEV · EV1 533 kg [13] · RAV4 EV [16] · 2014 Model S debris fires [23] · 2018–20 Audi e-tron, VW MEB [7][26] · 2019 CATL CTP, BYD Blade [31][32].',
  },
  {
    part: P1, sec: 55, scene: null, short: 'Market',
    title: '20 million boxes protect the car’s costliest part',
    html: `<div style="display:grid;gap:40px;align-content:start">
        <div class="tiles" style="grid-template-columns:repeat(3,1fr)">
          <div class="tile"><b>&gt;20<small>million</small></b><span>electric cars sold in 2025 ${r(2)}</span></div>
          <div class="tile"><b>⅓</b><span>of an EV’s production cost is the battery ${r(1)}</span></div>
          <div class="tile"><b>0.5–1.2<small>kWh</small></b><span>saved per 100 km for every 100 kg removed ${r(42)}</span></div>
        </div>
        <div class="panel" data-s="1" style="padding:30px 40px">
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
            <b style="font-size:36px">Enclosure market by material</b><span class="small">market-research estimate ${r(40)}</span></div>
          <div class="hbar"><span><i class="dot al"></i>Aluminium</span><div class="track"><div class="fill" style="width:49%;background:var(--al)"></div></div><span class="v">49%</span></div>
          <div class="hbar"><span><i class="dot st"></i>Steel</span><div class="track"><div class="fill" style="width:38.9%;background:var(--steel)"></div></div><span class="v">39%</span></div>
          <div class="hbar"><span><i class="dot smc"></i>Composites</span><div class="track"><div class="fill" style="width:8.1%;background:var(--smc)"></div></div><span class="v">8%</span></div>
          <div class="hbar"><span><i class="dot" style="background:var(--mute)"></i>Other</span><div class="track"><div class="fill" style="width:4%;background:var(--mute)"></div></div><span class="v">4%</span></div>
        </div>
      </div>`,
    sources: '[1] ICCT 2023 · [2] IEA Global EV Outlook 2026 · [40] Global Market Insights · [42] Del Pero et al., Machines 2020',
    script: `Why does the market need a better enclosure? Two numbers. First, volume: according to the IEA, more than 20 million electric cars were sold in 2025, one in four new cars. That means about 20 million enclosures every year. Second, value: the ICCT calculates that the battery is about one third of the production cost of a battery-electric car. So a relatively cheap box protects the most expensive part of the car. There is also a third number: weight. A peer-reviewed study found that every 100 kilograms removed saves about half to more than one kilowatt-hour per 100 kilometres. Lighter enclosures mean longer range. Market-research firms estimate this market at three to five billion US dollars, with aluminium as the leading material. These estimates differ, so I treat them as rough. But the message is clear: strong, safe and light, at a price for mass production. That is the challenge.`,
    tip: '→ shows the market-share bars. Extra numbers: 23 million EVs expected in 2026 [2]; battery ≈ 33% of cost [1]; pack price ≈ $99/kWh in 2025 [38]; market size USD 3.1–4.7 billion [39]. Bridge: “So what must this box do? The design constraints.”',
  },

  // ------------------------------------------------------------------------------------------ Part 2
  {
    part: P2, sec: 65, scene: 'threats', stops: [1.95, 3.95, 5.95, 7.95, 9.95, 11.95, 13.95], short: 'Seven jobs',
    title: 'The enclosure must do seven jobs at once',
    html: `<div style="display:grid;grid-template-rows:1fr auto;gap:20px;height:100%">
        <div class="cols" style="grid-template-columns:720px 1fr;min-height:0">
          <div class="steps" style="gap:12px">
            ${['Crash protection', 'Underbody protection', 'Sealing', 'Thermal management', 'Fire containment', 'Electrical safety', 'Light, stiff, recyclable']
              .map((a, i) => `<div class="step" data-h="${i}" style="padding:10px 22px"><i>${i + 1}</i><div><b>${a}</b></div></div>`).join('')}
          </div>
          ${slot('Illustrative model, not to scale')}
        </div>
        <div class="callout" data-s="6"><b>Central tension:</b> strength for safety <span class="hl">vs.</span> lightness for range ${r(10)}</div>
      </div>`,
    sources: '[9] Stratview Research · [10] Zhang et al., World Electric Vehicle Journal 16(11):632, 2025',
    script: `In plain terms, the enclosure has seven jobs. First, in a crash it must not let anything crush the cells. Second, it sits under the car, so stones and kerbs hit it from below; that was the lesson of the Tesla fires. Third, it must be sealed, because water inside a high-voltage battery destroys insulation. Fourth, it holds the cooling system, since lithium-ion cells work best between about 20 and 40 degrees. Fifth, if one cell catches fire, the box must stop the fire from spreading. Sixth, it keeps high voltage away from the car body and controls electrical noise. And seventh, it must do all this while staying light, stiff and recyclable. Notice the conflict between the first and the last job: strength for safety pulls toward heavy material, while range pulls toward light material. This tension drives every decision in my talk.`,
    tip: 'One job per →: pole → side frame · stone → underbody plate · water → seal · coolant → tray (cells work best at about 20–40 °C [9]) · hot cell → barrier · lightning → insulation · scale → ≈100 kg. The last → adds the central tension.',
  },
  {
    part: P2, sec: 70, scene: 'tests', stops: [3.95, 7.95, 11.95], short: 'Regulations',
    title: 'Regulations put numbers on every job',
    html: `<div style="display:grid;grid-template-rows:auto 1fr;gap:20px;height:100%">
        <div>
          ${tbl(['Job', 'Test', 'Pass criterion'], [
            ['Crash', 'UN R100 crush', '≥ 100 kN on a 75 mm platen'],
            ['Underbody', 'GB 38031 bottom impact', '150 J × 3 hits: no leak, no fire'],
            ['Cell fire', 'GB 38031 thermal propagation', '<b>No fire or explosion for ≥ 2 h</b>'],
          ].map((row, i) => row), { cls: 'sm', rowAttr: (row) => `data-h="${['Crash', 'Underbody', 'Cell fire'].indexOf(row[0])}"` })}
          <div class="small" style="margin-top:10px">GB 38031-2025 applies to new type approvals from 1 July 2026 ${r(46)}</div>
        </div>
        ${slot('Simplified illustration of test principles, not the real test rig')}
      </div>`,
    sources: '[3] AVL white paper on GB 38031-2025 · [45] In Compliance Magazine · [46] CarNewsChina 2025 · [48] UN ECE Regulation No. 100',
    script: `These jobs are not just ideas. Regulations turn them into tests with numbers. Europe and many other countries use UN Regulation 100, and China uses GB 38031. In the crush test, the pack must survive at least 100 kilonewtons, about the weight of ten tonnes. China's new bottom-impact test hits the underside three times with a 30 mm steel head at 150 joules, with the battery almost fully charged, and nothing may leak, rupture or burn. The biggest change is this one: from July 2026, China requires that when one cell goes into thermal runaway, there must be no fire or explosion for at least two hours. The old rule only required a five-minute warning. Since China makes about 80% of the world's battery cells, this rule effectively sets a global target. Its message for the enclosure is simple: the box must change from protecting the battery to containing the fire.`,
    tip: 'One test per →. Not on the slide, but in UN R100: external fire (2 min direct LPG flame, no explosion) and electrical isolation ≥ 100 Ω/V [45][48]; bottom impact uses a 30 mm head with SOC ≥ 95% [3].',
  },
  {
    part: P2, sec: 75, scene: 'plates', stops: [0.9, 4.4, 11.9], short: 'Mechanical properties',
    title: 'Steel is strongest; Al and Mg are stiffest per kg',
    html: `<div style="display:grid;grid-template-rows:auto 1fr;gap:20px;height:100%">
        <div class="cols" style="grid-template-columns:1000px 1fr;gap:48px;height:auto">
          ${tbl(['Material', 'Strength (MPa)', { t: 'Panel index E<sup>⅓</sup>/ρ', s: 1 }], [
            [`<i class="dot st"></i>Steel`, { t: '1300–1650', c: 'best' }, { t: '0.73', s: 1 }],
            [`<i class="dot al"></i>Aluminium`, '140–340', { t: '1.52', s: 1 }],
            [`<i class="dot mg"></i>Magnesium`, '230', { t: '2.10', c: 'best', s: 1 }],
            [`<i class="dot smc"></i>FR glass-fibre SMC`, '146–180', { t: '1.33–1.47', s: 1 }],
            [`<i class="dot cf"></i>CFRP`, '~740', { t: '~2.4*', c: 'best', s: 1 }],
          ], { cls: 'sm' })}
          <div class="stack" style="align-content:center;gap:22px">
            <div class="small" data-s="1" style="font-size:var(--fs-sub)">Panels bend: stiffness ∝ E·t³, mass ∝ ρ·t ${r(50)}<br>* assumed density</div>
            <div class="callout teal" data-s="2">Same stiffness → Al weighs <b>0.48×</b>, Mg <b>0.35×</b> of steel</div>
          </div>
        </div>
        ${slot('Calculated from E and ρ in [51][53][56]')}
      </div>`,
    sources: '[50] Ansys Granta EduPack (Ashby) · [52] AHSS Insights · [53][56] MakeItFrom.com · [57] IDI Composites · [58] Hexcel HexPly 8552',
    script: `Now the materials. I compare five families: steel, aluminium, magnesium, glass-fibre SMC and carbon fibre. Look first at tensile strength. Press-hardened steel reaches 1300 to 1650 megapascals, four to five times aluminium. That is why steel is used where nothing may push into the cells. But strength is not everything. A battery floor or lid is a flat panel that bends. For a panel, stiffness grows with the cube of thickness, and mass grows only with thickness. So a lighter material can simply be made a little thicker. Ashby's method captures this with the panel index, E to the power one-third divided by density. On this index, aluminium is about twice as good as steel, and magnesium almost three times. In other words, for the same stiffness, an aluminium floor weighs about half as much as a steel floor. Magnesium looks even better, but it is brittle, with low elongation and fatigue strength. So no single number decides the winner.`,
    tip: '→ ① three plates, same size · ② one force: all deflect equally (equal stiffness, so thickness differs) · ③ weigh them: steel 1.00, Al 0.48, Mg 0.35 (own calculation from E and ρ). Not on the slide: Mg is brittle (elongation 11%, fatigue 96 MPa); density 7.9 / 2.7 / 1.7 g/cm³; Al 1.40 t thick, Mg 1.62 t for equal stiffness.',
  },
  {
    part: P2, sec: 60, scene: null, short: 'Thermal, electrical, cost, CO₂',
    title: 'Each material wins a different test',
    html: `<div style="display:grid;gap:18px;align-content:start">
        ${tbl(['', '<i class="dot st"></i>Steel', '<i class="dot al"></i>Aluminium', '<i class="dot smc"></i>FR SMC', '<i class="dot cf"></i>CFRP'], [
          ['Fire', { t: 'melts 1430 °C', c: 'best' }, { t: 'melts ~600 °C', c: 'worst' }, { t: 'flame-retardant', c: 'best' }, { t: 'burns ~430 °C', c: 'worst' }],
          ['Heat conduction', '53', { t: '130–160', c: 'best' }, { t: '&lt; 0.1', c: 'worst' }, '~0.2'],
          ['EMI shielding', { t: 'yes', c: 'best' }, { t: 'yes', c: 'best' }, { t: 'needs foil', c: 'worst' }, 'partly'],
          ['Corrosion', 'needs coating', 'road salt', { t: 'none', c: 'best' }, { t: 'attacks Al', c: 'worst' }],
          ['Cost per kg', { t: '¥10–20', c: 'best' }, '¥30–50', '¥40–70', { t: '¥200–400', c: 'worst' }],
          ['CO₂ per kg', { t: '1.4 kg', c: 'best' }, '8–9 kg *', '3–4 kg', { t: 'high', c: 'worst' }],
        ], { cls: 'sm' })}
        <div class="small">* recycled aluminium: about 95% less · optical properties: weight 0 (hidden box) · values from ${r(5, 6, 51, 53, 57, 59, 62, 79)}</div>
        <div class="panel" data-s="1" style="padding:22px 36px">
          <b style="font-size:32px">Industry fire test: how long does the cover hold?</b>
          <div class="hbar" style="margin:14px 0 8px"><span><i class="dot al"></i>Thin aluminium</span><div class="track"><div class="fill" style="width:2.5%;background:var(--bad)"></div></div><span class="v">30 s</span></div>
          <div class="hbar" style="margin:8px 0 0"><span><i class="dot st"></i>Steel cover</span><div class="track"><div class="fill" style="width:100%;background:var(--steel)"></div></div><span class="v">20 min</span></div>
        </div>
      </div>`,
    sources: '[5] Li et al. 2024 · [6] Fragiadaki et al. 2026 · [51][53] MakeItFrom.com · [57] IDI · [59] Zhang et al. 2025 · [62] epoxy data · [79] Intl. Aluminium Institute',
    script: `When we look beyond strength, each material wins a different test. Fire: steel starts to melt only at about 1430 degrees, but aluminium at about 600 degrees, far below the 800 to 1200 degree flames of a battery fire. In an industry test, a thin aluminium sheet collapsed in 30 seconds, while a steel cover held for 20 minutes. Flame-retardant SMC also performs well here. Heat: the opposite story. Aluminium conducts heat about three times better than steel, which is perfect for cooling plates. Electricity: metals shield electrical noise naturally, while composites are insulators and need added foil. Corrosion: aluminium suffers from road salt and from contact with steel or carbon fibre. Cost: per kilogram, steel is cheapest and carbon fibre is ten times more expensive. Carbon footprint: primary aluminium emits a lot, but recycled aluminium emits about 95% less. Finally, optical properties do not matter for a box nobody sees. So we have a puzzle: no material wins every row. We need a systematic way to rank them.`,
    tip: 'Green = best in the row, red = weakest. → adds the fire-test bars (battery-fire flames 800–1200 °C). Bridge: “So we need a systematic way to rank them.”',
  },
];
