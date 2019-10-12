import { SynthConnectorType } from 'src/types';

export const inputTypes: SynthConnectorType[] = [{
  connection: [{
    x: 40,
    y: 148,
  }],
  name: 'cvFreq',
  position: {
    x: 20,
    y: 148,
  },
  type: 'audio',
}, {
  connection: [{
    x: 40,
    y: 213,
  }],
  name: 'cvQ',
  position: {
    x: 20,
    y: 213,
  },
  type: 'cv',
}, {
  icon: 'audio-in',
  name: 'audioIn',
  position: {
    x: 20,
    y: 270,
  },
  showIcon: true,
  type: 'audio',
}];
