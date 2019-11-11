import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { createGainNode } from '@utilities/createGain';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './ringModulator.inputs';
import { outputTypes } from './ringModulator.outputs';

export class RingModulator extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 135,
    width: 160,
  };

  public type = 'ringModulator';
  public title = 'Ring Modulator';
  private node: GainNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
  ) {
    super(canvas, position);
    this.accentColor = Colors.AccentModulator;
    this.node = createGainNode(context, 1);
    this.container = new SynthModule(canvas, RingModulator.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
  }

  public draw(): void {
    super.draw();
    this.drawFlow();
  }

  private getInputConnection = (type: string): GainNode | AudioParam => {
    switch (type) {
      case '1':
        return this.node.gain;
      case '2':
        return this.node;
    }
  }

  private getOutputConnection = (type: string): GainNode => {
    switch (type) {
      case 'audioOut':
        return this.node;
    }
  }

  private drawFlow() {
    const {x, y} = this.getPosition();

    this.canvas.save();
    this.canvas.translate(x + 65, y + 85);
    this.canvas.rotate(45 * Math.PI / 180);
    this.canvas.translate(-(x + 65), -(y + 85));
    this.canvas.strokeStyle = this.accentColor;
    this.canvas.fillStyle = 'transparent';
    this.canvas.beginPath();
    this.canvas.arc(x + 65, y + 85, 20, 2 * Math.PI, 0);
    this.canvas.moveTo(x + 55, y + 85);
    this.canvas.lineTo(x + 75, y + 85);
    this.canvas.moveTo(x + 65, y + 75);
    this.canvas.lineTo(x + 65, y + 95);

    this.canvas.translate(x + 65, y + 85);
    this.canvas.rotate(-45 * Math.PI / 180);
    this.canvas.translate(-(x + 65), -(y + 85));
    this.canvas.moveTo(x + 35, y + 55);
    this.canvas.lineTo(x + 65, y + 55);
    this.canvas.lineTo(x + 65, y + 65);
    this.canvas.moveTo(x + 35, y + 115);
    this.canvas.lineTo(x + 65, y + 115);
    this.canvas.lineTo(x + 65, y + 105);
    this.canvas.moveTo(x + 85, y + 85);
    this.canvas.lineTo(x + 105, y + 85);
    this.canvas.fill();
    this.canvas.stroke();
    this.canvas.restore();
  }
}
