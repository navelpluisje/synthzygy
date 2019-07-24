import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: Array<ControlType> = [{
  type: CONTROL_ROTARY,
  label: 'Gain',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: false,
  value: 0.5,
  position: {
    x: 67.5,
    y: 65,
  }
}]