import { ModuleInputType } from "src/types";

export const inputTypes: ModuleInputType[] = [{
  icon: 'cv-in',
  type: 'cv',
  position: {
    x: 20,
    y: 155,
  },
  connection: [{
    x: 45,
    y: 155,
  }, {
    x: 60,
    y: 140,
  }]
}, {
  icon: 'freq',
  type: 'cv',
  position: {
    x: 20,
    y: 125,
  },
  connection: [{
    x: 45,
    y: 125,
  }, {
    x: 70,
    y: 100,
  }]
}]