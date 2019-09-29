import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Attack',
  size: MEDIUM_KNOB,
  min: 0,
  max: 3,
  step: 0.05,
  log: true,
  value: .3,
  position: {
    x: 70,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Decay',
  size: MEDIUM_KNOB,
  min: 0,
  max: 3,
  step: 0.05,
  log: true,
  value: .3,
  position: {
    x: 130,
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
  max: 3,
  step: 0.05,
  log: true,
  value: .5,
  position: {
    x: 100,
    y: 135,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'level',
  size: SMALL_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: true,
  value: .5,
  position: {
    x: 160,
    y: 135,
  }
}]