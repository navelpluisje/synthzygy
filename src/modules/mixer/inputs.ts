import { ModuleInputType } from "src/types";

export const inputTypes: ModuleInputType[] = [{
  icon: 'audio-in-1',
  position: {
    x: 20,
    y: 65,
  },
  connection: [{
    x: 40,
    y: 65,
  }]
}, {
  icon: 'audio-in-2',
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
  icon: 'audio-in-3',
  position: {
    x: 20,
    y: 135,
  },
  connection: [{
    x: 40,
    y: 135,
  }]
}, {
  icon: 'audio-in-4',
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