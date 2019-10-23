import { Knob, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './vca.inputs';
import { knobTypes } from './vca.knobs';
import { VcaNode } from './vca.node';
import { outputTypes } from './vca.outputs';

export class Vca extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 140,
    width: 130,
  };

  public type = 'vca';
  public title = 'Vca';
  protected defaults: ModuleDefaultValues = {
    level: 0,
  };
  private node: VcaNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position);
    this.accentColor = Colors.AccentAudioPath;
    this.node = new VcaNode(context);
    this.container = new SynthModule(canvas, Vca.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getValues() {
    return {
      level: this.node.getLevel(),
    };
  }

  public addControls() {
    this.controls.push(new Knob(this.canvas, this, knobTypes[0], this.node.setGain, Colors.AccentAudioPath));
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case 'cvGain':
        return this.node.inputCvGain();
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
      case 'level':
        return {
          callback: this.node.setLevel,
          default: this.defaults[key],
        };
    }
  }
}
