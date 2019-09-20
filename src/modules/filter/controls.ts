import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, LARGE_KNOB, SMALL_KNOB } from "@constants/sizes";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Cutoff',
  size: LARGE_KNOB,
  min: 0,
  max: 10,
  step: .005,
  log: true,
  value: 4,
  position: {
    x: 110,
    y: 71,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Level in',
  size: MEDIUM_KNOB,
  min: 0,
  max: 2,
  step: 0.01,
  log: false,
  value: 1,
  position: {
    x: 120,
    y: 213,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Resonance',
  size: MEDIUM_KNOB,
  min: 0,
  max: 150,
  step: .1,
  log: true,
  value: 0,
  position: {
    x: 120,
    y: 148,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'cv C/o',
  size: SMALL_KNOB,
  min: 0,
  max: 1,
  step: 0.001,
  value: 0,
  log: true,
  position: {
    x: 60,
    y: 148,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'cv Res',
  size: SMALL_KNOB,
  min: 0,
  max: 200,
  step: .5,
  value: 0,
  log: false,
  position: {
    x: 60,
    y: 213,
  }
}]