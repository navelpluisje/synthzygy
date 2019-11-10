import { SynthConnectorType } from 'src/types';

// TODO: This needs to be a connection in stead of an icon
export const outputTypes: SynthConnectorType[] = [{
  name: 'V/Oct',
  position: {
    x: 160,
    y: 50,
  },
  showLabel: true,
  type: 'audio',
}, {
  name: 'Pitch',
  position: {
    x: 160,
    y: 80,
  },
  showLabel: true,
  type: 'audio',
}, {
  name: 'Mod',
  position: {
    x: 160,
    y: 110,
  },
  showLabel: true,
  type: 'audio',
}, {
  name: 'Press',
  position: {
    x: 160,
    y: 140,
  },
  showLabel: true,
  type: 'audio',
}, {
  icon: 'gate-out',
  name: 'Gate',
  position: {
    x: 160,
    y: 170,
  },
  showIcon: true,
  type: 'audio',
}, {
  name: 'Clock',
  position: {
    x: 160,
    y: 200,
  },
  showLabel: true,
  type: 'audio',
}, {
  name: 'Transport',
  position: {
    x: 160,
    y: 230,
  },
  showLabel: true,
  type: 'data',
}];
