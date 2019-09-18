import { SynthConnectorType } from "src/types";

export const outputTypes: SynthConnectorType[] = [{
  name: 'cv A',
  icon: 'envelope-out',
  type: 'audio',
  position: {
    x: 550,
    y: 90,
  },
  showLabel: true,
}, {
  name: 'cv B',
  icon: 'envelope-out',
  type: 'audio',
  position: {
    x: 550,
    y: 120,
  },
  showLabel: true,
}, {
  name: 'gateOut',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 550,
    y: 150,
  },
  showIcon: true,
}]