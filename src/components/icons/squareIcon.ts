import { ICON_SIZE } from '@constants/sizes';
import { PositionType } from 'src/types';
import { drawCircle, setIconStyle, setPositionAndSize } from './iconHelpers';

export const drawSquareIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position;
  ctx.save();
  setIconStyle(ctx, color);
  setPositionAndSize(ctx, x, y, ICON_SIZE);
  ctx.beginPath();
  drawCircle(ctx);
  ctx.moveTo(-8, 5);
  ctx.lineTo(-4, 5);
  ctx.lineTo(-4, -5);
  ctx.lineTo(4, -5);
  ctx.lineTo(4, 5);
  ctx.lineTo(8, 5);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};
