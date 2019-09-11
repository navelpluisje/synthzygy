import { SynthConnectorType } from "src/types";

// TODO: This needs to be a connection in stead of an icon
export const outputTypes: SynthConnectorType[] = [{
  name: 'V/Oct',
  type: 'audio',
  position: {
    x: 160,
    y: 50,
  },
  showLabel: true,
}, {
  name: 'Pitch',
  type: 'audio',
  position: {
    x: 160,
    y: 80,
  },
  showLabel: true,
}, {
  name: 'Mod',
  type: 'audio',
  position: {
    x: 160,
    y: 110,
  },
  showLabel: true,
}, {
  name: 'Press',
  type: 'audio',
  position: {
    x: 160,
    y: 140,
  },
  showLabel: true,
}, {
  name: 'Gate',
  type: 'gate',
  icon: 'gate-out',
  showIcon: true,
  position: {
    x: 160,
    y: 170,
  },
}]