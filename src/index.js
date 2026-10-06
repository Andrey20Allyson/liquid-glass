/* Liquid Glass: refração em WebGL e vidro SVG sobre o DOM, no estilo do iOS 26. */
import { params, defaults, presets, presetLabels, palettes, resolve } from './params.js';
import { Stage, createStage, supportsWebGL } from './stage.js';
import { glass, glassAll, auto, stopAuto, supportsRefraction } from './dom.js';
import { scenes } from './scenes.js';
import { Spring } from './util.js';

export const version = __VERSION__;
export { params, defaults, presets, presetLabels, palettes, resolve, Stage, createStage, supportsWebGL, glass, glassAll, auto, stopAuto, supportsRefraction, scenes, Spring };

export default {
  version, params, defaults, presets, presetLabels, palettes, resolve,
  Stage, createStage, supportsWebGL, glass, glassAll, auto, stopAuto, supportsRefraction, scenes, Spring,
};
