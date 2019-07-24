import { setIconStyle, drawCircle, setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "src/constants";

export const drawAudioIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position
  ctx.save()
  setIconStyle(ctx, color)
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  ctx.beginPath()
  drawCircle(ctx)
  ctx.rect(-6, -4, 4, 8)
  ctx.moveTo(-2, -2);
  ctx.lineTo(4, -7);
  ctx.lineTo(4, 7);
  ctx.lineTo(-2, 2);
  ctx.stroke();
  ctx.closePath();
  ctx.restore()
}