/* ================= Fundos prontos (canvas 2D) =================
   Cada fábrica devolve uma função (ctx, w, h, info) para a opção `background` do palco.
   ctx já vem em px CSS; info = { dark, dpr, time, stage, resize(altura) }. */

const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
function spacing(c, px) { try { c.letterSpacing = px + 'px'; } catch (e) { /* sem suporte */ } }
function wrapLines(c, text, maxW) {
  const out = []; let line = '';
  for (const word of text.split(' ')) {
    const t = line ? line + ' ' + word : word;
    if (c.measureText(t).width > maxW && line) { out.push(line); line = word; } else line = t;
  }
  if (line) out.push(line);
  return out;
}
function rrect(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
function gridLines(c, w, h, step, dark) {
  const fg = dark ? '255,255,255' : '16,18,28';
  c.strokeStyle = `rgba(${fg},${dark ? 0.09 : 0.11})`; c.lineWidth = 1; c.beginPath();
  for (let x = (w % step) / 2; x < w; x += step) { c.moveTo(Math.round(x) + 0.5, 0); c.lineTo(Math.round(x) + 0.5, h); }
  for (let y = (h % step) / 2; y < h; y += step) { c.moveTo(0, Math.round(y) + 0.5); c.lineTo(w, Math.round(y) + 0.5); }
  c.stroke();
}

export const scenes = {
  // Grade fina sobre o gradiente animado
  grid({ step = 44 } = {}) {
    return (c, w, h, { dark }) => gridLines(c, w, h, step, dark);
  },

  // Título grande (o herói do Lab), sobre a grade
  title({ text = 'Liquid Glass', subtitle = '', font = SANS, grid = true } = {}) {
    return (c, w, h, { dark }) => {
      const fg = dark ? '255,255,255' : '16,18,28';
      if (grid) gridLines(c, w, h, 44, dark);
      const x0 = Math.max(20, w * 0.06);
      const words = text.split(' ');
      const two = w < 760 && words.length > 1;
      const lines = two ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [text];
      c.font = `800 100px ${font}`; spacing(c, -4);
      const widest = Math.max(...lines.map(t => c.measureText(t).width));
      const size = Math.min(100 * (w - x0 * 2) / widest, two ? h * 0.26 : h * 0.3);
      c.font = `800 ${size}px ${font}`; spacing(c, -size * 0.04);
      c.fillStyle = `rgb(${fg})`;
      const lh = size * 0.9;
      const top = h * 0.5 - (lines.length * lh) / 2 + size * 0.72;
      lines.forEach((t, i) => c.fillText(t, x0, top + i * lh));
      spacing(c, 0);
      if (subtitle) {
        const base = top + (lines.length - 1) * lh;
        c.font = `500 ${w < 520 ? 15 : 19}px ${font}`;
        c.fillStyle = `rgba(${fg},.78)`;
        wrapLines(c, subtitle, w - x0 * 2).forEach((t, i) => c.fillText(t, x0 + 4, base + size * 0.36 + 8 + i * 24));
      }
    };
  },

  // Listras diagonais, xadrez e círculos: mostra bem a refração e a dispersão
  stripes({ colors = ['#ff3b5c', '#ffb020', '#2ad17f', '#1fa2ff', '#7b5cff'], width = 22 } = {}) {
    return (c, w, h, { dark }) => {
      const bg = dark ? '#0c0e18' : '#f6f2ea';
      c.fillStyle = bg; c.fillRect(0, 0, w, h);
      c.save(); c.translate(w / 2, h / 2); c.rotate(-Math.PI / 4);
      const L = Math.hypot(w, h);
      for (let i = Math.floor(-L / width / 2); i < L / width / 2; i++) {
        if (i % 2 === 0) continue;
        c.fillStyle = colors[((i % colors.length) + colors.length) % colors.length]; c.fillRect(i * width, -L / 2, width, L);
      }
      c.restore();
      const cs = 18, bandY = Math.round(h * 0.62);
      for (let x = 0; x < w; x += cs) for (let k = 0; k < 4; k++) {
        c.fillStyle = ((x / cs + k) % 2) ? bg : (dark ? '#fff' : '#111');
        c.fillRect(x, bandY + k * cs, cs, cs);
      }
      c.lineWidth = 6;
      for (let r = 20; r < 170; r += 18) { c.strokeStyle = r % 36 ? (dark ? '#fff' : '#111') : colors[0]; c.beginPath(); c.arc(w * 0.22, h * 0.3, r, 0, 7); c.stroke(); }
    };
  },

  // Pôr do sol com montanhas e lago
  landscape() {
    return (c, w, h, { dark }) => {
      const sky = c.createLinearGradient(0, 0, 0, h * 0.7);
      if (dark) { sky.addColorStop(0, '#0b1033'); sky.addColorStop(0.55, '#5a2a7a'); sky.addColorStop(1, '#ff7a45'); }
      else { sky.addColorStop(0, '#5fb3ff'); sky.addColorStop(0.6, '#ffc3a0'); sky.addColorStop(1, '#ffe0b0'); }
      c.fillStyle = sky; c.fillRect(0, 0, w, h);
      const sx = w * 0.68, sy = h * 0.5;
      const glow = c.createRadialGradient(sx, sy, 0, sx, sy, h * 0.5);
      glow.addColorStop(0, 'rgba(255,220,150,.9)'); glow.addColorStop(1, 'rgba(255,220,150,0)');
      c.fillStyle = glow; c.fillRect(0, 0, w, h);
      c.fillStyle = '#fff3d6'; c.beginPath(); c.arc(sx, sy, Math.min(w, h) * 0.08, 0, 7); c.fill();
      const layers = dark ? ['#3b2a63', '#2a1f4d', '#1b1538', '#0f0c24'] : ['#b9a3d9', '#8f7bc2', '#5f4f9a', '#3a2f6e'];
      layers.forEach((col, k) => {
        const base = h * (0.52 + k * 0.07);
        c.fillStyle = col; c.beginPath(); c.moveTo(0, h);
        for (let x = 0; x <= w + 8; x += 8) {
          const y = base - (Math.sin(x * 0.006 + k * 2.1) * 40 + Math.sin(x * 0.017 + k) * 18 + Math.sin(x * 0.041 + k * 3) * 6) * (1 - k * 0.12);
          c.lineTo(x, y);
        }
        c.lineTo(w, h); c.closePath(); c.fill();
      });
      const lakeY = h * 0.8;
      c.fillStyle = dark ? '#0d0a20' : '#2f2763'; c.fillRect(0, lakeY, w, h - lakeY);
      for (let y = lakeY + 4, i = 0; y < h; y += 7, i++) {
        const half = (w * 0.05 + i * 3) * (0.6 + 0.4 * Math.sin(i * 1.7));
        c.fillStyle = `rgba(255,214,150,${0.75 - i * 0.03})`; c.fillRect(sx - half, y, half * 2, 2.5);
      }
    };
  },

  // Galeria de capas mais alta que o palco: combine com scrollSpeed para rolar em laço
  gallery({ titles = ['Maré Alta', 'Vidro Azul', 'Neon 84', 'Cítrico', 'Lua Cheia', 'Areia Quente', 'Prisma', 'Cobalto', 'Sol de Meio-dia', 'Aurora', 'Ondas', 'Noturno'],
    artists = ['Lagoa Azul', 'Cobalto', 'Os Prismas', 'Sal & Sol', 'Noturno', 'Duna'], font = SANS } = {}) {
    const pairs = [['#ff5f6d', '#ffc371'], ['#4facfe', '#00f2fe'], ['#7f00ff', '#e100ff'], ['#11998e', '#38ef7d'], ['#232526', '#606c88'], ['#f83600', '#f9d423'], ['#fc466b', '#3f5efb'], ['#00c6ff', '#0072ff'], ['#f7971e', '#ffd200'], ['#8e2de2', '#4a00e0']];
    return (c, w, h, { dark, resize }) => {
      const pad = 14, gap = 14, cols = w < 520 ? 2 : w < 860 ? 3 : 4;
      const tw = (w - pad * 2 - gap * (cols - 1)) / cols, th = tw + 40, pitch = th + gap;
      const rows = Math.ceil(h / pitch) + 1, H = rows * pitch;
      c = resize(H);
      c.fillStyle = dark ? '#0b0c11' : '#f2f3f7'; c.fillRect(0, 0, w, H);
      let i = 0;
      for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++, i++) {
        const x = pad + k * (tw + gap), y = r * pitch + gap / 2;
        const [a, b] = pairs[(i * 7) % pairs.length];
        const g = c.createLinearGradient(x, y, x + tw, y + tw); g.addColorStop(0, a); g.addColorStop(1, b);
        c.save(); rrect(c, x, y, tw, tw, 14); c.fillStyle = g; c.fill(); c.clip();
        c.fillStyle = 'rgba(255,255,255,.3)'; c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 5;
        switch (i % 5) {
          case 0: c.beginPath(); c.arc(x + tw * 0.68, y + tw * 0.32, tw * 0.16, 0, 7); c.fillStyle = 'rgba(255,255,255,.75)'; c.fill(); break;
          case 1: for (let s = 0; s < tw; s += 16) c.fillRect(x, y + s, tw, 6); break;
          case 2: for (let s = tw * 0.1; s < tw * 0.6; s += 14) { c.beginPath(); c.arc(x + tw / 2, y + tw / 2, s, 0, 7); c.stroke(); } break;
          case 3: c.beginPath(); c.moveTo(x, y + tw); c.lineTo(x + tw * 0.4, y + tw * 0.45); c.lineTo(x + tw * 0.7, y + tw * 0.75); c.lineTo(x + tw, y + tw * 0.5); c.lineTo(x + tw, y + tw); c.fill(); break;
          default: for (let yy = 12; yy < tw; yy += 18) for (let xx = 12; xx < tw; xx += 18) { c.beginPath(); c.arc(x + xx, y + yy, 3, 0, 7); c.fill(); }
        }
        c.restore();
        c.fillStyle = dark ? '#f1f2f6' : '#14151a'; c.font = `600 13.5px ${font}`;
        c.fillText(titles[i % titles.length], x + 2, y + tw + 19);
        c.fillStyle = dark ? '#8d92a0' : '#6b7080'; c.font = `400 12.5px ${font}`;
        c.fillText(artists[i % artists.length], x + 2, y + tw + 35);
      }
      return H;
    };
  },
};

// Passada sem parênteses (background: scenes.stripes), a fábrica recebe o ctx no lugar das opções
for (const k of Object.keys(scenes)) {
  const make = scenes[k];
  scenes[k] = o => make(o && typeof o.fillRect === 'function' ? undefined : o);
}
