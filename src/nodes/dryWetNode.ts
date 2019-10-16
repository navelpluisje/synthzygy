import { createGainNode } from '@utilities/createGain';
import { getNumberInRange } from '@utilities/numeric';

interface DryWetOptions {
  ratio?: number;
}

export class DryWetNode {
  private static options: DryWetOptions = {
    ratio: 0,
  };
  private context: AudioContext;
  private dryNode: GainNode;
  private wetNode: GainNode;
  private outputNode: GainNode;
  private ratio: number;

  constructor(context: AudioContext, options?: DryWetOptions) {
    this.context = context;
    const mergedOptions = {
      ...DryWetNode.options,
      ...options,
    };
    this.ratio = mergedOptions.ratio;
    this.createNodes();
    this.setDefaultValues();
  }

  /**
   * @description Set the value for the DryWetNode
   * @param {number} ratio the ratio wet/dry to set.Dry: -1, Wet: 1
   * @memberof DryWetNode
   */
  public setRatio = (ratio: number): void => {
    this.ratio = (getNumberInRange(ratio, -1, 1) + 1) / 2;
    this.dryNode.gain.setTargetAtTime(1 - this.ratio, this.context.currentTime, 0.001);
    this.wetNode.gain.setTargetAtTime(this.ratio, this.context.currentTime, 0.001);
  }

  public getDryNode(): AudioNode {
    return this.dryNode;
  }

  public getWetNode(): AudioNode {
    return this.wetNode;
  }

  public connect(audioNode: AudioNode): AudioNode {
    return this.outputNode.connect(audioNode);
  }

  public disconnect(audioNode: AudioNode): undefined {
    this.outputNode.disconnect(audioNode);
    return undefined;
  }

  private createNodes(): void {
    this.dryNode = createGainNode(this.context, 0);
    this.wetNode = createGainNode(this.context, 0);
    this.outputNode = createGainNode(this.context, 1);

    this.dryNode.connect(this.outputNode);
    this.wetNode.connect(this.outputNode);
  }

  private setDefaultValues() {
    this.setRatio(this.ratio);
  }
}
