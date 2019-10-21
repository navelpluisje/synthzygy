import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, GateTrigger, ModuleDefaultValues, PositionType } from 'src/types';
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
  protected defaults: ModuleDefaultValues = {
    decay: 0.1,
    head: 0.2,
    snare: 2000,
  };
  private node: SnareNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentGenerator;
    this.node = new SnareNode(context);
    this.container = new SynthModule(canvas, Snare.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(controlTypes, this.getKnobCallbackAndDefault);
  }

  public getNode() {
    return this.node;
  }

  private getInputConnection = (type: string): GateTrigger => {
    switch (type) {
      case 'Gate':
        return this.node.inputGate();
    }
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'Output':
        return this.node.output();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'decay':
        return {
          callback: this.node.setDecay,
          default: this.defaults[key],
        };
      case 'head':
        return {
          callback: this.node.setHead,
          default: this.defaults[key],
        };
      case 'snare':
        return {
          callback: this.node.setSnare,
          default: this.defaults[key],
        };
    }
  }
}
