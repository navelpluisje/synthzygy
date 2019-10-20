import { Knob, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { controlTypes } from './controls';
import { inputTypes } from './inputs';
import { MixerNode } from './mixer.node';
import { outputTypes } from './outputs';

export interface Mixer extends Module {
  getNode(): MixerNode;
}

export class Mixer extends ModuleBase implements Mixer, ParentModule {
  public static dimensions = {
    height: 245,
    width: 165,
  };

  public type = 'mixer';
  public title = 'Mixer';
  public active: boolean = false;
  public node: MixerNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new MixerNode(context);
    this.container = new SynthModule(canvas, Mixer.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addControls();
  }

  public addControls() {
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[0],
      this.node.setAudio('1'),
      Colors.AccentAudioPath,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[1],
      this.node.setAudio('2'),
      Colors.AccentAudioPath,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[2],
      this.node.setAudio('3'),
      Colors.AccentAudioPath,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[3],
      this.node.setAudio('4'),
      Colors.AccentAudioPath,
    ));
    this.controls.push(new Knob(
      this.canvas,
      this, controlTypes[4],
      this.node.setAudio('out'),
      Colors.AccentAudioPath,
    ));
  }

  public getNode() {
    return this.node;
  }

  private getOutputConnection(type: string): GainNode {
    switch (type) {
      case 'audioOut':
        return this.node.output();
    }
  }

  private getInputConnection(type: string): GainNode {
    switch (type) {
      case 'audioIn1':
        return this.node.input('1');
      case 'audioIn2':
        return this.node.input('2');
      case 'audioIn3':
        return this.node.input('3');
      case 'audioIn4':
        return this.node.input('4');
    }
  }
}
