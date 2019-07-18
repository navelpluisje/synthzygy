import { setIconStyle, drawCircle, setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "src/constants";

export const drawSawIcon = (ctx: CanvasRenderingContext2D, position: PositionType) => {
  const {x, y} = position
  ctx.save()
  setIconStyle(ctx)
  ctx.beginPath()
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  drawCircle(ctx)
  ctx.moveTo(-8, 4);
  ctx.lineTo(0, -5);
  ctx.lineTo(0, 4);
  ctx.lineTo(8, -5);
  ctx.lineTo(8, 4);
  ctx.stroke();
  ctx.closePath();
  ctx.restore()
}
