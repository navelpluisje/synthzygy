import { KnobSizesType } from 'src/types';

export const SMALL_KNOB = 'small';
export const MEDIUM_KNOB = 'medium';
export const LARGE_KNOB = 'large';
export const STEP_ROTARY = 'step';
export const CONTROL_ROTARY = 'rotary';
export const CONTROL_SWITCH = 'switch';
export const TRIGGER_BUTTON = 'trigger';

export const ICON_SIZE = 0.7;

export const knobSizes: KnobSizesType = {
  large: {
    baseOffset: 6,
    radius: 21,
  },
  medium: {
    baseOffset: 4,
    radius: 15,
  },
  small: {
    baseOffset: 2,
    radius: 11,
  },
};
