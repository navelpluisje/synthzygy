import { CONTROL_ROTARY, MEDIUM_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Freq',
  log: true,
  max: 20,
  min: 0,
  position: {
    x: 45,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: .01,
  type: CONTROL_ROTARY,
  value: 5,
}];
