import { CONTROL_KNOB, STEP_KNOB } from '@constants/controlTypes';
import { MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Freq',
  log: true,
  max: 10,
  min: 0,
  position: {
    x: 95,
    y: 95,
  },
  size: MEDIUM_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 3,
}, {
  label: 'Octave',
  log: false,
  max: 8,
  min: 0,
  position: {
    x: 40,
    y: 65,
  },
  size: SMALL_KNOB,
  step: 1,
  type: STEP_KNOB,
  value: 3,
}, {
  label: 'FM',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 95,
    y: 170,
  },
  size: MEDIUM_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 0,
}, {
  label: 'Detune',
  log: false,
  max: 1200,
  min: -1200,
  position: {
    x: 150,
    y: 65,
  },
  size: SMALL_KNOB,
  step: 10,
  type: CONTROL_KNOB,
  value: 0,
}];
