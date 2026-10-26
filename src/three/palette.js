// One palette for 3D and 2D (plan rule 2): the viewer reads the material from the colour on every slide.
export const C = {
  aluminium: 0x3b82f6,
  steel: 0x22c55e,
  smc: 0x3f5b78,
  barrier: 0xf472b6,
  danger: 0xef4444,
  cells: 0xdfe3e8,
  seal: 0x2a2c31,
  shield: 0x9aa4af,
  vent: 0xb4bbc4,
  coolant: 0x7dd3fc,
  magnesium: 0xa78bfa,
  cfrp: 0x1f2937,
  hot: 0xff7a1a,
  warn: 0xfbbf24,
};

export const hex = (n) => '#' + n.toString(16).padStart(6, '0');
