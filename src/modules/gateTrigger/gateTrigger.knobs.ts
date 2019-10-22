import { LARGE_KNOB, TRIGGER_BUTTON } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Gate',
  position: {
    x: 50,
    y: 65,
  },
  size: LARGE_KNOB,
  type: TRIGGER_BUTTON,
}];
