import { SynthConnectorType } from "src/types";

export const inputTypes: SynthConnectorType[] = [{
  name: 'fm',
  icon: 'cv-in',
  type: 'audio',
  position: {
    x: 20,
    y: 195,
  },
  connection: [{
    x: 60,
    y: 195,
  }, {
    x: 75,
    y: 180,
  }]
}, {
  name: 'frequency',
  icon: 'freq',
  type: 'audio',
  position: {
    x: 20,
    y: 165,
  },
  connection: [{
    x: 45,
    y: 165,
  }, {
    x: 85,
    y: 125,
  }]
}]