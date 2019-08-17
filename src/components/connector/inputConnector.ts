import { SynthConnector } from './connectorBase'

export class InputConnector extends SynthConnector {
  iconOffset: number = 25

  isInputClicked(xPos: number, yPos: number): boolean {
    const { x, y } = this.getPosition()

    if (xPos > x -15 && xPos < x + 15) {
      if (yPos > y - 15  && yPos < y + 15) {
        return true
      }
    }
    return false
  }
}