import { InputType, OutputType } from "src/types";

export interface Module {
  draw(): void
  onMouseDown(xPos: number, yPos: number): boolean
  onMouseMove(event: MouseEvent): void
  onMouseUp(event: MouseEvent): void
  unset(): void
  activeOutput: OutputType
  activeInput: InputType
  activeControl: number
}