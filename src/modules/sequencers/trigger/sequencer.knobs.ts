import { STEP_KNOB } from '@constants/controlTypes';
import { LARGE_KNOB, SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Length',
  log: false,
  max: 16,
  min: 0,
  position: {
    x: 200,
    y: 164,
  },
  showValue: true,
  size: LARGE_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 0,
}, {
  label: '1',
  log: false,
  max: 8,
  min: 1,
  position: {
    x: 324,
    y: 78,
  },
  showValue: true,
  size: SMALL_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 1,
}, {
  label: '2',
  log: false,
  max: 8,
  min: 1,
  position: {
    x: 386,
    y: 78,
  },
  showValue: true,
  size: SMALL_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 1,
}, {
  label: '3',
  log: false,
  max: 8,
  min: 1,
  position: {
    x: 355,
    y: 123,
  },
  showValue: true,
  size: SMALL_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 1,
}];
