import { CONTROL_ROTARY, LARGE_KNOB, SMALL_KNOB, STEP_ROTARY } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Prob\'ty',
  log: true,
  max: 11,
  min: 1,
  position: {
    x: 45,
    y: 75,
  },
  size: LARGE_KNOB,
  step: 1,
  type: STEP_ROTARY,
  value: 6,
}, {
  label: 'Length',
  log: false,
  max: 6,
  min: 0,
  position: {
    x: 45,
    y: 150,
  },
  size: SMALL_KNOB,
  step: 1,
  type: STEP_ROTARY,
  value: 6,
}];
