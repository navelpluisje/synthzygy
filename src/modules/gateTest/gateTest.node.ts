export class GateNode {
  public context: AudioContext;
  public gateNode: AudioWorkletNode;

  constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createGainNode();
  }

  public createGainNode() {
    this.gateNode = new AudioWorkletNode(this.context, 'gateinput-processor');
  }

  public input(): AudioWorkletNode {
    return this.gateNode;
  }

  public output(): AudioWorkletNode {
    return this.gateNode;
  }
}
