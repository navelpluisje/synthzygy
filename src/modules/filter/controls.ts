import { CONTROL_ROTARY, LARGE_KNOB, MEDIUM_KNOB, SMALL_KNOB } from '@constants/sizes';
import { ControlType } from 'src/types';

export const controlTypes: ControlType[] = [{
  label: 'Cutoff',
  log: true,
  max: 10,
  min: 0,
  position: {
    x: 110,
    y: 71,
  },
  size: LARGE_KNOB,
  step: .005,
  type: CONTROL_ROTARY,
  value: 4,
}, {
  label: 'Level in',
  log: false,
  max: 2,
  min: 0,
  position: {
    x: 120,
    y: 213,
  },
  size: MEDIUM_KNOB,
  step: 0.01,
  type: CONTROL_ROTARY,
  value: 1,
}, {
  label: 'Resonance',
  log: true,
  max: 150,
  min: 0,
  position: {
    x: 120,
    y: 148,
  },
  size: MEDIUM_KNOB,
  step: .1,
  type: CONTROL_ROTARY,
  value: 0,
}, {
  label: 'cv C/o',
  log: true,
  max: 1,
  min: 0,
  position: {
    x: 60,
    y: 148,
  },
  size: SMALL_KNOB,
  step: 0.001,
  type: CONTROL_ROTARY,
  value: 0,
}, {
  label: 'cv Res',
  log: false,
  max: 200,
  min: 0,
  position: {
    x: 60,
    y: 213,
  },
  size: SMALL_KNOB,
  step: .5,
  type: CONTROL_ROTARY,
  value: 0,
}];
