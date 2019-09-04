import { ModuleButtonsList } from '@components/buttonGroup';

export const buttons: ModuleButtonsList = [{
  position: {
    x: 20,
    y: 45,
  },
  dimensions: {
    height: 25,
    width: 50,
  },
  direction: 'vertical',
  active: 'stop',
  buttons: [{
    label: 'Start',
    value: 'start',
  }, {
    label: 'Stop',
    value: 'stop',
  }, {
    label: 'Reset',
    value: 'reset',
  }]
}, {
  position: {
    x: 445,
    y: 45,
  },
  dimensions: {
    height: 25,
    width: 35,
  },
  direction: 'vertical',
  active: 'A',
  buttons: [{
    label: 'A',
    value: 'A',
  }, {
    label: 'B',
    value: 'B',
  }]
}]
