import a from './slides-a.js';
import b from './slides-b.js';

// Divider before the first slide of each numbered part (1-6): what the part covers, in one spoken line.
const INTRO = {
  1: 'what the enclosure is, where it came from, and why the market needs it',
  2: 'the jobs the box must do, and the rules and properties that limit the material',
  3: 'how I rank the candidate materials, from a quick screen to published studies',
  4: 'how the parts fit together, and how the layout answers a crash and a fire',
  5: 'how the enclosure is made, and the trade-offs of each route',
  6: 'what I conclude, and what is still open',
};
const divider = (part) => {
  const [n, name] = part.split(' · ');
  return {
    part, layout: 'section', sec: 5, scene: null, short: `Part ${n}`, title: name,
    html: `<div class="sec"><div class="k">Part ${n}</div><h1>${name}</h1></div>`,
    script: `Part ${n}: ${name}. Here I cover ${INTRO[n]}.`,
  };
};
const thanks = {
  part: '6 · Conclusion', layout: 'section', sec: 10, scene: null, short: 'Thank you', title: 'Thank you',
  html: `<div class="sec"><h1>Thank you</h1><p>Questions &amp; discussion</p></div>`,
  script: 'Thank you for your attention. I am happy to take your questions.',
};

export const slides = [];
let last = '';
for (const s of [...a, ...b]) {
  if (s.part !== last && /^[1-6] · /.test(s.part)) slides.push(divider(s.part));
  last = s.part;
  slides.push(s);
  if (s.short === 'References') slides.push(thanks);
}
