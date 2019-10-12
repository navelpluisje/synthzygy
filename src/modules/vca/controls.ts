import { CONTROL_ROTARY, MEDIUM_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Level',
  log: true,
  max: 1,
  min: 0,
  position: {
    x: 65,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.005,
  type: CONTROL_ROTARY,
  value: 0,
}];
