import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Attack',
  size: MEDIUM_KNOB,
  min: 0.01,
  max: 10,
  step: 0.01,
  log: false,
  value: 1,
  position: {
    x: 40,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Decay',
  size: MEDIUM_KNOB,
  min: 0.01,
  max: 10,
  step: 0.01,
  log: false,
  value: 1,
  position: {
    x: 100,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Sustain',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: false,
  value: .5,
  position: {
    x: 40,
    y: 135,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Release',
  size: MEDIUM_KNOB,
  min: 0,
  max: 10,
  step: 0.01,
  log: false,
  value: 5,
  position: {
    x: 100,
    y: 135,
  }
}]