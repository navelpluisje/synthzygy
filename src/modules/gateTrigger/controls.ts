import { ControlType } from "src/types";
import { TRIGGER_BUTTON, LARGE_KNOB } from "src/constants";

export const controlTypes: ControlType[] = [{
  type: TRIGGER_BUTTON,
  label: 'Gate',
  size: LARGE_KNOB,
  position: {
    x: 50,
    y: 65,
  }
}]