import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, STEP_ROTARY, SMALL_KNOB } from "src/constants";

export const controlTypes: Array<ControlType> = [{
  type: CONTROL_ROTARY,
  label: 'Freq',
  size: MEDIUM_KNOB,
  min: 10,
  max: 134,
  step: 1,
  log: true,
  value: 440,
  position: {
    x: 85,
    y: 65,
  }
}, {
  type: STEP_ROTARY,
  label: 'Range',
  size: SMALL_KNOB,
  min: -2,
  max: 2,
  step: 1,
  log: false,
  value: 0,
  position: {
    x: 30,
    y: 65,
  },
}, {
  type: CONTROL_ROTARY,
  label: 'FM',
  size: MEDIUM_KNOB,
  min: 0,
  max: 10,
  step: 1,
  value: 0,
  log: false,
  position: {
    x: 85,
    y: 140,
  }
}]