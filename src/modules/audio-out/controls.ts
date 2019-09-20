import { ControlType } from "src/types";
import { CONTROL_ROTARY, LARGE_KNOB } from "@constants/sizes";

export const controlTypes: Array<ControlType> = [{
  type: CONTROL_ROTARY,
  label: 'Gain',
  size: LARGE_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: false,
  value: 0.5,
  position: {
    x: 60,
    y: 71,
  }
}]