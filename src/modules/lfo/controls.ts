import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Freq',
  size: MEDIUM_KNOB,
  min: 0,
  max: 10,
  step: .05,
  log: false,
  value: 5,
  position: {
    x: 35,
    y: 65,
  }
}]