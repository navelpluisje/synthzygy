import { SynthConnectorType } from 'src/types';

export const outputTypes: SynthConnectorType[] = [{
  icon: 'envelope-out',
  name: 'cv A',
  position: {
    x: 580,
    y: 90,
  },
  showLabel: true,
  type: 'cv',
}, {
  icon: 'envelope-out',
  name: 'cv B',
  position: {
    x: 580,
    y: 120,
  },
  showLabel: true,
  type: 'cv',
}, {
  icon: 'gate-out',
  name: 'gateOut',
  position: {
    x: 580,
    y: 150,
  },
  showIcon: true,
  type: 'gate',
}];
