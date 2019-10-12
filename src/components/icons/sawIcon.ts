import { ICON_SIZE } from '@constants/sizes';
import { PositionType } from 'src/types';
import { drawCircle, setIconStyle, setPositionAndSize } from './iconHelpers';

export const drawSawIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position;
  ctx.save();
  setIconStyle(ctx, color);
  ctx.beginPath();
  setPositionAndSize(ctx, x, y, ICON_SIZE);
  drawCircle(ctx);
  ctx.moveTo(-8, 4);
  ctx.lineTo(0, -5);
  ctx.lineTo(0, 4);
  ctx.lineTo(8, -5);
  ctx.lineTo(8, 4);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};
