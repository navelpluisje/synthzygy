import { ICON_SIZE } from '@constants/sizes';
import { PositionType } from 'src/types';
import { drawCircle, setIconStyle, setPositionAndSize } from './iconHelpers';

export const drawNumberIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string, label: string) => {
  const {x, y} = position;
  ctx.save();
  ctx.save();
  setIconStyle(ctx, color);
  setPositionAndSize(ctx, x, y, ICON_SIZE);
  ctx.beginPath();
  drawCircle(ctx);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.font = '13px Raleway, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(label, x, y);
  ctx.restore();

  ctx.closePath();
};
