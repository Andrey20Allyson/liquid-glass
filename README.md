# liquid-glass

O material Liquid Glass do iOS 26 para a web, numa biblioteca JavaScript sem dependências (~16 KB com gzip).

- **Vidro sobre o DOM** (`glass`): qualquer elemento passa a refratar o que está atrás dele. Usa SVG + `backdrop-filter` e funciona em JavaScript puro ou só com atributos `data-*`.
- **Palco WebGL** (`createStage`): formas de vidro desenhadas num shader, que se fundem como gotas, sobre uma imagem, um vídeo, um canvas ou uma função de desenho.
- **Modelos e parâmetros expostos**: os 5 modelos e os 11 parâmetros do Liquid Glass Lab, com faixas, unidades e descrições, prontos para montar painéis de ajuste.

**Demonstrações:** [playground da biblioteca](https://andrey20allyson.github.io/liquid-glass/playground.html) · [Liquid Glass Lab](https://andrey20allyson.github.io/liquid-glass/)

## Instalar

Pelo CDN do jsDelivr, servido direto deste repositório. Fixe a versão na URL:

```html
<script src="https://cdn.jsdelivr.net/gh/Andrey20Allyson/liquid-glass@1.0.0/dist/liquid-glass.min.js"></script>
<!-- cria window.LiquidGlass -->
```

Como módulo ES:

```js
import LiquidGlass, { glass, createStage, presets, params } from 'https://cdn.jsdelivr.net/gh/Andrey20Allyson/liquid-glass@1.0.0/dist/liquid-glass.esm.min.js';
```

| Arquivo | Para quê |
|---|---|
| `dist/liquid-glass.min.js` | `<script>` comum; expõe `window.LiquidGlass` |
| `dist/liquid-glass.esm.min.js` | `import` em navegador ou bundler |
| `dist/liquid-glass.js` | versão sem minificar, para depurar |
| `dist/liquid-glass.d.ts` | tipos TypeScript |

Outras URLs:

- `…/liquid-glass@1/dist/…` recebe correções e novidades da versão 1 sem quebrar a API.
- `https://andrey20allyson.github.io/liquid-glass/dist/liquid-glass.min.js` (GitHub Pages) sempre aponta para a última versão do branch `main`.

## Uso rápido

### Vidro em qualquer elemento

```html
<nav class="barra">…</nav>
<script>
  LiquidGlass.glass('.barra', { preset: 'frosted', frost: 8 });
</script>
```

Ou sem JavaScript: o valor do atributo é o modelo, e os outros atributos são parâmetros.

```html
<nav data-liquid-glass="frosted" data-frost="10">…</nav>
<button data-liquid-glass data-press>OK</button>
<div data-liquid-glass="drop" data-zoom="1.5" style="width:150px;height:150px"></div>
```

A biblioteca aplica os atributos ao carregar e observa o DOM depois disso, então elementos criados por React, Vue e afins também viram vidro. Mudar ou remover um atributo atualiza ou desfaz o vidro.

### Palco WebGL

```html
<div id="palco" style="height:480px"></div>
<script>
  const stage = LiquidGlass.createStage('#palco', {
    preset: 'drop',
    background: 'foto.jpg',          // ou <img>, <video>, <canvas>, ou uma função de desenho
  });
  stage.add({ x: '30%', y: '50%', width: 260, height: 100, draggable: true });
  stage.add({ x: '70%', y: '40%', width: 140, height: 140, lens: true, draggable: true });

  stage.set({ refraction: 40 });   // muda parâmetros a qualquer momento
  stage.preset('crystal');         // ou troca o modelo inteiro
</script>
```

Imagens de outro domínio precisam de CORS liberado; sem isso o navegador não deixa a textura ir para a GPU.

## Modelos

| Nome | No Lab | Caráter |
|---|---|---|
| `liquid` | Liquid Glass | O padrão: bisel médio, pouca dispersão, sem fosco |
| `drop` | Gota d'água | Bisel largo, refração forte, fusão generosa |
| `frosted` | Fosco | Desfoque de 12 px, bom para vidro com texto por cima |
| `crystal` | Cristal | Bisel fino e muita dispersão, como um prisma |
| `dark` | Escuro | Vidro escurecido (tom −40) com um pouco de fosco |

Os nomes em português do Lab também funcionam: `'gota'`, `'fosco'`, `'cristal'` e `'escuro'`. Os valores ficam em `LiquidGlass.presets`, os rótulos em `LiquidGlass.presetLabels`, e você pode registrar modelos seus:

```js
LiquidGlass.presets.meu = { refraction: 30, frost: 2, tint: 10 };
LiquidGlass.glass('#card', 'meu');
```

## Parâmetros

`LiquidGlass.params` traz, para cada parâmetro, `default`, `min`, `max`, `step`, `unit`, `label`, `description` e `modes` (onde ele tem efeito).

| Parâmetro | Faixa | Padrão | Onde | O que faz |
|---|---|---|---|---|
| `refraction` | 0 a 60 px | 24 | WebGL, DOM | Quanto o bisel puxa o fundo para dentro, como uma lente convexa |
| `bevel` | 4 a 80 px | 30 | WebGL, DOM | Largura da borda curva onde a refração acontece |
| `dispersion` | 0 a 1 | 0.08 | WebGL, DOM | Separação das cores no bisel (aberração cromática) |
| `frost` | 0 a 24 px | 0 | WebGL, DOM | Desfoque do fundo; use de 4 a 12 em vidro com texto |
| `specular` | 0 a 1 | 0.85 | WebGL, DOM | Intensidade do filete de luz na borda |
| `merge` | 0 a 140 px | 44 | WebGL | Distância em que as formas se fundem como gotas |
| `zoom` | 1 a 2 × | 1.3 | WebGL, DOM | Ampliação das formas marcadas como lente |
| `light` | 0 a 360 ° | 135 | WebGL, DOM | Ângulo da luz (135 = de cima à esquerda) |
| `shadow` | 0 a 1 | 0.3 | WebGL, DOM | Opacidade da sombra |
| `tint` | −60 a 60 | 6 | WebGL, DOM | Positivo clareia, negativo escurece |
| `saturation` | 0 a 2.5 × | 1.25 | WebGL, DOM | Saturação vista através do vidro |

Todo lugar que aceita parâmetros aceita também `preset`: o modelo é aplicado primeiro e os parâmetros soltos vencem. Também dá para passar só o nome do modelo como string.

```js
LiquidGlass.glass(el, 'crystal');
LiquidGlass.glass(el, { preset: 'crystal', dispersion: 0.2 });
LiquidGlass.resolve(LiquidGlass.defaults, 'drop'); // objeto final, com os 11 valores
```

Para montar um painel de ajustes:

```js
for (const [nome, p] of Object.entries(LiquidGlass.params)) {
  const input = Object.assign(document.createElement('input'), { type: 'range', min: p.min, max: p.max, step: p.step, value: stage.params[nome] });
  input.oninput = () => stage.set({ [nome]: +input.value });
  painel.append(p.label, input);
}
```

## API

### `glass(elemento, opções?)` → `Glass`

Transforma um elemento (ou o primeiro que casar com um seletor) em vidro. Chamar de novo no mesmo elemento atualiza o vidro existente.

Além dos parâmetros e de `preset`, aceita:

| Opção | Padrão | |
|---|---|---|
| `lens` | `false` | Aplica o `zoom`. Liga sozinho quando você passa `zoom`. |
| `press` | `false` | Brilho no ponto de toque e escala com mola. Um número define a escala (`1` deixa só o brilho). |
| `rim` | `true` | Contorno de luz em gradiente. |
| `scale` | `'auto'` | Fator de refração e bisel. Em `'auto'`, cresce com o tamanho do elemento: um botão de 44 px usa cerca de 40% do que uma lente de 116 px usa. |
| `radius` | do CSS | `border-radius` (número = px). Sem CSS, vira pílula. |
| `fill` | do `tint` | Cor de fundo do vidro, que substitui o `tint`. Aceita `var(--minha-cor)`. |
| `fallbackBlur` | `8` | Desfoque usado onde não há refração SVG. |

O objeto devolvido tem `set(opções)` (os parâmetros se acumulam), `refresh()`, `destroy()`, `element` e `params`.

Os atributos do modo declarativo têm os mesmos nomes em kebab-case: `data-refraction`, `data-frost`, `data-zoom`, `data-press`, `data-fill`, `data-fallback-blur` e assim por diante.

Funções relacionadas:

- **`glassAll(seletor | lista, opções?)`** aplica a vários elementos e devolve um array.
- **`auto(raiz?)`** aplica a todo `[data-liquid-glass]` dentro da raiz. Já roda sozinha no carregamento.
- **`stopAuto()`** para de observar o DOM.
- **`supportsRefraction()`** diz se o navegador faz a refração SVG.

### `createStage(alvo, opções?)` → `Stage`

O alvo pode ser um `<canvas>` ou qualquer elemento. No segundo caso, a biblioteca cria um canvas que ocupa o elemento inteiro. Lança erro se não houver WebGL; use `supportsWebGL()` antes se precisar de alternativa.

| Opção | Padrão | |
|---|---|---|
| `background` | nenhum | Imagem, vídeo, canvas, `ImageBitmap`, URL ou função `(ctx, w, h, info) => altura?` |
| `fit` | `'cover'` | `'cover'`, `'contain'` ou `'fill'` para imagens e vídeos |
| `gradient` | só sem fundo | Gradiente animado atrás do conteúdo. Aceita `{ background, colors, mix }`. |
| `theme` | `'auto'` | `'auto'` segue `<html data-theme>` e o sistema |
| `shapes` | `[]` | Formas iniciais, como em `add()` |
| `maxShapes` | `8` | Até 16 |
| `scale` | `1` | Multiplica refração, bisel e fusão (útil em telas pequenas) |
| `drift` | `false` | As formas flutuam devagar quando ninguém arrasta |
| `stretch` | `true` | As formas esticam conforme a velocidade |
| `scrollSpeed` | `0` | Rola o conteúdo em laço, em px/s |
| `live` | `false` | Redesenha o fundo a cada quadro. Vídeos já fazem isso. |
| `maxDpr` | `2` | Limite de densidade de pixels |
| `autoRender` | `true` | `false` para chamar `stage.step()` você mesmo |

Métodos do palco:

- `set(parâmetros)` e `preset(nome)`. Também dá para alterar `stage.params` direto.
- `add(forma)`, `remove(forma)` e `clear()`.
- `setBackground(fundo)`, `setTheme(tema)` e `redraw()`.
- `glowAt(x, y)` e `glowOff()`.
- `on(evento, fn)` e `off(evento, fn)`.
- `resize()`, `step(dt)`, `render(dt)` e `destroy()`.

Eventos: `dragstart`, `drag`, `dragend` (recebem a forma), `frame` (recebe `dt`) e `resize` (recebe largura e altura).

#### Formas: `stage.add(opções)` → `Shape`

| Opção | Padrão | |
|---|---|---|
| `x`, `y` | `'50%'` | Centro em px ou em `'%'` do palco. Porcentagens acompanham o redimensionamento. |
| `width`, `height` | `120` | Tamanho em px. Sem `height`, a forma fica quadrada. |
| `radius` | pílula | Raio do canto |
| `lens` | `false` | Usa o `zoom` do palco |
| `zoom` | | Zoom próprio, que vence `lens` |
| `draggable` | `false` | Cria uma alça invisível que funciona com mouse, toque e setas do teclado |
| `label` | | Nome lido por leitores de tela |
| `visible` | `true` | |
| `stiffness`, `damping` | `190`, `19` | Mola de posição e tamanho |

A forma tem `set(opções, imediato?)`, `moveTo(x, y)`, `resize(w, h)` e `remove()`. Sem `imediato`, posição e tamanho andam com mola, e é isso que produz a fusão líquida quando duas formas se aproximam. A posição e o tamanho atuais ficam em `x`, `y`, `width` e `height`.

#### Fundo como função

```js
createStage('#palco', {
  background(ctx, w, h, { dark }) {
    ctx.fillStyle = dark ? '#111' : '#eee';
    ctx.fillRect(0, 0, w, h);
    ctx.font = '700 64px system-ui';
    ctx.fillStyle = dark ? '#fff' : '#000';
    ctx.fillText('Olá', 40, h / 2);
  },
});
```

O `ctx` já vem em px CSS. Para conteúdo mais alto que o palco (que rola com `scrollSpeed`), chame `info.resize(altura)`, desenhe no `ctx` que ela devolve e retorne a altura.

Fundos prontos, todos fábricas com opções: `scenes.title({ text, subtitle })`, `scenes.grid()`, `scenes.stripes()`, `scenes.landscape()` e `scenes.gallery()`.

### Outros

- **`version`**: versão da biblioteca.
- **`defaults`**: os 11 valores padrão.
- **`palettes`**: as cores do gradiente animado.
- **`Spring`**: a mola usada nas animações.
- **`supportsWebGL()`**: diz se o navegador tem WebGL.

## Compatibilidade e limites

- **WebGL:** funciona em Chrome, Edge, Safari e Firefox.
- **Refração SVG no DOM:** só no Chromium (Chrome, Edge, Opera, Samsung Internet), porque só ele aceita `url()` em `backdrop-filter`. Nos outros navegadores, o mesmo elemento vira vidro desfocado com brilho e sombra, sem refração.
- **Vidro dentro de vidro não refrata.** Um elemento com `backdrop-filter` vira a raiz do fundo dos descendentes. Se precisar de vidro sobre vidro, use elementos irmãos, com o de baixo como camada de fundo (`position:absolute; inset:0; z-index:-1`).
- **Pseudo-elementos:** o vidro do DOM usa `::before` (brilho do toque) e `::after` (contorno). Os estilos da biblioteca entram com especificidade zero (`:where`), então o CSS da sua página sempre vence.
- **Custo:** cada elemento de vidro no DOM gera um mapa de deslocamento na CPU, que é refeito quando o tamanho muda. Mudanças por `transform` não custam nada.
- **Movimento reduzido:** `prefers-reduced-motion` desliga a deriva, o gradiente animado e a rolagem automática.

## Desenvolvimento

```bash
npm install
npm run build        # gera dist/
```

O código fica em `src/`, com os shaders em `src/shaders/*.glsl`. O `playground.html` usa o `dist/` e serve de teste manual. O `index.html` é o Liquid Glass Lab original.

Para publicar uma versão nova:

1. Suba `version` no `package.json` e rode `npm run build`.
2. Faça o commit do `dist/` junto com o código.
3. Crie a tag `vX.Y.Z` e envie com `git push --follow-tags`.

O jsDelivr passa a servir a nova versão pela URL com `@X.Y.Z`.

## Licença

MIT
