import { Knob, OutputConnector, SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { ClockNode } from '@nodes/clockNode';
import { Colors } from 'src/constants/enums';
import { DimensionType, PositionType } from 'src/types';
import { controlTypes } from './controls';
import { outputTypes } from './outputs';

export class Clock extends ModuleBase implements Clock, ParentModule {
  public static dimensions: DimensionType = {
    height: 210,
    width: 140,
  };

  public bpm: number = 120;
  public frequency: number = 2;
  public pulseWidth: number = .5;
  public type = 'clock';
  public title = 'Clock';
  public context: AudioContext;
  public nodes: Record<string, ClockNode> = {};

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.context = context;
    this.container = new SynthModule(canvas, Clock.dimensions, position, this.color);
    this.createNodes();
    this.addOutputs();
    this.addControls();
  }

  public draw(): void {
    super.draw();
    this.drawBPMDisplay();
  }

  public getNode() {
    return this.nodes['/1'];
  }

  private createNodes() {
    this.nodes['2'] = new ClockNode(this.context);
    this.nodes['/1'] = new ClockNode(this.context);
    this.nodes['/2'] = new ClockNode(this.context);
    this.nodes['/4'] = new ClockNode(this.context);
    this.nodes['/8'] = new ClockNode(this.context);

    this.setBPM(this.bpm);
    this.setPulseWidth(this.pulseWidth);
  }

  private addOutputs(): void {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility);
      const key = output.type === 'gate' ? 'gate' : 'node';
      this.outputs.push({
        component,
        type: output.type,
        [key]: this.nodes[output.name],
      });
    });
  }

  private addControls(): void {
    this.controls.push(new Knob(this.canvas, this, controlTypes[0], this.setBPM, Colors.AccentUtility));
    this.controls.push(new Knob(this.canvas, this, controlTypes[1], this.setPulseWidth, Colors.AccentUtility));
  }

  private setBPM = (bpm: number): void => {
    this.bpm = bpm;
    this.frequency = bpm / 60;

    Object.values(this.nodes).forEach((node, index) => {
      const value = this.frequency * (2 ** (index - 1));
      node.setFrequency(value);
      },
    );

    this.drawBPMDisplay(true);
  }

  private setPulseWidth = (pw: number) => {
    this.pulseWidth = pw;
    Object.values(this.nodes).forEach((node) => node.setPulseWidth(this.pulseWidth));
  }

  private drawBPMDisplay(reset: boolean = false): void {
    const { x, y } = this.getPosition();
    const xPos = x + 20;
    const yPos = y + 45;
    const width = 50;
    const height = 20;

    if (reset) {
      this.canvas.save();
      this.canvas.strokeStyle = Colors.ModuleBackground;
      this.canvas.fillStyle = Colors.ModuleBackground;
      this.canvas.beginPath();
      this.canvas.rect(xPos, yPos, width, height);
      this.canvas.fill();
      this.canvas.stroke();
    }

    this.canvas.save();
    this.canvas.font = '16px Raleway, sans-serif';
    this.canvas.strokeStyle = Colors.AccentUtility;
    this.canvas.fillStyle = 'transparent';
    this.canvas.beginPath();
    this.canvas.rect(xPos, yPos, width, height);
    this.canvas.fill();
    this.canvas.stroke();

    this.canvas.beginPath();
    this.canvas.fillStyle = Colors.AccentUtility;
    this.canvas.shadowOffsetX = .5;
    this.canvas.shadowOffsetY = .5;
    this.canvas.shadowBlur = 1;
    this.canvas.shadowColor = Colors.ModuleBackground;
    this.canvas.fillText(this.bpm.toFixed(1), xPos + width / 2, yPos + height / 2);
    this.canvas.restore();

  }
}
