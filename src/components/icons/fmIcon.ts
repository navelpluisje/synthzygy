import { setIconStyle, drawCircle, setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "src/constants";

export const drawFmIcon = (ctx: CanvasRenderingContext2D, position: PositionType) => {
  const {x, y} = position
  ctx.save()
  setIconStyle(ctx)
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  ctx.beginPath()
  drawCircle(ctx)
  ctx.moveTo(-5, 0);
  ctx.quadraticCurveTo(-3, -10, 1, 0);
  ctx.quadraticCurveTo(5, 10, 7, 0);
  ctx.stroke();
  ctx.closePath()
  ctx.restore()
}
