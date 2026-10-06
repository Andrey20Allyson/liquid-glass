// Tipos de liquid-glass

/** Os 11 parâmetros do vidro. */
export interface GlassParams {
  /** Quanto o bisel puxa o fundo para dentro, como lente convexa (px). 0–60, padrão 24. */
  refraction: number;
  /** Largura da borda curva onde a refração acontece (px). 4–80, padrão 30. */
  bevel: number;
  /** Separação das cores no bisel (aberração cromática). 0–1, padrão 0.08. */
  dispersion: number;
  /** Desfoque do fundo (px). 0–24, padrão 0. */
  frost: number;
  /** Intensidade do filete de luz na borda. 0–1, padrão 0.85. */
  specular: number;
  /** Distância em que as formas se fundem como gotas (px). Só WebGL. 0–140, padrão 44. */
  merge: number;
  /** Ampliação das formas marcadas como lente. 1–2, padrão 1.3. */
  zoom: number;
  /** Ângulo da luz em graus (135 = de cima à esquerda). 0–360. */
  light: number;
  /** Opacidade da sombra. 0–1, padrão 0.3. */
  shadow: number;
  /** Positivo clareia, negativo escurece. -60–60, padrão 6. */
  tint: number;
  /** Saturação vista através do vidro. 0–2.5, padrão 1.25. */
  saturation: number;
}
export type ParamName = keyof GlassParams;

export interface ParamSpec {
  default: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  modes: Array<'webgl' | 'dom'>;
  label: string;
  description: string;
}

export type PresetName = 'liquid' | 'drop' | 'frosted' | 'crystal' | 'dark';
/** Também aceita os nomes do Lab: 'gota', 'fosco', 'cristal', 'escuro', ou um modelo seu adicionado em `presets`. */
export type PresetInput = PresetName | 'gota' | 'fosco' | 'cristal' | 'escuro' | (string & {});

export type ParamInput = Partial<GlassParams> & { preset?: PresetInput };

export interface Palette { background: string; colors: string[]; mix: number }

export const version: string;
export const params: Record<ParamName, ParamSpec>;
export const defaults: GlassParams;
export const presets: Record<PresetName, Partial<GlassParams>> & Record<string, Partial<GlassParams>>;
export const presetLabels: Record<PresetName, string>;
export const palettes: { dark: Palette; light: Palette };
/** Junta base + modelo + parâmetros soltos. */
export function resolve(base: GlassParams, input?: PresetInput | ParamInput): GlassParams;

/* ---------- WebGL ---------- */
export interface SceneInfo {
  dark: boolean;
  dpr: number;
  time: number;
  stage: Stage;
  /** Redimensiona o canvas do conteúdo para uma altura maior (conteúdo que rola) e devolve o novo ctx. */
  resize(height: number): CanvasRenderingContext2D;
}
/** Desenha o conteúdo atrás do vidro em px CSS. Pode devolver a altura total do conteúdo. */
export type SceneFn = (ctx: CanvasRenderingContext2D, width: number, height: number, info: SceneInfo) => number | void;
export type Background = SceneFn | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas | string | null;

export interface StageOptions extends ParamInput {
  /** Conteúdo atrás do vidro. Sem fundo, aparece só o gradiente animado. */
  background?: Background;
  /** Como imagens e vídeos preenchem o palco. Padrão 'cover'. */
  fit?: 'cover' | 'contain' | 'fill';
  /** Gradiente animado atrás do conteúdo. Padrão: ligado só quando não há `background`. */
  gradient?: boolean | Partial<Palette>;
  /** 'auto' segue <html data-theme> e o sistema. */
  theme?: 'auto' | 'light' | 'dark';
  /** Formas desenhadas (1–16). Padrão 8. */
  maxShapes?: number;
  /** Multiplica refração, bisel e fusão (útil em telas pequenas). Padrão 1. */
  scale?: number;
  /** As formas flutuam devagar quando ninguém arrasta. */
  drift?: boolean;
  /** As formas esticam conforme a velocidade. Padrão true. */
  stretch?: boolean;
  /** Rola o conteúdo em laço, em px/s (combine com scenes.gallery). */
  scrollSpeed?: number;
  /** Redesenha o fundo a cada quadro (fundo animado). Vídeos já fazem isso. */
  live?: boolean;
  /** Limite de densidade de pixels. Padrão 2. */
  maxDpr?: number;
  /** false para chamar stage.step() você mesmo. */
  autoRender?: boolean;
  shapes?: ShapeOptions[];
}

export interface ShapeOptions {
  /** Centro em px ou '%' do palco. Padrão '50%'. */
  x?: number | string;
  y?: number | string;
  width?: number;
  height?: number;
  /** Raio do canto. Padrão: pílula. */
  radius?: number | null;
  /** Usa o parâmetro `zoom` do palco (lupa). */
  lens?: boolean;
  /** Zoom próprio desta forma (vence `lens`). */
  zoom?: number | null;
  /** Cria uma alça invisível para arrastar com mouse, toque e setas do teclado. */
  draggable?: boolean;
  /** Nome lido por leitores de tela na alça. */
  label?: string;
  visible?: boolean;
  /** Rigidez e amortecimento da mola. Padrão 190 / 19. */
  stiffness?: number;
  damping?: number;
}

