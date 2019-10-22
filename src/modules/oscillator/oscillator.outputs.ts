import { SynthConnectorType } from 'src/types';

export const outputTypes: SynthConnectorType[] = [{
  icon: 'saw',
  name: 'sawWave',
  position: {
    x: 170,
    y: 120,
  },
  showIcon: true,
  type: 'audio',
}, {
  icon: 'square',
  name: 'squareWave',
  position: {
    x: 170,
    y: 150,
  },
  showIcon: true,
  type: 'audio',
}, {
  icon: 'sine',
  name: 'sineWave',
  position: {
    x: 170,
    y: 180,
  },
  showIcon: true,
  type: 'audio',
}, {
  icon: 'triangle',
  name: 'triangleWave',
  position: {
    x: 170,
    y: 210,
  },
  showIcon: true,
  type: 'audio',
}];
