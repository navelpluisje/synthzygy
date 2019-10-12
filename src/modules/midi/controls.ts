import { MEDIUM_KNOB, SMALL_KNOB, STEP_ROTARY } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Midi Port',
  log: false,
  max: 16,
  min: 0,
  position: {
    x: 45,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: STEP_ROTARY,
  value: 0,
}, {
  label: 'Clock',
  log: false,
  max: 5,
  min: 1,
  position: {
    x: 45,
    y: 130,
  },
  size: SMALL_KNOB,
  step: 1,
  type: STEP_ROTARY,
  value: 3,
}];
