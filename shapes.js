const SD = {
  rect: {
    name: '사각형',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><rect x="5" y="11" width="28" height="16" rx="2"/></svg>`,
    dw: 120, dh: 75,
    render(s) { return `<rect class="shape-main" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="3" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.sw}"/>` },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  rrect: {
    name: '둥근사각',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><rect x="5" y="11" width="28" height="16" rx="8"/></svg>`,
    dw: 120, dh: 75,
    render(s) { const r = Math.min(s.w, s.h) * .22; return `<rect class="shape-main" x="${s.x}" y="${s.y}" width="${s.w}" height="${s.h}" rx="${r}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.sw}"/>` },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  circle: {
    name: '원',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><circle cx="19" cy="19" r="13"/></svg>`,
    dw: 100, dh: 100,
    render(s) { return `<ellipse class="shape-main" cx="${s.x + s.w / 2}" cy="${s.y + s.h / 2}" rx="${s.w / 2}" ry="${s.h / 2}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.sw}"/>` },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  diamond: {
    name: '다이아몬드',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><polygon points="19,4 34,19 19,34 4,19"/></svg>`,
    dw: 110, dh: 80,
    render(s) { const { x, y, w, h, fill, stroke, sw } = s; return `<polygon class="shape-main" points="${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  triangle: {
    name: '삼각형',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><polygon points="19,5 35,33 3,33"/></svg>`,
    dw: 100, dh: 90,
    render(s) { const { x, y, w, h, fill, stroke, sw } = s; return `<polygon class="shape-main" points="${x + w / 2},${y} ${x + w},${y + h} ${x},${y + h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w * .75, y: y + h * .55 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x: x + w * .25, y: y + h * .55 }] }
  },
  hexagon: {
    name: '육각형',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><polygon points="19,3 33,11 33,27 19,35 5,27 5,11"/></svg>`,
    dw: 100, dh: 100,
    render(s) {
      const { x, y, w, h, fill, stroke, sw } = s, cx = x + w / 2, cy = y + h / 2;
      const pts = Array.from({ length: 6 }, (_, i) => { const a = Math.PI / 3 * i - Math.PI / 6; return `${cx + w / 2 * Math.cos(a)},${cy + h / 2 * Math.sin(a)}` });
      return `<polygon class="shape-main" points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'tr', x: x + w, y: y + h * .25 }, { id: 'br', x: x + w, y: y + h * .75 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'bl', x, y: y + h * .75 }, { id: 'tl', x, y: y + h * .25 }] }
  },
  parallelogram: {
    name: '평행사변형',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><polygon points="10,30 16,8 38,8 32,30"/></svg>`,
    dw: 130, dh: 70,
    render(s) { const { x, y, w, h, fill, stroke, sw } = s, o = w * .2; return `<polygon class="shape-main" points="${x + o},${y} ${x + w},${y} ${x + w - o},${y + h} ${x},${y + h}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>` },
    cp(s) { const { x, y, w, h } = s, o = w * .2; return [{ id: 't', x: x + w / 2 + o / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2 - o / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  cylinder: {
    name: '실린더',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><ellipse cx="19" cy="9" rx="13" ry="5"/><line x1="6" y1="9" x2="6" y2="29"/><line x1="32" y1="9" x2="32" y2="29"/><ellipse cx="19" cy="29" rx="13" ry="5"/></svg>`,
    dw: 90, dh: 110,
    render(s) {
      const { x, y, w, h, fill, stroke, sw } = s, ry = h * .14;
      return `<rect x="${x}" y="${y + ry}" width="${w}" height="${h - ry * 2}" fill="${fill}" stroke="none"/>
              <ellipse cx="${x + w / 2}" cy="${y + h - ry}" rx="${w / 2}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
              <ellipse class="shape-main" cx="${x + w / 2}" cy="${y + ry}" rx="${w / 2}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
              <line x1="${x}" y1="${y + ry}" x2="${x}" y2="${y + h - ry}" stroke="${stroke}" stroke-width="${sw}"/>
              <line x1="${x + w}" y1="${y + ry}" x2="${x + w}" y2="${y + h - ry}" stroke="${stroke}" stroke-width="${sw}"/>`;
    },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  star: {
    name: '별',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><polygon points="19,3 22,14 33,14 24,21 27,32 19,25 11,32 14,21 5,14 16,14"/></svg>`,
    dw: 100, dh: 100,
    render(s) {
      const { x, y, w, h, fill, stroke, sw } = s, cx = x + w / 2, cy = y + h / 2, or = Math.min(w, h) / 2, ir = or * .4;
      const pts = Array.from({ length: 10 }, (_, i) => { const a = Math.PI / 5 * i - Math.PI / 2, r = i % 2 ? ir : or; return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}` });
      return `<polygon class="shape-main" points="${pts.join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x, y: y + h / 2 }] }
  },
  doc: {
    name: '문서',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><path d="M6,6 L32,6 L32,28 Q25,22 19,28 Q13,34 6,28 Z"/></svg>`,
    dw: 110, dh: 90,
    render(s) {
      const { x, y, w, h, fill, stroke, sw } = s, wy = y + h * .78;
      return `<path class="shape-main" d="M${x},${y} L${x + w},${y} L${x + w},${wy} Q${x + w * .75},${y + h * .62} ${x + w * .5},${wy} Q${x + w * .25},${y + h * .94} ${x},${wy} Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h * .4 }, { id: 'b', x: x + w / 2, y: y + h * .88 }, { id: 'l', x: x + w, y: y + h * .4 }] }
  },
  db: {
    name: '데이터베이스',
    ico: `<svg width="38" height="38" viewBox="0 0 38 38" fill="none" stroke="#8b949e" stroke-width="2"><ellipse cx="19" cy="10" rx="13" ry="5"/><path d="M6,10 L6,28 Q6,33 19,33 Q32,33 32,28 L32,10"/><ellipse cx="19" cy="19" rx="13" ry="5"/></svg>`,
    dw: 90, dh: 100,
    render(s) {
      const { x, y, w, h, fill, stroke, sw } = s, ry = h * .12;
      return `<path class="shape-main" d="M${x},${y + ry} Q${x},${y + h} ${x + w / 2},${y + h} Q${x + w},${y + h} ${x + w},${y + ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" fill-opacity="1"/>
              <rect x="${x}" y="${y + ry}" width="${w}" height="${h - ry - ry}" fill="${fill}" stroke="none"/>
              <ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>
              <ellipse cx="${x + w / 2}" cy="${y + ry}" rx="${w / 2}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    },
    cp(s) { const { x, y, w, h } = s; return [{ id: 't', x: x + w / 2, y }, { id: 'r', x: x + w, y: y + h / 2 }, { id: 'b', x: x + w / 2, y: y + h }, { id: 'l', x: x + w, y: y + h / 2 }] }
  }
};