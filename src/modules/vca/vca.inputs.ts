import { SynthConnectorType } from 'src/types';

export const inputTypes: SynthConnectorType[] = [{
  connection: [{
    x: 40,
    y: 65,
  }],
  icon: 'cv-in',
  name: 'cvGain',
  position: {
    x: 20,
    y: 65,
  },
  type: 'audio',
}, {
  icon: 'audio-in',
  name: 'audioIn',
  position: {
    x: 20,
    y: 120,
  },
  showIcon: true,
  type: 'audio',
}];
