import { KnobSizesType, ColorsType } from "./types";

export const SMALL_KNOB = 'small';
export const MEDIUM_KNOB = 'medium';
export const LARGE_KNOB = 'large';
export const STEP_ROTARY = 'step'
export const CONTROL_ROTARY = 'rotary'
export const CONTROL_SWITCH = 'switch'

export const ICON_SIZE = 0.7

export const colors: ColorsType = {
  green: 'hsl(166, 42%, 74%)',
  yellow: 'hsl(96, 67%, 87%)',
  purple: 'hsl(259, 18%, 83%)',
  blue: 'hsl(200, 35%, 73%)',
  pink: 'hsl(317, 100%, 89%)',
  transBlack: 'hsla(0, 0%, 0%, 0.6)',
  transWhite: 'hsla(0, 0%, 100%, 0.5)',
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

