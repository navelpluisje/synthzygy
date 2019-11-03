import { STEP_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'X',
  log: false,
  max: 10,
  min: 0,
  position: {
    x: 400,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 4,
}, {
  label: 'Y',
  log: false,
  max: 1,
  min: 0.1,
  position: {
    x: 400,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.1,
  type: STEP_KNOB,
  value: 0.5,
}];
