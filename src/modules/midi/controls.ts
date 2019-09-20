import { ControlType } from "src/types";
import { STEP_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: Array<ControlType> = [{
  type: STEP_ROTARY,
  label: 'Midi Port',
  size: MEDIUM_KNOB,
  min: 0,
  max: 16,
  step: 1,
  log: false,
  value: 0,
  position: {
    x: 45,
    y: 65,
  },
}, {
  type: STEP_ROTARY,
  label: 'Clock',
  size: SMALL_KNOB,
  min: 1,
  max: 5,
  step: 1,
  log: false,
  value: 3,
  position: {
    x: 45,
    y: 130,
  },
}]