import { SynthConnectorType } from "src/types";

export const outputTypes: SynthConnectorType[] = [{
  name: 'sawWave',
  icon: 'saw',
  type: 'audio',
  position: {
    x: 170,
    y: 120,
  },
  showIcon: true,
}, {
  name: 'squareWave',
  icon: 'square',
  type: 'audio',
  position: {
    x: 170,
    y: 150,
  },
  showIcon: true,
}, {
  name: 'sineWave',
  icon: 'sine',
  type: 'audio',
  position: {
    x: 170,
    y: 180,
  },
  showIcon: true,
}, {
  name: 'triangleWave',
  icon: 'triangle',
  type: 'audio',
  position: {
    x: 170,
    y: 210,
  },
  showIcon: true,
}]