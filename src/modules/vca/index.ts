import { Knob, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';
import { VcaNode } from './vca.node';

export interface Vca extends Module {
  getNode(): VcaNode;
}

export class Vca extends ModuleBase implements Vca, ParentModule {
  public static dimensions = {
    height: 140,
    width: 130,
  };

  public type = 'vca';
  public title = 'Vca';
  public active: boolean = false;
  public node: VcaNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new VcaNode(context);
    this.container = new SynthModule(canvas, Vca.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addControls();
  }

  public getKey(type: string): string {
    switch (type) {
      case 'audio':
        return 'node';
      case 'cv':
        return 'cv';
    }
  }

  public addControls() {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.node.setGain, Colors.AccentAudioPath));
  }

  public getNode() {
    return this.node;
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'cvGain':
        return this.node.inputCvGain();
      case 'audioIn':
        return this.node.input();
    }
  }

  private getOutputConnection(type: string): GainNode {
    switch (type) {
      case 'audioOut':
        return this.node.output();
    }
  }
}
