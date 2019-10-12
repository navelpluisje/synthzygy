import { MEDIUM_KNOB, STEP_ROTARY } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'X',
  log: false,
  max: 10,
  min: 0,
  position: {
    x: 400,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: STEP_ROTARY,
  value: 4,
}, {
  label: 'Y',
  log: false,
  max: 1,
  min: 0.1,
  position: {
    x: 400,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.1,
  type: STEP_ROTARY,
  value: 0.5,
}];
