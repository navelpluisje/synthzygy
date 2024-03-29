import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { GateNode } from '@nodes/gateNode';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../../moduleBase';
import { inputTypes } from './turing.inputs';
import { knobTypes } from './turing.knobs';
import { TuringMachineNode } from './turing.node';
import { outputTypes } from './turing.outputs';

export class TuringMachine extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 230,
    width: 190,
  };
  // tslint:disable-next-line
  private static probKey = "prob'ty";
  private static initialValues: ModuleDefaultValues = {
    [TuringMachine.probKey]: 6,
    length: 6,
  };

  public type = 'turinger';
  public title = 'Turing Machine';
  private node: TuringMachineNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...TuringMachine.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentUtility;
    this.node = new TuringMachineNode(context);
    this.container = new SynthModule(canvas, TuringMachine.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getValues() {
    return {
      [TuringMachine.probKey]: this.node.getProbability(),
      length: this.node.getLength(),
    };
  }

  private getOutputConnection = (type: string): ConstantSourceNode | GateNode => {
    switch (type) {
      case 'Out':
        return this.node.output();
      case 'Trigger':
        return this.node.outputGate();
      case '2':
      case '4':
      case '6':
      case '8':
      case '2+4':
      case '2+6':
        return this.node.outputPulse(type);
      }
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case 'Clock':
        return this.node.inputClock();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case TuringMachine.probKey:
        return {
          callback: this.node.setProbability,
          default: this.defaults[key],
        };
      case 'length':
        return {
          callback: this.node.setLength,
          default: this.defaults[key],
        };
    }
  }
}
