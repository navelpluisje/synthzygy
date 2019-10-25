import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { GateTrigger, ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './envelope.inputs';
import { knobTypes } from './envelope.knobs';
import { EnvelopeNode } from './envelope.node';
import { outputTypes } from './envelope.outputs';

export class Envelope extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 210,
    width: 200,
  };
  private static initialValues: ModuleDefaultValues = {
    attack: 0.3,
    decay: 0.3,
    level: 0.5,
    release: 0.5,
    sustain: 0.5,
  };

  public type = 'envelope';
  public title = 'Envelope';
  private node: EnvelopeNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...Envelope.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentModulator;
    this.node = new EnvelopeNode(context);
    this.container = new SynthModule(canvas, Envelope.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      attack: this.node.getAttack(),
      decay: this.node.getDecay(),
      level: this.node.getLevel(),
      release: this.node.getRelease(),
      sustain: this.node.getSustain(),
    };
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
