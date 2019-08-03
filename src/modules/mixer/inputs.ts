import { ModuleInputType } from "src/types";

export const inputTypes: ModuleInputType[] = [{
  name: 'audioIn1',
  icon: 'audio-in',
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
  name: 'audioIn2',
  icon: 'audio-in',
  type: 'audio',
  position: {
    x: 20,
    y: 100,
  },
  connection: [{
    x: 45,
    y: 100,
  },{
    x: 50,
    y: 105,
  },{
    x: 85,
    y: 105,
  },{
    x: 105,
    y: 85,
  }]
}, {
  name: 'audioIn3',
  icon: 'audio-in',
  type: 'audio',
  position: {
    x: 20,
    y: 135,
  },
  connection: [{
    x: 40,
    y: 135,
  }]
}, {
  name: 'audioIn4',
  icon: 'audio-in',
  type: 'audio',
  position: {
    x: 20,
    y: 170,
  },
  connection: [{
    x: 45,
    y: 170,
  },{
    x: 50,
    y: 175,
  },{
    x: 85,
    y: 175,
  },{
    x: 105,
    y: 155,
  }]
}]