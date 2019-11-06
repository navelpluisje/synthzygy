import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './harmonic.inputs';
import { knobTypes } from './harmonic.knobs';
import { labels } from './harmonic.labels';
import { HarmonicNode } from './harmonic.node';
import { outputTypes } from './harmonic.outputs';
import { sliderTypes } from './harmonic.sliders';

export class HarmonicOscillator extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 195,
    width: 420,
  };
  private static initialValues: ModuleDefaultValues = {
    detune: 0,
    fm: 0,
    freq: 3.0,
  };

  public type = 'harmonic';
  public title = 'Harmonic Oscillator';
  private node: HarmonicNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...HarmonicOscillator.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentGenerator;
    this.node = new HarmonicNode(context);
    this.container = new SynthModule(canvas, HarmonicOscillator.dimensions, position, this.color);

    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
    this.addSliders(sliderTypes, this.getSliderCallbackAndDefault);
    this.addLabels(labels);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      detune: this.node.getDetune(),
      fm: this.node.getFm(),
      freq: this.node.getFrequency(),
    };
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'output':
        return this.node.output();
    }
  }

  private getInputConnection = (type: string): GainNode | AudioParam => {
    switch (type) {
      case 'fm':
        return this.node.inputCvFM();
      case 'frequency':
        return this.node.inputFrequency();
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
      case 'fm':
        return {
          callback: this.node.setFm,
          default: this.defaults[key],
        };
      case 'detune':
        return {
          callback: this.node.setDetune,
          default: this.defaults[key],
        };
    }
  }

  private getSliderCallbackAndDefault = (label: string): any => {
    return {
      callback: this.node.setHarmonic(label),
      default: .5,
    };
}
}
