import { ModuleInputType } from "src/types";

export const inputTypes: ModuleInputType[] = [{
  icon: 'cv-in',
  type: 'cv',
  position: {
    x: 20,
    y: 65,
  },
  connection: [{
    x: 40,
    y: 65,
  }]
}, {
  icon: 'audio-in',
  type: 'audio',
  showIcon: true,
  position: {
    x: 20,
    y: 120,
  },
}]