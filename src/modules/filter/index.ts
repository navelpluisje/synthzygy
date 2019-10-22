import { ButtonGroup, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { buttons } from './filter.buttons';
import { inputTypes } from './filter.inputs';
import { knobTypes } from './filter.knobs';
import { FilterNode } from './filter.node';
import { outputTypes } from './filter.outputs';

export class Filter extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 290,
    width: 170,
  };

  public type = 'filter';
  public title = 'Filter';
  protected defaults: ModuleDefaultValues = {
    'cutoff': 4,
    'cv c/o': 0,
    'cv res': 0,
    'level in': 1,
    'resonance': 0,
  };
  private node: FilterNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentEffect;
    this.node = new FilterNode(context);
    this.container = new SynthModule(canvas, Filter.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
    this.addButtonControls();
  }

  public getValues(): ModuleDefaultValues {
    return {
      'cutoff': this.node.getFrequency(),
      'cv c/o': this.node.getCvFrequency(),
      'cv res': this.node.getCvQ(),
      'level in': this.node.getInputLevel(),
      'resonance': this.node.getQ(),
    };
  }

  public addButtonControls() {
    buttons.forEach((buttonGroup) => {
      this.buttons.push(new ButtonGroup(this.canvas, this, buttonGroup, this.node.setFilterType, Colors.AccentEffect));
    });
  }

  private getInputConnection = (type: string): GainNode | BiquadFilterNode => {
    switch (type) {
      case 'cvFreq':
        return this.node.inputCvFrequency();
      case 'cvQ':
        return this.node.inputCvQ();
      case 'audioIn':
        return this.node.input();
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
      case 'cutoff':
        return {
          callback: this.node.setFrequency,
          default: this.defaults[key],
        };
      case 'level in':
        return {
          callback: this.node.setInputLevel,
          default: this.defaults[key],
        };
      case 'resonance':
        return {
          callback: this.node.setQ,
          default: this.defaults[key],
        };
      case 'cv c/o':
        return {
          callback: this.node.setCvFrequency,
          default: this.defaults[key],
        };
      case 'cv res':
        return {
          callback: this.node.SetCvQ,
          default: this.defaults[key],
        };
    }
  }
}
