import { CONTROL_KNOB, LARGE_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
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
  type: CONTROL_KNOB,
  value: 0.5,
}];
