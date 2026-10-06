// Gera dist/: script global (window.LiquidGlass), módulo ES e tipos. Uso: npm run build
import * as esbuild from 'esbuild';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const banner = `/*! liquid-glass v${pkg.version} | MIT | https://github.com/Andrey20Allyson/liquid-glass */`;

// GLSL sem comentários nem espaços sobrando; linhas de pré-processador ficam em linha própria
function minifyGlsl(src) {
  let out = '';
  for (let line of src.replace(/\/\*[\s\S]*?\*\//g, '').split('\n')) {
    line = line.replace(/\/\/.*$/, '').trim();
    if (!line) continue;
    if (line.startsWith('#')) { out += '\n' + line + '\n'; continue; }
    line = line.replace(/\s+/g, ' ').replace(/\s*([{}()[\];,=+\-*/<>!?:&|.])\s*/g, '$1');
    if (/\w$/.test(out) && /^\w/.test(line)) out += ' ';
    out += line;
  }
  return out.replace(/\n+/g, '\n').trim();
}
const glsl = {
  name: 'glsl',
  setup(b) {
    b.onLoad({ filter: /\.glsl$/ }, async a => ({
      contents: 'export default ' + JSON.stringify(minifyGlsl(await fs.promises.readFile(a.path, 'utf8'))),
      loader: 'js',
    }));
  },
};

const common = {
  entryPoints: ['src/index.js'],
  bundle: true,
  target: 'es2019',
  banner: { js: banner },
  define: { __VERSION__: JSON.stringify(pkg.version) },
  plugins: [glsl],
  legalComments: 'none',
  logLevel: 'info',
};

fs.rmSync('dist', { recursive: true, force: true });
await Promise.all([
  esbuild.build({ ...common, format: 'iife', globalName: 'LiquidGlass', outfile: 'dist/liquid-glass.js', footer: { js: 'LiquidGlass=LiquidGlass.default;' } }),
  esbuild.build({ ...common, format: 'iife', globalName: 'LiquidGlass', outfile: 'dist/liquid-glass.min.js', minify: true, sourcemap: true, footer: { js: 'LiquidGlass=LiquidGlass.default;' } }),
  esbuild.build({ ...common, format: 'esm', outfile: 'dist/liquid-glass.esm.min.js', minify: true, sourcemap: true }),
]);
fs.copyFileSync('src/index.d.ts', 'dist/liquid-glass.d.ts');
