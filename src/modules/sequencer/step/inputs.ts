import { SynthConnectorType } from "src/types";

export const inputTypes: SynthConnectorType[] = [{
  name: 'Start/Stop',
  type: 'gate',
  position: {
    x: 20,
    y: 90,
  },
}, {
  name: 'gateIn',
  icon: 'gate-in',
  type: 'gate',
  position: {
    x: 20,
    y: 150,
  },
  showIcon: true,
}]