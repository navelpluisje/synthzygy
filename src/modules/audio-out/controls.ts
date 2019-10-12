import { CONTROL_ROTARY, LARGE_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Gain',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 60,
    y: 71,
  },
  size: LARGE_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: 0.5,
}];
