import { ControlType } from "src/types";
import { CONTROL_ROTARY, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Frequency',
  size: SMALL_KNOB,
  min: 10,
  max: 100,
  step: 0.01,
  log: true,
  value: 40,
  position: {
    x: 45,
    y: 125,
  }
}]