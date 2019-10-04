import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Pitch',
  size: MEDIUM_KNOB,
  min: 10,
  max: 100,
  step: 0.01,
  log: true,
  value: 40,
  position: {
    x: 40,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Decay',
  size: MEDIUM_KNOB,
  min: 0.2,
  max: 0.4,
  step: 0.001,
  log: true,
  value: 0.3,
  position: {
    x: 100,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Punch',
  size: MEDIUM_KNOB,
  min: 0.1,
  max: 0.9,
  step: 0.001,
  log: true,
  value: 0.5,
  position: {
    x: 40,
    y: 135,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Boost',
  size: MEDIUM_KNOB,
  min: 0,
  max: 3,
  step: 0.01,
  log: true,
  value: 0,
  position: {
    x: 100,
    y: 135,
  }
}]