import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, ModuleDefaultValues, PositionType } from 'src/types';
import { knobTypes } from './lfo.knobs';
import { LfoNode } from './lfo.node';
import { outputTypes } from './lfo.outputs';

export class Lfo extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 160,
    width: 140,
  };

  public type =  'lfo';
  public title = 'Lfo';
  protected defaults: ModuleDefaultValues = {
    freq: 5,
  };
  private node: LfoNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentModulator;
    this.node = new LfoNode(context);
    this.container = new SynthModule(canvas, Lfo.dimensions, position, this.color);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getValues(): ModuleDefaultValues {
    return {
      freq: this.node.getFrequency(),
    };
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'sawWave':
        return this.node.outputSaw();
      case 'sineWave':
        return this.node.outputSine();
      case 'squareWave':
        return this.node.outputSquare();
      case 'triangleWave':
        return this.node.outputTriangle();
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
    }
  }
}
