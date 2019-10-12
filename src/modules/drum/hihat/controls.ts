import { CONTROL_ROTARY, MEDIUM_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Freq',
  log: true,
  max: 8000,
  min: 2000,
  position: {
    x: 40,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: CONTROL_ROTARY,
  value: 4000,
}, {
  label: 'Decay',
  log: true,
  max: 0.5,
  min: 0.05,
  position: {
    x: 100,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.005,
  type: CONTROL_ROTARY,
  value: 0.1,
}];
