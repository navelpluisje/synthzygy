import { SynthConnectorType } from 'src/types';

export const outputTypes: SynthConnectorType[] = [{
  icon: 'envelope',
  name: 'Out',
  position: {
    x: 120,
    y: 180,
  },
  showIcon: true,
  type: 'audio',
}, {
  icon: 'gate-out',
  name: 'Trigger',
  position: {
    x: 120,
    y: 210,
  },
  showIcon: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: '2+6',
  position: {
    x: 170,
    y: 60,
  },
  showLabel: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: '2+4',
  position: {
    x: 170,
    y: 90,
  },
  showLabel: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: '8',
  position: {
    x: 170,
    y: 120,
  },
  showLabel: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: '6',
  position: {
    x: 170,
    y: 150,
  },
  showLabel: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: '4',
  position: {
    x: 170,
    y: 180,
  },
  showLabel: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: '2',
  position: {
    x: 170,
    y: 210,
  },
  showLabel: true,
  type: 'gate',
}];
