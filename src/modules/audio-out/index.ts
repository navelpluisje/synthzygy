import { Knob, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
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
    this.addInputs(inputTypes, this.getInputConnection);
    this.addControls();
  }

  public getNode(): OutputNode {
    return this.node;
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'audioIn':
        return this.node.connectAudioIn();
    }
  }

  private addControls(): void {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath));
  }
}
