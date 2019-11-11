import { SynthConnectorType } from 'src/types';

export const outputTypes: SynthConnectorType[] = [{
  icon: 'gate-out',
  name: 'and',
  position: {
    x: 140,
    y: 65,
  },
  showIcon: true,
  type: 'gate',
}, {
  icon: 'gate-out',
  name: 'nand',
  position: {
    x: 140,
    y: 115,
  },
  showIcon: true,
  type: 'gate',
}];
