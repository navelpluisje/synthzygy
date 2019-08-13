import { InputType, OutputType } from "src/types";

export interface Module {
  draw(): void
  getSelectedInput(event: MouseEvent): InputType | null
  onMouseDown(event: MouseEvent): boolean
  onMouseMove(event: MouseEvent): void
  onMouseUp(event: MouseEvent): void
  unset(): void
  setId(id: string): void
  getActiveOutput(): OutputType
  getActiveInput(): InputType
  getActiveControl(): number
}