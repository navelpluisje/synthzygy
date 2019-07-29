export interface SynthModuleControl {
  draw(): void
  isControlPressed(xPos: number, yPos: number): boolean
  isControlReleased(xPos: number, yPos: number): boolean
  onMouseMove(event: MouseEvent): void
}