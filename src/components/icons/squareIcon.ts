import { setIconStyle, drawCircle, setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "src/constants";

export const drawSquareIcon = (ctx: CanvasRenderingContext2D, position: PositionType) => {
  const {x, y} = position
  ctx.save()
  setIconStyle(ctx)
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  ctx.beginPath()
  drawCircle(ctx)
  ctx.moveTo(-8, 5);
  ctx.lineTo(-4, 5);
  ctx.lineTo(-4, -5);
  ctx.lineTo(4, -5);
  ctx.lineTo(4, 5);
  ctx.lineTo(8, 5);
  ctx.stroke();
  ctx.closePath();
  ctx.restore()
}