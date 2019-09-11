import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'BPM',
  size: MEDIUM_KNOB,
  min: 0.01,
  max: 20,
  step: 0.1,
  log: false,
  value: 10,
  position: {
    x: 45,
    y: 95,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'PW',
  size: MEDIUM_KNOB,
  min: 0.1,
  max: .9,
  step: 0.01,
  log: false,
  value: .5,
  position: {
    x: 45,
    y: 160,
  }
}]