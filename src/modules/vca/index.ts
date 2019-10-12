import { InputConnector, OutputConnector, Rotary, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { VcaNode } from './vca.node';

export interface Vca extends Module {
  getNode(): VcaNode;
}

export class Vca extends ModuleBase implements Vca, ParentModule {
  public static dimensions = {
    height: 140,
    width: 130,
  };

  public type = 'vca';
  public title = 'Vca';
  public active: boolean = false;
  public node: VcaNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new VcaNode(context);
    this.container = new SynthModule(canvas, Vca.dimensions, position, this.color);
    this.addOutputs();
    this.addInputs();
    this.addControls();
  }

  public getKey(type: string): string {
    switch (type) {
      case 'audio':
        return 'node';
      case 'cv':
        return 'cv';
    }
  }

  public addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentAudioPath);
      this.inputs.push({
        component,
        node: this.getInputConnection(input.name),
        type: input.type,
      });
    });
  }

  public addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentAudioPath);
      this.outputs.push({
        component,
        node: this.node.output(),
        type: output.type,
      });
    });
  }

  public addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath));
  }

  public getNode() {
    return this.node;
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'cvGain':
        return this.node.inputCvGain();
      case 'audioIn':
        return this.node.input();
    }
  }
}
