import { SynthConnectorType } from "src/types";

export const outputTypes: SynthConnectorType[] = [{
  name: 'cvOutputA',
  icon: 'envelope-out',
  type: 'audio',
  position: {
    x: 550,
    y: 90,
  },
  showIcon: true,
}, {
  name: 'cvOutputB',
  icon: 'envelope-out',
  type: 'audio',
  position: {
    x: 550,
    y: 120,
  },
  showIcon: true,
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