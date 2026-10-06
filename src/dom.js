/* ================= Vidro SVG sobre o DOM ================= */
import { clamp, hasDOM, springEasing } from './util.js';
import { params, defaults, resolve } from './params.js';

const SVGNS = 'http://www.w3.org/2000/svg';
// Só o Chromium aplica url() em backdrop-filter; nos outros fica o vidro desfocado
const SVG_OK = hasDOM && /Chrome\/\d+/.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent);
export const supportsRefraction = () => SVG_OK;

const STYLES = `
:where(.lg-glass){position:relative;border-radius:999px;background:var(--lg-fill);
-webkit-backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat));backdrop-filter:blur(var(--lg-blur)) saturate(var(--lg-sat));
box-shadow:inset 0 0 0 1px rgba(255,255,255,var(--lg-hair)),inset var(--lg-sx) var(--lg-sy) 1px -1px rgba(255,255,255,var(--lg-spec)),
inset calc(var(--lg-sx) * -1) calc(var(--lg-sy) * -1) 1px -1px rgba(255,255,255,calc(var(--lg-spec) * .55)),
0 12px 32px -10px rgba(10,14,28,var(--lg-shadow)),0 2px 6px -2px rgba(10,14,28,var(--lg-shadow))}
:where(.lg-glass.lg-refract){-webkit-backdrop-filter:var(--lg-filter) blur(var(--lg-frost)) saturate(var(--lg-sat));backdrop-filter:var(--lg-filter) blur(var(--lg-frost)) saturate(var(--lg-sat))}
:where(.lg-glass)::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;padding:1px;
background:linear-gradient(var(--lg-rim-angle),rgba(255,255,255,.9),rgba(255,255,255,.12) 30%,rgba(255,255,255,0) 50%,rgba(255,255,255,.1) 70%,rgba(255,255,255,.6));
-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;
mask:linear-gradient(#000 0 0) content-box exclude,linear-gradient(#000 0 0);opacity:var(--lg-rim)}
:where(.lg-glass)::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
background:radial-gradient(circle 90px at var(--lg-mx,50%) var(--lg-my,50%),rgba(255,255,255,.5),rgba(255,255,255,0));opacity:0;transition:opacity .45s}
:where(.lg-glass.lg-pressed)::before{opacity:.85;transition-duration:.12s}
:where(.lg-glass.lg-press){transition:scale var(--lg-spring-dur) var(--lg-spring)}
:where(.lg-glass.lg-press.lg-pressed){scale:var(--lg-press-scale)}
@media (prefers-reduced-motion: reduce){:where(.lg-glass.lg-press){transition:none}}`;

const VARS = ['--lg-fill', '--lg-sat', '--lg-frost', '--lg-blur', '--lg-spec', '--lg-hair', '--lg-rim', '--lg-rim-angle', '--lg-sx', '--lg-sy', '--lg-shadow', '--lg-filter', '--lg-press-scale', '--lg-mx', '--lg-my'];
const OPTS = ['lens', 'press', 'rim', 'scale', 'radius', 'fill', 'fallbackBlur'];
const OPT_DEFAULTS = { lens: false, press: false, rim: true, scale: 'auto', radius: null, fill: null, fallbackBlur: 8 };

let cssDone = false;
function injectCSS() {
  if (cssDone) return;
  cssDone = true;
  const lin = window.CSS && CSS.supports && CSS.supports('transition-timing-function', 'linear(0, 1)');
  const st = document.createElement('style');
  st.id = 'liquid-glass-css';
  // antes de tudo e com especificidade zero (:where): o CSS da página sempre vence
  st.textContent = `:root{--lg-spring:${lin ? springEasing() : 'cubic-bezier(.34,1.56,.64,1)'};--lg-spring-dur:${lin ? '1s' : '.6s'}}` + STYLES;
  document.head.prepend(st);
}

let svgDefs = null;
function defs() {
  if (!svgDefs) {
    const svg = document.createElementNS(SVGNS, 'svg');
    svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
    svgDefs = svg.appendChild(document.createElementNS(SVGNS, 'defs'));
    document.body.appendChild(svg);
  }
  return svgDefs;
}

