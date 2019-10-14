import { InputConnector, Knob, OutputConnector, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, GateTrigger, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { SnareNode } from './snare.node';

export class Snare extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 210,
    width: 140,
  };

  public type =  'snare';
  public title = 'Snare';
  public node: SnareNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new SnareNode(context);
    this.container = new SynthModule(canvas, Snare.dimensions, position, this.color);
    this.addInputs();
    this.addOutputs();
    this.addControls();
  }

  public getNode() {
    return this.node;
  }

  private addInputs() {
    inputTypes.forEach((input) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentGenerator);
      this.inputs.push({
        component,
        gate: this.getInputConnection(input.name),
        type: input.type,
      });
    });
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentGenerator);
      this.outputs.push({
        component,
        node: this.node.output(),
        type: output.type,
      });
    });
  }

  private addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setDecay, Colors.AccentGenerator));
    this.controls.push(new Knob(this.canvas, this, controlTypes[1], this.node.setHead, Colors.AccentGenerator));
    this.controls.push(new Knob(this.canvas, this, controlTypes[2], this.node.setSnare, Colors.AccentGenerator));
  }

  private getInputConnection(type: string): GateTrigger {
    switch (type) {
      case 'Gate':
        return this.node.inputGate();
    }
  }
}
