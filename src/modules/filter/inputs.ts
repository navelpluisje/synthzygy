import { ModuleInputType } from "src/types";

export const inputTypes: ModuleInputType[] = [{
  name: 'cvFreq',
  type: 'audio',
  position: {
    x: 20,
    y: 148,
  },
  connection: [{
    x: 40,
    y: 148,
  }]
},{
  name: 'cvQ',
  type: 'cv',
  position: {
    x: 20,
    y: 213,
  },
  connection: [{
    x: 40,
    y: 213,
  }]
},{
  name: 'audioIn',
  icon: 'audio-in',
  type: 'audio',
  position: {
    x: 20,
    y: 270,
  },
  showIcon: true,
}]