function sdRound(x, y, hw, hh, r) {
  const qx = Math.abs(x) - hw + r, qy = Math.abs(y) - hh + r;
  return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
}
// Mapa de deslocamento: R = deslocamento em x, G = em y, 128 = zero. Mesmo modelo do shader.
function buildMap(w, h, r, bevel, refr, zoom) {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const c = cv.getContext('2d'), img = c.createImageData(w, h), D = img.data;
  const hw = w / 2, hh = h / 2, zk = 1 - 1 / zoom;
  r = Math.min(r, hw, hh);
  const vx = new Float32Array(w * h), vy = new Float32Array(w * h);
  let max = 0.5;
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    const x = i + 0.5 - hw, y = j + 0.5 - hh, d = sdRound(x, y, hw, hh, r);
    let dx = 0, dy = 0;
    if (d < 0) {
      const s = 1 - Math.min(-d / bevel, 1);
      if (s > 0) {
        const gx = sdRound(x + 0.5, y, hw, hh, r) - sdRound(x - 0.5, y, hw, hh, r);
        const gy = sdRound(x, y + 0.5, hw, hh, r) - sdRound(x, y - 0.5, hw, hh, r);
        const gl = Math.hypot(gx, gy) || 1, m = refr * s * s;
        dx = -gx / gl * m; dy = -gy / gl * m;
      }
      dx -= x * zk; dy -= y * zk;
    }
    const k = j * w + i; vx[k] = dx; vy[k] = dy;
    max = Math.max(max, Math.abs(dx), Math.abs(dy));
  }
  for (let k = 0; k < w * h; k++) {
    D[k * 4] = 128 + Math.round(vx[k] / max * 127);
    D[k * 4 + 1] = 128 + Math.round(vy[k] / max * 127);
    D[k * 4 + 2] = 128; D[k * 4 + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  return { url: cv.toDataURL(), scale: max * 255 / 127 };
}
function makeFilter(id) {
  const f = document.createElementNS(SVGNS, 'filter');
  for (const [a, v] of [['id', id], ['x', '0'], ['y', '0'], ['width', '100%'], ['height', '100%'], ['color-interpolation-filters', 'sRGB']]) f.setAttribute(a, v);
  const ch = (m, n) => `<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="d${n}"/><feColorMatrix in="d${n}" type="matrix" values="${m} 0 0 0 1 0" result="${n}"/>`;
  f.innerHTML = '<feImage result="map" x="0" y="0" preserveAspectRatio="none"/>'
    + ch('1 0 0 0 0 0 0 0 0 0 0 0 0 0 0', 'r') + ch('0 0 0 0 0 0 1 0 0 0 0 0 0 0 0', 'g') + ch('0 0 0 0 0 0 0 0 0 0 0 0 1 0 0', 'b')
    + '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/>';
  defs().appendChild(f);
  return f;
}

/* Fila de mapas: no máximo ~10 ms de trabalho por quadro */
const instances = new Map();
const queue = new Set();
let qRaf = 0, filterSeq = 0, ro = null;
function schedule(g) {
  queue.add(g);
  if (!qRaf) qRaf = requestAnimationFrame(flush);
}
function flush() {
  qRaf = 0;
  const t0 = performance.now();
  for (const g of queue) {
    queue.delete(g); g._map();
    if (performance.now() - t0 > 10) break;
  }
  if (queue.size) qRaf = requestAnimationFrame(flush);
}

class Glass {
  constructor(el, options) {
    this.element = el;
    this.id = 'lg-f' + (++filterSeq);
    this.key = '';
    this.params = null;
    this.opts = Object.assign({}, OPT_DEFAULTS);
    el.classList.add('lg-glass');
    if (SVG_OK) {
      this.filter = makeFilter(this.id);
      if (!ro) ro = new ResizeObserver(es => es.forEach(e => { const g = instances.get(e.target); if (g) schedule(g); }));
      ro.observe(el);
    }
    this.set(options);
  }

  // Atualiza parâmetros e opções. Parâmetros se acumulam: set({ frost: 6 }) mantém o resto.
  set(options = {}) {
    if (typeof options === 'string') options = { preset: options };
    this.params = resolve(this.params || defaults, options);
    for (const k of OPTS) if (k in options) this.opts[k] = options[k];
    if (options.zoom != null && options.lens == null) this.opts.lens = true;
    this._apply();
    return this;
  }
  // Força um mapa novo (o tamanho já é observado sozinho)
  refresh() { this.key = ''; if (SVG_OK) schedule(this); return this; }

  _apply() {
    const el = this.element, s = el.style, p = this.params, o = this.opts;
    const tn = p.tint / 100;
    const la = p.light * Math.PI / 180, lx = Math.cos(la), ly = -Math.sin(la);
    const vars = {
      '--lg-fill': o.fill || (tn >= 0 ? `rgba(255,255,255,${+(tn * 0.5).toFixed(3)})` : `rgba(5,5,13,${+(-tn).toFixed(3)})`),
      '--lg-sat': p.saturation,
      '--lg-frost': p.frost + 'px',
      '--lg-blur': Math.max(p.frost, o.fallbackBlur) + 'px',
      '--lg-spec': p.specular,
      '--lg-hair': +(0.16 * p.specular).toFixed(3),
      '--lg-rim': o.rim ? p.specular : 0,
      '--lg-rim-angle': (270 - p.light) + 'deg',
      '--lg-sx': +(-lx * 2.26).toFixed(2) + 'px',
      '--lg-sy': +(-ly * 2.26).toFixed(2) + 'px',
      '--lg-shadow': +(p.shadow * 0.75).toFixed(3),
    };
    for (const k in vars) s.setProperty(k, vars[k]);
    if (o.radius != null) { s.borderRadius = typeof o.radius === 'number' ? o.radius + 'px' : o.radius; this._radius = true; }
    else if (this._radius) { s.borderRadius = ''; this._radius = false; }
    this._press(o.press);
    if (SVG_OK) schedule(this);
  }

  _press(v) {
    const el = this.element;
    if (v && !this._pdown) {
      this._pdown = e => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--lg-mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--lg-my', (e.clientY - r.top) + 'px');
        el.classList.add('lg-pressed');
      };
      this._pup = () => el.classList.remove('lg-pressed');
      el.addEventListener('pointerdown', this._pdown);
      for (const t of ['pointerup', 'pointerleave', 'pointercancel']) el.addEventListener(t, this._pup);
    } else if (!v && this._pdown) {
      el.removeEventListener('pointerdown', this._pdown);
      for (const t of ['pointerup', 'pointerleave', 'pointercancel']) el.removeEventListener(t, this._pup);
      this._pdown = this._pup = null;
      el.classList.remove('lg-pressed');
    }
    el.classList.toggle('lg-press', !!v);
    el.style.setProperty('--lg-press-scale', typeof v === 'number' ? v : 1.08);
  }

  _map() {
    const el = this.element;
    if (!this.filter || !el.isConnected) return;
    const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
    if (!w || !h) return;
    const rs = getComputedStyle(el).borderTopLeftRadius;
    const r = Math.min(parseFloat(rs) * (rs.endsWith('%') ? Math.min(w, h) / 100 : 1) || 0, w / 2, h / 2);
    const p = this.params, o = this.opts;
    // refração e bisel crescem com o tamanho: um botão de 44 px usa ~40% do que uma lente de 116 px usa
    const k = o.scale === 'auto' || o.scale == null ? clamp(Math.min(w, h) / 116, 0.25, 1) : +o.scale;
    const refr = p.refraction * k, bevel = Math.max(p.bevel * k, 1), zoom = o.lens ? p.zoom : 1;
    const key = [w, h, r, refr, bevel, zoom, p.dispersion].join();
    if (key === this.key) return;
    this.key = key;
    const { url, scale } = buildMap(w, h, r, bevel, refr, zoom);
    const fe = this.filter.querySelector('feImage');
    fe.setAttribute('href', url); fe.setAttribute('width', w); fe.setAttribute('height', h);
    const sp = p.dispersion * 0.1, dm = this.filter.querySelectorAll('feDisplacementMap');
    dm[0].setAttribute('scale', (scale * (1 + sp)).toFixed(2));
    dm[1].setAttribute('scale', scale.toFixed(2));
    dm[2].setAttribute('scale', (scale * (1 - sp)).toFixed(2));
    el.style.setProperty('--lg-filter', `url(#${this.id})`);
    el.classList.add('lg-refract');
  }

  destroy() {
    const el = this.element;
    instances.delete(el); queue.delete(this);
    if (ro) ro.unobserve(el);
    if (this.filter) this.filter.remove();
    this._press(false);
    el.classList.remove('lg-glass', 'lg-refract', 'lg-press');
    VARS.forEach(v => el.style.removeProperty(v));
    if (this._radius) el.style.borderRadius = '';
  }
}

