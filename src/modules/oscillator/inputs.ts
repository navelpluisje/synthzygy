import { SynthConnectorType } from "src/types";

export const inputTypes: SynthConnectorType[] = [{
  name: 'fm',
  icon: 'cv-in',
  type: 'audio',
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
  name: 'frequency',
  icon: 'freq',
  type: 'audio',
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