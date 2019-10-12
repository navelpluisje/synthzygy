import { LARGE_KNOB, TRIGGER_BUTTON } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Gate',
  position: {
    x: 50,
    y: 65,
  },
  size: LARGE_KNOB,
  type: TRIGGER_BUTTON,
}];
