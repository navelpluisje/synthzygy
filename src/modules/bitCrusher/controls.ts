import { ControlType } from "src/types";
import { CONTROL_ROTARY, STEP_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: STEP_ROTARY,
  label: 'Depth',
  size: MEDIUM_KNOB,
  min: 1,
  max: 16,
  step: 1,
  log: false,
  value: 8,
  position: {
    x: 40,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Degrade',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: false,
  value: .5,
  position: {
    x: 100,
    y: 65,
  },
}]