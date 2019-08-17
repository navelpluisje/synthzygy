import { SynthConnectorType } from "src/types";

export const outputTypes: SynthConnectorType[] = [{
  name: 'sawWave',
  icon: 'saw',
  type: 'audio',
  position: {
    x: 110,
    y: 50,
  },
}, {
  name: 'squareWave',
  icon: 'square',
  type: 'audio',
  position: {
    x: 110,
    y: 80,
  },
}, {
  name: 'sineWave',
  icon: 'sine',
  type: 'audio',
  position: {
    x: 110,
    y: 110,
  },
}, {
  name: 'triangleWave',
  icon: 'triangle',
  type: 'audio',
  position: {
    x: 110,
    y: 140,
  },
}]
