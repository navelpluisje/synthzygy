import { createConstantSourceNode } from '@utilities/createConstantSource';
import { GateTrigger } from 'src/types';

export class EnvelopeNode {
  private attack: number;
  private decay: number;
  private sustain: number;
  private release: number;
  private level: number;
  private context: AudioContext;
  private cvOutputNode: ConstantSourceNode;

  constructor(
    context: AudioContext,
    ) {
    this.context = context;
    this.setAttack(.3);
    this.setDecay(.3);
    this.setSustain(.5);
    this.setRelease(.5);
    this.setLevel(.8);
    this.createCvOutputNode();
  }

  public setAttack = (attack: number): void => {
    this.attack = attack;
  }

  public setDecay = (decay: number): void => {
    this.decay = decay;
  }

  public setSustain = (sustain: number): void => {
    this.sustain = sustain;
  }

  public setRelease = (release: number): void => {
    this.release = release / 10;
  }

  public setLevel = (level: number): void => {
    this.level = level * 8;
  }

  public inputGate(): GateTrigger {
    return this.trigger;
  }

  public output(): ConstantSourceNode {
    return this.cvOutputNode;
  }

  private createCvOutputNode() {
    this.cvOutputNode = createConstantSourceNode(this.context, 0);
  }

  private trigger = (value: number): void => {
    this.cvOutputNode.offset.cancelAndHoldAtTime(0);
    const time = this.context.currentTime;

    if (value === 1) {
      this.cvOutputNode.offset.linearRampToValueAtTime(
        this.level,
        time + this.attack,
      );
      this.cvOutputNode.offset.linearRampToValueAtTime(
        this.sustain * this.level,
        time + this.attack + this.decay,
      );
    }
    if (value === 0) {
      this.cvOutputNode.offset.setValueCurveAtTime (
        [this.cvOutputNode.offset.value, 0],
        time,
        this.release,
      );
    }
  }
}
