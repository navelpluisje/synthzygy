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
  active: 'lp',
  buttons: [{
    label: 'hp',
    value: 'hp',
  }, {
    label: 'bp',
    value: 'bp',
  }, {
    label: 'lp',
    value: 'lp',
  }]
}
