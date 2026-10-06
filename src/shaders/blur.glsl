// Passos 2 e 3: desfoque gaussiano separável em meia resolução
varying vec2 v;
uniform sampler2D uTex;
uniform vec2 uDir;
uniform float uSigma;
void main(){
  vec4 s = vec4(0.0); float ws = 0.0;
  float st = max(1.0, uSigma * 3.0 / 12.0);
  for (int i = -12; i <= 12; i++){
    float x = float(i) * st;
    float w = exp(-0.5 * x * x / (uSigma * uSigma));
    s += texture2D(uTex, v + uDir * x) * w; ws += w;
  }
  gl_FragColor = s / ws;
}
