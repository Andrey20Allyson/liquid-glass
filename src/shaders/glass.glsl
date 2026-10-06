// Passo 4: o vidro. Formas = retângulos arredondados unidos por smin (fusão líquida).
// MAXS é definido em tempo de execução (opção maxShapes).
varying vec2 v;
uniform sampler2D uScene, uBlur;
uniform vec2 uRes;
uniform float uDpr;
uniform int uCount;
uniform vec4 uShape[MAXS];   // centro x, centro y, meia largura, meia altura (px CSS)
uniform vec2 uShape2[MAXS];  // raio do canto, zoom
uniform float uK, uRefr, uBevel, uDisp, uFrostMix, uSpec, uSat, uShadow;
uniform vec2 uLight;
uniform vec4 uTint, uGlow;
float sdBox(vec2 p, vec2 b, float r){
  r = min(r, min(b.x, b.y));
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
float smin(float a, float b, float k){
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}
float field(vec2 p){
  float d = 1e5;
  for (int i = 0; i < MAXS; i++){
    if (i >= uCount) break;
    float di = sdBox(p - uShape[i].xy, uShape[i].zw, uShape2[i].x);
    d = uK > 0.5 ? smin(d, di, uK) : min(d, di);
  }
  return d;
}
vec2 lens(vec2 p){
  vec2 acc = vec2(0.0); float ws = 0.0;
  for (int i = 0; i < MAXS; i++){
    if (i >= uCount) break;
    float di = sdBox(p - uShape[i].xy, uShape[i].zw, uShape2[i].x);
    float w = exp(-clamp(di, -40.0, 120.0) * 0.08);
    acc += w * (uShape[i].xy - p) * (1.0 - 1.0 / uShape2[i].y);
    ws += w;
  }
  return acc / max(ws, 1e-4);
}
// a dispersão age só no bisel; a ampliação da lupa é igual nos três canais
vec3 tap(sampler2D t, vec2 uv, vec2 o, vec2 z, vec2 k){
  return vec3(texture2D(t, uv + (o * (1.0 + uDisp) + z) * k).r,
              texture2D(t, uv + (o + z) * k).g,
              texture2D(t, uv + (o * (1.0 - uDisp) + z) * k).b);
}
void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  vec2 p = vec2(fc.x, uRes.y - fc.y) / uDpr;
  vec3 bg = texture2D(uScene, uv).rgb;
  float d = field(p);
  float aa = 1.0 / uDpr;
  float sh = 0.0;
  if (uShadow > 0.0 && d < 40.0){
    float ds = field(p - vec2(0.0, 8.0));
    sh = uShadow * (1.0 - smoothstep(-10.0, 30.0, ds));
  }
  vec3 outside = bg * (1.0 - sh);
  if (d > aa){ gl_FragColor = vec4(outside, 1.0); return; }
  vec2 e = vec2(0.5, 0.0);
  vec2 g = vec2(field(p + e.xy) - field(p - e.xy), field(p + e.yx) - field(p - e.yx));
  float gm = length(g);
  g = gm > 1e-5 ? g / gm : vec2(0.0);
  float x = max(-d, 0.0);
  float s = 1.0 - clamp(x / max(uBevel, 1.0), 0.0, 1.0);
  // bisel convexo: a amostra do fundo é puxada para dentro, mais forte junto da borda
  vec2 off = -g * uRefr * s * s;
  vec2 zo = lens(p);
  vec2 k = vec2(uDpr / uRes.x, -uDpr / uRes.y);
  vec3 col = tap(uScene, uv, off, zo, k);
  if (uFrostMix > 0.0) col = mix(col, tap(uBlur, uv, off, zo, k), uFrostMix);
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSat);
  col = mix(col, uTint.rgb, uTint.a);
  // luz: filete na borda + brilho no bisel, nos dois lados do eixo da luz
  float f = dot(g, uLight);
  float lit = max(f, 0.0), back = max(-f, 0.0);
  float rim = 1.0 - smoothstep(0.0, 1.6, x);
  col += uSpec * rim * (0.18 + 0.75 * pow(lit, 1.5) + 0.38 * pow(back, 1.5));
  col += uSpec * s * s * s * (0.22 * lit * lit + 0.08 * back * back);
  col = mix(col, vec3(1.0), uSpec * 0.07 * pow(s, 4.0));
  if (uGlow.z > 0.001){
    float gd = length(p - uGlow.xy);
    col += uGlow.z * 0.28 * exp(-gd * gd / (2.0 * uGlow.w * uGlow.w));
  }
  float m = clamp(0.5 - d / aa, 0.0, 1.0);
  gl_FragColor = vec4(mix(outside, col, m), 1.0);
}
