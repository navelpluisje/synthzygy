import { InputConnector, OutputConnector, Rotary, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { EnvelopeNode } from './envelope.node';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export interface Envelope extends Module {
  getNode(): EnvelopeNode;
}

export class Envelope extends ModuleBase implements Envelope, ParentModule {
  public static dimensions = {
    height: 210,
    width: 200,
  };

  public type = 'envelope';
  public title = 'Envelope';
  public active: boolean = false;
  public node: EnvelopeNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new EnvelopeNode(context);
    this.container = new SynthModule(canvas, Envelope.dimensions, position, this.color);
    this.addOutputs();
    this.addInputs();
    this.addControls();
  }

  public addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentModulator);
      this.inputs.push({
        component,
        gate: this.node.inputGate(),
        type: input.type,
      });
    });
  }

  public addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentModulator);
      this.outputs.push({
        component,
        node: this.node.output(),
        type: output.type,
      });
    });
  }

  public addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setAttack, Colors.AccentModulator));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setDecay, Colors.AccentModulator));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setSustain, Colors.AccentModulator));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[3], this.node.setRelease, Colors.AccentModulator));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[4], this.node.setLevel, Colors.AccentModulator));
  }

  public getNode() {
    return this.node;
  }
}
