import { OutputConnector, Rotary, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { NoisesNode } from './noise.node';
import { outputTypes } from './outputs';

export class Noise extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 230,
    width: 110,
  };

  public type =  'noise';
  public title = 'Noise';
  public node: NoisesNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new NoisesNode(context);
    this.container = new SynthModule(canvas, Noise.dimensions, position, this.color);
    this.setup();
  }

  public getNode() {
    return this.node;
  }

  private async setup() {
    await this.node.setup();
    this.addOutputs();
    this.addControls();
    this.drawOutputs();
    this.drawControls();
  }

  private addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentGenerator);
      this.outputs.push({
        component,
        node: this.getOutputConnection(output.name),
        type: output.type,
      });
    });
  }

  private drawOutputs() {
    this.outputs.forEach((output) => output.component.draw());
  }

  private addControls() {
    this.controls.push(new Rotary(
      this.canvas,
      this,
      controlTypes[0],
      this.node.setPinkNoisGain,
      Colors.AccentGenerator,
    ));
    this.controls.push(new Rotary(
      this.canvas,
      this,
      controlTypes[1],
      this.node.setWhiteNoisGain,
      Colors.AccentGenerator,
    ));
    this.controls.push(new Rotary(
      this.canvas,
      this,
      controlTypes[2],
      this.node.setBlueNoisGain,
      Colors.AccentGenerator,
    ));
  }

  private drawControls() {
    this.controls.forEach((control) => control.draw());
  }

  private getOutputConnection(type: string): GainNode {
    switch (type) {
      case 'Pink':
        return this.node.outputPinkNoise();
      case 'White':
        return this.node.outputWhiteNoise();
      case 'Blue':
        return this.node.outputBlueNoise();
    }
  }
}
