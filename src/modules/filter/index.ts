import { ButtonGroup, InputConnector, OutputConnector, Rotary, SynthModule } from '@components/index';
import { Module, ParentModule } from '@interfaces/index';
import { Colors } from 'src/constants/enums';
import { PositionType } from 'src/types';
import { ModuleBase } from '../moduleBase';
import { buttons } from './buttons';
import { controlTypes } from './controls';
import { FilterNode } from './filter.node';
import { inputTypes } from './inputs';
import { outputTypes } from './outputs';

export interface Filter extends Module {
  getNode(): FilterNode;
}

export class Filter extends ModuleBase implements Filter, ParentModule {
  public static dimensions = {
    height: 290,
    width: 170,
  };

  public type = 'filter';
  public title = 'Filter';
  public active: boolean = false;
  public node: FilterNode;

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position);
    this.node = new FilterNode(context);
    this.container = new SynthModule(canvas, Filter.dimensions, position, this.color);
    this.addOutputs();
    this.addInputs();
    this.addControls();
    this.addButtonControls();
  }

  public addInputs() {
    inputTypes.forEach((input, index) => {
      const component = new InputConnector(this.canvas, this, input, Colors.AccentEffect);
      this.inputs.push({
        component,
        node: this.getInputConnection(input.name),
        type: input.type,
      });
    });
  }

  public addOutputs() {
    outputTypes.forEach((output) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentEffect);
      this.outputs.push({
        component,
        node: this.node.output(),
        type: output.type,
      });
    });
  }

  public addButtonControls() {
    buttons.forEach((buttonGroup) => {
      this.buttons.push(new ButtonGroup(this.canvas, this, buttonGroup, this.node.setFilterType, Colors.AccentEffect));
    });
  }

  public addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.node.setFrequency, Colors.AccentEffect));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[2], this.node.setQ, Colors.AccentEffect));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.node.setInputLevel, Colors.AccentEffect));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[3], this.node.setCvFrequency, Colors.AccentEffect));
    this.controls.push(new Rotary(this.canvas, this, controlTypes[4], this.node.SetCvQ, Colors.AccentEffect));
  }

  public getNode(): FilterNode {
    return this.node;
  }

  private getInputConnection(type: string): GainNode | BiquadFilterNode {
    switch (type) {
      case 'cvFreq':
        return this.node.inputCvFrequency();
      case 'cvQ':
        return this.node.inputCvQ();
      case 'audioIn':
        return this.node.input();
    }
  }
}
