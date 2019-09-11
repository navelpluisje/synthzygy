import { ControlType } from "src/types";
import { STEP_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: Array<ControlType> = [{
  type: STEP_ROTARY,
  label: 'Octave',
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
}]