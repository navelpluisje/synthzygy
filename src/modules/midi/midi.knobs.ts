import { STEP_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Midi Port',
  log: false,
  max: 16,
  min: 0,
  position: {
    x: 45,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 0,
}, {
  label: 'Clock',
  log: false,
  max: 5,
  min: 1,
  position: {
    x: 45,
    y: 130,
  },
  size: SMALL_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 3,
}];
