import { HORIZONTAL_SLIDER } from '@constants/controlTypes';
import { MEDIUM_SLIDER } from '@constants/sizes';
import { KnobType } from 'src/types';

export const sliderTypes: KnobType[] = [{
  label: 'In 1',
  max: 1,
  min: 0,
  position: {
    x: 70,
    y: 55,
  },
  showLabel: false,
  size: MEDIUM_SLIDER,
  step: .005,
  type: HORIZONTAL_SLIDER,
  value: .5,
}, {
  label: 'In 2',
  max: 1,
  min: 0,
  position: {
    x: 70,
    y: 85,
  },
  showLabel: false,
  size: MEDIUM_SLIDER,
  step: .005,
  type: HORIZONTAL_SLIDER,
  value: .5,
}, {
  label: 'In 3',
  max: 1,
  min: 0,
  position: {
    x: 70,
    y: 115,
  },
  showLabel: false,
  size: MEDIUM_SLIDER,
  step: .005,
  type: HORIZONTAL_SLIDER,
  value: .5,
}, {
  label: 'In 4',
  max: 1,
  min: 0,
  position: {
    x: 70,
    y: 145,
  },
  showLabel: false,
  size: MEDIUM_SLIDER,
  step: .005,
  type: HORIZONTAL_SLIDER,
  value: .5,
}];
