import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: Array<ControlType> = [{
  type: CONTROL_ROTARY,
  label: 'Level',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: 0.005,
  log: true,
  value: 0,
  position: {
    x: 65,
    y: 65,
  }
}]