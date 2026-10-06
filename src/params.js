/* ================= Parâmetros e modelos ================= */
// Esquema dos parâmetros: serve para validar e para montar painéis de ajuste.
// `modes` diz onde o parâmetro tem efeito: 'webgl' (createStage) e/ou 'dom' (glass).
export const params = {
  refraction: { default: 24, min: 0, max: 60, step: 1, unit: 'px', modes: ['webgl', 'dom'], label: 'Refração', description: 'Quanto o bisel puxa o fundo para dentro, como uma lente convexa.' },
  bevel: { default: 30, min: 4, max: 80, step: 1, unit: 'px', modes: ['webgl', 'dom'], label: 'Bisel', description: 'Largura da borda curva onde a refração acontece.' },
  dispersion: { default: 0.08, min: 0, max: 1, step: 0.01, unit: '', modes: ['webgl', 'dom'], label: 'Dispersão', description: 'Separação das cores no bisel (aberração cromática).' },
  frost: { default: 0, min: 0, max: 24, step: 0.5, unit: 'px', modes: ['webgl', 'dom'], label: 'Fosco', description: 'Desfoque do que está atrás do vidro. Use 4 a 12 em vidro com texto por cima.' },
  specular: { default: 0.85, min: 0, max: 1, step: 0.01, unit: '', modes: ['webgl', 'dom'], label: 'Brilho', description: 'Intensidade do filete de luz na borda.' },
  merge: { default: 44, min: 0, max: 140, step: 1, unit: 'px', modes: ['webgl'], label: 'Fusão', description: 'Distância em que duas formas começam a se fundir como gotas.' },
  zoom: { default: 1.3, min: 1, max: 2, step: 0.01, unit: '×', modes: ['webgl', 'dom'], label: 'Lupa', description: 'Ampliação das formas marcadas como lente (lens: true).' },
  light: { default: 135, min: 0, max: 360, step: 1, unit: '°', modes: ['webgl', 'dom'], label: 'Luz', description: 'Ângulo de onde vem a luz (135 = de cima à esquerda).' },
  shadow: { default: 0.3, min: 0, max: 1, step: 0.01, unit: '', modes: ['webgl', 'dom'], label: 'Sombra', description: 'Opacidade da sombra projetada.' },
  tint: { default: 6, min: -60, max: 60, step: 1, unit: '', modes: ['webgl', 'dom'], label: 'Tom', description: 'Positivo clareia o vidro, negativo escurece, 0 é neutro.' },
  saturation: { default: 1.25, min: 0, max: 2.5, step: 0.01, unit: '×', modes: ['webgl', 'dom'], label: 'Saturação', description: 'Saturação das cores vistas através do vidro.' },
};

export const defaults = Object.fromEntries(Object.entries(params).map(([k, p]) => [k, p.default]));

// Os cinco modelos do Liquid Glass Lab
export const presets = {
  liquid: { refraction: 24, bevel: 30, dispersion: 0.08, frost: 0, specular: 0.85, merge: 44, zoom: 1.3, shadow: 0.3, tint: 6, saturation: 1.25 },
  drop: { refraction: 46, bevel: 70, dispersion: 0.2, frost: 0, specular: 1, merge: 96, zoom: 1.6, shadow: 0.45, tint: 0, saturation: 1.35 },
  frosted: { refraction: 14, bevel: 22, dispersion: 0.04, frost: 12, specular: 0.7, merge: 40, zoom: 1, shadow: 0.25, tint: 24, saturation: 1.5 },
  crystal: { refraction: 34, bevel: 16, dispersion: 0.5, frost: 0, specular: 1, merge: 20, zoom: 1.15, shadow: 0.2, tint: 0, saturation: 1.1 },
  dark: { refraction: 22, bevel: 28, dispersion: 0.06, frost: 4, specular: 0.6, merge: 44, zoom: 1.2, shadow: 0.45, tint: -40, saturation: 1.1 },
};
export const presetLabels = { liquid: 'Liquid Glass', drop: "Gota d'água", frosted: 'Fosco', crystal: 'Cristal', dark: 'Escuro' };
// Os nomes em português do Lab também funcionam
const aliases = { gota: 'drop', fosco: 'frosted', cristal: 'crystal', escuro: 'dark' };

// Cores do gradiente animado atrás do conteúdo, por tema
export const palettes = {
  dark: { background: '#07080f', colors: ['#3d5afe', '#ff2d6f', '#00b8d4', '#7c4dff', '#ff9100'], mix: 0.9 },
  light: { background: '#eef1f8', colors: ['#7aa2ff', '#ff8fb1', '#5fe0f0', '#b69cff', '#ffc46b'], mix: 0.85 },
};

export function getPreset(name) {
  const p = presets[name] || presets[aliases[name]];
  if (!p) throw new Error(`LiquidGlass: modelo desconhecido "${name}". Use: ${Object.keys(presets).join(', ')}`);
  return p;
}

// Junta base + modelo + parâmetros soltos. `input` pode ser o nome de um modelo ou um objeto com `preset`.
export function resolve(base, input) {
  const out = Object.assign({}, base);
  if (typeof input === 'string') input = { preset: input };
  if (!input) return out;
  if (input.preset) Object.assign(out, getPreset(input.preset));
  for (const k in params) if (input[k] != null && input[k] !== '') out[k] = +input[k];
  return out;
}
