import { KeyboardNode } from '@nodes/keyboardNode'
import { SynthModule, OutputConnector } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';

export interface Keyboard extends Module{
  getNode(): KeyboardNode
}

export class Keyboard extends ModuleBase implements Keyboard, ParentModule {
  static dimensions: DimensionType = {
    height: 130,
    width: 100,
  }

  type =  'keyboard'
  title = 'Keyboard'
  node: KeyboardNode

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.node = new KeyboardNode(context)
    this.container = new SynthModule(canvas, Keyboard.dimensions, position, this.color)
    this.addOutputs()
  }

  addOutputs() {
    outputTypes.forEach((output, index) => {
      const component = new OutputConnector(this.canvas, this, output, Colors.AccentUtility)
      const key = output.type === 'gate' ? 'gate' : 'node'
      this.outputs.push({
        type: output.type,
        [key]: this.getOutputConnection(output.name),
        component,
      })
    })
  }

  private getOutputConnection(type: string): AudioWorkletNode | KeyboardNode {
    switch (type) {
      case 'gateOut':
        return this.node
      case 'Freqency':
        return this.node.noteOutput()
    }
  }


  getNode() {
    return this.node
  }
}