import { createGainNode } from '@utilities/createGain';

export class OutputNode {
  private gain: number;
  private context: AudioContext;
  private dynamicsNode: DynamicsCompressorNode;
  private gainNode: GainNode;

  constructor(
    context: AudioContext,
    gain: number = 0.5,
  ) {
    this.context = context;
    this.gain = gain;
    this.createGainNode();
  }

  public createGainNode() {
    this.gainNode = createGainNode(this.context, this.gain);
    this.dynamicsNode = new DynamicsCompressorNode(this.context);

    this.gainNode
      .connect(this.dynamicsNode)
      .connect(this.context.destination);
  }

  public setGain = (gain: number): void => {
    this.gain = gain;
    this.gainNode.gain.setTargetAtTime(this.gain, this.context.currentTime, 0.001);
  }

  public getGain = (): number => {
    return this.gain;
  }

  public connectAudioIn(): GainNode {
    return this.gainNode;
  }
}
