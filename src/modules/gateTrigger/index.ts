import { SynthModule, TriggerButton } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { GateOutputNode } from '@nodes/gateOutputNode';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';
import { knobTypes } from './gateTrigger.knobs';
import { outputTypes } from './gateTrigger.outputs';

export class GateTrigger extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 130,
    width: 100,
  };

  public type =  'gateTrigger';
  public title = 'Gate';
  public node: GateOutputNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.accentColor = Colors.AccentUtility;
    this.node = new GateOutputNode(context);
    this.container = new SynthModule(canvas, GateTrigger.dimensions, position, this.color);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addControls();
  }

  public getValues() {
    return {};
  }

  public addControls() {
    this.controls.push(new TriggerButton(
      this.canvas,
      this,
      knobTypes[0],
      () => this.node.setLevel(1),
      () => this.node.setLevel(0),
      Colors.AccentUtility,
    ));
  }

  private getOutputConnection = (type: string): ConstantSourceNode => {
    switch (type) {
      case 'gateOut':
        return this.node.output();
    }
  }

}
