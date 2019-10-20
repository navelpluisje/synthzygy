import { ButtonGroup, Knob, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { buttons } from './buttons';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { JsOscillatorNode } from './oscillator.node';
import { outputTypes } from './outputs';

export class Oscillator extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 230,
    width: 190,
  };

  public type =  'oscillator';
  public title =  'Oscillator';
  public active: boolean = false;
  public node: JsOscillatorNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new JsOscillatorNode(context);
    this.container = new SynthModule(canvas, Oscillator.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addButtonControls();
    this.addControls();
  }

  public addButtonControls() {
    buttons.forEach((buttonGroup) => {
      this.buttons.push(new ButtonGroup(
        this.canvas,
        this, buttonGroup,
        this.node.setRange,
        Colors.AccentGenerator,
        true,
      ));
    });
  }

  public getNode() {
    return this.node;
  }

  private addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentGenerator));
    this.controls.push(new Knob(this.canvas, this, controlTypes[1], this.node.setOctave, Colors.AccentGenerator));
    this.controls.push(new Knob(this.canvas, this, controlTypes[2], this.node.setFm, Colors.AccentGenerator));
    this.controls.push(new Knob(this.canvas, this, controlTypes[3], this.node.setDetune, Colors.AccentGenerator));
  }

  private getOutputConnection(type: string): GainNode {
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

  private getInputConnection(type: string): GainNode | AudioWorkletNode {
    switch (type) {
      case 'fm':
        return this.node.inputCvFM();
      case 'frequency':
        return this.node.inputCvFrequency();
    }
  }
}
