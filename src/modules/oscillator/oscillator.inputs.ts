import { SynthConnectorType } from 'src/types';

export const inputTypes: SynthConnectorType[] = [{
  connection: [{
    x: 60,
    y: 195,
  }, {
    x: 75,
    y: 180,
  }],
  icon: 'cv-in',
  name: 'fm',
  position: {
    x: 20,
    y: 195,
  },
  type: 'audio',
}, {
  connection: [{
    x: 45,
    y: 165,
  }, {
    x: 85,
    y: 125,
  }],
  icon: 'freq',
  name: 'frequency',
  position: {
    x: 20,
    y: 165,
  },
  type: 'audio',
}];
