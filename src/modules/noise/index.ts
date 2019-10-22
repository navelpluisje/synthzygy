import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, ModuleDefaultValues, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { NoisesNode } from './noise.node';
import { outputTypes } from './outputs';

export class Noise extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 230,
    width: 110,
  };

  public type =  'noise';
  public title = 'Noise';
  protected defaults: ModuleDefaultValues = {
    blue: 1,
    pink: 1,
    white: 2,
  };
  private node: NoisesNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position);
    this.accentColor = Colors.AccentGenerator;
    this.node = new NoisesNode(context);
    this.container = new SynthModule(canvas, Noise.dimensions, position, this.color);
    this.setup();
  }

  private async setup() {
    await this.node.setup();
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(controlTypes, this.getKnobCallbackAndDefault);
    this.drawOutputs();
    this.drawControls();
  }

  private drawOutputs() {
    this.outputs.forEach((output) => output.component.draw());
  }

  private drawControls() {
    this.controls.forEach((control) => control.draw());
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'Pink':
        return this.node.outputPinkNoise();
      case 'White':
        return this.node.outputWhiteNoise();
      case 'Blue':
        return this.node.outputBlueNoise();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'pink':
        return {
          callback: this.node.setPinkNoisGain,
          default: this.defaults[key],
        };
      case 'white':
        return {
          callback: this.node.setWhiteNoisGain,
          default: this.defaults[key],
        };
      case 'blue':
        return {
          callback: this.node.setBlueNoisGain,
          default: this.defaults[key],
        };
    }
  }
}
