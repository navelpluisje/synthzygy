import { CONTROL_KNOB } from '@constants/controlTypes';
import { SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Pink',
  log: true,
  max: 2,
  min: 0,
  position: {
    x: 45,
    y: 65,
  },
  size: SMALL_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 1,
}, {
  label: 'White',
  log: true,
  max: 2,
  min: 0,
  position: {
    x: 45,
    y: 125,
  },
  size: SMALL_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 2,
}, {
  label: 'Blue',
  log: true,
  max: 2,
  min: 0,
  position: {
    x: 45,
    y: 185,
  },
  size: SMALL_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 1,
}];
