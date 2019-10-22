import { CONTROL_KNOB, MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
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
  type: CONTROL_KNOB,
  value: 5,
}];
