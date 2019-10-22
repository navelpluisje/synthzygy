import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { DelayerNode } from './delay.node';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export class Delay extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 210,
    width: 140,
  };

  public type = 'delay';
  public title = 'Delay';
  protected defaults: ModuleDefaultValues = {
    'cutoff': 3000,
    'delay': 0.5,
    'dry/wet': 0,
    'f.back': 0.6,
  };
  private node: DelayerNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentEffect;
    this.node = new DelayerNode(context);
    this.container = new SynthModule(canvas, Delay.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(controlTypes, this.getKnobCallbackAndDefault);
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioIn':
        return this.node.input();
    }
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioOut':
        return this.node.output();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'delay':
        return {
          callback: this.node.setDelayTime,
          default: this.defaults[key],
        };
      case 'f.back':
        return {
          callback: this.node.setFeedback,
          default: this.defaults[key],
        };
      case 'dry/wet':
        return {
          callback: this.node.setDryWet,
          default: this.defaults[key],
        };
      case 'cutoff':
        return {
          callback: this.node.setFrequency,
          default: this.defaults[key],
        };
    }
  }
}
