import { CONTROL_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Attack',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 70,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.05,
  type: CONTROL_KNOB,
  value: .3,
}, {
  label: 'Decay',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 130,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.05,
  type: CONTROL_KNOB,
  value: .3,
}, {
  label: 'Sustain',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 40,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: .5,
}, {
  label: 'Release',
  log: true,
  max: 3,
  min: 0,
  position: {
    x: 100,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: 0.05,
  type: CONTROL_KNOB,
  value: .5,
}, {
  label: 'level',
  log: true,
  max: 1,
  min: 0,
  position: {
    x: 160,
    y: 135,
  },
  size: SMALL_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: .5,
}];
