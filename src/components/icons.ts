import { PositionType } from 'src/types';
import * as icon from './icons/index';

export const drawIcon = (ctx: CanvasRenderingContext2D, iconType: string, position: PositionType, color: string) => {
  const [type, direction] = icon.splitIcon(iconType);
  switch (type) {
    case 'audio':
      icon.audio(ctx, position, color);
      break;
    case 'cv':
    case 'envelope':
      icon.envelope(ctx, position, color);
      break;
    case 'frequency':
      icon.fm(ctx, position, color);
      icon.arrowIn(ctx, position, color);
      break;
    case 'gate':
      icon.gate(ctx, position, color);
      break;
    case 'saw':
      icon.saw(ctx, position, color);
      break;
    case 'sine':
      icon.sine(ctx, position, color);
      break;
    case 'square':
      icon.square(ctx, position, color);
      break;
    case 'triangle':
      icon.triangle(ctx, position, color);
      break;
    default:
      console.warn(`Icon ${icon} is not available`);
  }
  if (direction) {
    switch (direction) {
      case 'in':
        icon.arrowIn(ctx, position, color);
        break;
      case 'out':
        icon.arrowOut(ctx, position, color);
        break;
      default:
        console.warn(`Direction ${direction} is not available`);
      }
  }
};
