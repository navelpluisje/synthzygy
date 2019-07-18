import { IModule } from '@interfaces/index';
import { ISynthModuleRotary } from '@components/moduleRotary';
import { OutputType, PositionType, InputType } from 'src/types';
import { SynthModule } from '@components/synthModule';

export class ModuleBase implements IModule {
  title = 'JSOscillator'
  inputs: Array<InputType> = []
  outputs: Array<OutputType> = []
  controls: Array<ISynthModuleRotary> = []
  activeOutput: OutputType = null
  activeInput: InputType = null
  activeControl: number | null = null
  active: boolean = false
  position: PositionType
  canvas: CanvasRenderingContext2D
  container: SynthModule

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
        const clicked = control.isRotaryClicked(xPos, yPos)
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
      this.controls[this.activeControl].setRotaryValue(event)
    } else {
      // this.position = position
    }
  }

  onMouseUp(event: MouseEvent): void {
    const { layerX, layerY } = event
    this.inputs.some(input => {
      const position = input.component.isInputClicked(layerX, layerY)
      if (position) {
        this.activeInput = input
        return true
      }
    })
  }

  unset() {
    this.active = false
    this.activeOutput = null
    this.activeControl = null
    this.container.unSet()
  }
}