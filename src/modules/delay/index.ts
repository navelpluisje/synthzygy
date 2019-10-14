import { InputConnector, Knob, OutputConnector, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { DelayerNode } from './delay.node';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export interface Delay extends Module {
  getNode(): DelayerNode;
}

export class Delay extends ModuleBase implements Delay, ParentModule {
  public static dimensions = {
    height: 210,
    width: 140,
  };

  public type = 'delay';
  public title = 'Delay';
  public active: boolean = false;
  public node: DelayerNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new DelayerNode(context);
    this.container = new SynthModule(canvas, Delay.dimensions, position, this.color);
    this.addOutputs();
    this.addInputs();
    this.addControls();
  }

  public addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentEffect);
      this.inputs.push({
        component,
        node: this.getInputConnection(input.name),
        type: input.type,
      });
    });
  }

  public addOutputs() {
    outputTypes.forEach((output) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentEffect);
      this.outputs.push({
        component,
        node: this.node.output(),
        type: output.type,
      });
    });
  }

  public addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setDelayTime, Colors.AccentEffect));
    this.controls.push(new Knob(this.canvas, this, controlTypes[1], this.node.setFeedback, Colors.AccentEffect));
    this.controls.push(new Knob(this.canvas, this, controlTypes[2], this.node.setDryWet, Colors.AccentEffect));
    this.controls.push(new Knob(this.canvas, this, controlTypes[3], this.node.setFrequency, Colors.AccentEffect));
  }

  public getNode(): DelayerNode {
    return this.node;
  }

  private getInputConnection(type: string): GainNode | DelayNode {
    switch (type) {
      case 'audioIn':
        return this.node.input();
    }

  }
}
