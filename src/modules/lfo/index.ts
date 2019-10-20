import { Knob, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { LfoNode } from './lfo.node';
import { outputTypes } from './outputs';

export interface Lfo extends Module {
  getNode(): LfoNode;
}

export class Lfo extends ModuleBase implements Lfo, ParentModule {
  public static dimensions: DimensionType = {
    height: 160,
    width: 140,
  };

  public type =  'lfo';
  public title = 'Lfo';
  public node: LfoNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new LfoNode(context);
    this.container = new SynthModule(canvas, Lfo.dimensions, position, this.color);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addControls();
  }

  public addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentModulator));
  }

  public getNode() {
    return this.node;
  }

  private getOutputConnection(type: string): GainNode {
    switch (type) {
      case 'saw':
        return this.node.outputSaw();
      case 'sine':
        return this.node.outputSine();
      case 'square':
        return this.node.outputSquare();
      case 'triangle':
        return this.node.outputTriangle();
    }
  }
}
