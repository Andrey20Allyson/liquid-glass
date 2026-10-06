/* ================= Palco WebGL ================= */
import { clamp, hasDOM, reduceMotion, isDark, onThemeChange, rgb, Spring, stepSprings, addTick } from './util.js';
import { defaults, palettes, resolve } from './params.js';
import SCENE from './shaders/scene.glsl';
import BLUR from './shaders/blur.glsl';
import GLASS from './shaders/glass.glsl';

const VS = 'attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
const PREC = '#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
const CTX_OPTS = { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false };

const isPct = v => typeof v === 'string' && v.trim().endsWith('%');
const coord = (v, total) => (isPct(v) ? parseFloat(v) / 100 * total : +v);

let webglOK = null;
export function supportsWebGL() {
  if (webglOK !== null) return webglOK;
  webglOK = false;
  if (!hasDOM) return webglOK;
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    webglOK = !!gl;
    const ext = gl && gl.getExtension('WEBGL_lose_context');
    if (ext) ext.loseContext();
  } catch (e) { /* sem WebGL */ }
  return webglOK;
}

// Prepara o canvas 2D do conteúdo (em px CSS, já com o dpr aplicado)
function prep(cv, w, h, dpr) {
  const W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
  const resized = cv.width !== W || cv.height !== H;
  if (resized) { cv.width = W; cv.height = H; }
  const c = cv.getContext('2d');
  if (!resized) { if (c.reset) c.reset(); else cv.width = W; }
  c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
  return c;
}
function drawFit(c, src, w, h, fit) {
  const sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
  if (!sw || !sh) return;
  if (fit === 'fill') { c.drawImage(src, 0, 0, w, h); return; }
  const k = (fit === 'contain' ? Math.min : Math.max)(w / sw, h / sh);
  c.drawImage(src, (w - sw * k) / 2, (h - sh * k) / 2, sw * k, sh * k);
}

/* ---------- Forma de vidro (retângulo arredondado com molas) ---------- */
class Shape {
  constructor(stage, o) {
    this.stage = stage;
    const k = o.stiffness || 190, c = o.damping || 19;
    this._x = new Spring(0, k, c); this._y = new Spring(0, k, c);
    this._w = new Spring(0, k + 10, c - 2); this._h = new Spring(0, k + 10, c - 2);
    this._p = new Spring(1, 320, 17);
    this.springs = [this._x, this._y, this._w, this._h, this._p];
    this.radius = null; this.zoom = null; this.lens = false; this.visible = true; this.draggable = false; this.label = '';
    this.homeX = 0; this.homeY = 0; this._sx = this._sy = null;
    this.phase = stage.shapes.length * 2.1;
    this.drag = null; this.el = null; this._ew = this._eh = 0;
    const w = o.width != null ? o.width : 120;
    this.set(Object.assign({ x: '50%', y: '50%', width: w, height: w }, o), true);
  }
  get x() { return this._x.x; }
  get y() { return this._y.x; }
  get width() { return this._w.x; }
  get height() { return this._h.x; }
  get dragging() { return !!this.drag; }

  // Muda propriedades. Sem `immediate`, posição e tamanho andam com mola.
  set(o = {}, immediate = false) {
    const st = this.stage;
    if (o.x != null) { this._sx = isPct(o.x) ? o.x : null; this.homeX = coord(o.x, st.w); this._x.t = this.homeX; if (immediate) this._x.set(this.homeX); }
    if (o.y != null) { this._sy = isPct(o.y) ? o.y : null; this.homeY = coord(o.y, st.h); this._y.t = this.homeY; if (immediate) this._y.set(this.homeY); }
    if (o.width != null) { this._w.t = +o.width; if (immediate) this._w.set(+o.width); }
    if (o.height != null) { this._h.t = +o.height; if (immediate) this._h.set(+o.height); }
    if ('radius' in o) this.radius = o.radius == null ? null : +o.radius;
    if ('zoom' in o) this.zoom = o.zoom == null ? null : +o.zoom;
    if ('lens' in o) this.lens = !!o.lens;
    if ('visible' in o) { this.visible = o.visible !== false; if (this.el) this.el.hidden = !this.visible; }
    if ('label' in o) { this.label = o.label || ''; this._aria(); }
    if ('draggable' in o) { this.draggable = !!o.draggable; if (this.draggable) { if (!this.el) this._attach(); } else this._detach(); }
    return this;
  }
  moveTo(x, y, immediate) { return this.set({ x, y }, immediate); }
  resize(width, height, immediate) { return this.set({ width, height: height == null ? width : height }, immediate); }
  remove() { this.stage.remove(this); }

