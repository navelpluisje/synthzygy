import { SynthConnectorType } from 'src/types';

// TODO: This needs to be a connection in stead of an icon
export const outputTypes: SynthConnectorType[] = [{
  icon: 'gate-out',
  name: 'gateOut',
  position: {
    x: 80,
    y: 110,
  },
  showIcon: true,
  type: 'audio',
}];
