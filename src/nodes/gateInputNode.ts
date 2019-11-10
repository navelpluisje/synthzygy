import { createGainNode } from '@utilities/createGain';

export class GateInputNode {
  private context: AudioContext;
  private inputNode: GainNode;
  private dummyOutput: AnalyserNode;
  private outputNode: GainNode;
  private gateNode: AudioWorkletNode;
  private onTrigger: (state: number) => void;

  constructor(
    context: AudioContext,
    onTrigger: (state: number) => void,
  ) {
    this.context = context;
    this.onTrigger = onTrigger;
    this.createNodes();
  }

  public input(): GainNode {
    return this.inputNode;
  }

  public output(): GainNode {
    return this.outputNode;
  }

  private handleMessage = (event: MessageEvent) => {
    this.onTrigger(event.data);
  }

  private createNodes() {
    this.inputNode = createGainNode(this.context, 1);
    this.dummyOutput = new AnalyserNode(this.context);
    this.outputNode = createGainNode(this.context, 1);
    this.gateNode = new AudioWorkletNode(this.context, 'gateinput-processor');
    this.gateNode.port.onmessage = this.handleMessage;

    this.inputNode.connect(this.gateNode).connect(this.outputNode);
    this.gateNode.connect(this.dummyOutput);
  }
}
