import { CONTROL_KNOB, MEDIUM_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Freq',
  log: true,
  max: 8000,
  min: 2000,
  position: {
    x: 40,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 1,
  type: CONTROL_KNOB,
  value: 4000,
}, {
  label: 'Decay',
  log: true,
  max: 0.5,
  min: 0.05,
  position: {
    x: 100,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: 0.005,
  type: CONTROL_KNOB,
  value: 0.1,
}];
