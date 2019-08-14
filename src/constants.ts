import { KnobSizesType, ColorsType } from "./types";

export const SMALL_KNOB = 'small';
export const MEDIUM_KNOB = 'medium';
export const LARGE_KNOB = 'large';
export const STEP_ROTARY = 'step'
export const CONTROL_ROTARY = 'rotary'
export const CONTROL_SWITCH = 'switch'
export const TRIGGER_BUTTON = 'trigger'

export const ICON_SIZE = 0.7

export enum Colors {
  TransBlack = 'hsla(0, 0%, 0%, 0.6)',
  TransWhite = 'hsla(0, 0%, 100%, 0.02)',
  ModuleBackground = '#212121',
  ModuleTitle = '#d9e5d6',
  ControlLabel = '#d9e5d6',
  ControlRing = '#93827f',
  ControlBorder = '#d9e5d6',
  ControlMarker = '#d9e5d6',
  ControlBackground = '#d9e5d633',
  AccentGenerator = '#c04d35',
  AccentAudioPath = '#e2712e',
  AccentEffect = '#dbb04a',
  AccentModulator = '#68a678',
  AccentUtility = '#577590',
  Connection = '#8c1c13',
}

export const knobSizes: KnobSizesType = {
  small: {
    radius: 11,
    baseOffset: 2,
  },
  medium: {
    radius: 15,
    baseOffset: 4,
  },
  large: {
    radius: 21,
    baseOffset: 6,
  },
}

export const AvailableModules = [{
  name: 'generators',
  title: 'Generators',
  modules: [{
    name: 'oscillator',
    title: 'Oscillator',
  }]
}, {
  name: 'modulators',
  title: 'Modulators',
  modules: [{
    name: 'envelope',
    title: 'Envelope',
  }, {
    name: 'lfo',
    title: 'Lfo',
  }]
}, {
  name: 'effects',
  title: 'Effects',
  modules: [{
    name: 'filter',
    title: 'Filter',
  }, {
    name: 'delay',
    title: 'Delay',
  }]
}, {
  name: 'utilities',
  title: 'Utilities',
  modules: [{
    name: 'audioOut',
    title: 'Audio Output',
  }, {
    name: 'gate',
    title: 'Gate trigger',
  }, {
    name: 'keyboard',
    title: 'Keyboard',
  }]
}, {
  name: 'audio',
  title: 'Audio',
  modules: [{
    name: 'mixer',
    title: 'Mixer',
  }, {
    name: 'vca',
    title: 'Vca',
  }]
}]
