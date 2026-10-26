/** [7][8] style citation marks, the numbers match the References list of the research report */
export const r = (...n) => `<span class="ref">${n.map((x) => `[${x}]`).join('')}</span>`;

/** table helper: head = ['A', 'B'], rows = [['x', 'y']]; a cell may be {t, c, s}: class c (best / worst / num), s = step it appears on */
export function tbl(head, rows, { cls = '', rowAttr = () => '' } = {}) {
  const cell = (c, tag = 'td') => (typeof c === 'object' ? `<${tag} class="${c.c || ''}"${c.s != null ? ` data-s="${c.s}"` : ''}>${c.t}</${tag}>` : `<${tag}>${c}</${tag}>`);
  return `<table class="tbl ${cls}"><thead><tr>${head.map((h) => cell(h, 'th')).join('')}</tr></thead><tbody>${rows
    .map((row) => `<tr ${rowAttr(row)}>${row.map((c) => cell(c)).join('')}</tr>`)
    .join('')}</tbody></table>`;
}

/** the 3D slot; the note is the accuracy caption required by the plan */
export const slot = (note, style = '', cls = '') =>
  `<div class="stage3d ${cls}" style="${style}">${note ? `<div class="note3d">${note}</div>` : ''}<div class="replay3d">R = replay step · drag = orbit</div></div>`;

export const meta = {
  author: 'Nguyen Ngoc Nhat',
  course: 'Materials Selection',
  date: 'Oct 26, 2026',
};
