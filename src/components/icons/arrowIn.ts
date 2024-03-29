import { ICON_SIZE } from '@constants/sizes';
import { PositionType } from 'src/types';
import { setPositionAndSize } from './iconHelpers';

export const drawArrowInIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position;
  ctx.save();
  ctx.fillStyle = color;
  setPositionAndSize(ctx, x, y, ICON_SIZE);
  ctx.beginPath();
  ctx.moveTo(-12, -5);
  ctx.lineTo(-8, 0);
  ctx.lineTo(-12, 5);
  ctx.lineTo(-13, 0);
  ctx.fill();
  ctx.fillStyle = 'rgba(254, 254, 254, .4)';
  ctx.closePath();  ctx.restore();
};
