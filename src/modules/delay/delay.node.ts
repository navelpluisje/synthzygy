import { createGainNode } from '@utilities/createGain';

export class DelayerNode {
  private feedback: number = .6;
  private frequency: number = 2000;
  private delayTime: number = .5;
  private dryWet: number = .5;
  private context: AudioContext;
  private inputNode: GainNode;
  private outputNode: GainNode;
  private dryNode: GainNode;
  private wetNode: GainNode;
  private delayNode: DelayNode;
  private feedbackNode: GainNode;
  private filterNode: BiquadFilterNode;

  public constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createDelayNode();
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = frequency;
    this.filterNode.frequency.setValueAtTime(this.frequency, this.context.currentTime);
  }

  public setFeedback = (feedback: number): void => {
    this.feedback = feedback;
    this.feedbackNode.gain.setValueAtTime(this.feedback, this.context.currentTime);
  }

  public setDryWet = (dryWet: number): void => {
    this.dryWet = dryWet;
    this.dryNode.gain.setValueAtTime(1 - this.dryWet, this.context.currentTime);
    this.wetNode.gain.setValueAtTime(this.dryWet, this.context.currentTime);
  }

  public setDelayTime = (delayTime: number): void => {
    this.delayTime = delayTime;
    this.delayNode.delayTime.value = this.delayTime;
  }

  public inputCvFeedback(): AudioParam {
    return this.feedbackNode.gain;
  }

  public input(): GainNode {
    return this.inputNode;
  }

  public output(): GainNode {
    return this.outputNode;
  }

  private createDelayNode() {
    this.inputNode = createGainNode(this.context, 1);
    this.outputNode = createGainNode(this.context, 1);

    this.delayNode = new DelayNode(this.context, {
      delayTime: this.delayTime,
      maxDelayTime: 6.0,
    });

    this.feedbackNode = createGainNode(this.context, this.feedback);

    this.filterNode = new BiquadFilterNode(this.context, {
      Q: 0,
      frequency: this.frequency,
    });

    this.dryNode = createGainNode(this.context, 0);
    this.wetNode = createGainNode(this.context, 0);
    this.setDryWet(this.dryWet);

    this.inputNode
      .connect(this.filterNode)
      .connect(this.delayNode)
      .connect(this.feedbackNode)
      .connect(this.filterNode);
    this.delayNode
      .connect(this.wetNode)
      .connect(this.outputNode);
    this.inputNode
      .connect(this.dryNode)
      .connect(this.outputNode);
  }
}