  _layout(first) {
    const st = this.stage;
    this.homeX = this._sx != null ? coord(this._sx, st.w) : clamp(this.homeX, 0, st.w);
    this.homeY = this._sy != null ? coord(this._sy, st.h) : clamp(this.homeY, 0, st.h);
    if (first) { this._x.set(this.homeX); this._y.set(this.homeY); }
  }
  _aria() {
    if (this.el) this.el.setAttribute('aria-label', (this.label ? this.label + '. ' : '') + 'Arraste ou use as setas para mover.');
  }
  // Alça DOM transparente por cima da forma: mouse, toque e teclado
  _attach() {
    const st = this.stage, el = this.el = document.createElement('div');
    el.className = 'lg-handle'; el.tabIndex = 0; el.setAttribute('role', 'img'); el.hidden = !this.visible;
    el.style.cssText = 'position:absolute;left:0;top:0;pointer-events:auto;touch-action:none;cursor:grab;border-radius:999px;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent';
    this._aria();
    st._overlay().appendChild(el);
    const local = e => { const r = st.canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    el.addEventListener('pointerdown', e => {
      el.setPointerCapture(e.pointerId);
      const [px, py] = local(e);
      this.drag = { ox: px - this._x.x, oy: py - this._y.x, id: e.pointerId };
      this._p.t = 1.08; el.style.cursor = 'grabbing'; st.glowAt(px, py);
      st._emit('dragstart', this, e);
    });
    el.addEventListener('pointermove', e => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const [px, py] = local(e);
      this._sx = this._sy = null;
      this.homeX = this._x.t = clamp(px - this.drag.ox, 0, st.w);
      this.homeY = this._y.t = clamp(py - this.drag.oy, 0, st.h);
      st.glowAt(px, py);
      st._emit('drag', this, e);
    });
    const end = e => {
      if (!this.drag) return;
      this.drag = null; this._p.t = 1; el.style.cursor = 'grab'; st.glowOff();
      st._emit('dragend', this, e);
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('keydown', e => {
      const s = e.shiftKey ? 48 : 16;
      const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
      if (!d) return;
      e.preventDefault();
      this._sx = this._sy = null;
      this.homeX = clamp(this.homeX + d[0], 0, st.w); this.homeY = clamp(this.homeY + d[1], 0, st.h);
      st._emit('drag', this, e);
    });
  }
  _detach() { if (this.el) { this.el.remove(); this.el = null; this._ew = this._eh = 0; } this.drag = null; }
}

/* ---------- Palco ---------- */
export class Stage {
  constructor(target, options = {}) {
    if (!hasDOM) throw new Error('LiquidGlass: createStage precisa de um navegador');
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target) throw new Error('LiquidGlass: elemento do palco não encontrado');
    let canvas = target;
    if (!(target instanceof HTMLCanvasElement)) {
      canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:100%;height:100%';
      target.appendChild(canvas);
      this._ownCanvas = true;
    }
    const o = this.options = options;
    this.canvas = canvas;
    this.params = resolve(defaults, o);
    this.theme = o.theme || 'auto';
    this.maxShapes = clamp(Math.round(o.maxShapes || 8), 1, 16);
    this.scale = o.scale || 1;
    this.drift = !!o.drift;
    this.stretch = o.stretch !== false;
    this.scrollSpeed = o.scrollSpeed || 0;
    this.gradient = o.gradient != null ? o.gradient : !o.background;
    this.fit = o.fit || 'cover';
    this.live = !!o.live;
    this.shapes = [];
    this.w = this.h = 0; this.dpr = 1; this.time = 0; this.scroll = 0; this.cScale = 1; this._laid = false;
    this.glow = { x: 0, y: 0, s: new Spring(0, 160, 24), r: 70 };
    this._ua = new Float32Array(this.maxShapes * 4); this._ub = new Float32Array(this.maxShapes * 2);
    this._events = {};
    this.c2d = document.createElement('canvas');
    this._initGL();
    this._lost = e => { e.preventDefault(); this._ok = false; };
    this._restored = () => { this._initGL(); this.w = 0; this.resize(); };
    canvas.addEventListener('webglcontextlost', this._lost);
    canvas.addEventListener('webglcontextrestored', this._restored);
    this.setBackground(o.background != null ? o.background : null);
    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(canvas);
    this._offTheme = onThemeChange(() => this.redraw());
    if (o.autoRender !== false) this._stopTick = addTick(canvas, (dt, t) => this.step(dt, t));
    this.resize();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (!this.destroyed) this.redraw(); });
    (o.shapes || []).forEach(s => this.add(s));
  }

  _initGL() {
    const c = this.canvas;
    const gl = this.gl = this.gl || c.getContext('webgl2', CTX_OPTS) || c.getContext('webgl', CTX_OPTS) || c.getContext('experimental-webgl', CTX_OPTS);
    if (!gl) throw new Error('LiquidGlass: WebGL indisponível');
    this.pScene = this._prog(SCENE); this.pBlur = this._prog(BLUR);
    this.pGlass = this._prog('#define MAXS ' + this.maxShapes + '\n' + GLASS);
    const b = this._buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.content = this._tex();
    this.rtScene = this.rtA = this.rtB = null;
    this._ok = true;
  }
  _prog(fs) {
    const gl = this.gl;
    const sh = (type, src) => {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, PREC + fs));
    gl.bindAttribLocation(p, 0, 'a'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {};
    for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) {
      const info = gl.getActiveUniform(p, i);
      u[info.name.replace(/\[0\]$/, '')] = gl.getUniformLocation(p, info.name);
    }
    return { p, u };
  }
  _tex() {
    const gl = this.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  _target(w, h, old) {
    const gl = this.gl;
    if (old) { gl.deleteTexture(old.t); gl.deleteFramebuffer(old.f); }
    const t = this._tex();
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const f = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { t, f, w, h };
  }

  /* ----- API pública ----- */
  set(input) { Object.assign(this.params, resolve(this.params, input)); return this; }
  preset(name) { return this.set({ preset: name }); }
  setTheme(theme) { this.theme = theme || 'auto'; this.redraw(); return this; }

  add(o = {}) {
    if (this.shapes.length >= this.maxShapes) console.warn(`LiquidGlass: o palco desenha no máximo ${this.maxShapes} formas (opção maxShapes, até 16)`);
    const s = new Shape(this, o);
    this.shapes.push(s);
    return s;
  }
  remove(shape) {
    const i = this.shapes.indexOf(shape);
    if (i >= 0) { this.shapes.splice(i, 1); shape._detach(); }
    return this;
  }
  clear() { this.shapes.slice().forEach(s => this.remove(s)); return this; }

  // Fundo: imagem, vídeo, canvas, ImageBitmap, URL ou função (ctx, w, h, info) => altura?
  setBackground(bg) {
    this._bgFn = null; this._video = false; this._warned = false;
    if (typeof bg === 'string') { const img = new Image(); img.crossOrigin = 'anonymous'; img.src = bg; bg = img; }
    this._bg = bg;
    if (typeof HTMLImageElement !== 'undefined' && bg instanceof HTMLImageElement && !(bg.complete && bg.naturalWidth)) {
      bg.addEventListener('load', () => { if (this._bg === bg) this.redraw(); }, { once: true });
      bg.addEventListener('error', () => console.warn('LiquidGlass: não foi possível carregar o fundo', bg.src), { once: true });
    }
    if (typeof HTMLVideoElement !== 'undefined' && bg instanceof HTMLVideoElement) this._video = true;
    if (this.w) this.redraw();
    return this;
  }

  glowAt(x, y) { this.glow.x = x; this.glow.y = y; this.glow.s.t = 1; return this; }
  glowOff() { this.glow.s.t = 0; return this; }

  on(type, fn) { (this._events[type] = this._events[type] || new Set()).add(fn); return this; }
  off(type, fn) { if (this._events[type]) this._events[type].delete(fn); return this; }
  _emit(type, ...a) { if (this._events[type]) this._events[type].forEach(f => f(...a)); }

  _overlay() {
    if (this._ov) return this._ov;
    const parent = this.canvas.parentElement;
    if (getComputedStyle(parent).position === 'static') parent.style.position = 'relative';
    const ov = this._ov = document.createElement('div');
    ov.className = 'lg-handles';
    ov.style.cssText = 'position:absolute;pointer-events:none;overflow:hidden';
    this.canvas.after(ov);
    this._placeOverlay();
    return ov;
  }
  _placeOverlay() {
    const ov = this._ov, c = this.canvas;
    if (ov) Object.assign(ov.style, { left: c.offsetLeft + 'px', top: c.offsetTop + 'px', width: c.offsetWidth + 'px', height: c.offsetHeight + 'px' });
  }

  resize() {
    if (!this._ok || this.destroyed) return false;
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    const max = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
    const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr || 2, max / w, max / (h * 2.5));
    if (w === this.w && h === this.h && dpr === this.dpr) return false;
    this.w = w; this.h = h; this.dpr = dpr;
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    this.canvas.width = W; this.canvas.height = H;
    this.rtScene = this._target(W, H, this.rtScene);
    this.rtA = this._target(Math.max(1, W >> 1), Math.max(1, H >> 1), this.rtA);
    this.rtB = this._target(Math.max(1, W >> 1), Math.max(1, H >> 1), this.rtB);
    const was = this._laid;
    this._laid = r.width > 0 && r.height > 0;
    if (this._laid) for (const s of this.shapes) s._layout(!was);
    this._placeOverlay();
    this._emit('resize', w, h);
    this.redraw();
    return true;
  }

  _setPalette(dark) {
    const g = this.gradient, base = palettes[dark ? 'dark' : 'light'];
    const pal = g && typeof g === 'object' ? Object.assign({}, base, g) : base;
    const cs = pal.colors;
    this.pal = {
      bg: new Float32Array(rgb(pal.background)),
      c: new Float32Array([0, 1, 2, 3, 4].flatMap(i => rgb(cs[i % cs.length]))),
      mix: g ? (pal.mix != null ? pal.mix : 0.85) : 0,
    };
  }

  // Redesenha o conteúdo atrás do vidro (chame quando o fundo mudar)
  redraw() {
    if (!this._ok || !this.w || this.destroyed) return this;
    const dark = isDark(this.theme);
    this._setPalette(dark);
    const w = this.w, h = this.h, dpr = this.dpr, cv = this.c2d, bg = this._bg;
    let ctx = prep(cv, w, h, dpr), ch = h;
    if (typeof bg === 'function') {
      const info = { dark, dpr, time: this.time, stage: this, resize: H => (ctx = prep(cv, w, H, dpr)) };
      let r = (this._bgFn || bg)(ctx, w, h, info);
      // aceita tanto uma cena pronta quanto a fábrica dela (scenes.stripes ou scenes.stripes())
      if (typeof r === 'function') { this._bgFn = r; r = r(ctx, w, h, info); }
      if (r > 0) ch = r;
    } else if (bg) drawFit(ctx, bg, w, h, this.fit);
    this.cScale = ch / h;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.content);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    try { gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv); } catch (e) {
      if (!this._warned) { this._warned = true; console.warn('LiquidGlass: o fundo não pôde ir para a GPU (imagem de outro domínio sem CORS?)', e); }
    }
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    return this;
  }

  // Um quadro completo: molas, deriva, alças e render. Chamado sozinho, a não ser com autoRender: false.
  step(dt = 1 / 60, t = performance.now() / 1000) {
    if (!this._ok || !this.w || this.destroyed) return;
    const amp = this.drift && !reduceMotion.matches ? this.scale : 0;
    const springs = [];
    for (const s of this.shapes) {
      if (!s.drag) {
        s._x.t = s.homeX + Math.sin(t * 0.5 + s.phase) * 14 * amp;
        s._y.t = s.homeY + Math.cos(t * 0.42 + s.phase * 1.3) * 10 * amp;
      }
      springs.push(...s.springs);
    }
    stepSprings(springs, dt);
    if (this.scrollSpeed && !reduceMotion.matches) this.scroll = (this.time * this.scrollSpeed / (this.cScale * this.h)) % 1;
    if (this._video || this.live) this.redraw();
    this._emit('frame', dt, t);
    this.render(dt);
  }

  _stretch(s) {
    if (!this.stretch) return [1, 1];
    const vx = Math.abs(s._x.v), vy = Math.abs(s._y.v);
    return [1 + Math.min(vx / 2600, 0.22) - Math.min(vy / 5200, 0.1), 1 + Math.min(vy / 2600, 0.22) - Math.min(vx / 5200, 0.1)];
  }

  render(dt = 0) {
    if (!this._ok || !this.w || this.destroyed) return;
    const gl = this.gl, p = this.params, W = this.canvas.width, H = this.canvas.height;
    if (!reduceMotion.matches) this.time += dt;
    const draw = () => gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    // 1. cena
    let P = this.pScene;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtScene.f); gl.viewport(0, 0, W, H);
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.content);
    gl.uniform1i(P.u.uContent, 0); gl.uniform2f(P.u.uRes, W, H);
    gl.uniform1f(P.u.uTime, this.time); gl.uniform1f(P.u.uScroll, this.scroll); gl.uniform1f(P.u.uCScale, this.cScale);
    gl.uniform3fv(P.u.uBg, this.pal.bg); gl.uniform3fv(P.u.uC, this.pal.c); gl.uniform1f(P.u.uMix, this.pal.mix);
    draw();
    // 2-3. desfoque (só quando há fosco)
    const fm = p.frost > 0 ? clamp(p.frost / 3, 0, 1) : 0;
    if (fm > 0) {
      P = this.pBlur; gl.useProgram(P.p);
      gl.uniform1i(P.u.uTex, 0); gl.uniform1f(P.u.uSigma, Math.max(p.frost, 1.5) * this.dpr / 2);
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtA.f); gl.viewport(0, 0, this.rtA.w, this.rtA.h);
      gl.bindTexture(gl.TEXTURE_2D, this.rtScene.t); gl.uniform2f(P.u.uDir, 1 / this.rtA.w, 0); draw();
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtB.f);
      gl.bindTexture(gl.TEXTURE_2D, this.rtA.t); gl.uniform2f(P.u.uDir, 0, 1 / this.rtB.h); draw();
    }
    // 4. vidro
    P = this.pGlass;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H);
    gl.useProgram(P.p);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.rtScene.t);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.rtB.t);
    gl.uniform1i(P.u.uScene, 0); gl.uniform1i(P.u.uBlur, 1);
    const a = this._ua, b = this._ub;
    let n = 0;
    for (const s of this.shapes) {
      const [sx, sy] = this._stretch(s), ps = s._p.x;
      const w0 = Math.max(s._w.x, 1), h0 = Math.max(s._h.x, 1), w = w0 * ps, h = h0 * ps;
      if (s.el) {
        if (Math.abs(s._ew - w0) > 0.5 || Math.abs(s._eh - h0) > 0.5) { s._ew = w0; s._eh = h0; s.el.style.width = w0 + 'px'; s.el.style.height = h0 + 'px'; }
        s.el.style.transform = `translate(${s._x.x - s._ew / 2}px,${s._y.x - s._eh / 2}px) scale(${sx * w / s._ew},${sy * h / s._eh})`;
      }
      if (!s.visible || n >= this.maxShapes) continue;
      const hw = Math.max(w / 2 * sx, 0.5), hh = Math.max(h / 2 * sy, 0.5);
      a[n * 4] = s._x.x; a[n * 4 + 1] = s._y.x; a[n * 4 + 2] = hw; a[n * 4 + 3] = hh;
      b[n * 2] = s.radius == null ? Math.min(hw, hh) : s.radius * ps;
      b[n * 2 + 1] = s.zoom != null ? s.zoom : s.lens ? p.zoom : 1;
      n++;
    }
    gl.uniform1i(P.u.uCount, n); gl.uniform4fv(P.u.uShape, a); gl.uniform2fv(P.u.uShape2, b);
    gl.uniform2f(P.u.uRes, W, H); gl.uniform1f(P.u.uDpr, this.dpr);
    const sc = this.scale;
    gl.uniform1f(P.u.uK, p.merge * sc); gl.uniform1f(P.u.uRefr, p.refraction * sc); gl.uniform1f(P.u.uBevel, p.bevel * sc);
    gl.uniform1f(P.u.uDisp, p.dispersion); gl.uniform1f(P.u.uFrostMix, fm); gl.uniform1f(P.u.uSpec, p.specular);
    gl.uniform1f(P.u.uSat, p.saturation); gl.uniform1f(P.u.uShadow, p.shadow);
    const la = p.light * Math.PI / 180;
    gl.uniform2f(P.u.uLight, Math.cos(la), -Math.sin(la));
    const tn = p.tint / 100;
    if (tn >= 0) gl.uniform4f(P.u.uTint, 1, 1, 1, tn * 0.5); else gl.uniform4f(P.u.uTint, 0.02, 0.02, 0.05, -tn);
    this.glow.s.step(dt);
    gl.uniform4f(P.u.uGlow, this.glow.x, this.glow.y, Math.max(0, this.glow.s.x), this.glow.r);
    draw();
    gl.bindTexture(gl.TEXTURE_2D, null); gl.activeTexture(gl.TEXTURE0);
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (this._stopTick) this._stopTick();
    this._ro.disconnect(); this._offTheme();
    this.shapes.forEach(s => s._detach());
    if (this._ov) this._ov.remove();
    this.canvas.removeEventListener('webglcontextlost', this._lost);
    this.canvas.removeEventListener('webglcontextrestored', this._restored);
    const gl = this.gl;
    if (this._ownCanvas) {
      const ext = gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
      this.canvas.remove();
    } else {
      // o canvas é de quem chamou: libera os recursos mas deixa o contexto vivo,
      // para que um novo palco no mesmo canvas funcione (ex.: React StrictMode)
      [this.pScene, this.pBlur, this.pGlass].forEach(p => gl.deleteProgram(p.p));
      [this.rtScene, this.rtA, this.rtB].forEach(t => { if (t) { gl.deleteTexture(t.t); gl.deleteFramebuffer(t.f); } });
      gl.deleteTexture(this.content); gl.deleteBuffer(this._buf);
    }
  }
}

export const createStage = (target, options) => new Stage(target, options);
