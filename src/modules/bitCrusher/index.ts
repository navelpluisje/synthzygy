import { InputConnector, OutputConnector, Knob, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { BitCrusherNode } from './bitCrusher.node';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export interface BitCrusher extends Module {
  getNode(): BitCrusherNode;
}

export class BitCrusher extends ModuleBase implements BitCrusher, ParentModule {
  public static dimensions = {
    height: 205,
    width: 140,
  };

  public type = 'bitCrusher';
  public title = 'Crushy';
  public active: boolean = false;
  public node: BitCrusherNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new BitCrusherNode(context);
    this.container = new SynthModule(canvas, BitCrusher.dimensions, position, this.color);
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
    this.controls.push(new Knob(
      this.canvas,
      this,
      controlTypes[0],
      this.node.setBitDepth,
      Colors.AccentEffect,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this,
      controlTypes[1],
      this.node.setFrequencyReduction,
      Colors.AccentEffect,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this,
      controlTypes[2],
      this.node.setDryWet,
      Colors.AccentEffect,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this,
      controlTypes[3],
      this.node.setOutputLevel,
      Colors.AccentEffect,
    ));
  }

  public getNode(): BitCrusherNode {
    return this.node;
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'audioIn':
        return this.node.input();
    }

  }
}
