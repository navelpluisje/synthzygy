import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'Delay',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: 0.01,
  log: false,
  value: .25,
  position: {
    x: 40,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'F.back',
  size: MEDIUM_KNOB,
  min: 0,
  max: 0.95,
  step: 0.01,
  log: false,
  value: .6,
  position: {
    x: 100,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Dry/Wet',
  size: SMALL_KNOB,
  min: 0,
  max: 1,
  step: 0.001,
  value: .5,
  log: false,
  position: {
    x: 40,
    y: 135,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Degrade',
  size: SMALL_KNOB,
  min: 1000,
  max: 4000,
  step: 10,
  log: false,
  value: 2000,
  position: {
    x: 100,
    y: 135,
  }
}]