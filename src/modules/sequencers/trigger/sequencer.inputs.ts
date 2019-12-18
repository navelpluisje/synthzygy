import { SynthConnectorType } from 'src/types';

export const inputTypes: SynthConnectorType[] = [{
  name: 'Start/Stop',
  position: {
    x: 20,
    y: 250,
  },
  type: 'data',
}, {
  icon: 'gate-in',
  name: 'gateIn',
  position: {
    x: 20,
    y: 280,
  },
  showIcon: true,
  type: 'gate',
}];
