import { ButtonGroup, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { buttons } from './oscillator.buttons';
import { inputTypes } from './oscillator.inputs';
import { knobTypes } from './oscillator.knobs';
import { JsOscillatorNode } from './oscillator.node';
import { outputTypes } from './oscillator.outputs';

export class Oscillator extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 230,
    width: 190,
  };

  public type = 'oscillator';
  public title = 'Oscillator';
  protected defaults: ModuleDefaultValues = {
    detune: 0,
    fm: 0,
    freq: 3.0,
    octave: 3.0,
  };
  private node: JsOscillatorNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentGenerator;
    this.node = new JsOscillatorNode(context);
    this.container = new SynthModule(canvas, Oscillator.dimensions, position, this.color);

    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addButtonControls();
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      detune: this.node.getDetune(),
      fm: this.node.getFm(),
      freq: this.node.getFrequency(),
      octave: this.node.getOctave(),
    };
  }

  public addButtonControls() {
    buttons.forEach((buttonGroup) => {
      this.buttons.push(new ButtonGroup(
        this.canvas,
        this,
        buttonGroup,
        this.node.setRange,
        this.accentColor,
        true,
      ));
    });
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

  private getInputConnection = (type: string): GainNode | AudioWorkletNode => {
    switch (type) {
      case 'fm':
        return this.node.inputCvFM();
      case 'frequency':
        return this.node.inputCvFrequency();
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
      case 'octave':
        return {
          callback: this.node.setOctave,
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

}
