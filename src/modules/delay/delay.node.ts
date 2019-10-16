import { DryWetNode } from '@nodes/dryWetNode';
import { createGainNode } from '@utilities/createGain';

export class DelayerNode {
  private feedback: number = .6;
  private frequency: number = 2000;
  private delayTime: number = .5;
  private context: AudioContext;
  private inputNode: GainNode;
  private outputNode: GainNode;
  private delayNode: DelayNode;
  private feedbackNode: GainNode;
  private filterNode: BiquadFilterNode;
  private dryWetNode: DryWetNode;

  public constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createDelayNode();
  }

  public setFrequency = (frequency: number): void => {
    this.frequency = frequency;
    this.filterNode.frequency.setTargetAtTime(this.frequency, this.context.currentTime, 0.001);
  }

  public setFeedback = (feedback: number): void => {
    this.feedback = feedback;
    this.feedbackNode.gain.setTargetAtTime(this.feedback, this.context.currentTime, 0.001);
  }

  public setDryWet = (dryWet: number): void => {
    this.dryWetNode.setRatio(dryWet);
  }

  public setDelayTime = (delayTime: number): void => {
    this.delayTime = delayTime;
    this.delayNode.delayTime.setTargetAtTime(this.delayTime, this.context.currentTime, 0.001);
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
    this.dryWetNode = new DryWetNode(this.context, {
      ratio: 0,
    });

    this.delayNode = new DelayNode(this.context, {
      delayTime: this.delayTime,
      maxDelayTime: 6.0,
    });

    this.feedbackNode = createGainNode(this.context, this.feedback);

    this.filterNode = new BiquadFilterNode(this.context, {
      Q: 0,
      frequency: this.frequency,
    });

    this.inputNode
      .connect(this.filterNode)
      .connect(this.delayNode)
      .connect(this.feedbackNode)
      .connect(this.filterNode);
    this.delayNode.connect(this.dryWetNode.getWetNode());
    this.inputNode.connect(this.dryWetNode.getDryNode());
    this.dryWetNode.connect(this.outputNode);
  }
}
