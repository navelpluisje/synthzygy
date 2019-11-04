import { SynthModule, ThreeStateButton } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType, KnobType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './mixer.inputs';
import { knobTypes } from './mixer.knobs';
import { MixerNode } from './mixer.node';
import { sliderTypes } from './mixer.sliders';
import { outputTypes } from './mixer.outputs';
import { SMALL_KNOB } from '@constants/sizes';
import { THREE_STATE_BUTTON } from '@constants/controlTypes';

export class Mixer extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 165,
    width: 260,
  };
  private static initialValues: ModuleDefaultValues = {
    'in 1': 0.5,
    'in 2': 0.5,
    'in 3': 0.5,
    'in 4': 0.5,
    'out': 1,
  };

  public type = 'mixer';
  public title = 'Mixer';
  private node: MixerNode;
  private muteButtons: ThreeStateButton[] = [];

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...Mixer.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentAudioPath;
    this.node = new MixerNode(context);
    this.container = new SynthModule(canvas, Mixer.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addSliders(sliderTypes, this.getSliderCallbackAndDefault);
    this.addMuteButtons();
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public draw(): void {
    super.draw();
    this.drawMuteButtons();
  }

  public onMouseDown(event: MouseEvent): boolean {
    super.onMouseDown(event);

    if (!this.active) {
      return false;
    }
    const {offsetX: xPos, offsetY: yPos} = event;
    this.offset = {
      x: xPos - this.position.x,
      y: yPos - this.position.y,
    };

    this.muteButtons.some((muteButton) => {
      const position = muteButton.isControlClicked(xPos, yPos);
      if (position) {
        // this.activeOutput = o
        this.drawMuteButtons(true);
        return true;
      }
    });
    return true;
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      'in 1': this.node.getAudio('1'),
      'in 2': this.node.getAudio('2'),
      'in 3': this.node.getAudio('3'),
      'in 4': this.node.getAudio('4'),
      'out': this.node.getAudio('out'),
    };
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioOut':
        return this.node.output();
    }
  }

  private getInputConnection = (type: string): GainNode => {
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

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'out':
        return {
          callback: this.node.setAudio('out'),
          default: this.defaults[key],
        };
    }
  }

  private getSliderCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'in 1':
        return {
          callback: this.node.setAudio('1'),
          default: this.defaults[key],
        };
      case 'in 2':
        return {
          callback: this.node.setAudio('2'),
          default: this.defaults[key],
        };
      case 'in 3':
        return {
          callback: this.node.setAudio('3'),
          default: this.defaults[key],
        };
      case 'in 4':
        return {
          callback: this.node.setAudio('4'),
          default: this.defaults[key],
        };
    }
  }

  private addMuteButtons() {
    for (let i = 0; i < 4; i += 1) {
      const button: KnobType = {
        position: {
          x: 175,
          y: 55 + i * 30,
        },
        size: SMALL_KNOB,
        type: THREE_STATE_BUTTON,
      };

      this.muteButtons.push(new ThreeStateButton(
        this.canvas,
        this,
        button,
        () => {},
        Colors.AccentAudioPath,
      ));
      this.muteButtons[i].setActive(false);
    }
  }

  private drawMuteButtons(overWrite = false): void {
    this.muteButtons.forEach((button) => button.draw(overWrite));
  }
}
