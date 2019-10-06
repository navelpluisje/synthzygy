import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Freq',
  size: MEDIUM_KNOB,
  min: 2000,
  max: 8000,
  step: 1,
  log: true,
  value: 4000,
  position: {
    x: 40,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Decay',
  size: MEDIUM_KNOB,
  min: 0.05,
  max: 0.5,
  step: 0.005,
  log: true,
  value: 0.1,
  position: {
    x: 100,
    y: 65,
  }
}]