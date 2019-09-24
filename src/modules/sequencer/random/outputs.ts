import { SynthConnectorType } from "src/types";

export const outputTypes: SynthConnectorType[] = [{
  name: 'Out',
  type: 'audio',
  icon: 'envelope',
  position: {
    x: 120,
    y: 180,
  },
  showIcon: true,
}, {
  name: 'Trigger',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 120,
    y: 210,
  },
  showIcon: true,
}, {
  name: '2+6',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 170,
    y: 60,
  },
  showLabel: true,
}, {
  name: '2+4',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 170,
    y: 90,
  },
  showLabel: true,
}, {
  name: '8',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 170,
    y: 120,
  },
  showLabel: true,
}, {
  name: '6',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 170,
    y: 150,
  },
  showLabel: true,
}, {
  name: '4',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 170,
    y: 180,
  },
  showLabel: true,
}, {
  name: '2',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 170,
    y: 210,
  },
  showLabel: true,
}]