import { CONTROL_ROTARY, MEDIUM_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Pitch',
  log: true,
  max: 100,
  min: 10,
  position: {
    x: 40,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: 40,
}, {
  label: 'Decay',
  log: true,
  max: 0.4,
  min: 0.2,
  position: {
    x: 100,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.001,
  type: CONTROL_ROTARY,
  value: 0.3,
}, {
  label: 'Punch',
  log: true,
  max: 0.9,
  min: 0.1,
  position: {
    x: 40,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.001,
  type: CONTROL_ROTARY,
  value: 0.5,
}, {
  label: 'Boost',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 100,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: 0,
}];
