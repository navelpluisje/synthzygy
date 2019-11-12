import { GateInputNode } from '@nodes/gateInputNode';
import { GateOutputNode } from '@nodes/gateOutputNode';

export class OrNode {
  private valueA: number;
  private valueB: number;
  private gateA: GateInputNode;
  private gateB: GateInputNode;
  private outAnd: GateOutputNode;
  private outNand: GateOutputNode;
  private context: AudioContext;

  constructor(
    context: AudioContext,
  ) {
    this.context = context;
    this.createNodes();
  }

  public inputA(): GainNode {
    return this.gateA.input();
  }

  public inputB(): GainNode {
    return this.gateB.input();
  }

  public outputAnd(): ConstantSourceNode {
    return this.outAnd.output();
  }

  public outputNAnd(): ConstantSourceNode {
    return this.outNand.output();
  }

  private handleLogic() {
    const orValue = this.valueA | this.valueB;
    this.outAnd.setLevel(orValue);
    this.outNand.setLevel(1 - orValue);
  }

  private triggerA = (value: number) => {
    this.valueA = value;
    this.handleLogic();
  }

  private triggerB = (value: number) => {
    this.valueB = value;
    this.handleLogic();
  }

  private createNodes() {
    this.gateA = new GateInputNode(this.context, this.triggerA);
    this.gateB = new GateInputNode(this.context, this.triggerB);
    this.outAnd = new GateOutputNode(this.context);
    this.outNand = new GateOutputNode(this.context);
  }
}
