import { CONTROL_KNOB, STEP_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Depth',
  log: false,
  max: 16,
  min: 1,
  position: {
    x: 40,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 8,
}, {
  label: 'Degrade',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 100,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: .5,
}, {
  label: 'Wet/Dry',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 40,
    y: 135,
  },
  size: SMALL_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: .5,
}, {
  label: 'Level',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 100,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: .5,
}];
