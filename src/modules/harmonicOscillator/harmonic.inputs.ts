import { SynthConnectorType } from 'src/types';

export const inputTypes: SynthConnectorType[] = [{
  connection: [{
    x: 35,
    y: 145,
  }, {
    x: 50,
    y: 130,
  }, {
    x: 50,
    y: 100,
  }],
  icon: 'cv-in',
  name: 'fm',
  position: {
    x: 20,
    y: 145,
  },
  type: 'audio',
}, {
  connection: [{
    x: 35,
    y: 175,
  }, {
    x: 60,
    y: 150,
  }],
  icon: 'freq',
  name: 'frequency',
  position: {
    x: 20,
    y: 175,
  },
  type: 'audio',
}];
