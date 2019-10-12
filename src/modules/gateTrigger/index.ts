import { OutputConnector, SynthModule, TriggerButton } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { GateNode } from '@nodes/gateNode';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { outputTypes } from './outputs';

export interface GateTrigger extends Module {
  getNode(): GateNode;
}

export class GateTrigger extends ModuleBase implements GateTrigger, ParentModule {
  public static dimensions: DimensionType = {
    height: 130,
    width: 100,
  };

  public type =  'gateTrigger';
  public title = 'Gate';
  public node: GateNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new GateNode();
    this.container = new SynthModule(canvas, GateTrigger.dimensions, position, this.color);
    this.addOutputs();
    this.addControls();
  }

  public addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility);
      this.outputs.push({
        component,
        gate: this.node,
        type: output.type,
      });
    });
  }

  public addControls() {
    this.controls.push(new TriggerButton(
      this.canvas,
      this,
      controlTypes[0],
      this.node.onKeyDown,
      this.node.onKeyUp,
      Colors.AccentUtility,
    ));
  }

  public getNode() {
    return this.node;
  }
}
