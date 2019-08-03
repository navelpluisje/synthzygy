import { ModuleInputType } from "src/types";

export const inputTypes: ModuleInputType[] = [{
  name: 'cvGain',
  icon: 'cv-in',
  type: 'audio',
  position: {
    x: 20,
    y: 65,
  },
  connection: [{
    x: 40,
    y: 65,
  }]
}, {
  name: 'audioIn',
  icon: 'audio-in',
  type: 'audio',
  showIcon: true,
  position: {
    x: 20,
    y: 120,
  },
}]