import { ControlType } from "src/types";
import { CONTROL_ROTARY, LARGE_KNOB, STEP_ROTARY, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: Array<ControlType> = [{
  type: STEP_ROTARY,
  label: 'Prob\'ty',
  size: LARGE_KNOB,
  min: 1,
  max: 11,
  step: 1,
  log: true,
  value: 6,
  position: {
    x: 45,
    y: 75,
  }
}, {
  type: STEP_ROTARY,
  label: 'Length',
  size: SMALL_KNOB,
  min: 0,
  max: 6,
  step: 1,
  log: false,
  value: 6,
  position: {
    x: 45,
    y: 150,
  },
}]