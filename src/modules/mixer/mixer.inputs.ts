import { SynthConnectorType } from 'src/types';

export const inputTypes: SynthConnectorType[] = [{
  connection: [{
    x: 40,
    y: 65,
  }],
  icon: 'audio-in',
  name: 'audioIn1',
  position: {
    x: 20,
    y: 65,
  },
  type: 'audio',
}, {
  connection: [{
    x: 45,
    y: 100,
  }, {
    x: 50,
    y: 105,
  }, {
    x: 85,
    y: 105,
  }, {
    x: 105,
    y: 85,
  }],
  icon: 'audio-in',
  name: 'audioIn2',
  position: {
    x: 20,
    y: 100,
  },
  type: 'audio',
}, {
  connection: [{
    x: 40,
    y: 135,
  }],
  icon: 'audio-in',
  name: 'audioIn3',
  position: {
    x: 20,
    y: 135,
  },
  type: 'audio',
}, {
  connection: [{
    x: 45,
    y: 170,
  }, {
    x: 50,
    y: 175,
  }, {
    x: 85,
    y: 175,
  }, {
    x: 105,
    y: 155,
  }],
  icon: 'audio-in',
  name: 'audioIn4',
  position: {
    x: 20,
    y: 170,
  },
  type: 'audio',
}];
