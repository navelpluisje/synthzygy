import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, GateTrigger, ModuleDefaultValues, PositionType } from 'src/types';
import { inputTypes } from './kick.inputs';
import { knobTypes } from './kick.knobs';
import { KickNode } from './kick.node';
import { outputTypes } from './kick.outputs';

export class Kick extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 210,
    width: 140,
  };
  private static initialValues: ModuleDefaultValues = {
    boost: 0,
    decay: 0.3,
    pitch: 40,
    punch: 0.5,
  };

  public type =  'kick';
  public title = 'Kick';
  private node: KickNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...Kick.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentGenerator;
    this.node = new KickNode(context);
    this.container = new SynthModule(canvas, Kick.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      boost: this.node.getBoost(),
      decay: this.node.getDecay(),
      pitch: this.node.getFrequency(),
      punch: this.node.getSweep(),
    };
  }

  private getInputConnection = (type: string): GateTrigger => {
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
      case 'pitch':
        return {
          callback: this.node.setFequency,
          default: this.defaults[key],
        };
      case 'decay':
        return {
          callback: this.node.setDecay,
          default: this.defaults[key],
        };
      case 'punch':
        return {
          callback: this.node.setSweep,
          default: this.defaults[key],
        };
      case 'boost':
        return {
          callback: this.node.setBoost,
          default: this.defaults[key],
        };
    }
  }
}
