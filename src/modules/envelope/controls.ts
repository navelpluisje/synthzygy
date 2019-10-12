import { CONTROL_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Attack',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 70,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.05,
  type: CONTROL_ROTARY,
  value: .3,
}, {
  label: 'Decay',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 130,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.05,
  type: CONTROL_ROTARY,
  value: .3,
}, {
  label: 'Sustain',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 40,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'Release',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 100,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.05,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'level',
  log: true,
  max: 1,
  min: 0,
  position: {
    x: 160,
    y: 135,
  },
  size: SMALL_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: .5,
}];
