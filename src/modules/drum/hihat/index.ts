import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, GateTrigger, ModuleDefaultValues, PositionType } from 'src/types';
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
  protected defaults: ModuleDefaultValues = {
    decay: 0.1,
    freq: 4000,
  };
  private node: HiHatNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentGenerator;
    this.node = new HiHatNode(context);
    this.container = new SynthModule(canvas, HiHat.dimensions, position, this.color);
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
      case 'Audio':
        return this.node.output();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'freq':
        return {
          callback: this.node.setFrequency,
          default: this.defaults[key],
        };
      case 'decay':
        return {
          callback: this.node.setDecay,
          default: this.defaults[key],
        };
    }
  }
}
