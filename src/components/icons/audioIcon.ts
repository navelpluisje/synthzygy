import { ICON_SIZE } from '@constants/sizes';
import { PositionType } from 'src/types';
import { drawCircle, setIconStyle, setPositionAndSize } from './iconHelpers';

export const drawAudioIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position;
  ctx.save();
  setIconStyle(ctx, color);
  setPositionAndSize(ctx, x, y, ICON_SIZE);
  ctx.beginPath();
  drawCircle(ctx);
  ctx.rect(-6, -4, 4, 8);
  ctx.moveTo(-2, -2);
  ctx.lineTo(4, -7);
  ctx.lineTo(4, 7);
  ctx.lineTo(-2, 2);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};
