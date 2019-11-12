import { SynthModule } from '@components/index';
import { ParentModule } from '@interfaces/index';
// import { strokeRoundedRect } from '@utilities/roundedRect';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { inputTypes } from './logicXor.inputs';
import { XorNode } from './logicXor.node';
import { outputTypes } from './logicXor.outputs';

export class LogicXor extends ModuleBase implements ParentModule {
  public static dimensions = {
    height: 135,
    width: 160,
  };

  public type = 'xor';
  public title = 'X(n)or';
  private node: XorNode;

  constructor(
    canvas: CanvasRenderingContext2D,
    context: AudioContext,
    position: PositionType,
  ) {
    super(canvas, position);
    this.accentColor = Colors.AccentUtility;
    this.node = new XorNode(context);
    this.container = new SynthModule(canvas, LogicXor.dimensions, position, this.color);
    this.addInputs(inputTypes, this.getInputConnection);
    this.addOutputs(outputTypes, this.getOutputConnection);
  }

  public draw(): void {
    super.draw();
    this.drawFlow();
  }

  private getInputConnection = (type: string): GainNode => {
    switch (type) {
      case '1':
        return this.node.inputA();
      case '2':
        return this.node.inputB();
    }
  }

  private getOutputConnection = (type: string): ConstantSourceNode => {
    switch (type) {
      case 'and':
        return this.node.outputAnd();
      case 'nand':
        return this.node.outputNAnd();
    }
  }

  private drawFlow() {
    const {x, y} = this.getPosition();

    this.canvas.save();
    this.canvas.strokeStyle = this.accentColor;
    this.canvas.fillStyle = 'transparent';
    this.canvas.beginPath();
    // Logic and
    this.canvas.moveTo(x + 50, y + 45);
    this.canvas.lineTo(x + 55, y + 45);
    this.canvas.quadraticCurveTo(x + 75, y + 45, x + 85, y + 65);
    this.canvas.moveTo(x + 50, y + 85);
    this.canvas.lineTo(x + 55, y + 85);
    this.canvas.quadraticCurveTo(x + 75, y + 85, x + 85, y + 65);
    this.canvas.moveTo(x + 50, y + 85);
    this.canvas.quadraticCurveTo(x + 60, y + 65, x + 50, y + 45);
    this.canvas.moveTo(x + 45, y + 85);
    this.canvas.quadraticCurveTo(x + 55, y + 65, x + 45, y + 45);

    // strokeRoundedRect(this.canvas, x + 45, y + 45, 40, 40, {tl: 0, tr: 20, br: 20, bl: 0});
    // Input lines
    this.canvas.moveTo(x + 35, y + 55);
    this.canvas.lineTo(x + 53, y + 55);
    this.canvas.moveTo(x + 35, y + 115);
    this.canvas.lineTo(x + 35, y + 75);
    this.canvas.lineTo(x + 53, y + 75);
    // To output and
    this.canvas.moveTo(x + 85, y + 65);
    this.canvas.lineTo(x + 105, y + 65);
    // to output nand
    this.canvas.moveTo(x + 95, y + 65);
    this.canvas.lineTo(x + 95, y + 85);
    // Tna not symbol
    this.canvas.moveTo(x + 85, y + 85);
    this.canvas.lineTo(x + 105, y + 85);
    this.canvas.lineTo(x + 95, y + 95);
    this.canvas.lineTo(x + 85, y + 85);
    this.canvas.moveTo(x + 99, y + 99);
    this.canvas.arc(x + 95, y + 99, 4, 0, 2 * Math.PI);
    // And continue to the output
    this.canvas.moveTo(x + 95, y + 103);
    this.canvas.lineTo(x + 95, y + 115);
    this.canvas.lineTo(x + 105, y + 115);

    this.canvas.fill();
    this.canvas.stroke();
    this.canvas.restore();
  }
}
