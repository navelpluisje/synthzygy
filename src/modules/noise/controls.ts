import { CONTROL_ROTARY, SMALL_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
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
  type: CONTROL_ROTARY,
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
  type: CONTROL_ROTARY,
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
  type: CONTROL_ROTARY,
  value: 1,
}];
