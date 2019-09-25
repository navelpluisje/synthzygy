import { ControlType } from "src/types";
import { CONTROL_ROTARY, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Decay',
  size: SMALL_KNOB,
  min:0.05,
  max: 0.5,
  step: 0.005,
  log: true,
  value: 0.1,
  position: {
    x: 70,
    y: 65,
  }
}]