import { CONTROL_KNOB } from '@constants/controlTypes';
import { LARGE_KNOB, SMALL_KNOB } from '@constants/sizes';
import { KnobType } from 'src/types';

export const knobTypes: KnobType[] = [{
  label: 'Freq',
  log: true,
  max: 10,
  min: 0,
  position: {
    x: 85,
    y: 135,
  },
  size: LARGE_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 3,
}, {
  label: 'FM',
  log: false,
  max: 1,
  min: 0,
  position: {
    x: 50,
    y: 65,
  },
  size: SMALL_KNOB,
  step: .005,
  type: CONTROL_KNOB,
  value: 0,
}, {
  label: 'Detune',
  log: false,
  max: 1200,
  min: -1200,
  position: {
    x: 130,
    y: 65,
  },
  size: SMALL_KNOB,
  step: 10,
  type: CONTROL_KNOB,
  value: 0,
}];
