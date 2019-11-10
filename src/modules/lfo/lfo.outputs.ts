import { SynthConnectorType } from 'src/types';

export const outputTypes: SynthConnectorType[] = [{
  icon: 'saw',
  name: 'sawWave',
  position: {
    x: 120,
    y: 50,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'square',
  name: 'squareWave',
  position: {
    x: 120,
    y: 80,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'sine',
  name: 'sineWave',
  position: {
    x: 120,
    y: 110,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'triangle',
  name: 'triangleWave',
  position: {
    x: 120,
    y: 140,
  },
  showIcon: true,
  type: 'cv',
}];
