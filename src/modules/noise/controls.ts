import { ControlType } from "src/types";
import { CONTROL_ROTARY, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Pink',
  size: SMALL_KNOB,
  min: 0,
  max: 2,
  step: .005,
  log: true,
  value: 1,
  position: {
    x: 45,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'White',
  size: SMALL_KNOB,
  min: 0,
  max: 2,
  step: .005,
  log: true,
  value: 2,
  position: {
    x: 45,
    y: 125,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Blue',
  size: SMALL_KNOB,
  min: 0,
  max: 2,
  step: .005,
  log: true,
  value: 1,
  position: {
    x: 45,
    y: 185,
  }
}]