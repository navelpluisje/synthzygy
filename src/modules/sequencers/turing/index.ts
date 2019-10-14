import { InputConnector, Knob, OutputConnector, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { GateNode } from '@nodes/gateNode';
import { Colors } from 'src/constants/enums';
import { GateTrigger, PositionType } from 'src/types';
import { ModuleBase } from '../../moduleBase';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { TuringMachineNode } from './turingMachine.node';

export class TuringMachine extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 230,
    width: 190,
  };
  public static pulsDimensions = {
    height: 200,
    width: 90,
  };

  public type =  'turinger';
  public title =  'Turing Machine';
  public active: boolean = false;
  public node: TuringMachineNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new TuringMachineNode(context);
    this.container = new SynthModule(canvas, TuringMachine.dimensions, position, this.color);
    this.addOutputs();
    this.addInputs();
    this.addControls();
  }

  public getNode() {
    return this.node;
  }

  private addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentUtility);
      const key = input.type === 'gate' ? 'gate' : 'node';
      this.inputs.push({
        component,
        type: input.type,
        [key]: this.getInputConnection(input.name),
      });
    });
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility);
      const key = output.type === 'gate' ? 'gate' : 'node';
      this.outputs.push({
        component,
        type: output.type,
        [key]: this.getOutputConnection(output.name),
      });
    });
  }

  private addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setProbability, Colors.AccentUtility));
    this.controls.push(new Knob(this.canvas, this, controlTypes[1], this.node.setLength, Colors.AccentUtility));
  }

  private getOutputConnection(type: string): ConstantSourceNode | GateNode {
    switch (type) {
      case 'Out':
        return this.node.output();
      case 'Trigger':
        return this.node.outputGate();
      case '2':
      case '4':
      case '6':
      case '8':
      case '2+4':
      case '2+6':
        return this.node.outputPulse(type);
      }
  }

  private getInputConnection(type: string): GateTrigger {
    switch (type) {
      case 'Clock':
        return this.node.inputClock();
    }
  }
}
