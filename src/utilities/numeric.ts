
export const roundByStepSize = (value: number, step: number) => (
  Number((Math.round(value / step) * step).toFixed(2))
);
