import { SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { GateTrigger, ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { EnvelopeNode } from './envelope.node';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export interface Envelope extends Module {
  getNode(): EnvelopeNode;
}

export class Envelope extends ModuleBase implements Envelope, ParentModule {
  public static dimensions = {
    height: 210,
    width: 200,
  };

  public type = 'envelope';
  public title = 'Envelope';
  public active: boolean = false;
  protected defaults: ModuleDefaultValues = {
    attack: 0.3,
    decay: 0.3,
    level: 0.5,
    release: 0.5,
    sustain: 0.5,
  };
  private node: EnvelopeNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, defaults);
    this.accentColor = Colors.AccentModulator;
    this.node = new EnvelopeNode(context);
    this.container = new SynthModule(canvas, Envelope.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(controlTypes, this.getKnobCallbackAndDefault);
  }

  public getNode() {
    return this.node;
  }

  private getInputConnection = (type: string): GateTrigger => {
    switch (type) {
      case 'gateIn':
        return this.node.inputGate();
    }
  }

  private getOutputConnection = (type: string): ConstantSourceNode => {
    switch (type) {
      case 'envelopeOut':
        return this.node.output();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'attack':
        return {
          callback: this.node.setAttack,
          default: this.defaults[key],
        };
      case 'decay':
        return {
          callback: this.node.setDecay,
          default: this.defaults[key],
        };
      case 'sustain':
        return {
          callback: this.node.setSustain,
          default: this.defaults[key],
        };
      case 'release':
        return {
          callback: this.node.setRelease,
          default: this.defaults[key],
        };
      case 'level':
        return {
          callback: this.node.setLevel,
          default: this.defaults[key],
        };
    }
  }
}
