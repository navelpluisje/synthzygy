import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { ModuleDefaultValues, PositionType } from 'src/types';
import { inputTypes } from './output.inputs';
import { knobTypes } from './output.knobs';
import { OutputNode } from './output.node';

export class AudioOut extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 155,
    width: 120,
  };
  private static initialValues: ModuleDefaultValues = {
    gain: 0.5,
  };

  public type = 'audioOut';
  public title = 'Output';
  private node: OutputNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...AudioOut.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentAudioPath;
    this.node = new OutputNode(context);
    this.container = new SynthModule(canvas, AudioOut.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      gain: this.node.getGain(),
    };
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioIn':
        return this.node.connectAudioIn();
    }
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'gain':
        return {
          callback: this.node.setGain,
          default: this.defaults[key],
        };
    }
  }
}
