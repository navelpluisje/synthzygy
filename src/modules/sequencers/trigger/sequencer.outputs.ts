import { SynthConnectorType } from 'src/types';

export const outputTypes: SynthConnectorType[] = [{
  icon: 'number-1',
  name: 'gate-1',
  position: {
    x: 400,
    y: 160,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'number-2',
  name: 'gate-2',
  position: {
    x: 400,
    y: 190,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'number-3',
  name: 'gate-3',
  position: {
    x: 400,
    y: 220,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'number-^',
  name: 'gateXor',
  position: {
    x: 400,
    y: 250,
  },
  showIcon: true,
  type: 'cv',
}, {
  icon: 'number-&',
  name: 'gateAnd',
  position: {
    x: 400,
    y: 280,
  },
  showIcon: true,
  type: 'gate',
}];