// Transforma um elemento em vidro. Chamar de novo no mesmo elemento atualiza.
export function glass(target, options) {
  if (!hasDOM) return null;
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) throw new Error(`LiquidGlass: elemento não encontrado (${target})`);
  injectCSS();
  const g = instances.get(el);
  if (g) return options ? g.set(options) : g;
  const n = new Glass(el, options || {});
  instances.set(el, n);
  return n;
}
export function glassAll(targets, options) {
  const list = typeof targets === 'string' ? document.querySelectorAll(targets) : targets;
  return Array.from(list, el => glass(el, options));
}

/* ---------- Modo declarativo: <div data-liquid-glass="drop" data-frost="6"> ---------- */
const ATTR = 'data-liquid-glass';
const DATA_ATTRS = [ATTR, ...[...Object.keys(params), ...OPTS].map(k => 'data-' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()))];
function fromData(el) {
  const d = el.dataset, o = {};
  if (d.liquidGlass) o.preset = d.liquidGlass;
  for (const k in params) if (d[k] != null && d[k] !== '') o[k] = +d[k];
  const bool = v => v !== 'false';
  if (d.lens != null) o.lens = bool(d.lens);
  if (d.rim != null) o.rim = bool(d.rim);
  if (d.press != null) o.press = d.press === '' || d.press === 'true' ? true : d.press === 'false' ? false : +d.press;
  if (d.radius != null) o.radius = isNaN(+d.radius) ? d.radius : +d.radius;
  if (d.scale != null) o.scale = d.scale === 'auto' ? 'auto' : +d.scale;
  if (d.fill) o.fill = d.fill;
  if (d.fallbackBlur != null) o.fallbackBlur = +d.fallbackBlur;
  return o;
}
function autoOne(el) {
  const old = instances.get(el);
  if (old && old._auto) { old.params = null; old.opts = Object.assign({}, OPT_DEFAULTS); return old.set(fromData(el)); }
  const g = glass(el, fromData(el));
  g._auto = true;
  return g;
}
export function auto(root = document) {
  if (!hasDOM) return [];
  const els = Array.from(root.querySelectorAll(`[${ATTR}]`));
  if (root.matches && root.matches(`[${ATTR}]`)) els.unshift(root);
  return els.map(autoOne);
}

let mo = null;
function startAuto() {
  auto();
  if (mo || typeof MutationObserver === 'undefined') return;
  mo = new MutationObserver(records => {
    let removed = false;
    for (const r of records) {
      if (r.type === 'attributes') {
        const el = r.target;
        if (el.hasAttribute(ATTR)) autoOne(el);
        else { const g = instances.get(el); if (g && g._auto) g.destroy(); }
      } else {
        for (const n of r.addedNodes) if (n.nodeType === 1) auto(n);
        if (r.removedNodes.length) removed = true;
      }
    }
    if (removed) instances.forEach(g => { if (g._auto && !g.element.isConnected) g.destroy(); });
  });
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: DATA_ATTRS });
}
export function stopAuto() { if (mo) { mo.disconnect(); mo = null; } }

if (hasDOM) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startAuto, { once: true });
  else startAuto();
}
