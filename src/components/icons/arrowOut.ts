import { setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "src/constants";

export const drawArrowOutIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position
  ctx.save()
  ctx.fillStyle = color;
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  ctx.beginPath()
  ctx.moveTo(7, -5);
  ctx.lineTo(12, 0);
  ctx.lineTo(7, 5);
  ctx.fill();
  ctx.fillStyle = 'rgba(254, 254, 254, .4)';
  ctx.closePath();  ctx.restore()
}
