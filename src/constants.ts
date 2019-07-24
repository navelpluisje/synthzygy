import { KnobSizesType, ColorsType } from "./types";

export const SMALL_KNOB = 'small';
export const MEDIUM_KNOB = 'medium';
export const LARGE_KNOB = 'large';
export const STEP_ROTARY = 'step'
export const CONTROL_ROTARY = 'rotary'
export const CONTROL_SWITCH = 'switch'

export const ICON_SIZE = 0.7

export enum Colors {
  TransBlack = 'hsla(0, 0%, 0%, 0.6)',
  TransWhite = 'hsla(0, 0%, 100%, 0.02)',
  ModuleBackground = '#212121',
  ModuleTitle = '#cccccc',
  ControlLabel = '#cccccc',
  ControlRing = '#cccccc',
  ControlBorder = '#cccccc',
  ControlMarker = '#cccccc',
  ControlBackground = '#cccccc33',
  AccentGenerator = '#c04d35',
  AccentAudioPath = '#e2712e',
  AccentEffect = '#dbb04a',
  AccentEnvelope = '#68a678',
}

export const knobSizes: KnobSizesType = {
  small: {
    radius: 12,
    baseOffset: 2,
  },
  medium: {
    radius: 16,
    baseOffset: 4,
  },
  large: {
    radius: 22,
    baseOffset: 6,
  },
}

