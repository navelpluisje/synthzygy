import { CONTROL_KNOB, MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'BPM',
  log: true,
  max: 200,
  min: 20,
  position: {
    x: 45,
    y: 100,
  },
  size: MEDIUM_KNOB,
  step: 0.1,
  type: CONTROL_KNOB,
  value: 120,
}, {
  label: 'PW',
  log: false,
  max: .9,
  min: 0.1,
  position: {
    x: 45,
    y: 165,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_KNOB,
  value: .5,
}];
