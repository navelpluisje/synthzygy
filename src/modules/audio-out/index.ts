import { InputConnector, Knob, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { OutputNode } from './output.node';

export class AudioOut extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 155,
    width: 120,
  };

  public type = 'audioOut';
  public title = 'Output';
  public active: boolean = false;
  private node: OutputNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new OutputNode(context);
    this.container = new SynthModule(canvas, AudioOut.dimensions, position, this.color);
    this.addInputs();
    this.addControls();
  }

  public getNode(): OutputNode {
    return this.node;
  }

  private addInputs(): void {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentAudioPath);
      this.inputs.push({
        component,
        node: this.node.connectAudioIn(),
        type: input.type,
      });
    });
  }

  private addControls(): void {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath));
  }
}
