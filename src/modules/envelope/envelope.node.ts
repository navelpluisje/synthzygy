import { GateInputNode } from '@nodes/gateInputNode';
import { createConstantSourceNode } from '@utilities/createConstantSource';

export class EnvelopeNode {
  private attack: number;
  private decay: number;
  private sustain: number;
  private release: number;
  private level: number;
  private context: AudioContext;
  private cvOutputNode: ConstantSourceNode;
  private gateInput: GateInputNode;

  constructor(
    context: AudioContext,
    ) {
    this.context = context;
    this.gateInput = new GateInputNode(this.context, this.trigger);
    this.setAttack(.3);
    this.setDecay(.3);
    this.setSustain(.5);
    this.setRelease(.5);
    this.setLevel(.8);
    this.createCvOutputNode();
  }

  public setAttack = (attack: number): void => {
    this.attack = attack || 0.001;
  }

  public getAttack(): number {
    return this.attack;
  }

  public setDecay = (decay: number): void => {
    this.decay = decay || 0.001;
  }

  public getDecay(): number {
    return this.decay;
  }

  public setSustain = (sustain: number): void => {
    this.sustain = sustain;
  }

  public getSustain(): number {
    return this.sustain;
  }

  public setRelease = (release: number): void => {
    this.release = release / 10 || 0.001;
  }

  public getRelease(): number {
    return this.release;
  }

  public setLevel = (level: number): void => {
    this.level = level * 8;
  }

  public getLevel(): number {
    return this.level;
  }

  public inputGate(): GainNode {
    return this.gateInput.input();
  }

  public output(): ConstantSourceNode {
    return this.cvOutputNode;
  }

  private createCvOutputNode() {
    this.cvOutputNode = createConstantSourceNode(this.context, 0);
  }

  private trigger = (value: number): void => {
    const time = this.context.currentTime;

    this.cvOutputNode.offset.cancelAndHoldAtTime(0);
    if (value === 1) {
      this.cvOutputNode.offset.setTargetAtTime(this.level, time, this.attack);
      this.cvOutputNode.offset.setTargetAtTime(this.sustain * this.level, time + this.attack, this.decay);
    }
    if (value === 0) {
      this.cvOutputNode.offset.setTargetAtTime (0, time, this.release);
    }
  }
}
