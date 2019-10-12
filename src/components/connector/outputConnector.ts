import { PositionType } from 'src/types';
import { SynthConnector } from './connectorBase';

export class OutputConnector extends SynthConnector {
  public iconOffset: number = -25;
  public labelAlign: string = 'left';

  public isOutputClicked(xPos: number, yPos: number): PositionType | null {
    this.active = false;
    const { x, y } = this.getPosition();

    if (xPos > x - 15 && xPos < x + 15) {
      if (yPos > y - 15  && yPos < y + 15) {
        return {
          x,
          y,
        };
      }
    }
    return null;
  }
}
