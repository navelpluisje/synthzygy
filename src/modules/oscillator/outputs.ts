import { SynthConnectorType } from "src/types";

export const outputTypes: SynthConnectorType[] = [{
  name: 'sawWave',
  icon: 'saw',
  type: 'audio',
  position: {
    x: 160,
    y: 80,
  },
}, {
  name: 'squareWave',
  icon: 'square',
  type: 'audio',
  position: {
    x: 160,
    y: 110,
  },
}, {
  name: 'sineWave',
  icon: 'sine',
  type: 'audio',
  position: {
    x: 160,
    y: 140,
  },
}, {
  name: 'triangleWave',
  icon: 'triangle',
  type: 'audio',
  position: {
    x: 160,
    y: 170,
  },
}]