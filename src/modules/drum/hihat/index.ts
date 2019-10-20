import { Knob, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, GateTrigger, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { HiHatNode } from './hihat.node';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export class HiHat extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 140,
    width: 140,
  };

  public type =  'hihat';
  public title = 'Hihat';
  public node: HiHatNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new HiHatNode(context);
    this.container = new SynthModule(canvas, HiHat.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addControls();
  }

  public getNode() {
    return this.node;
  }

  private addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentGenerator));
    this.controls.push(new Knob(this.canvas, this, controlTypes[1], this.node.setDecay, Colors.AccentGenerator));
  }

  private getInputConnection(type: string): GateTrigger {
    switch (type) {
      case 'Gate':
        return this.node.inputGate();
    }
  }

  private getOutputConnection(type: string): GainNode {
    switch (type) {
      case 'Audio':
        return this.node.output();
    }
  }
}
