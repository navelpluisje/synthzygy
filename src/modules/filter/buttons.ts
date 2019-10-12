import { ModuleButtonsList } from '@components/buttonGroup';

export const buttons: ModuleButtonsList = [{
  active: 'lowpass',
  buttons: [{
    label: 'hp',
    value: 'highpass',
  }, {
    label: 'bp',
    value: 'bandpass',
  }, {
    label: 'lp',
    value: 'lowpass',
  }],
  dimensions: {
    height: 20,
    width: 40,
  },
  direction: 'vertical',
  position: {
    x: 20,
    y: 45,
  },
}];
