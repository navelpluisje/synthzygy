import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Tempo',
  size: MEDIUM_KNOB,
  min: 0.01,
  max: 20,
  step: 0.1,
  log: false,
  value: 10,
  position: {
    x: 50,
    y: 65,
  }
}]