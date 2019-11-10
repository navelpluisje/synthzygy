import { SynthConnectorType } from 'src/types';

// TODO: This needs to be a connection in stead of an icon
export const outputTypes: SynthConnectorType[] = [{
  name: 'V/Oct',
  position: {
    x: 160,
    y: 50,
  },
  showLabel: true,
  type: 'cv',
}, {
  name: 'Pitch',
  position: {
    x: 160,
    y: 80,
  },
  showLabel: true,
  type: 'cv',
}, {
  name: 'Mod',
  position: {
    x: 160,
    y: 110,
  },
  showLabel: true,
  type: 'cv',
}, {
  name: 'Press',
  position: {
    x: 160,
    y: 140,
  },
  showLabel: true,
  type: 'cv',
}, {
  icon: 'gate-out',
  name: 'Gate',
  position: {
    x: 160,
    y: 170,
  },
  showIcon: true,
  type: 'gate',
}, {
  name: 'Clock',
  position: {
    x: 160,
    y: 200,
  },
  showLabel: true,
  type: 'gate',
}, {
  name: 'Transport',
  position: {
    x: 160,
    y: 230,
  },
  showLabel: true,
  type: 'data',
}];
