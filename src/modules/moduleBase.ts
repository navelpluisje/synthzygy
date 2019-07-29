import { Module } from '@interfaces/index';
import { SynthModuleRotary } from '@components/moduleRotary';
import { OutputType, PositionType, InputType } from 'src/types';
import { SynthModule } from '@components/synthModule';
import { Colors } from 'src/constants';
import { SynthModuleButtonGroup } from '@components/moduleButtonGroup';
import { SynthModuleTriggerButton } from '@components/moduleTriggerButton';
import { SynthModuleControl } from '@interfaces/moduleControl';

export class ModuleBase implements Module {
  title = 'title'
  inputs: Array<InputType> = []
  outputs: Array<OutputType> = []
  controls: Array<SynthModuleRotary | SynthModuleTriggerButton> = []
  buttons: SynthModuleButtonGroup[] = []
  activeOutput: OutputType = null
  activeInput: InputType = null
  activeControl: number | null = null
  active: boolean = false
  position: PositionType
  canvas: CanvasRenderingContext2D
  container: SynthModule
  color = Colors.ModuleBackground

  constructor(canvas: CanvasRenderingContext2D, position: PositionType) {
    this.position = position
    this.canvas = canvas
  }

  draw(): void {
    this.container.draw()
    this.container.drawTitle(this.title)
    this.inputs.length && this.inputs.forEach(input => input.component.draw())
    this.outputs.length && this.outputs.forEach(output => output.component.draw())
    this.controls.length && this.controls.forEach(control => control.draw())
    this.buttons.length && this.buttons.forEach(button => button.draw())
  }

  getSelectedInput(event: MouseEvent): InputType | null {
    const { layerX, layerY } = event
    this.inputs.some(input => {
      const position = input.component.isInputClicked(layerX, layerY)
      if (position) {
        this.activeInput = input
        return true
      }
    })

    return this.activeInput
  }

  onMouseDown(xPos: number, yPos: number): boolean {
    this.active = this.container.isModuleClicked(xPos, yPos)
    this.outputs.some(output => {
      const position = output.component.isOutputClicked(xPos, yPos)
      if (position) {
        this.activeOutput = output
        return true
      }
    })

    if (this.activeOutput === null) {
      this.controls.some((control, index) => {
        const clicked = control.isControlPressed(xPos, yPos)
        if (clicked) {
          this.activeControl = index
        }
        return clicked
      })
    }

    return this.active
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.active) { return }
    if (this.activeControl !== null) {
      this.controls[this.activeControl].onMouseMove(event)
    } else {
      // this.position = position
    }
  }

  onMouseUp(event: MouseEvent): void {
    const { layerX, layerY } = event
    this.controls.forEach((control, index) => {
      control.isControlReleased(layerX, layerY)
      this.activeControl = null
    })
    this.unset()
  }

  onMouseClick(event: MouseEvent): void {
    const {layerX, layerY} = event
    this.buttons.forEach((control, index) => {
       control.isButtonClicked(layerX, layerY)
    })
    this.unset()
  }

  unset() {
    this.active = false
    this.activeOutput = null
    this.activeControl = null
    this.container.unSet()
  }
}