import { CONTROL_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'In 1',
  max: 1,
  min: 0,
  position: {
    x: 65,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: .005,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'In 2',
  max: 1,
  min: 0,
  position: {
    x: 125,
    y: 65,
  },
  size: MEDIUM_KNOB,
  step: .005,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'In 3',
  max: 1,
  min: 0,
  position: {
    x: 65,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: .005,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'In 4',
  max: 1,
  min: 0,
  position: {
    x: 125,
    y: 135,
  },
  size: MEDIUM_KNOB,
  step: .005,
  type: CONTROL_ROTARY,
  value: .5,
}, {
  label: 'Out',
  log: false,
  max: 2,
  min: 0,
  position: {
    x: 65,
    y: 205,
  },
  size: SMALL_KNOB,
  step: .01,
  type: CONTROL_ROTARY,
  value: 1,
}];
