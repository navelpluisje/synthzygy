import { ControlType } from "src/types";
import { CONTROL_ROTARY, MEDIUM_KNOB, SMALL_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: CONTROL_ROTARY,
  label: 'In 1',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: .005,
  value: .5,
  position: {
    x: 65,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'In 2',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: .005,
  value: .5,
  position: {
    x: 125,
    y: 65,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'In 3',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: .005,
  value: .5,
  position: {
    x: 65,
    y: 135,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'In 4',
  size: MEDIUM_KNOB,
  min: 0,
  max: 1,
  step: .005,
  value: .5,
  position: {
    x: 125,
    y: 135,
  }
}, {
  type: CONTROL_ROTARY,
  label: 'Out',
  size: SMALL_KNOB,
  min: 0,
  max: 2,
  step: .01,
  log: false,
  value: 1,
  position: {
    x: 65,
    y: 205,
  }
}]