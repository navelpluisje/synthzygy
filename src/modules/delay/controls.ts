import { CONTROL_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Delay',
  log: true,
  max: 2,
  min: 0,
  position: {
    x: 40,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.005,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'F.back',
  log: false,
  max: 0.99,
  min: 0,
  position: {
    x: 100,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: .6,
}, {
  label: 'Dry/Wet',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 40,
    y: 135,
  },
  size: SMALL_KNOB,
  step: 0.001,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'Cutoff',
  log: true,
  max: 4000,
  min: 1000,
  position: {
    x: 100,
    y: 135,
  },
  size: SMALL_KNOB,
  step: 1,
  type: CONTROL_ROTARY,
  value: 3000,
}];
