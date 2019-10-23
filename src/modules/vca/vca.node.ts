import { createGainNode } from '@utilities/createGain';

export interface VcaNode {
  // Controls
  setGain(gain: number): void;
  // Inputs
  input(): GainNode;
  inputCvGain(): GainNode;
  outputTypes(): GainNode;
}

export class VcaNode implements VcaNode {
  public level: number;
  public context: AudioContext;
  public gainNode: GainNode;
  public cvGainNode: AudioWorkletNode;
  public cvNode: GainNode;

  constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createGainNode();
  }

  public createGainNode() {
    this.gainNode = createGainNode(this.context, 0);
    this.cvNode = createGainNode(this.context, 0);
    this.cvNode.connect(this.gainNode.gain);
  }

  public setLevel = (level: number): void => {
    this.level = level;
    this.cvNode.gain.setTargetAtTime(this.level, this.context.currentTime, 0.001);
  }

  public getLevel(): number {
    return this.level;
  }

  public input(): GainNode {
    return this.gainNode;
  }

  public inputCvGain(): GainNode {
    return this.cvNode;
  }

  public output(): GainNode {
    return this.gainNode;
  }
}
