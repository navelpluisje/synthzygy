import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Freq',
  size: MEDIUM_KNOB,
  min: 0,
  max: 20,
  step: .01,
  log: true,
  value: 5,
  position: {
    x: 45,
    y: 65,
  }
}]