import { SynthConnectorType } from 'src/types';

// TODO: This needs to be a connection in stead of an icon
export const outputTypes: SynthConnectorType[] = [{
  icon: 'gate-out',
  name: '2',
  position: {
    x: 120,
    y: 70,
  },
  showLabel: true,
  type: 'audio',
}, {
  icon: 'gate-out',
  name: '/1',
  position: {
    x: 120,
    y: 100,
  },
  showLabel: true,
  type: 'audio',
}, {
  icon: 'gate-out',
  name: '/2',
  position: {
    x: 120,
    y: 130,
  },
  showLabel: true,
  type: 'audio',
}, {
  icon: 'gate-out',
  name: '/4',
  position: {
    x: 120,
    y: 160,
  },
  showLabel: true,
  type: 'audio',
}, {
  icon: 'gate-out',
  name: '/8',
  position: {
    x: 120,
    y: 190,
  },
  showLabel: true,
  type: 'audio',
}];
