import { ModuleButtonsList } from '@components/moduleButtonGroup';

export const buttons: ModuleButtonsList = {
  position: {
    x: 20,
    y: 45,
  },
  dimensions: {
    height: 20,
    width: 40,
  },
  direction: 'vertical',
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
  }]
}
