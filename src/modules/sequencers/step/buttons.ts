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
    x: 50,
    y: 45,
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
    x: 50,
    y: 100,
  },
}, {
  active: 'A',
  buttons: [{
    label: 'A',
    value: 'A',
  }, {
    label: 'B',
    value: 'B',
  }],
  dimensions: {
    height: 25,
    width: 35,
  },
  direction: 'vertical',
  position: {
    x: 480,
    y: 60,
  },
}];
