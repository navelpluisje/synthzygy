import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, STEP_ROTARY, SMALL_KNOB } from "src/constants";

export const controlTypes: Array<ControlType> = [{
  type: CONTROL_ROTARY,
  label: 'Freq',
  size: MEDIUM_KNOB,
  min: 0,
  max: 10,
  step: .005,
  log: true,
  value: 3,
  position: {
    x: 95,
    y: 95,
  }
}, {
  type: STEP_ROTARY,
  label: 'Octave',
  size: SMALL_KNOB,
  min: 0,
  max: 8,
  step: 1,
  log: false,
  value: 3,
  position: {
    x: 40,
    y: 65,
  },
}, {
  type: CONTROL_ROTARY,
  label: 'FM',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: .005,
  value: 0,
  log: false,
  position: {
    x: 95,
    y: 170,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Detune',
  size: SMALL_KNOB,
  min: -1200,
  max: 1200,
  step: 10,
  value: 0,
  log: false,
  position: {
    x: 150,
    y: 65,
  }
}]