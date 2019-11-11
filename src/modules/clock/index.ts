import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { Colors } from 'src/constants/enums';
import { DimensionType, ModuleDefaultValues, PositionType } from 'src/types';
import { knobTypes } from './clock.knobs';
import { ClockNode } from './clock.node';
import { outputTypes } from './clock.outputs';

export class Clock extends ModuleBase implements ParentModule {
  public static dimensions: DimensionType = {
    height: 210,
    width: 140,
  };
  private static initialValues: ModuleDefaultValues = {
    bpm: 120,
    pw: 0.5,
  };

  public bpm: number = 120;
  public frequency: number = 2;
  public pulseWidth: number = .5;
  public type = 'clock';
  public title = 'Clock';
  public context: AudioContext;
  private node: ClockNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
    defaults: ModuleDefaultValues,
  ) {
    super(canvas, position, {
      ...Clock.initialValues,
      ...defaults,
    });
    this.accentColor = Colors.AccentUtility;
    this.context = context;
    this.container = new SynthModule(canvas, Clock.dimensions, position, this.color);
    this.createNodes();
    this.addOutputs(outputTypes, this.getOutputConnection);
    this.addKnobs(knobTypes, this.getKnobCallbackAndDefault);
  }

  public getModuleData(): ModuleDefaultValues {
    return {
      bpm: this.bpm,
      pw: this.pulseWidth,
    };
  }

  public draw(): void {
    super.draw();
    this.drawBPMDisplay();
  }

  private createNodes() {
    this.node = new ClockNode(this.context);

    this.setBPM(this.bpm);
    this.node.setPulseWidth(this.pulseWidth);
  }

  private getOutputConnection = (type: string): ConstantSourceNode => {
    return this.node.output(type);
  }

  private getKnobCallbackAndDefault = (label: string): any => {
    const key = label.toLowerCase();
    switch (key) {
      case 'bpm':
        return {
          callback: this.setBPM,
          default: this.defaults[key],
        };
      case 'pw':
        return {
          callback: this.node.setPulseWidth,
          default: this.defaults[key],
        };
    }
  }

  private setBPM = (bpm: number): void => {
    this.bpm = bpm;
    this.drawBPMDisplay(true);
    this.node.setBPM(bpm);
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
