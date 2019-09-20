import { setIconStyle, drawCircle, setPositionAndSize } from "./iconHelpers";
import { PositionType } from "src/types";
import { ICON_SIZE } from "@constants/sizes";

export const drawGateIcon = (ctx: CanvasRenderingContext2D, position: PositionType, color: string) => {
  const {x, y} = position
  ctx.save()
  setIconStyle(ctx, color)
  setPositionAndSize(ctx, x, y, ICON_SIZE)
  ctx.beginPath()
  drawCircle(ctx)
  ctx.moveTo(8, -5)
  ctx.lineTo(5, -9)
  ctx.lineTo(-4, -2)
  ctx.lineTo(-1, 1)
  ctx.lineTo(-7, 8)
  ctx.lineTo(6, 1)
  ctx.lineTo(2, -2)
  ctx.lineTo(8, -5)
  ctx.stroke()
  ctx.closePath()
  ctx.restore()
}
