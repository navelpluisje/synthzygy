import { SynthConnectorType } from "src/types";

// TODO: This needs to be a connection in stead of an icon
export const outputTypes: SynthConnectorType[] = [{
  name: 'Freqency',
  icon: 'sine',
  type: 'audio',
  position: {
    x: 80,
    y: 80,
  },
  showIcon: true,
}, {
  name: 'gateOut',
  icon: 'gate-out',
  type: 'gate',
  position: {
    x: 80,
    y: 110,
  },
  showIcon: true,
}]