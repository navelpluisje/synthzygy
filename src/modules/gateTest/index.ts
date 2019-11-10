import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './gateTest.inputs';
import { GateNode } from './gateTest.node';
import { outputTypes } from './gateTest.outputs';

export class GateTest extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 140,
    width: 130,
  };
  private static initialValues: ModuleDefaultValues = {
    level: 0,
  };

  public type = 'gateTest';
  public title = 'Gate';
  private node: GateNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...GateTest.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentAudioPath;
    this.node = new GateNode(context);
    this.container = new SynthModule(canvas, GateTest.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
  }

  private getInputConnection = (type: string): AudioWorkletNode => {
    switch (type) {
      case 'cvGain':
        return this.node.input  ();
    }
  }

  private getOutputConnection = (type: string): AudioWorkletNode => {
    switch (type) {
      case 'audioOut':
        return this.node.output();
    }
  }
}
