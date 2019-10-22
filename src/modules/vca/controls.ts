import { CONTROL_KNOB, MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
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
  type: CONTROL_KNOB,
  value: 0,
}];
