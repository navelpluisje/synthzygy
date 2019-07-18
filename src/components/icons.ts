import { PositionType } from 'src/types'
import * as icon from './icons/index'

export const drawIcon = (ctx: CanvasRenderingContext2D, iconType: string, position: PositionType) => {
  const [type, direction] = icon.splitIcon(iconType)
  switch (type) {
    case 'audio':
      icon.audio(ctx, position)
      break
    case 'fm':
      icon.fm(ctx, position)
      icon.arrowIn(ctx, position)
      break
    case 'saw':
      icon.saw(ctx, position)
      break
    case 'sine':
      icon.sine(ctx, position)
      break
    case 'square':
      icon.square(ctx, position)
      break
    case 'triangle':
      icon.triangle(ctx, position)
      break
    default:
      console.warn(`Icon ${icon} is not available`)
  }
  if (direction) {
    switch (direction) {
      case 'in':
        icon.arrowIn(ctx, position)
        break
      case 'out':
        icon.arrowOut(ctx, position)
        break
      default:
        console.warn(`Direction ${direction} is not available`)
      }
  }
}
