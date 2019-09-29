import { MidiNode } from '@nodes/midiNode'
import { SynthModule, OutputConnector, Rotary, ButtonGroup } from '@components/index';
import { PositionType, DimensionType } from 'src/types';
import { Colors } from 'src/constants/enums';
import { ParentModule, Module } from '@interfaces/index';
import { ModuleBase } from '@modules/moduleBase';
import { outputTypes } from './outputs';
import { controlTypes } from './controls';
import { buttons } from './buttons';

export class Midi extends ModuleBase implements ParentModule {
  static dimensions: DimensionType = {
    height: 250,
    width: 180,
  }

  type =  'midi'
  title = 'Midi'
  midiNode: MidiNode
  settingsPanel: HTMLElement

  constructor(canvas: CanvasRenderingContext2D, context: AudioContext, position: PositionType) {
    super(canvas, position)
    this.midiNode = new MidiNode(context)
    this.container = new SynthModule(canvas, Midi.dimensions, position, this.color)
    this.settingsPanel = document.querySelector('np-midisettings')
    this.addOutputs()
    this.addControls()
    this.addButtonControls()
  }

  private addOutputs() {
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

  private addControls() {
    this.controls.push(new Rotary(this.canvas, this, controlTypes[0], this.midiNode.setMidiPort, Colors.AccentUtility))
    this.controls.push(new Rotary(this.canvas, this, controlTypes[1], this.midiNode.setClockStepSize, Colors.AccentUtility))
  }

  private addButtonControls() {
    buttons.forEach(buttonGroup => {
      this.buttons.push(new ButtonGroup(this.canvas, this, buttonGroup, this.showMidiSettings, Colors.AccentUtility, true))
    })
  }

  private showMidiSettings = () => {
    if (this.settingsPanel.hasAttribute('show')) {
      this.settingsPanel.removeAttribute('show')
    } else {
      // @ts-ignore
      this.settingsPanel.setValues(
        this.midiNode.getMidiInputs(),
        this.midiNode.getActiveInput(),
        this.setMidiDevice
      )
      this.settingsPanel.setAttribute('show', '')
      this.buttons[0].setActiveButton(null)
    }
  }

  private setMidiDevice = (id: string) => {
    this.midiNode.setMidiDevice(id)
    this.settingsPanel.removeAttribute('show')
  }

  private getOutputConnection(type: string): AudioWorkletNode | MidiNode | Object {
    switch (type) {
      case 'V/Oct':
        return this.midiNode.noteOutput()
      case 'Pitch':
        return this.midiNode.pitchOutput()
      case 'Mod':
        return this.midiNode.modulationOutput()
      case 'Press':
        return this.midiNode.aftertouchOutput()
      case 'Gate':
        return this.midiNode
      case 'Clock':
        return this.midiNode.clockNode()
      case 'Transport':
        return this.midiNode.transportNode()
    }
  }

  getNode() {
    return this.midiNode
  }
}