import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { MixerNode } from './mixer.node';
import { outputTypes } from './outputs';

export class Mixer extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 245,
    width: 165,
  };

  public type = 'mixer';
  public title = 'Mixer';
  protected defaults: ModuleDefaultValues = {
    'in 1': 0.5,
    'in 2': 0.5,
    'in 3': 0.5,
    'in 4': 0.5,
    'out': 1,
  };
  private node: MixerNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentAudioPath;
    this.node = new MixerNode(context);
    this.container = new SynthModule(canvas, Mixer.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(controlTypes, this.getKnobCallbackAndDefault);
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioOut':
        return this.node.output();
    }
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioIn1':
        return this.node.input('1');
      case 'audioIn2':
        return this.node.input('2');
      case 'audioIn3':
        return this.node.input('3');
      case 'audioIn4':
        return this.node.input('4');
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'in 1':
        return {
          callback: this.node.setAudio('1'),
          default: this.defaults[key],
        };
      case 'in 2':
        return {
          callback: this.node.setAudio('2'),
          default: this.defaults[key],
        };
      case 'in 3':
        return {
          callback: this.node.setAudio('3'),
          default: this.defaults[key],
        };
      case 'in 4':
        return {
          callback: this.node.setAudio('4'),
          default: this.defaults[key],
        };
      case 'out':
        return {
          callback: this.node.setAudio('out'),
          default: this.defaults[key],
        };
    }
  }
}
