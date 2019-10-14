import { CONTROL_KNOB, MEDIUM_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Decay',
  log: true,
  max: 0.5,
  min: 0.05,
  position: {
    x: 40,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.005,
  type: CONTROL_KNOB,
  value: 0.1,
}, {
  label: 'Head',
  log: true,
  max: 1,
  min: 0,
  position: {
    x: 100,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: 0.2,
}, {
  label: 'Snare',
  log: true,
  max: 4000,
  min: 2000,
  position: {
    x: 100,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: CONTROL_KNOB,
  value: 2000,
}];
