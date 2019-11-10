import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, ModuleDefaultValues, PositionType } from 'src/types';
import { inputTypes } from './snare.inputs';
import { knobTypes } from './snare.knobs';
import { SnareNode } from './snare.node';
import { outputTypes } from './snare.outputs';

export class Snare extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 210,
    width: 140,
  };
  private static initialValues: ModuleDefaultValues = {
    decay: 0.1,
    head: 0.2,
    snare: 2000,
  };

  public type =  'snare';
  public title = 'Snare';
  private node: SnareNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...Snare.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentGenerator;
    this.node = new SnareNode(context);
    this.container = new SynthModule(canvas, Snare.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      decay: this.node.getDecay(),
      head: this.node.getHead(),
      snare: this.node.getSnare(),
    };
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case 'Gate':
        return this.node.inputGate();
    }
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'Audio':
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
