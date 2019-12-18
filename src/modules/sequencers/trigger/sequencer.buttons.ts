import { ModuleButtonsList } from '@components/buttonGroup';

export const buttons: ModuleButtonsList = [{
  active: 'stop',
  buttons: [{
    label: 'Start',
    value: 'start',
  }, {
    label: 'Stop',
    value: 'stop',
  }],
  dimensions: {
    height: 25,
    width: 50,
  },
  direction: 'vertical',
  position: {
    x: 16,
    y: 125,
  },
}, {
  active: '',
  buttons: [{
    label: 'Reset',
    value: 'reset',
  }],
  dimensions: {
    height: 25,
    width: 50,
  },
  direction: 'vertical',
  position: {
    x: 16,
    y: 180,
  },
}];
