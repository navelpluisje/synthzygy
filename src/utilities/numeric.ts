
export const roundByStepSize = (value: number, step: number) => (
  Number((Math.round(value / step) * step).toFixed(2))
);

export const getNumberInRange = (value: number, min: number, max: number): number => {
  if (value < 0) {return Math.max(value, min); }
  if (value > 0) {return Math.min(value, max); }
  return 0;
};
