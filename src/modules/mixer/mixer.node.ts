import { createGainNode } from '@utilities/createGain';

interface MixerValues {
  [key: string]: number;
}

export class MixerNode {
  public context: AudioContext;
  public audioIn1: GainNode;
  public audioIn2: GainNode;
  public audioIn3: GainNode;
  public audioIn4: GainNode;
  public audioOut: GainNode;

  public values: MixerValues = {
    1: 0.5,
    2: 0.5,
    3: 0.5,
    4: 0.5,
    out: 0.5,
  };

  constructor(
    context: AudioContext,
    frequency: number = 0,
  ) {
    this.context = context;
    this.createGainNodes();
    this.connectNodes();
  }

  public createGainNodes() {
    this.audioIn1 = createGainNode(this.context, 0.5);
    this.audioIn2 = createGainNode(this.context, 0.5);
    this.audioIn3 = createGainNode(this.context, 0.5);
    this.audioIn4 = createGainNode(this.context, 0.5);

    this.audioOut = createGainNode(this.context, 0.5);
  }

  public connectNodes() {
    this.audioIn1.connect(this.audioOut);
    this.audioIn2.connect(this.audioOut);
    this.audioIn3.connect(this.audioOut);
    this.audioIn4.connect(this.audioOut);
  }

  public getAudioNode(index: string) {
    switch (index) {
      case '1':
        return this.audioIn1;
      case '2':
        return this.audioIn2;
      case '3':
        return this.audioIn3;
      case '4':
        return this.audioIn4;
      case 'out':
        return this.audioOut;
    }
  }

  public setAudio = (index: string): (value: number) => void => {
    return (value: number) => {
      this.values[index.toString()] = value;
      this.getAudioNode(index).gain.setTargetAtTime(value, this.context.currentTime, 0.001);
    };
  }

  public getAudio(index: string): number {
    return this.values[index];
  }

  public input(index: string): GainNode {
    switch (index) {
      case '1':
        return this.audioIn1;
      case '2':
        return this.audioIn2;
      case '3':
        return this.audioIn3;
      case '4':
        return this.audioIn4;
    }
  }

  public output(): GainNode {
    return this.audioOut;
  }
}
