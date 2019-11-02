export const isLeftMouseClick = (event: MouseEvent): boolean => {
  return event.button === 0 && !event.ctrlKey;
};

export const isRightMouseClick = (event: MouseEvent): boolean => {
  return event.button === 2 || (event.button === 0 && event.ctrlKey);
};
