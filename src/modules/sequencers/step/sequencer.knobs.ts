import { STEP_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Length',
  log: false,
  max: 16,
  min: 0,
  position: {
    x: 513,
    y: 60,
  },
  showValue: true,
  size: MEDIUM_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 0,
}];
