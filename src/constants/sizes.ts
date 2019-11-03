import { KnobSizesType, SliderSizesType } from 'src/types';

export const SMALL_KNOB = 'small';
export const MEDIUM_KNOB = 'medium';
export const LARGE_KNOB = 'large';
export const MEDIUM_SLIDER = 'medium';

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

export const sliderSizes: SliderSizesType = {
  large: 100,
  medium: 80,
  small: 60,
};