export interface Shape {
  readonly stage: Stage;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly dragging: boolean;
  /** Alça DOM, quando draggable. */
  readonly el: HTMLElement | null;
  radius: number | null;
  zoom: number | null;
  lens: boolean;
  visible: boolean;
  /** Muda propriedades; sem `immediate`, posição e tamanho andam com mola. */
  set(o: ShapeOptions, immediate?: boolean): this;
  moveTo(x: number | string, y: number | string, immediate?: boolean): this;
  resize(width: number, height?: number, immediate?: boolean): this;
  remove(): void;
}

export interface StageEvents {
  dragstart: (shape: Shape, e: PointerEvent) => void;
  drag: (shape: Shape, e: PointerEvent | KeyboardEvent) => void;
  dragend: (shape: Shape, e: PointerEvent) => void;
  frame: (dt: number, time: number) => void;
  resize: (width: number, height: number) => void;
}

export class Stage {
  constructor(target: HTMLCanvasElement | HTMLElement | string, options?: StageOptions);
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext | WebGL2RenderingContext;
  /** Parâmetros atuais; pode alterar direto, o próximo quadro já usa. */
  params: GlassParams;
  readonly shapes: Shape[];
  readonly w: number;
  readonly h: number;
  scale: number;
  drift: boolean;
  stretch: boolean;
  scrollSpeed: number;
  live: boolean;
  set(input: PresetInput | ParamInput): this;
  preset(name: PresetInput): this;
  setTheme(theme: 'auto' | 'light' | 'dark'): this;
  setBackground(bg: Background): this;
  add(o?: ShapeOptions): Shape;
  remove(shape: Shape): this;
  clear(): this;
  /** Brilho no ponto de toque (px do palco). */
  glowAt(x: number, y: number): this;
  glowOff(): this;
  on<K extends keyof StageEvents>(type: K, fn: StageEvents[K]): this;
  off<K extends keyof StageEvents>(type: K, fn: StageEvents[K]): this;
  /** Redesenha o conteúdo de fundo. */
  redraw(): this;
  resize(): boolean;
  /** Um quadro completo (molas + render). Só precisa chamar com autoRender: false. */
  step(dt?: number, time?: number): void;
  render(dt?: number): void;
  destroy(): void;
}
/** Cria um palco WebGL num <canvas> (ou dentro de um elemento, criando o canvas). Lança erro sem WebGL. */
export function createStage(target: HTMLCanvasElement | HTMLElement | string, options?: StageOptions): Stage;
export function supportsWebGL(): boolean;

/* ---------- DOM ---------- */
export interface GlassOptions extends ParamInput {
  /** Aplica o `zoom` (lupa). Ligado sozinho quando você passa `zoom`. */
  lens?: boolean;
  /** Brilho no ponto de toque e escala com mola. Número = escala (1 = só brilho). */
  press?: boolean | number;
  /** Contorno de luz em gradiente (::after). Padrão true. */
  rim?: boolean;
  /** Fator de refração/bisel. 'auto' ajusta ao tamanho do elemento. Padrão 'auto'. */
  scale?: 'auto' | number;
  /** border-radius (número = px). Padrão: o do CSS do elemento, ou pílula. */
  radius?: number | string | null;
  /** Cor de fundo do vidro (substitui o `tint`). */
  fill?: string | null;
  /** Desfoque usado onde não há refração SVG (Safari, Firefox). Padrão 8. */
  fallbackBlur?: number;
}

export interface Glass {
  readonly element: HTMLElement;
  readonly params: GlassParams;
  /** Parâmetros se acumulam: set({ frost: 6 }) mantém o resto. */
  set(options: PresetInput | GlassOptions): this;
  /** Força um mapa de refração novo. */
  refresh(): this;
  destroy(): void;
}

/** Transforma um elemento em vidro. Chamar de novo no mesmo elemento atualiza. */
export function glass(target: HTMLElement | string, options?: PresetInput | GlassOptions): Glass;
export function glassAll(targets: string | ArrayLike<HTMLElement>, options?: PresetInput | GlassOptions): Glass[];
/** Aplica o vidro a todo [data-liquid-glass] dentro de `root`. Já roda sozinho no carregamento e observa o DOM. */
export function auto(root?: ParentNode): Glass[];
/** Para de observar o DOM em busca de [data-liquid-glass]. */
export function stopAuto(): void;
/** true no Chromium: refração SVG via backdrop-filter. Nos outros, o vidro fica só desfocado. */
export function supportsRefraction(): boolean;

/* ---------- Extras ---------- */
export const scenes: {
  grid(o?: { step?: number }): SceneFn;
  title(o?: { text?: string; subtitle?: string; font?: string; grid?: boolean }): SceneFn;
  stripes(o?: { colors?: string[]; width?: number }): SceneFn;
  landscape(): SceneFn;
  gallery(o?: { titles?: string[]; artists?: string[]; font?: string }): SceneFn;
};

export class Spring {
  constructor(x?: number, stiffness?: number, damping?: number);
  /** Posição atual, alvo e velocidade. */
  x: number;
  t: number;
  v: number;
  step(dt: number): void;
  set(x: number): void;
  readonly idle: boolean;
}

declare const LiquidGlass: {
  version: typeof version;
  params: typeof params;
  defaults: typeof defaults;
  presets: typeof presets;
  presetLabels: typeof presetLabels;
  palettes: typeof palettes;
  resolve: typeof resolve;
  Stage: typeof Stage;
  createStage: typeof createStage;
  supportsWebGL: typeof supportsWebGL;
  glass: typeof glass;
  glassAll: typeof glassAll;
  auto: typeof auto;
  stopAuto: typeof stopAuto;
  supportsRefraction: typeof supportsRefraction;
  scenes: typeof scenes;
  Spring: typeof Spring;
};
export default LiquidGlass;
