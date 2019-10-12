import { ICON_SIZE } from '@constants/sizes';
import { PositionType } from 'src/types';
import { drawCircle, setIconStyle, setPositionAndSize } from './iconHelpers';

export const drawFmIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position;
  ctx.save();
  setIconStyle(ctx, color);
  setPositionAndSize(ctx, x, y, ICON_SIZE);
  ctx.beginPath();
  drawCircle(ctx);
  ctx.moveTo(-5, 0);
  ctx.quadraticCurveTo(-3, -10, 1, 0);
  ctx.quadraticCurveTo(5, 10, 7, 0);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};
