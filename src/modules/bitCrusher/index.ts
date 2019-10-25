import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './bitCrusher.inputs';
import { knobTypes } from './bitCrusher.knobs';
import { BitCrusherNode } from './bitCrusher.node';
import { outputTypes } from './bitCrusher.outputs';

export class BitCrusher extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 205,
    width: 140,
  };
  private static initialValues: ModuleDefaultValues = {
    'degrade': 0.5,
    'depth': 8,
    'level': 0.5,
    'wet/dry': 0.5,
  };

  public type = 'bitCrusher';
  public title = 'Crushy';
  private node: BitCrusherNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...BitCrusher.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentEffect;
    this.node = new BitCrusherNode(context);
    this.container = new SynthModule(canvas, BitCrusher.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      'degrade': this.node.getFrequencyReduction(),
      'depth': this.node.getBitDepth(),
      'level': this.node.getOutputLevel(),
      'wet/dry': this.node.getDryWet(),
    };
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
      case 'depth':
        return {
          callback: this.node.setBitDepth,
          default: this.defaults[key],
        };
      case 'degrade':
        return {
          callback: this.node.setFrequencyReduction,
          default: this.defaults[key],
        };
      case 'wet/dry':
        return {
          callback: this.node.setDryWet,
          default: this.defaults[key],
        };
      case 'level':
        return {
          callback: this.node.setOutputLevel,
          default: this.defaults[key],
        };
    }
  }
}
