import { CONTROL_ROTARY, MEDIUM_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'BPM',
  log: true,
  max: 200,
  min: 20,
  position: {
    x: 45,
    y: 100,
  },
  size: MEDIUM_KNOB,
  step: 0.1,
  type: CONTROL_ROTARY,
  value: 120,
}, {
  label: 'PW',
  log: false,
  max: .9,
  min: 0.1,
  position: {
    x: 45,
    y: 165,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: .5,
}];
