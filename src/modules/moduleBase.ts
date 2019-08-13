import { Module } from '@interfaces/index';
import { SynthModuleRotary } from '@components/moduleRotary';
import { OutputType, PositionType, InputType } from 'src/types';
import { SynthModule } from '@components/synthModule';
import { Colors } from 'src/constants';
import { SynthModuleButtonGroup } from '@components/moduleButtonGroup';
import { SynthModuleTriggerButton } from '@components/moduleTriggerButton';

export class ModuleBase implements Module {
  protected title = 'title'
  protected inputs: Array<InputType> = []
  protected outputs: Array<OutputType> = []
  protected controls: Array<SynthModuleRotary | SynthModuleTriggerButton> = []
  protected buttons: SynthModuleButtonGroup[] = []
  protected activeOutput: OutputType = null
  protected activeInput: InputType = null
  protected activeControl: number | null = null
  protected active: boolean = false
  protected position: PositionType
  protected offset: PositionType
  protected canvas: CanvasRenderingContext2D
  protected container: SynthModule
  protected color = Colors.ModuleBackground
  protected type: string = ''
  protected id: string = ''

  constructor(canvas: CanvasRenderingContext2D, position: PositionType) {
    this.position = position
    this.canvas = canvas
  }

  draw = (): void => {
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

  onMouseDown(event: MouseEvent): boolean {
    const {layerX: xPos, layerY: yPos} = event
    this.active = this.container.isModuleClicked(xPos, yPos)
    this.offset = {
      x: xPos - this.position.x,
      y: yPos - this.position.y,
    }
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
      requestAnimationFrame(this.draw)
    } else if (this.activeOutput === null) {

      this.position.x = event.layerX - this.offset.x
      this.position.y = event.layerY - this.offset.y
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

  getPosition(): PositionType {
    return this.position
  }

  getOffset(): PositionType {
    return this.offset
  }

  getActiveOutput(): OutputType {
    return this.activeOutput
  }

  hasActiveOutput(): boolean {
    return this.activeOutput !== null
  }

  getActiveInput(): InputType {
    return this.activeInput
  }

  getActiveControl(): number {
    return this.activeControl
  }

  hasActiveControl(): boolean {
    return this.activeControl !== null
  }

  getId(): string {
    return this.id
  }

  setId(id: string): void {
    this.id = id
  }

  getType() {
    return this.type
  }

  unset() {
    this.active = false
    this.activeOutput = null
    this.activeControl = null
    this.container.unSet()
  }
}