import { createGainNode } from '@utilities/createGain';

export class FilterNode {
  private frequency: number;
  private q: number;
  private level: number;
  private cvFreq: number;
  private cvQ: number;
  private type: BiquadFilterType;
  private context: AudioContext;
  private filterNode: BiquadFilterNode;
  private cvFreqNode: GainNode;
  private cvQNode: GainNode;
  private levelNode: GainNode;
  private frequencyNode: AudioWorkletNode;

  constructor(
    context: AudioContext,
    frequency: number = 440,
  ) {
    this.context = context;
    this.frequency = frequency;
    this.createFilterNode();
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = frequency;
    this.frequencyNode.parameters.get('frequency').setValueAtTime(this.frequency, this.context.currentTime);
  }

  public setQ = (q: number): void => {
    this.q = q;
    this.filterNode.Q.setValueAtTime(this.q, this.context.currentTime);
  }

  public setFilterType = (type: BiquadFilterType): void => {
    this.type = type;
    this.filterNode.type = this.type;
  }

  public setInputLevel = (level: number): void => {
    this.level = level;
    this.levelNode.gain.setValueAtTime(this.level, this.context.currentTime);
  }

  public setCvFrequency = (amount: number): void => {
    this.cvFreq = amount;
    this.cvFreqNode.gain.setValueAtTime(this.cvFreq, this.context.currentTime);
  }

  public SetCvQ = (amount: number): void => {
    this.cvQ = amount;
    this.cvQNode.gain.setValueAtTime(this.cvQ, this.context.currentTime);
  }

  public inputCvFrequency(): GainNode {
    return this.cvFreqNode;
  }

  public inputCvQ(): GainNode {
    return this.cvQNode;
  }

  public input(): GainNode {
    return this.levelNode;
  }

  public output(): BiquadFilterNode {
    return this.filterNode;
  }

  private createFilterNode() {
    this.filterNode = new BiquadFilterNode(this.context, {
      Q: 20,
      frequency: 0,
    });

    this.levelNode = createGainNode(this.context, 1);
    this.cvFreqNode = createGainNode(this.context, 0);
    this.cvQNode =  createGainNode(this.context, 5);

    this.frequencyNode = new AudioWorkletNode(this.context, 'frequency-processor');
    this.setCvFrequency(4);

    this.levelNode.connect(this.filterNode);
    this.frequencyNode.connect(this.filterNode.frequency);
    this.cvFreqNode.connect(this.frequencyNode.parameters.get('fm'));
    this.cvQNode.connect(this.filterNode.Q);
  }
}
