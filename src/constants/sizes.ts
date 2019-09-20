import { KnobSizesType } from "src/types";

export const SMALL_KNOB = 'small';
export const MEDIUM_KNOB = 'medium';
export const LARGE_KNOB = 'large';
export const STEP_ROTARY = 'step'
export const CONTROL_ROTARY = 'rotary'
export const CONTROL_SWITCH = 'switch'
export const TRIGGER_BUTTON = 'trigger'

export const ICON_SIZE = 0.7

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


