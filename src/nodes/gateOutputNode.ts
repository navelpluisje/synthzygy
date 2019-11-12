import { createConstantSourceNode } from '@utilities/createConstantSource';

export class GateOutputNode {
  private level: number;
  private context: AudioContext;
  private gateNode: ConstantSourceNode;

  constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createGainNode();
  }

  public createGainNode() {
    this.gateNode = createConstantSourceNode(this.context);
  }

  public setLevel = (level: number): void => {
    if (!isNaN(level) && this.level !== level) {
      this.level = level;
      this.gateNode.offset.setValueAtTime(this.level, this.context.currentTime);
    }
  }

  public output(): ConstantSourceNode {
    return this.gateNode;
  }
}
