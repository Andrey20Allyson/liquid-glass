// Passo 1: cena = gradiente animado + textura de conteúdo (pré-multiplicada, com rolagem vertical em laço)
varying vec2 v;
uniform sampler2D uContent;
uniform vec2 uRes;
uniform float uTime, uScroll, uCScale, uMix;
uniform vec3 uBg;
uniform vec3 uC[5];
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){
  float asp = uRes.x / uRes.y;
  vec2 q = vec2(v.x * asp, 1.0 - v.y);
  float t = uTime * 0.11;
  vec3 col = uBg;
  for (int i = 0; i < 5; i++){
    float fi = float(i);
    vec2 c = vec2((0.12 + 0.76 * fract(fi * 0.618 + 0.11)) * asp + 0.16 * asp * sin(t * (0.8 + 0.17 * fi) + fi * 1.9),
                  0.15 + 0.7 * fract(fi * 0.381 + 0.27) + 0.2 * cos(t * (0.9 + 0.13 * fi) + fi * 2.7));
    float r = 0.36 + 0.1 * sin(t * 0.6 + fi * 1.3);
    float dd = length(q - c);
    col = mix(col, uC[i], exp(-dd * dd / (r * r)) * uMix);
  }
  float cy = fract((1.0 - v.y) / uCScale + uScroll);
  vec4 c = texture2D(uContent, vec2(v.x, 1.0 - cy));
  col = col * (1.0 - c.a) + c.rgb;
  col += (hash(gl_FragCoord.xy + fract(uTime * 7.0)) - 0.5) * (1.5 / 255.0);
  gl_FragColor = vec4(col, 1.0);
}
