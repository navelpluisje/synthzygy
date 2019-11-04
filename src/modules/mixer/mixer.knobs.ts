import { CONTROL_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Out',
  log: false,
  max: 2,
  min: 0,
  position: {
    x: 220,
    y: 95,
  },
  size: MEDIUM_KNOB,
  step: .01,
  type: CONTROL_KNOB,
  value: 1,
}];
