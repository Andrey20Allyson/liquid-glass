/* ================= Utilidades ================= */
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const hasDOM = typeof window !== 'undefined' && typeof document !== 'undefined';

const noMQ = { matches: false, addEventListener() {}, removeEventListener() {} };
const mq = q => (hasDOM && window.matchMedia ? window.matchMedia(q) : noMQ);
export const reduceMotion = mq('(prefers-reduced-motion: reduce)');
const darkMQ = mq('(prefers-color-scheme: dark)');

// theme: 'auto' segue <html data-theme="..."> e, sem ele, o sistema
export function isDark(theme = 'auto') {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  const t = hasDOM && document.documentElement.dataset.theme;
  return t ? t === 'dark' : darkMQ.matches;
}

// Avisa quando o tema muda (sistema ou atributo data-theme no <html>)
const themeFns = new Set();
let themeMO = null;
export function onThemeChange(fn) {
  if (!hasDOM) return () => {};
  if (!themeMO) {
    const fire = () => themeFns.forEach(f => f());
    darkMQ.addEventListener('change', fire);
    themeMO = new MutationObserver(fire);
    themeMO.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  }
  themeFns.add(fn);
  return () => themeFns.delete(fn);
}

// Qualquer cor CSS -> [r, g, b] em 0..1
let colorCtx = null;
export function rgb(color) {
  if (Array.isArray(color)) return color.map(v => (v > 1 ? v / 255 : v));
  if (!colorCtx) colorCtx = document.createElement('canvas').getContext('2d');
  colorCtx.fillStyle = '#000';
  colorCtx.fillStyle = color;
  const s = colorCtx.fillStyle;
  if (s[0] === '#') return [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16) / 255);
  const m = s.match(/[\d.]+/g) || [0, 0, 0];
  return m.slice(0, 3).map(v => +v / 255);
}

export class Spring {
  constructor(x = 0, k = 220, c = 22) { this.x = x; this.t = x; this.v = 0; this.k = k; this.c = c; }
  step(dt) { const a = this.k * (this.t - this.x) - this.c * this.v; this.v += a * dt; this.x += this.v * dt; }
  set(x) { this.x = this.t = x; this.v = 0; }
  get idle() { return Math.abs(this.t - this.x) < 0.01 && Math.abs(this.v) < 0.01; }
}
// Integra várias molas com subpassos fixos (estável mesmo com quedas de frame)
export function stepSprings(list, dt) {
  const n = Math.ceil(dt / (1 / 240));
  const h = dt / n;
  for (let i = 0; i < n; i++) for (const s of list) s.step(h);
}

/* Laço de animação único: só anima o que está visível, e para quando não há nada */
const ticks = new Set();
let raf = 0, last = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!document.hidden) for (const t of ticks) if (t.visible) {
    try { t.fn(dt, now / 1000); } catch (e) { console.error(e); t.visible = false; }
  }
  raf = ticks.size ? requestAnimationFrame(frame) : 0;
}
export function addTick(el, fn) {
  const t = { fn, visible: true };
  let io = null;
  if (el && typeof IntersectionObserver !== 'undefined') {
    t.visible = false;
    io = new IntersectionObserver(es => { t.visible = es[es.length - 1].isIntersecting; }, { rootMargin: '120px' });
    io.observe(el);
  }
  ticks.add(t);
  if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  return () => { ticks.delete(t); if (io) io.disconnect(); };
}

/* Easing de mola para o CSS (linear()), gerado pela mesma física das molas em JS */
export function springEasing(k = 190, c = 15) {
  let x = 0, v = 0;
  const pts = [];
  for (let i = 0; i <= 60; i++) {
    pts.push(+x.toFixed(4));
    for (let j = 0; j < 8; j++) { const a = k * (1 - x) - c * v; v += a / 480; x += v / 480; }
  }
  return `linear(${pts.join(',')})`;
}
