import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, STEP_ROTARY } from "src/constants";

export const controlTypes: Array<ControlType> = [{
  type: STEP_ROTARY,
  label: 'X',
  size: MEDIUM_KNOB,
  min: 0,
  max: 10,
  step: 1,
  log: false,
  value: 4,
  position: {
    x: 400,
    y: 65,
  }
}, {
  type: STEP_ROTARY,
  label: 'Y',
  size: MEDIUM_KNOB,
  min: 0.1,
  max: 1,
  step: 0.1,
  log: false,
  value: 0.5,
  position: {
    x: 400,
    y: 135,
  }
}]