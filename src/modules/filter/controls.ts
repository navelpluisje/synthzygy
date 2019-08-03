import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, LARGE_KNOB, SMALL_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Frequency',
  size: LARGE_KNOB,
  min: 0,
  max: 12000,
  step: 0.01,
  log: false,
  value: 2000,
  position: {
    x: 110,
    y: 71,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Level in',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: false,
  value: .5,
  position: {
    x: 120,
    y: 213,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Q',
  size: MEDIUM_KNOB,
  min: 0.00001,
  max: 1000,
  step: 10,
  log: false,
  value: 5,
  position: {
    x: 120,
    y: 148,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'cv Freq',
  size: SMALL_KNOB,
  min: 0,
  max: 5,
  step: 0.1,
  log: false,
  value: .5,
  position: {
    x: 60,
    y: 148,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'cv Q',
  size: SMALL_KNOB,
  min: 0,
  max: 5,
  step: 0.1,
  log: false,
  value: .5,
  position: {
    x: 60,
    y: 213,
  }
}]