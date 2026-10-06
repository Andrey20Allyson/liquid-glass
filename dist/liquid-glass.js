/*! liquid-glass v1.0.0 | MIT | https://github.com/Andrey20Allyson/liquid-glass */
var LiquidGlass = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.js
  var index_exports = {};
  __export(index_exports, {
    Spring: () => Spring,
    Stage: () => Stage,
    auto: () => auto,
    createStage: () => createStage,
    default: () => index_default,
    defaults: () => defaults,
    glass: () => glass,
    glassAll: () => glassAll,
    palettes: () => palettes,
    params: () => params,
    presetLabels: () => presetLabels,
    presets: () => presets,
    resolve: () => resolve,
    scenes: () => scenes,
    stopAuto: () => stopAuto,
    supportsRefraction: () => supportsRefraction,
    supportsWebGL: () => supportsWebGL,
    version: () => version
  });

  // src/params.js
  var params = {
    refraction: { default: 24, min: 0, max: 60, step: 1, unit: "px", modes: ["webgl", "dom"], label: "Refra\xE7\xE3o", description: "Quanto o bisel puxa o fundo para dentro, como uma lente convexa." },
    bevel: { default: 30, min: 4, max: 80, step: 1, unit: "px", modes: ["webgl", "dom"], label: "Bisel", description: "Largura da borda curva onde a refra\xE7\xE3o acontece." },
    dispersion: { default: 0.08, min: 0, max: 1, step: 0.01, unit: "", modes: ["webgl", "dom"], label: "Dispers\xE3o", description: "Separa\xE7\xE3o das cores no bisel (aberra\xE7\xE3o crom\xE1tica)." },
    frost: { default: 0, min: 0, max: 24, step: 0.5, unit: "px", modes: ["webgl", "dom"], label: "Fosco", description: "Desfoque do que est\xE1 atr\xE1s do vidro. Use 4 a 12 em vidro com texto por cima." },
    specular: { default: 0.85, min: 0, max: 1, step: 0.01, unit: "", modes: ["webgl", "dom"], label: "Brilho", description: "Intensidade do filete de luz na borda." },
    merge: { default: 44, min: 0, max: 140, step: 1, unit: "px", modes: ["webgl"], label: "Fus\xE3o", description: "Dist\xE2ncia em que duas formas come\xE7am a se fundir como gotas." },
    zoom: { default: 1.3, min: 1, max: 2, step: 0.01, unit: "\xD7", modes: ["webgl", "dom"], label: "Lupa", description: "Amplia\xE7\xE3o das formas marcadas como lente (lens: true)." },
    light: { default: 135, min: 0, max: 360, step: 1, unit: "\xB0", modes: ["webgl", "dom"], label: "Luz", description: "\xC2ngulo de onde vem a luz (135 = de cima \xE0 esquerda)." },
    shadow: { default: 0.3, min: 0, max: 1, step: 0.01, unit: "", modes: ["webgl", "dom"], label: "Sombra", description: "Opacidade da sombra projetada." },
    tint: { default: 6, min: -60, max: 60, step: 1, unit: "", modes: ["webgl", "dom"], label: "Tom", description: "Positivo clareia o vidro, negativo escurece, 0 \xE9 neutro." },
    saturation: { default: 1.25, min: 0, max: 2.5, step: 0.01, unit: "\xD7", modes: ["webgl", "dom"], label: "Satura\xE7\xE3o", description: "Satura\xE7\xE3o das cores vistas atrav\xE9s do vidro." }
  };
  var defaults = Object.fromEntries(Object.entries(params).map(([k, p]) => [k, p.default]));
  var presets = {
    liquid: { refraction: 24, bevel: 30, dispersion: 0.08, frost: 0, specular: 0.85, merge: 44, zoom: 1.3, shadow: 0.3, tint: 6, saturation: 1.25 },
    drop: { refraction: 46, bevel: 70, dispersion: 0.2, frost: 0, specular: 1, merge: 96, zoom: 1.6, shadow: 0.45, tint: 0, saturation: 1.35 },
    frosted: { refraction: 14, bevel: 22, dispersion: 0.04, frost: 12, specular: 0.7, merge: 40, zoom: 1, shadow: 0.25, tint: 24, saturation: 1.5 },
    crystal: { refraction: 34, bevel: 16, dispersion: 0.5, frost: 0, specular: 1, merge: 20, zoom: 1.15, shadow: 0.2, tint: 0, saturation: 1.1 },
    dark: { refraction: 22, bevel: 28, dispersion: 0.06, frost: 4, specular: 0.6, merge: 44, zoom: 1.2, shadow: 0.45, tint: -40, saturation: 1.1 }
  };
  var presetLabels = { liquid: "Liquid Glass", drop: "Gota d'\xE1gua", frosted: "Fosco", crystal: "Cristal", dark: "Escuro" };
  var aliases = { gota: "drop", fosco: "frosted", cristal: "crystal", escuro: "dark" };
  var palettes = {
    dark: { background: "#07080f", colors: ["#3d5afe", "#ff2d6f", "#00b8d4", "#7c4dff", "#ff9100"], mix: 0.9 },
    light: { background: "#eef1f8", colors: ["#7aa2ff", "#ff8fb1", "#5fe0f0", "#b69cff", "#ffc46b"], mix: 0.85 }
  };
  function getPreset(name) {
    const p = presets[name] || presets[aliases[name]];
    if (!p) throw new Error(`LiquidGlass: modelo desconhecido "${name}". Use: ${Object.keys(presets).join(", ")}`);
    return p;
  }
  function resolve(base, input) {
    const out = Object.assign({}, base);
    if (typeof input === "string") input = { preset: input };
    if (!input) return out;
    if (input.preset) Object.assign(out, getPreset(input.preset));
    for (const k in params) if (input[k] != null && input[k] !== "") out[k] = +input[k];
    return out;
  }

  // src/util.js
  var clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  var hasDOM = typeof window !== "undefined" && typeof document !== "undefined";
  var noMQ = { matches: false, addEventListener() {
  }, removeEventListener() {
  } };
  var mq = (q) => hasDOM && window.matchMedia ? window.matchMedia(q) : noMQ;
  var reduceMotion = mq("(prefers-reduced-motion: reduce)");
  var darkMQ = mq("(prefers-color-scheme: dark)");
  function isDark(theme = "auto") {
    if (theme === "dark") return true;
    if (theme === "light") return false;
    const t = hasDOM && document.documentElement.dataset.theme;
    return t ? t === "dark" : darkMQ.matches;
  }
  var themeFns = /* @__PURE__ */ new Set();
  var themeMO = null;
  function onThemeChange(fn) {
    if (!hasDOM) return () => {
    };
    if (!themeMO) {
      const fire = () => themeFns.forEach((f) => f());
      darkMQ.addEventListener("change", fire);
      themeMO = new MutationObserver(fire);
      themeMO.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    }
    themeFns.add(fn);
    return () => themeFns.delete(fn);
  }
  var colorCtx = null;
  function rgb(color) {
    if (Array.isArray(color)) return color.map((v) => v > 1 ? v / 255 : v);
    if (!colorCtx) colorCtx = document.createElement("canvas").getContext("2d");
    colorCtx.fillStyle = "#000";
    colorCtx.fillStyle = color;
    const s = colorCtx.fillStyle;
    if (s[0] === "#") return [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16) / 255);
    const m = s.match(/[\d.]+/g) || [0, 0, 0];
    return m.slice(0, 3).map((v) => +v / 255);
  }
  var Spring = class {
    constructor(x = 0, k = 220, c = 22) {
      this.x = x;
      this.t = x;
      this.v = 0;
      this.k = k;
      this.c = c;
    }
    step(dt) {
      const a = this.k * (this.t - this.x) - this.c * this.v;
      this.v += a * dt;
      this.x += this.v * dt;
    }
    set(x) {
      this.x = this.t = x;
      this.v = 0;
    }
    get idle() {
      return Math.abs(this.t - this.x) < 0.01 && Math.abs(this.v) < 0.01;
    }
  };
  function stepSprings(list, dt) {
    const n = Math.ceil(dt / (1 / 240));
    const h = dt / n;
    for (let i = 0; i < n; i++) for (const s of list) s.step(h);
  }
  var ticks = /* @__PURE__ */ new Set();
  var raf = 0;
  var last = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1e3);
    last = now;
    if (!document.hidden) {
      for (const t of ticks) if (t.visible) {
        try {
          t.fn(dt, now / 1e3);
        } catch (e) {
          console.error(e);
          t.visible = false;
        }
      }
    }
    raf = ticks.size ? requestAnimationFrame(frame) : 0;
  }
  function addTick(el, fn) {
    const t = { fn, visible: true };
    let io = null;
    if (el && typeof IntersectionObserver !== "undefined") {
      t.visible = false;
      io = new IntersectionObserver((es) => {
        t.visible = es[es.length - 1].isIntersecting;
      }, { rootMargin: "120px" });
      io.observe(el);
    }
    ticks.add(t);
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
    return () => {
      ticks.delete(t);
      if (io) io.disconnect();
    };
  }
  function springEasing(k = 190, c = 15) {
    let x = 0, v = 0;
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      pts.push(+x.toFixed(4));
      for (let j = 0; j < 8; j++) {
        const a = k * (1 - x) - c * v;
        v += a / 480;
        x += v / 480;
      }
    }
    return `linear(${pts.join(",")})`;
  }

  // src/shaders/scene.glsl
  var scene_default = "varying vec2 v;uniform sampler2D uContent;uniform vec2 uRes;uniform float uTime,uScroll,uCScale,uMix;uniform vec3 uBg;uniform vec3 uC[5];float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}void main(){float asp=uRes.x/uRes.y;vec2 q=vec2(v.x*asp,1.0-v.y);float t=uTime*0.11;vec3 col=uBg;for(int i=0;i<5;i++){float fi=float(i);vec2 c=vec2((0.12+0.76*fract(fi*0.618+0.11))*asp+0.16*asp*sin(t*(0.8+0.17*fi)+fi*1.9),0.15+0.7*fract(fi*0.381+0.27)+0.2*cos(t*(0.9+0.13*fi)+fi*2.7));float r=0.36+0.1*sin(t*0.6+fi*1.3);float dd=length(q-c);col=mix(col,uC[i],exp(-dd*dd/(r*r))*uMix);}float cy=fract((1.0-v.y)/uCScale+uScroll);vec4 c=texture2D(uContent,vec2(v.x,1.0-cy));col=col*(1.0-c.a)+c.rgb;col+=(hash(gl_FragCoord.xy+fract(uTime*7.0))-0.5)*(1.5/255.0);gl_FragColor=vec4(col,1.0);}";

  // src/shaders/blur.glsl
  var blur_default = "varying vec2 v;uniform sampler2D uTex;uniform vec2 uDir;uniform float uSigma;void main(){vec4 s=vec4(0.0);float ws=0.0;float st=max(1.0,uSigma*3.0/12.0);for(int i=-12;i<=12;i++){float x=float(i)*st;float w=exp(-0.5*x*x/(uSigma*uSigma));s+=texture2D(uTex,v+uDir*x)*w;ws+=w;}gl_FragColor=s/ws;}";

  // src/shaders/glass.glsl
  var glass_default = "varying vec2 v;uniform sampler2D uScene,uBlur;uniform vec2 uRes;uniform float uDpr;uniform int uCount;uniform vec4 uShape[MAXS];uniform vec2 uShape2[MAXS];uniform float uK,uRefr,uBevel,uDisp,uFrostMix,uSpec,uSat,uShadow;uniform vec2 uLight;uniform vec4 uTint,uGlow;float sdBox(vec2 p,vec2 b,float r){r=min(r,min(b.x,b.y));vec2 q=abs(p)-b+r;return length(max(q,0.0))+min(max(q.x,q.y),0.0)-r;}float smin(float a,float b,float k){float h=max(k-abs(a-b),0.0)/k;return min(a,b)-h*h*k*0.25;}float field(vec2 p){float d=1e5;for(int i=0;i<MAXS;i++){if(i>=uCount)break;float di=sdBox(p-uShape[i].xy,uShape[i].zw,uShape2[i].x);d=uK>0.5?smin(d,di,uK):min(d,di);}return d;}vec2 lens(vec2 p){vec2 acc=vec2(0.0);float ws=0.0;for(int i=0;i<MAXS;i++){if(i>=uCount)break;float di=sdBox(p-uShape[i].xy,uShape[i].zw,uShape2[i].x);float w=exp(-clamp(di,-40.0,120.0)*0.08);acc+=w*(uShape[i].xy-p)*(1.0-1.0/uShape2[i].y);ws+=w;}return acc/max(ws,1e-4);}vec3 tap(sampler2D t,vec2 uv,vec2 o,vec2 z,vec2 k){return vec3(texture2D(t,uv+(o*(1.0+uDisp)+z)*k).r,texture2D(t,uv+(o+z)*k).g,texture2D(t,uv+(o*(1.0-uDisp)+z)*k).b);}void main(){vec2 fc=gl_FragCoord.xy;vec2 uv=fc/uRes;vec2 p=vec2(fc.x,uRes.y-fc.y)/uDpr;vec3 bg=texture2D(uScene,uv).rgb;float d=field(p);float aa=1.0/uDpr;float sh=0.0;if(uShadow>0.0&&d<40.0){float ds=field(p-vec2(0.0,8.0));sh=uShadow*(1.0-smoothstep(-10.0,30.0,ds));}vec3 outside=bg*(1.0-sh);if(d>aa){gl_FragColor=vec4(outside,1.0);return;}vec2 e=vec2(0.5,0.0);vec2 g=vec2(field(p+e.xy)-field(p-e.xy),field(p+e.yx)-field(p-e.yx));float gm=length(g);g=gm>1e-5?g/gm:vec2(0.0);float x=max(-d,0.0);float s=1.0-clamp(x/max(uBevel,1.0),0.0,1.0);vec2 off=-g*uRefr*s*s;vec2 zo=lens(p);vec2 k=vec2(uDpr/uRes.x,-uDpr/uRes.y);vec3 col=tap(uScene,uv,off,zo,k);if(uFrostMix>0.0)col=mix(col,tap(uBlur,uv,off,zo,k),uFrostMix);float l=dot(col,vec3(0.2126,0.7152,0.0722));col=mix(vec3(l),col,uSat);col=mix(col,uTint.rgb,uTint.a);float f=dot(g,uLight);float lit=max(f,0.0),back=max(-f,0.0);float rim=1.0-smoothstep(0.0,1.6,x);col+=uSpec*rim*(0.18+0.75*pow(lit,1.5)+0.38*pow(back,1.5));col+=uSpec*s*s*s*(0.22*lit*lit+0.08*back*back);col=mix(col,vec3(1.0),uSpec*0.07*pow(s,4.0));if(uGlow.z>0.001){float gd=length(p-uGlow.xy);col+=uGlow.z*0.28*exp(-gd*gd/(2.0*uGlow.w*uGlow.w));}float m=clamp(0.5-d/aa,0.0,1.0);gl_FragColor=vec4(mix(outside,col,m),1.0);}";

  // src/stage.js
  var VS = "attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}";
  var PREC = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n";
  var CTX_OPTS = { antialias: false, alpha: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false };
  var isPct = (v) => typeof v === "string" && v.trim().endsWith("%");
  var coord = (v, total) => isPct(v) ? parseFloat(v) / 100 * total : +v;
  var webglOK = null;
  function supportsWebGL() {
    if (webglOK !== null) return webglOK;
    webglOK = false;
    if (!hasDOM) return webglOK;
    try {
      const gl = document.createElement("canvas").getContext("webgl");
      webglOK = !!gl;
      const ext = gl && gl.getExtension("WEBGL_lose_context");
      if (ext) ext.loseContext();
    } catch (e) {
    }
    return webglOK;
  }
  function prep(cv, w, h, dpr) {
    const W = Math.max(1, Math.round(w * dpr)), H = Math.max(1, Math.round(h * dpr));
    const resized = cv.width !== W || cv.height !== H;
    if (resized) {
      cv.width = W;
      cv.height = H;
    }
    const c = cv.getContext("2d");
    if (!resized) {
      if (c.reset) c.reset();
      else cv.width = W;
    }
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, w, h);
    return c;
  }
  function drawFit(c, src, w, h, fit) {
    const sw = src.videoWidth || src.naturalWidth || src.width, sh = src.videoHeight || src.naturalHeight || src.height;
    if (!sw || !sh) return;
    if (fit === "fill") {
      c.drawImage(src, 0, 0, w, h);
      return;
    }
    const k = (fit === "contain" ? Math.min : Math.max)(w / sw, h / sh);
    c.drawImage(src, (w - sw * k) / 2, (h - sh * k) / 2, sw * k, sh * k);
  }
  var Shape = class {
    constructor(stage, o) {
      this.stage = stage;
      const k = o.stiffness || 190, c = o.damping || 19;
      this._x = new Spring(0, k, c);
      this._y = new Spring(0, k, c);
      this._w = new Spring(0, k + 10, c - 2);
      this._h = new Spring(0, k + 10, c - 2);
      this._p = new Spring(1, 320, 17);
      this.springs = [this._x, this._y, this._w, this._h, this._p];
      this.radius = null;
      this.zoom = null;
      this.lens = false;
      this.visible = true;
      this.draggable = false;
      this.label = "";
      this.homeX = 0;
      this.homeY = 0;
      this._sx = this._sy = null;
      this.phase = stage.shapes.length * 2.1;
      this.drag = null;
      this.el = null;
      this._ew = this._eh = 0;
      const w = o.width != null ? o.width : 120;
      this.set(Object.assign({ x: "50%", y: "50%", width: w, height: w }, o), true);
    }
    get x() {
      return this._x.x;
    }
    get y() {
      return this._y.x;
    }
    get width() {
      return this._w.x;
    }
    get height() {
      return this._h.x;
    }
    get dragging() {
      return !!this.drag;
    }
    // Muda propriedades. Sem `immediate`, posição e tamanho andam com mola.
    set(o = {}, immediate = false) {
      const st = this.stage;
      if (o.x != null) {
        this._sx = isPct(o.x) ? o.x : null;
        this.homeX = coord(o.x, st.w);
        this._x.t = this.homeX;
        if (immediate) this._x.set(this.homeX);
      }
      if (o.y != null) {
        this._sy = isPct(o.y) ? o.y : null;
        this.homeY = coord(o.y, st.h);
        this._y.t = this.homeY;
        if (immediate) this._y.set(this.homeY);
      }
      if (o.width != null) {
        this._w.t = +o.width;
        if (immediate) this._w.set(+o.width);
      }
      if (o.height != null) {
        this._h.t = +o.height;
        if (immediate) this._h.set(+o.height);
      }
      if ("radius" in o) this.radius = o.radius == null ? null : +o.radius;
      if ("zoom" in o) this.zoom = o.zoom == null ? null : +o.zoom;
      if ("lens" in o) this.lens = !!o.lens;
      if ("visible" in o) {
        this.visible = o.visible !== false;
        if (this.el) this.el.hidden = !this.visible;
      }
      if ("label" in o) {
        this.label = o.label || "";
        this._aria();
      }
      if ("draggable" in o) {
        this.draggable = !!o.draggable;
        if (this.draggable) {
          if (!this.el) this._attach();
        } else this._detach();
      }
      return this;
    }
    moveTo(x, y, immediate) {
      return this.set({ x, y }, immediate);
    }
    resize(width, height, immediate) {
      return this.set({ width, height: height == null ? width : height }, immediate);
    }
    remove() {
      this.stage.remove(this);
    }
    _layout(first) {
      const st = this.stage;
      this.homeX = this._sx != null ? coord(this._sx, st.w) : clamp(this.homeX, 0, st.w);
      this.homeY = this._sy != null ? coord(this._sy, st.h) : clamp(this.homeY, 0, st.h);
      if (first) {
        this._x.set(this.homeX);
        this._y.set(this.homeY);
      }
    }
    _aria() {
      if (this.el) this.el.setAttribute("aria-label", (this.label ? this.label + ". " : "") + "Arraste ou use as setas para mover.");
    }
    // Alça DOM transparente por cima da forma: mouse, toque e teclado
    _attach() {
      const st = this.stage, el = this.el = document.createElement("div");
      el.className = "lg-handle";
      el.tabIndex = 0;
      el.setAttribute("role", "img");
      el.hidden = !this.visible;
      el.style.cssText = "position:absolute;left:0;top:0;pointer-events:auto;touch-action:none;cursor:grab;border-radius:999px;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent";
      this._aria();
      st._overlay().appendChild(el);
      const local = (e) => {
        const r = st.canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
      };
      el.addEventListener("pointerdown", (e) => {
        el.setPointerCapture(e.pointerId);
        const [px, py] = local(e);
        this.drag = { ox: px - this._x.x, oy: py - this._y.x, id: e.pointerId };
        this._p.t = 1.08;
        el.style.cursor = "grabbing";
        st.glowAt(px, py);
        st._emit("dragstart", this, e);
      });
      el.addEventListener("pointermove", (e) => {
        if (!this.drag || e.pointerId !== this.drag.id) return;
        const [px, py] = local(e);
        this._sx = this._sy = null;
        this.homeX = this._x.t = clamp(px - this.drag.ox, 0, st.w);
        this.homeY = this._y.t = clamp(py - this.drag.oy, 0, st.h);
        st.glowAt(px, py);
        st._emit("drag", this, e);
      });
      const end = (e) => {
        if (!this.drag) return;
        this.drag = null;
        this._p.t = 1;
        el.style.cursor = "grab";
        st.glowOff();
        st._emit("dragend", this, e);
      };
      el.addEventListener("pointerup", end);
      el.addEventListener("pointercancel", end);
      el.addEventListener("keydown", (e) => {
        const s = e.shiftKey ? 48 : 16;
        const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
        if (!d) return;
        e.preventDefault();
        this._sx = this._sy = null;
        this.homeX = clamp(this.homeX + d[0], 0, st.w);
        this.homeY = clamp(this.homeY + d[1], 0, st.h);
        st._emit("drag", this, e);
      });
    }
    _detach() {
      if (this.el) {
        this.el.remove();
        this.el = null;
        this._ew = this._eh = 0;
      }
      this.drag = null;
    }
  };
  var Stage = class {
    constructor(target, options = {}) {
      if (!hasDOM) throw new Error("LiquidGlass: createStage precisa de um navegador");
      if (typeof target === "string") target = document.querySelector(target);
      if (!target) throw new Error("LiquidGlass: elemento do palco n\xE3o encontrado");
      let canvas = target;
      if (!(target instanceof HTMLCanvasElement)) {
        canvas = document.createElement("canvas");
        canvas.style.cssText = "display:block;width:100%;height:100%";
        target.appendChild(canvas);
        this._ownCanvas = true;
      }
      const o = this.options = options;
      this.canvas = canvas;
      this.params = resolve(defaults, o);
      this.theme = o.theme || "auto";
      this.maxShapes = clamp(Math.round(o.maxShapes || 8), 1, 16);
      this.scale = o.scale || 1;
      this.drift = !!o.drift;
      this.stretch = o.stretch !== false;
      this.scrollSpeed = o.scrollSpeed || 0;
      this.gradient = o.gradient != null ? o.gradient : !o.background;
      this.fit = o.fit || "cover";
      this.live = !!o.live;
      this.shapes = [];
      this.w = this.h = 0;
      this.dpr = 1;
      this.time = 0;
      this.scroll = 0;
      this.cScale = 1;
      this._laid = false;
      this.glow = { x: 0, y: 0, s: new Spring(0, 160, 24), r: 70 };
      this._ua = new Float32Array(this.maxShapes * 4);
      this._ub = new Float32Array(this.maxShapes * 2);
      this._events = {};
      this.c2d = document.createElement("canvas");
      this._initGL();
      this._lost = (e) => {
        e.preventDefault();
        this._ok = false;
      };
      this._restored = () => {
        this._initGL();
        this.w = 0;
        this.resize();
      };
      canvas.addEventListener("webglcontextlost", this._lost);
      canvas.addEventListener("webglcontextrestored", this._restored);
      this.setBackground(o.background != null ? o.background : null);
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(canvas);
      this._offTheme = onThemeChange(() => this.redraw());
      if (o.autoRender !== false) this._stopTick = addTick(canvas, (dt, t) => this.step(dt, t));
      this.resize();
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
        if (!this.destroyed) this.redraw();
      });
      (o.shapes || []).forEach((s) => this.add(s));
    }
    _initGL() {
      const c = this.canvas;
      const gl = this.gl = this.gl || c.getContext("webgl2", CTX_OPTS) || c.getContext("webgl", CTX_OPTS) || c.getContext("experimental-webgl", CTX_OPTS);
      if (!gl) throw new Error("LiquidGlass: WebGL indispon\xEDvel");
      this.pScene = this._prog(scene_default);
      this.pBlur = this._prog(blur_default);
      this.pGlass = this._prog("#define MAXS " + this.maxShapes + "\n" + glass_default);
      const b = this._buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      this.content = this._tex();
      this.rtScene = this.rtA = this.rtB = null;
      this._ok = true;
    }
    _prog(fs) {
      const gl = this.gl;
      const sh = (type, src) => {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
        return s;
      };
      const p = gl.createProgram();
      gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
      gl.attachShader(p, sh(gl.FRAGMENT_SHADER, PREC + fs));
      gl.bindAttribLocation(p, 0, "a");
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
      const u = {};
      for (let i = 0, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i < n; i++) {
        const info = gl.getActiveUniform(p, i);
        u[info.name.replace(/\[0\]$/, "")] = gl.getUniformLocation(p, info.name);
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
      if (old) {
        gl.deleteTexture(old.t);
        gl.deleteFramebuffer(old.f);
      }
      const t = this._tex();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      const f = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, f);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { t, f, w, h };
    }
    /* ----- API pública ----- */
    set(input) {
      Object.assign(this.params, resolve(this.params, input));
      return this;
    }
    preset(name) {
      return this.set({ preset: name });
    }
    setTheme(theme) {
      this.theme = theme || "auto";
      this.redraw();
      return this;
    }
    add(o = {}) {
      if (this.shapes.length >= this.maxShapes) console.warn(`LiquidGlass: o palco desenha no m\xE1ximo ${this.maxShapes} formas (op\xE7\xE3o maxShapes, at\xE9 16)`);
      const s = new Shape(this, o);
      this.shapes.push(s);
      return s;
    }
    remove(shape) {
      const i = this.shapes.indexOf(shape);
      if (i >= 0) {
        this.shapes.splice(i, 1);
        shape._detach();
      }
      return this;
    }
    clear() {
      this.shapes.slice().forEach((s) => this.remove(s));
      return this;
    }
    // Fundo: imagem, vídeo, canvas, ImageBitmap, URL ou função (ctx, w, h, info) => altura?
    setBackground(bg) {
      this._bgFn = null;
      this._video = false;
      this._warned = false;
      if (typeof bg === "string") {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = bg;
        bg = img;
      }
      this._bg = bg;
      if (typeof HTMLImageElement !== "undefined" && bg instanceof HTMLImageElement && !(bg.complete && bg.naturalWidth)) {
        bg.addEventListener("load", () => {
          if (this._bg === bg) this.redraw();
        }, { once: true });
        bg.addEventListener("error", () => console.warn("LiquidGlass: n\xE3o foi poss\xEDvel carregar o fundo", bg.src), { once: true });
      }
      if (typeof HTMLVideoElement !== "undefined" && bg instanceof HTMLVideoElement) this._video = true;
      if (this.w) this.redraw();
      return this;
    }
    glowAt(x, y) {
      this.glow.x = x;
      this.glow.y = y;
      this.glow.s.t = 1;
      return this;
    }
    glowOff() {
      this.glow.s.t = 0;
      return this;
    }
    on(type, fn) {
      (this._events[type] = this._events[type] || /* @__PURE__ */ new Set()).add(fn);
      return this;
    }
    off(type, fn) {
      if (this._events[type]) this._events[type].delete(fn);
      return this;
    }
    _emit(type, ...a) {
      if (this._events[type]) this._events[type].forEach((f) => f(...a));
    }
    _overlay() {
      if (this._ov) return this._ov;
      const parent = this.canvas.parentElement;
      if (getComputedStyle(parent).position === "static") parent.style.position = "relative";
      const ov = this._ov = document.createElement("div");
      ov.className = "lg-handles";
      ov.style.cssText = "position:absolute;pointer-events:none;overflow:hidden";
      this.canvas.after(ov);
      this._placeOverlay();
      return ov;
    }
    _placeOverlay() {
      const ov = this._ov, c = this.canvas;
      if (ov) Object.assign(ov.style, { left: c.offsetLeft + "px", top: c.offsetTop + "px", width: c.offsetWidth + "px", height: c.offsetHeight + "px" });
    }
    resize() {
      if (!this._ok || this.destroyed) return false;
      const r = this.canvas.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
      const max = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
      const dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr || 2, max / w, max / (h * 2.5));
      if (w === this.w && h === this.h && dpr === this.dpr) return false;
      this.w = w;
      this.h = h;
      this.dpr = dpr;
      const W = Math.round(w * dpr), H = Math.round(h * dpr);
      this.canvas.width = W;
      this.canvas.height = H;
      this.rtScene = this._target(W, H, this.rtScene);
      this.rtA = this._target(Math.max(1, W >> 1), Math.max(1, H >> 1), this.rtA);
      this.rtB = this._target(Math.max(1, W >> 1), Math.max(1, H >> 1), this.rtB);
      const was = this._laid;
      this._laid = r.width > 0 && r.height > 0;
      if (this._laid) for (const s of this.shapes) s._layout(!was);
      this._placeOverlay();
      this._emit("resize", w, h);
      this.redraw();
      return true;
    }
    _setPalette(dark) {
      const g = this.gradient, base = palettes[dark ? "dark" : "light"];
      const pal = g && typeof g === "object" ? Object.assign({}, base, g) : base;
      const cs = pal.colors;
      this.pal = {
        bg: new Float32Array(rgb(pal.background)),
        c: new Float32Array([0, 1, 2, 3, 4].flatMap((i) => rgb(cs[i % cs.length]))),
        mix: g ? pal.mix != null ? pal.mix : 0.85 : 0
      };
    }
    // Redesenha o conteúdo atrás do vidro (chame quando o fundo mudar)
    redraw() {
      if (!this._ok || !this.w || this.destroyed) return this;
      const dark = isDark(this.theme);
      this._setPalette(dark);
      const w = this.w, h = this.h, dpr = this.dpr, cv = this.c2d, bg = this._bg;
      let ctx = prep(cv, w, h, dpr), ch = h;
      if (typeof bg === "function") {
        const info = { dark, dpr, time: this.time, stage: this, resize: (H) => ctx = prep(cv, w, H, dpr) };
        let r = (this._bgFn || bg)(ctx, w, h, info);
        if (typeof r === "function") {
          this._bgFn = r;
          r = r(ctx, w, h, info);
        }
        if (r > 0) ch = r;
      } else if (bg) drawFit(ctx, bg, w, h, this.fit);
      this.cScale = ch / h;
      const gl = this.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.content);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
      } catch (e) {
        if (!this._warned) {
          this._warned = true;
          console.warn("LiquidGlass: o fundo n\xE3o p\xF4de ir para a GPU (imagem de outro dom\xEDnio sem CORS?)", e);
        }
      }
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      return this;
    }
    // Um quadro completo: molas, deriva, alças e render. Chamado sozinho, a não ser com autoRender: false.
    step(dt = 1 / 60, t = performance.now() / 1e3) {
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
      if (this.scrollSpeed && !reduceMotion.matches) this.scroll = this.time * this.scrollSpeed / (this.cScale * this.h) % 1;
      if (this._video || this.live) this.redraw();
      this._emit("frame", dt, t);
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
      let P = this.pScene;
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtScene.f);
      gl.viewport(0, 0, W, H);
      gl.useProgram(P.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.content);
      gl.uniform1i(P.u.uContent, 0);
      gl.uniform2f(P.u.uRes, W, H);
      gl.uniform1f(P.u.uTime, this.time);
      gl.uniform1f(P.u.uScroll, this.scroll);
      gl.uniform1f(P.u.uCScale, this.cScale);
      gl.uniform3fv(P.u.uBg, this.pal.bg);
      gl.uniform3fv(P.u.uC, this.pal.c);
      gl.uniform1f(P.u.uMix, this.pal.mix);
      draw();
      const fm = p.frost > 0 ? clamp(p.frost / 3, 0, 1) : 0;
      if (fm > 0) {
        P = this.pBlur;
        gl.useProgram(P.p);
        gl.uniform1i(P.u.uTex, 0);
        gl.uniform1f(P.u.uSigma, Math.max(p.frost, 1.5) * this.dpr / 2);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtA.f);
        gl.viewport(0, 0, this.rtA.w, this.rtA.h);
        gl.bindTexture(gl.TEXTURE_2D, this.rtScene.t);
        gl.uniform2f(P.u.uDir, 1 / this.rtA.w, 0);
        draw();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rtB.f);
        gl.bindTexture(gl.TEXTURE_2D, this.rtA.t);
        gl.uniform2f(P.u.uDir, 0, 1 / this.rtB.h);
        draw();
      }
      P = this.pGlass;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, W, H);
      gl.useProgram(P.p);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.rtScene.t);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.rtB.t);
      gl.uniform1i(P.u.uScene, 0);
      gl.uniform1i(P.u.uBlur, 1);
      const a = this._ua, b = this._ub;
      let n = 0;
      for (const s of this.shapes) {
        const [sx, sy] = this._stretch(s), ps = s._p.x;
        const w0 = Math.max(s._w.x, 1), h0 = Math.max(s._h.x, 1), w = w0 * ps, h = h0 * ps;
        if (s.el) {
          if (Math.abs(s._ew - w0) > 0.5 || Math.abs(s._eh - h0) > 0.5) {
            s._ew = w0;
            s._eh = h0;
            s.el.style.width = w0 + "px";
            s.el.style.height = h0 + "px";
          }
          s.el.style.transform = `translate(${s._x.x - s._ew / 2}px,${s._y.x - s._eh / 2}px) scale(${sx * w / s._ew},${sy * h / s._eh})`;
        }
        if (!s.visible || n >= this.maxShapes) continue;
        const hw = Math.max(w / 2 * sx, 0.5), hh = Math.max(h / 2 * sy, 0.5);
        a[n * 4] = s._x.x;
        a[n * 4 + 1] = s._y.x;
        a[n * 4 + 2] = hw;
        a[n * 4 + 3] = hh;
        b[n * 2] = s.radius == null ? Math.min(hw, hh) : s.radius * ps;
        b[n * 2 + 1] = s.zoom != null ? s.zoom : s.lens ? p.zoom : 1;
        n++;
      }
      gl.uniform1i(P.u.uCount, n);
      gl.uniform4fv(P.u.uShape, a);
      gl.uniform2fv(P.u.uShape2, b);
      gl.uniform2f(P.u.uRes, W, H);
      gl.uniform1f(P.u.uDpr, this.dpr);
      const sc = this.scale;
      gl.uniform1f(P.u.uK, p.merge * sc);
      gl.uniform1f(P.u.uRefr, p.refraction * sc);
      gl.uniform1f(P.u.uBevel, p.bevel * sc);
      gl.uniform1f(P.u.uDisp, p.dispersion);
      gl.uniform1f(P.u.uFrostMix, fm);
      gl.uniform1f(P.u.uSpec, p.specular);
      gl.uniform1f(P.u.uSat, p.saturation);
      gl.uniform1f(P.u.uShadow, p.shadow);
      const la = p.light * Math.PI / 180;
      gl.uniform2f(P.u.uLight, Math.cos(la), -Math.sin(la));
      const tn = p.tint / 100;
      if (tn >= 0) gl.uniform4f(P.u.uTint, 1, 1, 1, tn * 0.5);
      else gl.uniform4f(P.u.uTint, 0.02, 0.02, 0.05, -tn);
      this.glow.s.step(dt);
      gl.uniform4f(P.u.uGlow, this.glow.x, this.glow.y, Math.max(0, this.glow.s.x), this.glow.r);
      draw();
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE0);
    }
    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      if (this._stopTick) this._stopTick();
      this._ro.disconnect();
      this._offTheme();
      this.shapes.forEach((s) => s._detach());
      if (this._ov) this._ov.remove();
      this.canvas.removeEventListener("webglcontextlost", this._lost);
      this.canvas.removeEventListener("webglcontextrestored", this._restored);
      const gl = this.gl;
      if (this._ownCanvas) {
        const ext = gl.getExtension("WEBGL_lose_context");
        if (ext) ext.loseContext();
        this.canvas.remove();
      } else {
        [this.pScene, this.pBlur, this.pGlass].forEach((p) => gl.deleteProgram(p.p));
        [this.rtScene, this.rtA, this.rtB].forEach((t) => {
          if (t) {
            gl.deleteTexture(t.t);
            gl.deleteFramebuffer(t.f);
          }
        });
        gl.deleteTexture(this.content);
        gl.deleteBuffer(this._buf);
      }
    }
  };
  var createStage = (target, options) => new Stage(target, options);

  // src/dom.js
  var SVGNS = "http://www.w3.org/2000/svg";
  var SVG_OK = hasDOM && /Chrome\/\d+/.test(navigator.userAgent) && !/Firefox\//.test(navigator.userAgent);
  var supportsRefraction = () => SVG_OK;
  var STYLES = `
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
  var VARS = ["--lg-fill", "--lg-sat", "--lg-frost", "--lg-blur", "--lg-spec", "--lg-hair", "--lg-rim", "--lg-rim-angle", "--lg-sx", "--lg-sy", "--lg-shadow", "--lg-filter", "--lg-press-scale", "--lg-mx", "--lg-my"];
  var OPTS = ["lens", "press", "rim", "scale", "radius", "fill", "fallbackBlur"];
  var OPT_DEFAULTS = { lens: false, press: false, rim: true, scale: "auto", radius: null, fill: null, fallbackBlur: 8 };
  var cssDone = false;
  function injectCSS() {
    if (cssDone) return;
    cssDone = true;
    const lin = window.CSS && CSS.supports && CSS.supports("transition-timing-function", "linear(0, 1)");
    const st = document.createElement("style");
    st.id = "liquid-glass-css";
    st.textContent = `:root{--lg-spring:${lin ? springEasing() : "cubic-bezier(.34,1.56,.64,1)"};--lg-spring-dur:${lin ? "1s" : ".6s"}}` + STYLES;
    document.head.prepend(st);
  }
  var svgDefs = null;
  function defs() {
    if (!svgDefs) {
      const svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
      svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
      svgDefs = svg.appendChild(document.createElementNS(SVGNS, "defs"));
      document.body.appendChild(svg);
    }
    return svgDefs;
  }
  function sdRound(x, y, hw, hh, r) {
    const qx = Math.abs(x) - hw + r, qy = Math.abs(y) - hh + r;
    return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r;
  }
  function buildMap(w, h, r, bevel, refr, zoom) {
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const c = cv.getContext("2d"), img = c.createImageData(w, h), D = img.data;
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
          dx = -gx / gl * m;
          dy = -gy / gl * m;
        }
        dx -= x * zk;
        dy -= y * zk;
      }
      const k = j * w + i;
      vx[k] = dx;
      vy[k] = dy;
      max = Math.max(max, Math.abs(dx), Math.abs(dy));
    }
    for (let k = 0; k < w * h; k++) {
      D[k * 4] = 128 + Math.round(vx[k] / max * 127);
      D[k * 4 + 1] = 128 + Math.round(vy[k] / max * 127);
      D[k * 4 + 2] = 128;
      D[k * 4 + 3] = 255;
    }
    c.putImageData(img, 0, 0);
    return { url: cv.toDataURL(), scale: max * 255 / 127 };
  }
  function makeFilter(id) {
    const f = document.createElementNS(SVGNS, "filter");
    for (const [a, v] of [["id", id], ["x", "0"], ["y", "0"], ["width", "100%"], ["height", "100%"], ["color-interpolation-filters", "sRGB"]]) f.setAttribute(a, v);
    const ch = (m, n) => `<feDisplacementMap in="SourceGraphic" in2="map" xChannelSelector="R" yChannelSelector="G" result="d${n}"/><feColorMatrix in="d${n}" type="matrix" values="${m} 0 0 0 1 0" result="${n}"/>`;
    f.innerHTML = '<feImage result="map" x="0" y="0" preserveAspectRatio="none"/>' + ch("1 0 0 0 0 0 0 0 0 0 0 0 0 0 0", "r") + ch("0 0 0 0 0 0 1 0 0 0 0 0 0 0 0", "g") + ch("0 0 0 0 0 0 0 0 0 0 0 0 1 0 0", "b") + '<feBlend in="r" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="b" mode="screen"/>';
    defs().appendChild(f);
    return f;
  }
  var instances = /* @__PURE__ */ new Map();
  var queue = /* @__PURE__ */ new Set();
  var qRaf = 0;
  var filterSeq = 0;
  var ro = null;
  function schedule(g) {
    queue.add(g);
    if (!qRaf) qRaf = requestAnimationFrame(flush);
  }
  function flush() {
    qRaf = 0;
    const t0 = performance.now();
    for (const g of queue) {
      queue.delete(g);
      g._map();
      if (performance.now() - t0 > 10) break;
    }
    if (queue.size) qRaf = requestAnimationFrame(flush);
  }
  var Glass = class {
    constructor(el, options) {
      this.element = el;
      this.id = "lg-f" + ++filterSeq;
      this.key = "";
      this.params = null;
      this.opts = Object.assign({}, OPT_DEFAULTS);
      el.classList.add("lg-glass");
      if (SVG_OK) {
        this.filter = makeFilter(this.id);
        if (!ro) ro = new ResizeObserver((es) => es.forEach((e) => {
          const g = instances.get(e.target);
          if (g) schedule(g);
        }));
        ro.observe(el);
      }
      this.set(options);
    }
    // Atualiza parâmetros e opções. Parâmetros se acumulam: set({ frost: 6 }) mantém o resto.
    set(options = {}) {
      if (typeof options === "string") options = { preset: options };
      this.params = resolve(this.params || defaults, options);
      for (const k of OPTS) if (k in options) this.opts[k] = options[k];
      if (options.zoom != null && options.lens == null) this.opts.lens = true;
      this._apply();
      return this;
    }
    // Força um mapa novo (o tamanho já é observado sozinho)
    refresh() {
      this.key = "";
      if (SVG_OK) schedule(this);
      return this;
    }
    _apply() {
      const el = this.element, s = el.style, p = this.params, o = this.opts;
      const tn = p.tint / 100;
      const la = p.light * Math.PI / 180, lx = Math.cos(la), ly = -Math.sin(la);
      const vars = {
        "--lg-fill": o.fill || (tn >= 0 ? `rgba(255,255,255,${+(tn * 0.5).toFixed(3)})` : `rgba(5,5,13,${+(-tn).toFixed(3)})`),
        "--lg-sat": p.saturation,
        "--lg-frost": p.frost + "px",
        "--lg-blur": Math.max(p.frost, o.fallbackBlur) + "px",
        "--lg-spec": p.specular,
        "--lg-hair": +(0.16 * p.specular).toFixed(3),
        "--lg-rim": o.rim ? p.specular : 0,
        "--lg-rim-angle": 270 - p.light + "deg",
        "--lg-sx": +(-lx * 2.26).toFixed(2) + "px",
        "--lg-sy": +(-ly * 2.26).toFixed(2) + "px",
        "--lg-shadow": +(p.shadow * 0.75).toFixed(3)
      };
      for (const k in vars) s.setProperty(k, vars[k]);
      if (o.radius != null) {
        s.borderRadius = typeof o.radius === "number" ? o.radius + "px" : o.radius;
        this._radius = true;
      } else if (this._radius) {
        s.borderRadius = "";
        this._radius = false;
      }
      this._press(o.press);
      if (SVG_OK) schedule(this);
    }
    _press(v) {
      const el = this.element;
      if (v && !this._pdown) {
        this._pdown = (e) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--lg-mx", e.clientX - r.left + "px");
          el.style.setProperty("--lg-my", e.clientY - r.top + "px");
          el.classList.add("lg-pressed");
        };
        this._pup = () => el.classList.remove("lg-pressed");
        el.addEventListener("pointerdown", this._pdown);
        for (const t of ["pointerup", "pointerleave", "pointercancel"]) el.addEventListener(t, this._pup);
      } else if (!v && this._pdown) {
        el.removeEventListener("pointerdown", this._pdown);
        for (const t of ["pointerup", "pointerleave", "pointercancel"]) el.removeEventListener(t, this._pup);
        this._pdown = this._pup = null;
        el.classList.remove("lg-pressed");
      }
      el.classList.toggle("lg-press", !!v);
      el.style.setProperty("--lg-press-scale", typeof v === "number" ? v : 1.08);
    }
    _map() {
      const el = this.element;
      if (!this.filter || !el.isConnected) return;
      const w = Math.round(el.offsetWidth), h = Math.round(el.offsetHeight);
      if (!w || !h) return;
      const rs = getComputedStyle(el).borderTopLeftRadius;
      const r = Math.min(parseFloat(rs) * (rs.endsWith("%") ? Math.min(w, h) / 100 : 1) || 0, w / 2, h / 2);
      const p = this.params, o = this.opts;
      const k = o.scale === "auto" || o.scale == null ? clamp(Math.min(w, h) / 116, 0.25, 1) : +o.scale;
      const refr = p.refraction * k, bevel = Math.max(p.bevel * k, 1), zoom = o.lens ? p.zoom : 1;
      const key = [w, h, r, refr, bevel, zoom, p.dispersion].join();
      if (key === this.key) return;
      this.key = key;
      const { url, scale } = buildMap(w, h, r, bevel, refr, zoom);
      const fe = this.filter.querySelector("feImage");
      fe.setAttribute("href", url);
      fe.setAttribute("width", w);
      fe.setAttribute("height", h);
      const sp = p.dispersion * 0.1, dm = this.filter.querySelectorAll("feDisplacementMap");
      dm[0].setAttribute("scale", (scale * (1 + sp)).toFixed(2));
      dm[1].setAttribute("scale", scale.toFixed(2));
      dm[2].setAttribute("scale", (scale * (1 - sp)).toFixed(2));
      el.style.setProperty("--lg-filter", `url(#${this.id})`);
      el.classList.add("lg-refract");
    }
    destroy() {
      const el = this.element;
      instances.delete(el);
      queue.delete(this);
      if (ro) ro.unobserve(el);
      if (this.filter) this.filter.remove();
      this._press(false);
      el.classList.remove("lg-glass", "lg-refract", "lg-press");
      VARS.forEach((v) => el.style.removeProperty(v));
      if (this._radius) el.style.borderRadius = "";
    }
  };
  function glass(target, options) {
    if (!hasDOM) return null;
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) throw new Error(`LiquidGlass: elemento n\xE3o encontrado (${target})`);
    injectCSS();
    const g = instances.get(el);
    if (g) return options ? g.set(options) : g;
    const n = new Glass(el, options || {});
    instances.set(el, n);
    return n;
  }
  function glassAll(targets, options) {
    const list = typeof targets === "string" ? document.querySelectorAll(targets) : targets;
    return Array.from(list, (el) => glass(el, options));
  }
  var ATTR = "data-liquid-glass";
  var DATA_ATTRS = [ATTR, ...[...Object.keys(params), ...OPTS].map((k) => "data-" + k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()))];
  function fromData(el) {
    const d = el.dataset, o = {};
    if (d.liquidGlass) o.preset = d.liquidGlass;
    for (const k in params) if (d[k] != null && d[k] !== "") o[k] = +d[k];
    const bool = (v) => v !== "false";
    if (d.lens != null) o.lens = bool(d.lens);
    if (d.rim != null) o.rim = bool(d.rim);
    if (d.press != null) o.press = d.press === "" || d.press === "true" ? true : d.press === "false" ? false : +d.press;
    if (d.radius != null) o.radius = isNaN(+d.radius) ? d.radius : +d.radius;
    if (d.scale != null) o.scale = d.scale === "auto" ? "auto" : +d.scale;
    if (d.fill) o.fill = d.fill;
    if (d.fallbackBlur != null) o.fallbackBlur = +d.fallbackBlur;
    return o;
  }
  function autoOne(el) {
    const old = instances.get(el);
    if (old && old._auto) {
      old.params = null;
      old.opts = Object.assign({}, OPT_DEFAULTS);
      return old.set(fromData(el));
    }
    const g = glass(el, fromData(el));
    g._auto = true;
    return g;
  }
  function auto(root = document) {
    if (!hasDOM) return [];
    const els = Array.from(root.querySelectorAll(`[${ATTR}]`));
    if (root.matches && root.matches(`[${ATTR}]`)) els.unshift(root);
    return els.map(autoOne);
  }
  var mo = null;
  function startAuto() {
    auto();
    if (mo || typeof MutationObserver === "undefined") return;
    mo = new MutationObserver((records) => {
      let removed = false;
      for (const r of records) {
        if (r.type === "attributes") {
          const el = r.target;
          if (el.hasAttribute(ATTR)) autoOne(el);
          else {
            const g = instances.get(el);
            if (g && g._auto) g.destroy();
          }
        } else {
          for (const n of r.addedNodes) if (n.nodeType === 1) auto(n);
          if (r.removedNodes.length) removed = true;
        }
      }
      if (removed) instances.forEach((g) => {
        if (g._auto && !g.element.isConnected) g.destroy();
      });
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: DATA_ATTRS });
  }
  function stopAuto() {
    if (mo) {
      mo.disconnect();
      mo = null;
    }
  }
  if (hasDOM) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startAuto, { once: true });
    else startAuto();
  }

  // src/scenes.js
  var SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  function spacing(c, px) {
    try {
      c.letterSpacing = px + "px";
    } catch (e) {
    }
  }
  function wrapLines(c, text, maxW) {
    const out = [];
    let line = "";
    for (const word of text.split(" ")) {
      const t = line ? line + " " + word : word;
      if (c.measureText(t).width > maxW && line) {
        out.push(line);
        line = word;
      } else line = t;
    }
    if (line) out.push(line);
    return out;
  }
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);
    else c.rect(x, y, w, h);
  }
  function gridLines(c, w, h, step, dark) {
    const fg = dark ? "255,255,255" : "16,18,28";
    c.strokeStyle = `rgba(${fg},${dark ? 0.09 : 0.11})`;
    c.lineWidth = 1;
    c.beginPath();
    for (let x = w % step / 2; x < w; x += step) {
      c.moveTo(Math.round(x) + 0.5, 0);
      c.lineTo(Math.round(x) + 0.5, h);
    }
    for (let y = h % step / 2; y < h; y += step) {
      c.moveTo(0, Math.round(y) + 0.5);
      c.lineTo(w, Math.round(y) + 0.5);
    }
    c.stroke();
  }
  var scenes = {
    // Grade fina sobre o gradiente animado
    grid({ step = 44 } = {}) {
      return (c, w, h, { dark }) => gridLines(c, w, h, step, dark);
    },
    // Título grande (o herói do Lab), sobre a grade
    title({ text = "Liquid Glass", subtitle = "", font = SANS, grid = true } = {}) {
      return (c, w, h, { dark }) => {
        const fg = dark ? "255,255,255" : "16,18,28";
        if (grid) gridLines(c, w, h, 44, dark);
        const x0 = Math.max(20, w * 0.06);
        const words = text.split(" ");
        const two = w < 760 && words.length > 1;
        const lines = two ? [words.slice(0, Math.ceil(words.length / 2)).join(" "), words.slice(Math.ceil(words.length / 2)).join(" ")] : [text];
        c.font = `800 100px ${font}`;
        spacing(c, -4);
        const widest = Math.max(...lines.map((t) => c.measureText(t).width));
        const size = Math.min(100 * (w - x0 * 2) / widest, two ? h * 0.26 : h * 0.3);
        c.font = `800 ${size}px ${font}`;
        spacing(c, -size * 0.04);
        c.fillStyle = `rgb(${fg})`;
        const lh = size * 0.9;
        const top = h * 0.5 - lines.length * lh / 2 + size * 0.72;
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
    stripes({ colors = ["#ff3b5c", "#ffb020", "#2ad17f", "#1fa2ff", "#7b5cff"], width = 22 } = {}) {
      return (c, w, h, { dark }) => {
        const bg = dark ? "#0c0e18" : "#f6f2ea";
        c.fillStyle = bg;
        c.fillRect(0, 0, w, h);
        c.save();
        c.translate(w / 2, h / 2);
        c.rotate(-Math.PI / 4);
        const L = Math.hypot(w, h);
        for (let i = Math.floor(-L / width / 2); i < L / width / 2; i++) {
          if (i % 2 === 0) continue;
          c.fillStyle = colors[(i % colors.length + colors.length) % colors.length];
          c.fillRect(i * width, -L / 2, width, L);
        }
        c.restore();
        const cs = 18, bandY = Math.round(h * 0.62);
        for (let x = 0; x < w; x += cs) for (let k = 0; k < 4; k++) {
          c.fillStyle = (x / cs + k) % 2 ? bg : dark ? "#fff" : "#111";
          c.fillRect(x, bandY + k * cs, cs, cs);
        }
        c.lineWidth = 6;
        for (let r = 20; r < 170; r += 18) {
          c.strokeStyle = r % 36 ? dark ? "#fff" : "#111" : colors[0];
          c.beginPath();
          c.arc(w * 0.22, h * 0.3, r, 0, 7);
          c.stroke();
        }
      };
    },
    // Pôr do sol com montanhas e lago
    landscape() {
      return (c, w, h, { dark }) => {
        const sky = c.createLinearGradient(0, 0, 0, h * 0.7);
        if (dark) {
          sky.addColorStop(0, "#0b1033");
          sky.addColorStop(0.55, "#5a2a7a");
          sky.addColorStop(1, "#ff7a45");
        } else {
          sky.addColorStop(0, "#5fb3ff");
          sky.addColorStop(0.6, "#ffc3a0");
          sky.addColorStop(1, "#ffe0b0");
        }
        c.fillStyle = sky;
        c.fillRect(0, 0, w, h);
        const sx = w * 0.68, sy = h * 0.5;
        const glow = c.createRadialGradient(sx, sy, 0, sx, sy, h * 0.5);
        glow.addColorStop(0, "rgba(255,220,150,.9)");
        glow.addColorStop(1, "rgba(255,220,150,0)");
        c.fillStyle = glow;
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#fff3d6";
        c.beginPath();
        c.arc(sx, sy, Math.min(w, h) * 0.08, 0, 7);
        c.fill();
        const layers = dark ? ["#3b2a63", "#2a1f4d", "#1b1538", "#0f0c24"] : ["#b9a3d9", "#8f7bc2", "#5f4f9a", "#3a2f6e"];
        layers.forEach((col, k) => {
          const base = h * (0.52 + k * 0.07);
          c.fillStyle = col;
          c.beginPath();
          c.moveTo(0, h);
          for (let x = 0; x <= w + 8; x += 8) {
            const y = base - (Math.sin(x * 6e-3 + k * 2.1) * 40 + Math.sin(x * 0.017 + k) * 18 + Math.sin(x * 0.041 + k * 3) * 6) * (1 - k * 0.12);
            c.lineTo(x, y);
          }
          c.lineTo(w, h);
          c.closePath();
          c.fill();
        });
        const lakeY = h * 0.8;
        c.fillStyle = dark ? "#0d0a20" : "#2f2763";
        c.fillRect(0, lakeY, w, h - lakeY);
        for (let y = lakeY + 4, i = 0; y < h; y += 7, i++) {
          const half = (w * 0.05 + i * 3) * (0.6 + 0.4 * Math.sin(i * 1.7));
          c.fillStyle = `rgba(255,214,150,${0.75 - i * 0.03})`;
          c.fillRect(sx - half, y, half * 2, 2.5);
        }
      };
    },
    // Galeria de capas mais alta que o palco: combine com scrollSpeed para rolar em laço
    gallery({
      titles = ["Mar\xE9 Alta", "Vidro Azul", "Neon 84", "C\xEDtrico", "Lua Cheia", "Areia Quente", "Prisma", "Cobalto", "Sol de Meio-dia", "Aurora", "Ondas", "Noturno"],
      artists = ["Lagoa Azul", "Cobalto", "Os Prismas", "Sal & Sol", "Noturno", "Duna"],
      font = SANS
    } = {}) {
      const pairs = [["#ff5f6d", "#ffc371"], ["#4facfe", "#00f2fe"], ["#7f00ff", "#e100ff"], ["#11998e", "#38ef7d"], ["#232526", "#606c88"], ["#f83600", "#f9d423"], ["#fc466b", "#3f5efb"], ["#00c6ff", "#0072ff"], ["#f7971e", "#ffd200"], ["#8e2de2", "#4a00e0"]];
      return (c, w, h, { dark, resize }) => {
        const pad = 14, gap = 14, cols = w < 520 ? 2 : w < 860 ? 3 : 4;
        const tw = (w - pad * 2 - gap * (cols - 1)) / cols, th = tw + 40, pitch = th + gap;
        const rows = Math.ceil(h / pitch) + 1, H = rows * pitch;
        c = resize(H);
        c.fillStyle = dark ? "#0b0c11" : "#f2f3f7";
        c.fillRect(0, 0, w, H);
        let i = 0;
        for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++, i++) {
          const x = pad + k * (tw + gap), y = r * pitch + gap / 2;
          const [a, b] = pairs[i * 7 % pairs.length];
          const g = c.createLinearGradient(x, y, x + tw, y + tw);
          g.addColorStop(0, a);
          g.addColorStop(1, b);
          c.save();
          rrect(c, x, y, tw, tw, 14);
          c.fillStyle = g;
          c.fill();
          c.clip();
          c.fillStyle = "rgba(255,255,255,.3)";
          c.strokeStyle = "rgba(255,255,255,.35)";
          c.lineWidth = 5;
          switch (i % 5) {
            case 0:
              c.beginPath();
              c.arc(x + tw * 0.68, y + tw * 0.32, tw * 0.16, 0, 7);
              c.fillStyle = "rgba(255,255,255,.75)";
              c.fill();
              break;
            case 1:
              for (let s = 0; s < tw; s += 16) c.fillRect(x, y + s, tw, 6);
              break;
            case 2:
              for (let s = tw * 0.1; s < tw * 0.6; s += 14) {
                c.beginPath();
                c.arc(x + tw / 2, y + tw / 2, s, 0, 7);
                c.stroke();
              }
              break;
            case 3:
              c.beginPath();
              c.moveTo(x, y + tw);
              c.lineTo(x + tw * 0.4, y + tw * 0.45);
              c.lineTo(x + tw * 0.7, y + tw * 0.75);
              c.lineTo(x + tw, y + tw * 0.5);
              c.lineTo(x + tw, y + tw);
              c.fill();
              break;
            default:
              for (let yy = 12; yy < tw; yy += 18) for (let xx = 12; xx < tw; xx += 18) {
                c.beginPath();
                c.arc(x + xx, y + yy, 3, 0, 7);
                c.fill();
              }
          }
          c.restore();
          c.fillStyle = dark ? "#f1f2f6" : "#14151a";
          c.font = `600 13.5px ${font}`;
          c.fillText(titles[i % titles.length], x + 2, y + tw + 19);
          c.fillStyle = dark ? "#8d92a0" : "#6b7080";
          c.font = `400 12.5px ${font}`;
          c.fillText(artists[i % artists.length], x + 2, y + tw + 35);
        }
        return H;
      };
    }
  };
  for (const k of Object.keys(scenes)) {
    const make = scenes[k];
    scenes[k] = (o) => make(o && typeof o.fillRect === "function" ? void 0 : o);
  }

  // src/index.js
  var version = "1.0.0";
  var index_default = {
    version,
    params,
    defaults,
    presets,
    presetLabels,
    palettes,
    resolve,
    Stage,
    createStage,
    supportsWebGL,
    glass,
    glassAll,
    auto,
    stopAuto,
    supportsRefraction,
    scenes,
    Spring
  };
  return __toCommonJS(index_exports);
})();
LiquidGlass=LiquidGlass.default;
